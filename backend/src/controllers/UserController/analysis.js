import UserPlatform from "../../models/userPlatform.js";
import UserAnalysisModel from "../../models/userAnalysisModel.js";

// ⚠️ DO NOT implement this file now (as you requested)
import { generateAnalysis } from "../../services/ai/generateAnalysis.js";

export const generateUserAnalysis = async (req, res) => {
  try {
    const userId = req.userId; // from auth middleware

    // 1. Fetch platform stats
    const platforms = await UserPlatform.find({
      user: userId,
      platform: { $in: ["Codeforces", "LeetCode"] },
    }).lean();

    if (!platforms.length) {
      return res.status(400).json({
        message: "No platform data found for analysis",
      });
    }

    // 2. Normalize data for AI
    const analysisInput = {
      codeforces: null,
      leetcode: null,
    };

    for (const p of platforms) {
      if (p.platform === "Codeforces") {
        analysisInput.codeforces = {
          rating: p.rating,
          totalSolved: p.totalSolved,
          topicStats: p.topicStats,
        };
      }

      if (p.platform === "LeetCode") {
        analysisInput.leetcode = {
          totalSolved: p.totalSolved,
          topicStats: p.topicStats, 
        };
      }
    }

    // 3. Call AI service (implementation later)
    const analysisResult = await generateAnalysis(analysisInput);

    // 4. Store / overwrite analysis
    const savedAnalysis = await UserAnalysisModel.findOneAndUpdate(
      { user: userId },
      { analysis: analysisResult },
      { upsert: true, new: true }
    );

    // 5. Respond
    return res.json({
      message: "Analysis generated successfully",
      analysis: savedAnalysis.analysis,
    });

  } catch (err) {
    console.error("AI analysis error:", err);
    return res.status(500).json({
      message: "Failed to generate analysis",
    });
  }
};
