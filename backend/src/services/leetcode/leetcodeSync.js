import UserPlatform from "../../models/userPlatform.js";
import { fetchLeetCodeProfile } from "./leetcodeApi.js";

export const syncLeetCode = async ({ userId, handle }) => {
  const profile = await fetchLeetCodeProfile(handle);

  // 1. Calculate Total Solved
  const stats = profile.submitStatsGlobal.acSubmissionNum;
  const easy = stats.find(s => s.difficulty === "Easy")?.count || 0;
  const medium = stats.find(s => s.difficulty === "Medium")?.count || 0;
  const hard = stats.find(s => s.difficulty === "Hard")?.count || 0;
  const totalSolved = easy + medium + hard;

  // 2. Parse Heatmap Data
  let heatmapData = {};
  if (profile.userCalendar && profile.userCalendar.submissionCalendar) {
    heatmapData = JSON.parse(profile.userCalendar.submissionCalendar);
  }

  // 3. 🌟 CALCULATE REAL TOPIC STATS 🌟
  // Flatten the fundamental, intermediate, and advanced arrays into one single array
  const allTags = [
    ...(profile.tagProblemCounts?.fundamental || []),
    ...(profile.tagProblemCounts?.intermediate || []),
    ...(profile.tagProblemCounts?.advanced || [])
  ];

  // Initialize your schema's topic stats
  const topicStats = {
    Array: 0, DP: 0, Graph: 0, Tree: 0, Greedy: 0, String: 0, Math: 0, Other: 0
  };

  // Loop through LeetCode's tags and map them to your schema
  allTags.forEach(tag => {
    const name = tag.tagName;
    const count = tag.problemsSolved;

    if (name === "Array") topicStats.Array += count;
    else if (name === "Dynamic Programming") topicStats.DP += count;
    else if (name === "Graph") topicStats.Graph += count;
    else if (name === "Tree" || name === "Binary Tree" || name === "Binary Search Tree") topicStats.Tree += count;
    else if (name === "Greedy") topicStats.Greedy += count;
    else if (name === "String") topicStats.String += count;
    else if (name === "Math") topicStats.Math += count;
    else topicStats.Other += count; // Group everything else into 'Other'
  });

  // 4. Save to Database
  await UserPlatform.findOneAndUpdate(
    { user: userId, platform: "LeetCode" },
    {
      user: userId,
      platform: "LeetCode",
      username: handle,
      totalSolved,
      topicStats, // Now inserting the REAL calculated topics!
      rating: Math.round(profile.userContestRanking?.rating || 0),
      rank: profile.profile?.ranking,
      heatmap: heatmapData, 
      lastSyncedAt: new Date(),
    },
    { upsert: true }
  );
};