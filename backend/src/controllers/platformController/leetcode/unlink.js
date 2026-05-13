import UserPlatform from "../../../models/userPlatform.js"; // Adjust the path to your model if needed

export const unlinkLeetCode = async (req, res) => {
  try {
    // userId is populated by your auth middleware
    const userId = req.userId;

    // Find and delete the LeetCode platform entry for this user
    const deletedPlatform = await UserPlatform.findOneAndDelete({
      user: userId,
      platform: "LeetCode",
    });

    // If no document was found, it was never linked or already removed
    if (!deletedPlatform) {
      return res.status(404).json({ 
        message: "LeetCode account not found or already unlinked." 
      });
    }

    return res.status(200).json({ 
      message: "LeetCode account unlinked successfully." 
    });

  } catch (err) {
    console.error("Error unlinking LeetCode:", err);
    return res.status(500).json({ 
      message: "Internal server error while unlinking LeetCode." 
    });
  }
};