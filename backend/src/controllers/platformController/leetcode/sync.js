import UserModel from "../../../models/userModel.js"
import UserPlatform from "../../../models/userPlatform.js";
import { syncLeetCode } from "../../../services/leetcode/leetcodeSync.js";

export const syncLeetCodeManual = async (req, res) => {
  try {
    const {userId} = req.body;

    // Fetch user to get LC handle
    const user = await UserModel.findById(userId).lean();
    const leetcodeProfile = await UserPlatform.findOne({user:userId,platform:"LeetCode"});

    if (!user || !leetcodeProfile) {
      return res.status(400).json({
        message: "LeetCode handle not linked",
      });
    }

    // Inline LeetCode sync
    await syncLeetCode({
      userId,
      handle: leetcodeProfile.username,
    });

    return res.json({
      message: "LeetCode synced successfully",
      platform: "LeetCode",
    });
  } catch (err) {
    console.error("Manual LC sync error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
