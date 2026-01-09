import UserModel from "../../models/userModel.js"
import UserPlatform from "../../models/userPlatform.js";
//import LeetCodeProfile from "../../models/LeetCodeProfile.js";

import { addCodeforcesSyncJob } from "../../queues/cf.queue.js";
import { syncLeetCode } from "../../services/leetcode/leetcodeSync.js";

export const syncDashboard = async (req, res) => {
  try {
    const userId = req.userId;

    // 1. Fetch user & handles
    const user = await UserModel.findById(userId).lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const codeforcesHandle = await UserPlatform.findOne({user:userId,platform:"Codeforces"});
    const leetcodeHandle = await UserPlatform.findOne({user:userId,platform:"LeetCode"});

    // 2. Trigger Codeforces sync (ASYNC)
    if (codeforcesHandle) {
      await addCodeforcesSyncJob({
        type: "NORMAL_SYNC",
        userId,
        handle: codeforcesHandle.username,
      });
    }

    // 3. Sync LeetCode (INLINE – no queue)
    if (leetcodeHandle) {
      await syncLeetCode({
        userId,
        handle: leetcodeHandle.username,
      });
    }

    // 4. Fetch latest known data from DB
    const [cfProfile, lcProfile] = await Promise.all([
      UserPlatform.findOne({ user:userId,platform:"Codeforces" }).lean(),
      UserPlatform.findOne({ user:userId,platform:"LeetCode" }).lean(),
    ]);

    // 5. Respond immediately
    return res.json({
      codeforces: {
        data: cfProfile,
        syncStatus: "IDLE",
      },
      leetcode: {
        data: lcProfile,
        syncStatus: "COMPLETED",
      },
    });
  } catch (err) {
    console.error("Dashboard sync error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
