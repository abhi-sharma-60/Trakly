import mongoose from "mongoose";

const cfProblemSchema = new mongoose.Schema(
  {
    contestId: {
      type: Number,
      required: true,
    },
    index: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },

    rating: {
      type: Number,
      required: true,
    },

    topic: {
      type: String, // normalized topic: Graph, DP, Array, etc.
      required: true,
      index: true,
    },

    tags: [String],

    solvedCount: {
      type: Number,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

/**
 * Unique per CF problem
 */
cfProblemSchema.index({ contestId: 1, index: 1 }, { unique: true });

const CfProblemModel = mongoose.model("CfProblem", cfProblemSchema);
export default CfProblemModel;
