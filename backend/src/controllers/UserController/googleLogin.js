import { OAuth2Client } from "google-auth-library";
import UserModel from "../../models/userModel.js";
import jwt from "jsonwebtoken";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLogin = async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ message: "Google token is required" });
  }

  try {
    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    // Check if user exists
    let user = await UserModel.findOne({ email });

    if (!user) {
      user = await UserModel.create({
        name,
        email,
        avatar: picture,
        provider: "google",
      });
    }

    // Create JWT
    const tokenData = {
      _id: user._id,
      email: user.email,
    };

    const token = jwt.sign(
      tokenData,
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: "8h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    return res.status(200).json({
      message: "Login Successfully",
      data: token,
      success: true,
      error: false,
    });

  } catch (error) {
    console.error("Google Sign-In Error:", error);
    return res.status(401).json({ message: "Invalid Google token" });
  }
};

export default googleLogin;