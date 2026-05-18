// src/workers/cf.worker.js
import { Worker } from "bullmq";
import redis from "../redis/redis.client.js";
import { redisPublisher } from "../redis/redis.pubsub.js"; // IMPORT THE PUBLISHER
import {
  initialSyncCodeforces,
  normalSyncCodeforces,
} from "../services/codeforces/cfSyncService.js";

// Wrap the worker initialization in an exported function
export const startCodeforcesWorker = () => {
  console.log("✅ Codeforces worker starting in isolated process ID:", process.pid);

  new Worker(
    "codeforces-sync",
    async (job) => {
      const { type, userId, handle } = job.data;
      console.log(`Worker picked job ${job.id} for user ${userId}`);

      try {
        if (type === "INITIAL_SYNC") {
          await initialSyncCodeforces({ userId, handle });
        }
        if (type === "NORMAL_SYNC") {
          console.log("entered normal sync");
          await normalSyncCodeforces({ userId, handle });
        }
        console.log("Sync complete for", userId);
        
        // 🔔 NEW: Ring the Bell (Publish to Redis)
        const message = JSON.stringify({
          userId: userId,
          event: "CF_SYNC_COMPLETED",
          data: { platform: "Codeforces" }
        });
        
        await redisPublisher.publish("cf-sync-events", message);

      } catch (err) {
        // 🔔 NEW: Ring the Bell for errors too
        const errorMessage = JSON.stringify({
          userId: userId,
          event: "CF_SYNC_FAILED",
          data: { error: err.message }
        });
        
        await redisPublisher.publish("cf-sync-events", errorMessage);
        throw err;
      }
    },
    {
      connection: redis,
      concurrency: 1, // You can increase this to 3 or 5 later if you want it to process multiple users at the exact same time!
    }
  );
};