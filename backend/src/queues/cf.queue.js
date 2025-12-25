import { Queue } from "bullmq";
import redis from "../redis/redis.client.js"

export const codeforcesQueue = new Queue("codeforces-sync", {
  connection: redis,
});

export const addCodeforcesSyncJob = async (data) => {
  const job = await codeforcesQueue.add(
    "cf-sync",
    data,
    {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 5000,
      },
      removeOnComplete: true,
    }
  );
  console.log("Job added with id:",job.id);

};
