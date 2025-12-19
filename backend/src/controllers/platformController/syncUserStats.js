import User from "../../models/User.js";
import UserPlatform from "../../models/userPlatform.js";
import LeetCodeProfile from "../../models/LeetCodeProfile.js";

import { addCodeforcesSyncJob } from "../../queues/codeforces.queue.js";
import { syncLeetCode } from "../../services/leetcode/leetcodeSync.service.js";

export const syncDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Fetch user & handles
    const user = await User.findById(userId).lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { codeforcesHandle, leetcodeHandle } = user;

    // 2. Trigger Codeforces sync (ASYNC)
    if (codeforcesHandle) {
      await addCodeforcesSyncJob({
        type: "NORMAL_SYNC",
        userId,
        handle: codeforcesHandle,
      });
    }

    // 3. Sync LeetCode (INLINE – no queue)
    if (leetcodeHandle) {
      await syncLeetCode({
        userId,
        handle: leetcodeHandle,
      });
    }

    // 4. Fetch latest known data from DB
    const [cfProfile, lcProfile] = await Promise.all([
      UserPlatform.findOne({ userId }).lean(),
      LeetCodeProfile.findOne({ userId }).lean(),
    ]);

    // 5. Respond immediately
    return res.json({
      codeforces: {
        data: cfProfile,
        syncStatus: cfProfile?.syncStatus || "IDLE",
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
