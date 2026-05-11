import { Worker } from "bullmq";
import redis from "../redis/redis.client.js";
import {
  initialSyncCodeforces,
  normalSyncCodeforces,
} from "../services/codeforces/cfSyncService.js";
import { emitCfEvent } from "../sse/cfSseManager.js";

// Wrap the worker initialization in an exported function
export const startCodeforcesWorker = () => {
  console.log("Codeforces worker starting in main process", process.pid);

  new Worker(
    "codeforces-sync",
    async (job) => {
      const { type, userId, handle } = job.data;
      console.log("Worker picked job:", job.id);

      try {
        if (type === "INITIAL_SYNC") {
          await initialSyncCodeforces({ userId, handle });
        }
        if (type === "NORMAL_SYNC") {
          console.log("entered normal sync");
          console.log(job.data);
          await normalSyncCodeforces({ userId, handle });
        }
        console.log("done");
        
        // 🔔 Notify frontend - This will now successfully find the client!
        emitCfEvent(userId, "CF_SYNC_COMPLETED", {
          platform: "Codeforces",
        });
      } catch (err) {
        emitCfEvent(userId, "CF_SYNC_FAILED", {
          error: err.message,
        });
        throw err;
      }
    },
    {
      connection: redis,
      concurrency: 1,
    }
  );
};