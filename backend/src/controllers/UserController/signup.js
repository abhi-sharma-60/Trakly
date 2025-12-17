import { UserModel } from "../../model/userModel.js";

export const signup = async (req, res) => {
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

        // 5. Save refresh token
        user.refreshToken = refreshToken;
        await user.save();

        // 6. Remove sensitive fields
        const safeUser = await UserModel.findById(user._id);

        return res.status(201).json({
            success: true,
            message: "Signup successful",
            data: {
                user: safeUser,
                accessToken,
                refreshToken
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