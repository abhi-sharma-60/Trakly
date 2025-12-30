import mongoose from "mongoose";

const userAnalysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one latest analysis per user
    },

    analysis: {
      type: mongoose.Schema.Types.Mixed, 
      // Gemini-generated JSON (weakTopics, recommendations, etc.)
      required: true,
    },
  },
  { timestamps: true }
);

const UserAnalysisModel = mongoose.model("UserAnalysis", userAnalysisSchema);
export default UserAnalysisModel;
