import UserModel from "../../models/userModel.js";

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // 2. Find user and explicitly select password
        const user = await UserModel.findOne({ email }).select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // 3. Check password
        const isPasswordValid = await user.isPasswordCorrect(password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // 4. Generate tokens
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        const token = await user.generateAccessToken()

        const cookieOptions = {
            httpOnly : true,
            secure : true,
            sameSite: "None",
        }

        // 5. Save refresh token in DB
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        // 6. Remove sensitive fields
        const loggedInUser = await UserModel.findById(user._id);

        // 7. Send response
        return res.cookie('token',token,cookieOptions).status(200).json({
            success: true,
            message: "Login successful",
            data: {
                user: loggedInUser,
                accessToken,
                refreshToken,
                token
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
export default login