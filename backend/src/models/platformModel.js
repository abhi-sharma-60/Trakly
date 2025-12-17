import mongoose from "mongoose";

const platformSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ["Codeforces", "LeetCode", "CodeChef"],
    required: true,
    unique: true
  }
});

export const PlatformModel =  mongoose.model("Platform", platformSchema);
