import mongoose from "mongoose";

const problemSchema = new mongoose.Schema(
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

    problemId: {
      type: String
    },

    topic: {
      type: String,
      enum: [
        "Array",
        "DP",
        "Graph",
        "Tree",
        "Greedy",
        "String",
        "Math",
        "Other"
      ],
      required: true
    },
    
    link:{
        type: String
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"]
    },

    solvedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

export const ProblemModel =  mongoose.model("Problem", problemSchema);
