import { Worker } from "bullmq";
import dotenv from 'dotenv'
import redis from "../redis/redis.client.js";
import {
  initialSyncCodeforces,
  normalSyncCodeforces,
} from "../services/codeforces/cfSyncService.js";
import connectDB from '../db/index.js'

dotenv.config({
    path:'./.env'
})

import { emitCfEvent } from "../sse/cfSseManager.js";
await connectDB();
console.log("Codeforces worker started", process.pid);


new Worker(
  "codeforces-sync",
  async (job) => {
    const { type, userId, handle } = job.data;
    console.log("Codeforces worker started", process.pid);
    console.log("Worker picked job:", job.id);

    try {
      if (type === "INITIAL_SYNC") {
        await initialSyncCodeforces({ userId, handle });
      }

      if (type === "NORMAL_SYNC") {
        console.log("entered normal sync")
        console.log(job.data)
        await normalSyncCodeforces({ userId, handle });
      }
      console.log("done")
      // 🔔 Notify frontend
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
