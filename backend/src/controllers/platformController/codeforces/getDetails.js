import UserPlatform from "../../../models/userPlatform.js";

export const getCodeforcesDetails = async (req, res) => {
  try {
    const userId = req.userId;
    const { handle } = req.body; // optional

    const cfData = await UserPlatform.findOne({
      user: userId,
      platform: "Codeforces",
    }).lean();

    if (!cfData) {
      return res.status(404).json({
        message: "Codeforces data not found",
      });
    }

    // Optional safety check
    if (handle && cfData.username !== handle) {
      return res.status(400).json({
        message: "Handle mismatch",
      });
    }

    return res.json({
      platform: "Codeforces",
      data: cfData,
    });
  } catch (err) {
    console.error("Get CF details error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
