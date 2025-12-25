import { fetchUserSubmissions } from "./cfApiService.js";
import UserPlatform from "../../models/userPlatform.js";
import { countTopicWise } from "../../utils/countTopicWise.js";

export const initialSyncCodeforces = async ({ userId, handle }) => {
  let from = 1;
  const count = 1000; // max allowed
  let allSubmissions = [];
  console.log("working")

  while (true) {
    const submissions = await fetchUserSubmissions(handle, from, count);
    //console.log(submissions.length)
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
  console.log("working")
  const cfStat = await UserPlatform.findOne({
    user: userId,
    platform: "Codeforces",
  });
  console.log("working")

  // Safety check (first-time sync fallback)
  if (!cfStat){
    console.log("not found");
    return;
  }

  const from = cfStat.lastSubmissionIndex + 1;

  // Fetch only NEW submissions
  const submissions = await fetchUserSubmissions(handle, from, 50);
  console.log(submissions.length)
  if (!submissions.length){
    console.log("return");
    return;
  }
  //console.log(submissions)
  const newLastSubmissionIndex = cfStat.lastSubmissionIndex+submissions.length;

  // Process ONLY new submissions
  const {
    totalSolvedount,
    topicStats,
  } = countTopicWise(submissions);
  console.log(totalSolvedCount)
  // Increment existing values
  await UserPlatform.updateOne(
    { user: userId, platform: "Codeforces" },
    {
      $inc: {
        totalSolved: totalSolvedCount,
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
  console.log("done")
};

