import UserModel from "../../../models/userModel.js";
import UserPlatform from "../../../models/userPlatform.js";
import { addCodeforcesSyncJob } from "../../../queues/cf.queue.js";

export const syncCodeforces = async (req, res) => {
  try {
    const userId = req.userId;

    // Fetch user to get CF handle
    const user = await UserModel.findById(userId).lean();
    const cfProfile = await UserPlatform.findOne({user:userId,platform:"Codeforces"});
    if (!user || !cfProfile) {
      return res.status(400).json({
        message: "Codeforces handle not linked",
      });
    }

    // Enqueue CF sync job
    await addCodeforcesSyncJob({
      type: "NORMAL_SYNC",
      userId,
      handle: cfProfile.username,
    });

    return res.json({
      message: "Codeforces sync started",
      platform: "Codeforces",
    });
  } catch (err) {
    console.error("Manual CF sync error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
