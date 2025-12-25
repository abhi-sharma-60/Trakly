import { fetchUserSubmissions } from "./cfApiService.js";
import UserPlatform from "../../models/userPlatform.js";

export const initialSyncCodeforces = async ({ userId, handle }) => {
  let from = 1;
  const count = 1000; // max allowed
  let allSubmissions = [];
  console.log("working")

  while (true) {
    const submissions = await fetchUserSubmissions(handle, from, count);

    if (!submissions.length) break;

    allSubmissions.push(...submissions);
    from += count;

    // Respect CF rate limit (1 req / 2 sec)
    await new Promise((res) => setTimeout(res, 2000));
  }

  const { totalSolved, topicStats } = countTopicWise(allSubmissions);

  // Process & store
  await UserPlatform.findOneAndUpdate(
    { user: userId, platform: "Codeforces" },
    {
      username: handle,
      totalSolved,
      topicStats,
      lastSubmissionIndex,
      lastSyncedAt: new Date(),
    },
    { upsert: true }
  );
};

export const normalSyncCodeforces = async ({ userId, handle }) => {
  const cfStat = await UserPlatform.findOne({
    user: userId,
    platform: "Codeforces",
  });
  console.log("working")

  // Safety check (first-time sync fallback)
  if (!cfStat) return;

  const from = cfStat.lastSubmissionIndex + 1;

  // Fetch only NEW submissions
  const submissions = await fetchUserSubmissions(handle, from, 50);

  if (!submissions.length) return;
  const newLastSubmissionIndex = cfStat.lastSubmissionIndex+submissions.length;

  // Process ONLY new submissions
  const {
    newSolvedCount,
    topicStats,
  } = countTopicWise(submissions, cfStat.lastSubmissionIndex);

  // Increment existing values
  await UserPlatform.updateOne(
    { user: userId, platform: "Codeforces" },
    {
      $inc: {
        totalSolved: newSolvedCount,
        "topicStats.Array": topicStats.Array,
        "topicStats.DP": topicStats.DP,
        "topicStats.Graph": topicStats.Graph,
        "topicStats.Tree": topicStats.Tree,
        "topicStats.Greedy": topicStats.Greedy,
        "topicStats.String": topicStats.String,
        "topicStats.Math": topicStats.Math,
        "topicStats.Other": topicStats.Other,
      },
      $set: {
        lastSubmissionIndex: newLastSubmissionIndex,
        lastSyncedAt: new Date(),
      },
    }
  );
};

