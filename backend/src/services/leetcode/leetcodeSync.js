import UserPlatform from "../../models/userPlatform.js";
import { fetchLeetCodeProfile } from "./leetcodeApi.js";

export const syncLeetCode = async ({ userId, handle }) => {
  const profile = await fetchLeetCodeProfile(handle);

  const stats = profile.submitStatsGlobal.acSubmissionNum;

  const easy = stats.find(s => s.difficulty === "Easy")?.count || 0;
  const medium = stats.find(s => s.difficulty === "Medium")?.count || 0;
  const hard = stats.find(s => s.difficulty === "Hard")?.count || 0;

  const totalSolved = easy + medium + hard;

  await UserPlatform.findOneAndUpdate(
    { user: userId, platform: "LeetCode" },
    {
      user: userId,
      platform: "LeetCode",
      username: handle,
      totalSolved,
      topicStats: {
        Array: easy,
        DP: medium,
        Graph: hard,
      },
      rating: profile.userContestRanking?.rating,
      rank: profile.profile?.ranking,
      lastSyncedAt: new Date(),
    },
    { upsert: true }
  );
};
