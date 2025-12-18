import CodeforcesProfile from "../../models/CodeforcesProfile.js";
import { addCodeforcesSyncJob } from "../../queues/codeforces.queue.js";

export const getDetails = async (req, res) => {
  try {
    const { handle } = req.body;
    const userId = req.user.id; // from auth middleware

    if (!handle) {
      return res.status(400).json({ message: "Codeforces handle required" });
    }

    // Check if user already has CF profile
    const cfProfile = await CodeforcesProfile.findOne({ userId });

    if (!cfProfile) {
      // First time CF sync
      await addCodeforcesSyncJob({
        type: "INITIAL_SYNC",
        userId,
        handle,
      });

      return res.status(202).json({
        message: "Initial Codeforces sync started",
      });
    }

    // Existing CF user → normal sync
    await addCodeforcesSyncJob({
      type: "NORMAL_SYNC",
      userId,
      handle,
    });

    return res.status(202).json({
      message: "Codeforces sync started",
    });
  } catch (err) {
    console.error("CF getDetails error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
