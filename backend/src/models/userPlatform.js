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

    totalSolved: {
      type: Number,
      default: 0
    },

    topicStats: {
      Array: { type: Number, default: 0 },
      DP: { type: Number, default: 0 },
      Graph: { type: Number, default: 0 },
      Tree: { type: Number, default: 0 },
      Greedy: { type: Number, default: 0 },
      String: { type: Number, default: 0 },
      Math: { type: Number, default: 0 },
      Other: { type: Number, default: 0 }
    },
    lastSubmissionIndex: {
      type: Number,
      default: 0
    },
    rating: Number,        // CF rating, CC rating
    rank: Number,          // optional
    heatmap: {
      type: Map,
      of: Number,
      default: {}
    },
    lastSyncedAt: {
      type: Date
    }
  },
  { timestamps: true }
);

/**
 * Prevent same user adding same platform twice
 */
userPlatformSchema.index({ user: 1, platform: 1, username: 1 }, { unique: true });

const UserPlatform = mongoose.model("UserPlatform",userPlatformSchema);
export default UserPlatform;
