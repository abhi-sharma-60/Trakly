import UserPlatform from "../../models/userPlatform.js";
import UserAnalysisModel from "../../models/userAnalysisModel.js";
import UserRecommendationModel from "../../models/userRecommendationModel.js"; 
import { getRecommendedProblems } from "../../services/ai/getRecommendedProblem.js";

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

    // 3. Call AI service
    const analysisResult = await generateAnalysis(analysisInput);
    let recommendations = await getRecommendedProblems(analysisResult);

    // --- FIX STARTS HERE ---
    // A. The AI likely returned a stringified JSON. We must parse it.
    if (typeof recommendations === 'string') {
      try {
        recommendations = JSON.parse(recommendations);
      } catch (parseErr) {
        console.error("Failed to parse AI recommendations:", parseErr);
        recommendations = []; 
      }
    }

    // B. Mongoose expects a flat array of ObjectIds. 
    // We need to extract just the IDs from the grouped AI response.
    const problemIdsForDb = [];
    
    if (Array.isArray(recommendations)) {
      recommendations.forEach(group => {
        if (group.problems && Array.isArray(group.problems)) {
          group.problems.forEach(prob => {
            // Depending on how your AI service maps them, extract the ID
            if (prob._id) problemIdsForDb.push(prob._id);
            else if (typeof prob === 'string') problemIdsForDb.push(prob); // fallback if it's just an array of ID strings
          });
        }
      });
    }
    // --- FIX ENDS HERE ---

    // 4. Store / overwrite analysis
    const savedAnalysis = await UserAnalysisModel.findOneAndUpdate(
      { user: userId },
      { analysis: analysisResult },
      { upsert: true, new: true }
    );

    // 5. Store / overwrite recommendations 
    // Use the flattened array of IDs to satisfy the Mongoose schema
    await UserRecommendationModel.findOneAndUpdate(
      { user: userId },
      { problems: problemIdsForDb },
      { upsert: true, new: true }
    );

    // 6. Respond
    return res.json({
      message: "Analysis generated successfully",
      analysis: savedAnalysis.analysis,
      // We send the structured/grouped AI recommendations to the frontend
      // because your React UI will need the topics/ratings to render them nicely!
      recommendations: recommendations 
    });

  } catch (err) {
    console.error("AI analysis error:", err);
    return res.status(500).json({
      message: "Failed to generate analysis",
    });
  }
};