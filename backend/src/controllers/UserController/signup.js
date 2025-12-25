import UserModel from "../../models/userModel.js";

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Validate input
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }

        // 2. Check if user already exists
        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists with this email"
            });
        }

        // 3. Create user (password will be hashed by pre-save hook)
        const user = await UserModel.create({
            name,
            email,
            password
        });

        // 4. Generate tokens
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        const token = await user.generateAccessToken()

        const cookieOptions = {
            httpOnly : true,
            secure : true,
            sameSite: "None",
        }

        // 5. Save refresh token
        user.refreshToken = refreshToken;
        await user.save();

        // 6. Remove sensitive fields
        const safeUser = await UserModel.findById(user._id);

        return res.cookie('token',token,cookieOptions).status(201).json({
            success: true,
            message: "Signup successful",
            data: {
                user: safeUser,
                accessToken,
                refreshToken,
                token
            }
        });

    } catch (error) {
        console.error("Signup Controller Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export default signup