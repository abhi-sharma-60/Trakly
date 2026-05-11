import UserModel from "../../models/userModel.js";

export const logout = async (req, res) => {
  try {

    // 1. Get user (assuming you have auth middleware)
    const userId = req.userId;

    if (userId) {
      // 2. Remove refresh token from DB
      await UserModel.findByIdAndUpdate(userId, {
        $unset: { refreshToken: 1 }
      });
    }

    // 3. Clear cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,      // true in production
      sameSite: "Lax"
    });

    // 4. Send response
    return res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });

  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};