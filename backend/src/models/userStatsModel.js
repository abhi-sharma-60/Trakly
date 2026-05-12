// models/UserStats.js
// not in use currently
import mongoose from "mongoose";

const userStatsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true,
    required: true
  },

  totalSolved: {
    type: Number,
    default: 0
  },

  platformStats: {
    Codeforces: { type: Number, default: 0 },
    LeetCode: { type: Number, default: 0 },
    CodeChef: { type: Number, default: 0 }
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
  }
});

export const UserStatsModel =  mongoose.model("UserStats", userStatsSchema);
