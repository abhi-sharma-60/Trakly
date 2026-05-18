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
    const isLocalhost = process.env.environment === "localhost";
    // 3. Clear cookie
    res.clearCookie("token", {
      httpOnly: true, 
      secure: !isLocalhost,                  // true in production (requires HTTPS), false locally
      sameSite: isLocalhost ? "Lax" : "None"
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