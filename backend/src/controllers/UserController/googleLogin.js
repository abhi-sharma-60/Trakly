import UserModel from "../../models/userModel.js";

export const googleLogin = async (req, res) => {
  try {
    const { googleAccessToken } = req.body;

    if (!googleAccessToken) {
      return res.status(400).json({ message: "Google access token is required." });
    }
    //console.log(googleAccessToken)

    // 1. Fetch user data from Google API using the access token
    const googleResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        Authorization: `Bearer ${googleAccessToken}`,
      },
    });

    const googleUser = await googleResponse.json();

    if (!googleResponse.ok) {
      return res.status(401).json({ message: "Invalid Google token provided." });
    }

    const { sub: googleId, name, email, picture } = googleUser;
    //console.log(email)
    // 2. Check if user already exists in your Database
    let user = await UserModel.findOne({ email });

    if (user) {
      // If user exists but doesn't have a googleId linked, link it now
      if (!user.googleId) {
        user.googleId = googleId;
        // Optionally update profile pic if they didn't have one
        if (!user.profile_pic) user.profile_pic = picture;
        await user.save({ validateBeforeSave: false });
      }
    } else {
      // 3. If user doesn't exist, create a new user account
      // Note: We don't need to provide a password because your schema doesn't make it strictly required
      user = await UserModel.create({
        name,
        email,
        googleId,
        profile_pic: picture,
      });
    }

    // 4. Generate your app's JWT Tokens (reusing methods from your userSchema)
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // 5. Save the refresh token in the database
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    const cookieOptions = {
      httpOnly : true,
      secure : false,
      sameSite: "Lax",
  }
    // 6. Send the response back to the client
    // (You might want to set the refresh token in an HTTP-only cookie here if you are doing that for normal login)
    return res
  .status(200)
  .cookie("token", accessToken, cookieOptions)
  .json({
    success: true,
    message: "Google login successful",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      profile_pic: user.profile_pic,
    },
    // You can remove the token from here if your frontend ONLY relies on cookies
    // token: accessToken 
  });

  } catch (error) {
    console.error("Google Login Backend Error:", error);
    return res.status(500).json({ message: "Internal server error during Google login." });
  }
};