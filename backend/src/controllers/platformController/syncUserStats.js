import UserModel from "../../models/userModel.js";
import UserPlatform from "../../models/userPlatform.js";
import { addCodeforcesSyncJob } from "../../queues/cf.queue.js";
import { syncLeetCode } from "../../services/leetcode/leetcodeSync.js";

export const syncDashboard = async (req, res) => {
  try {
    const userId = req.userId;

    // 1. Fetch user and ALL their platforms simultaneously in ONE database trip
    const [user, platforms] = await Promise.all([
      UserModel.findById(userId).lean(),
      UserPlatform.find({ user: userId, platform: { $in: ["Codeforces", "LeetCode"] } }).lean()
    ]);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract individual profiles from the array
    const cfProfile = platforms.find(p => p.platform === "Codeforces");
    const lcProfile = platforms.find(p => p.platform === "LeetCode");

    // 2. Trigger Codeforces sync (Background Queue)
    if (cfProfile?.username) {
      // Notice we are NOT awaiting this. We fire and forget!
      addCodeforcesSyncJob({
        type: "NORMAL_SYNC",
        userId,
        handle: cfProfile.username,
      }).catch(err => console.error("CF Queue Error:", err)); 
    }

    // 3. Trigger LeetCode sync (Background Execution)
    if (lcProfile?.username) {
      // Notice there is NO 'await' here. This tells Node.js to start syncing 
      // in the background, but continue executing the rest of the code immediately.
      syncLeetCode({
        userId,
        handle: lcProfile.username,
      }).catch(err => console.error("LC Sync Error:", err));
    }

    // 4. Respond immediately with the stale/cached data currently in the DB
    return res.json({
      codeforces: {
        data: cfProfile || null,
        syncStatus: cfProfile ? "SYNCING_IN_BACKGROUND" : "IDLE",
      },
      leetcode: {
        data: lcProfile || null,
        syncStatus: lcProfile ? "SYNCING_IN_BACKGROUND" : "IDLE",
      },
    });

  } catch (err) {
    console.error("Dashboard sync error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};