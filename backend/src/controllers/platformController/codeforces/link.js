import UserModel from "../../../models/userModel.js";
import UserPlatform from "../../../models/userPlatform.js";
// NEW: Import your queue function (adjust the path if necessary)
import { addCodeforcesSyncJob } from "../../../queues/cf.queue.js";

export const linkCodeforces = async (req, res) => {
  try {
    const userId = req.userId;
    const { handle } = req.body;

    if (!handle) {
      return res.status(400).json({
        message: "Codeforces handle is required",
      });
    }

    // 1. Check if user exists
    const user = await UserModel.findById(userId).lean();
    if (!user) {
      console.log("not found");
      return res.status(404).json({
        message: "User not found ok",
      });
    }

    // 2. Check if Codeforces already linked
    const existing = await UserPlatform.findOne({
      user: userId,
      platform: "Codeforces",
    });

    if (existing) {
      return res.status(400).json({
        message: "Codeforces account already linked",
      });
    }

    // 3. Create Codeforces platform entry
    const cfPlatform = await UserPlatform.create({
      user: userId,
      platform: "Codeforces",
      username: handle,
      profileUrl: `https://codeforces.com/profile/${handle}`,
      totalSolved: 0,
      lastSubmissionIndex: 0,
      lastSyncedAt: null,
    });

    // --- NEW: 4. Queue the Initial Sync Job ---
    await addCodeforcesSyncJob({
      type: "INITIAL_SYNC",
      userId,
      handle,
    });

    return res.status(201).json({
      message: "Codeforces account linked successfully and sync queued.",
      data: cfPlatform,
    });
  } catch (err) {
    // Handle duplicate key error (unique index safety)
    if (err.code === 11000) {
      return res.status(400).json({
        message: "Codeforces account already linked",
      });
    }

    console.error("Link Codeforces error:", err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};