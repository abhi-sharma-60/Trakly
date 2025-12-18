import { Worker } from "bullmq";
import redis from "../redis/redisClient.js";
import {
  initialSyncCodeforces,
  normalSyncCodeforces,
} from "../services/codeforces/cfSync.service.js";

const worker = new Worker(
  "codeforces-sync",
  async (job) => {
    const { type, userId, handle } = job.data;

    if (type === "INITIAL_SYNC") {
      await initialSyncCodeforces({ userId, handle });
    }

    if (type === "NORMAL_SYNC") {
      await normalSyncCodeforces({ userId, handle });
    }
  },
  {
    connection: redis,
    concurrency: 1, // IMPORTANT: CF rate limit
  }
);

export default worker;
