import UserPlatform from "../../../models/userPlatform.js";

export const getLeetcodeDetails = async (req, res) => {
  try {
    const userId = req.userId;
    const { handle } = req.body; // optional

    const lcData = await UserPlatform.findOne({
      user: userId,
      platform: "LeetCode",
    }).lean();

    if (!lcData) {
      return res.status(404).json({
        message: "Codeforces data not found",
      });
    }

    // Optional safety check
    if (handle && lcData.username !== handle) {
      return res.status(400).json({
        message: "Handle mismatch",
      });
    }

    return res.json({
      platform: "LeetCode",
      data: lcData,
    });
  } catch (err) {
    console.error("Get CF details error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
