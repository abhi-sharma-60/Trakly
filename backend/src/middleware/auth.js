import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

async function auth(req, res, next) {
  try {
    const token = req.cookies.token;

    // If no token is found
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized: Please login.",
        success: false,
        error: true,
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Fetch user details
    const user = await userModel.findById(decoded._id).select("-password");
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized: User not found.",
        success: false,
        error: true,
      });
    }

    // Attach user to request object
    req.user = user;
    req.userId = user._id;

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired token.",
      success: false,
      error: true,
    });
  }
}

export default auth;
