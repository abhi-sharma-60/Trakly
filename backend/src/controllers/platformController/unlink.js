import UserPlatform from "../../models/userPlatform.js"; // Adjust the path to your model if needed

export const unlinkAllPlatforms = async (req, res) => {
  try {
    // userId is populated by your auth middleware
    const userId = req.userId;

    // Delete all platform entries associated with this user
    const result = await UserPlatform.deleteMany({ user: userId });

    // If deletedCount is 0, they didn't have any platforms linked to begin with
    if (result.deletedCount === 0) {
      return res.status(404).json({ 
        message: "No linked platforms found for this user." 
      });
    }

    return res.status(200).json({ 
      message: `Successfully unlinked ${result.deletedCount} platform(s).` 
    });

  } catch (err) {
    console.error("Error unlinking all platforms:", err);
    return res.status(500).json({ 
      message: "Internal server error while unlinking all platforms." 
    });
  }
};