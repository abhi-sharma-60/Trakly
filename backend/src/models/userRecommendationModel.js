import mongoose from "mongoose";

const userRecommendationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    problems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CfProblem",
      },
    ],
  },
  { timestamps: true }
);

userRecommendationSchema.index({ user: 1 }, { unique: true });

const UserRecommendationModel = mongoose.model(
  "UserRecommendation",
  userRecommendationSchema
);

export default UserRecommendationModel;
