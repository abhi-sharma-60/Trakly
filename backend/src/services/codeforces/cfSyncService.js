import { fetchUserSubmissions } from "./cfApi.service.js";
import CodeforcesProfile from "../../models/CodeforcesProfile.js";

export const initialSyncCodeforces = async ({ userId, handle }) => {
  let from = 1;
  const count = 1000; // max allowed
  let allSubmissions = [];

  while (true) {
    const submissions = await fetchUserSubmissions(handle, from, count);

    if (!submissions.length) break;

    allSubmissions.push(...submissions);
    from += count;

    // Respect CF rate limit (1 req / 2 sec)
    await new Promise((res) => setTimeout(res, 2000));
  }

  // Process & store
  await CodeforcesProfile.create({
    userId,
    handle,
    submissionsCount: allSubmissions.length,
    lastSyncedAt: new Date(),
  });
};

export const normalSyncCodeforces = async ({ userId, handle }) => {
  const submissions = await fetchUserSubmissions(handle, 1, 50);

  // Update stats only
  await CodeforcesProfile.updateOne(
    { userId },
    {
      $set: { lastSyncedAt: new Date() },
    }
  );
};
