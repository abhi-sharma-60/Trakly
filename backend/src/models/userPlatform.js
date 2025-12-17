// models/UserPlatform.js
import mongoose from "mongoose";

const userPlatformSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    platform: {
      type: String,
      enum: ["Codeforces", "LeetCode", "CodeChef"],
      required: true
    },

    username: {
      type: String,
      required: true
    },

    profileUrl: {
      type: String
    },

    rating: Number,        // CF rating, CC rating
    rank: Number,          // optional

    lastSyncedAt: {
      type: Date
    }
  },
  { timestamps: true }
);

/**
 * Prevent same user adding same platform twice
 */
userPlatformSchema.index({ user: 1, platform: 1 }, { unique: true });

export default mongoose.model("UserPlatform", userPlatformSchema);
