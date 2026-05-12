import UserAnalysisModel from "../../models/userAnalysisModel.js";
import UserRecommendationModel from "../../models/userRecommendationModel.js"; 

/**
 * Fetches the existing AI analysis and recommendations for a user.
 * Reconstructs the recommendations array into the grouped format expected by the frontend.
 */
export const getAnalysis = async (req, res) => {
  try {
    const userId = req.userId; // from auth middleware

    // 1. Fetch the user's saved analysis
    const savedAnalysis = await UserAnalysisModel.findOne({ user: userId }).lean();

    // 2. Fetch the recommendations and populate the actual problem documents
    const savedRecommendations = await UserRecommendationModel.findOne({ user: userId })
      .populate("problems") // This replaces the ObjectIds with the full CfProblem objects
      .lean();

    // 3. Handle case where no analysis exists yet
    if (!savedAnalysis || !savedAnalysis.analysis) {
      return res.status(404).json({
        message: "No analysis found. Please generate an analysis first.",
        analysis: null,
        recommendations: []
      });
    }

    // 4. Reconstruct the grouped recommendations array for the frontend
    // The UI expects: [{ topic: "Graph", recommendedRating: 1400, problems: [...] }]
    let structuredRecommendations = [];

    if (savedRecommendations && savedRecommendations.problems && savedAnalysis.analysis.practicePlan) {
      
      const allPopulatedProblems = savedRecommendations.problems;

      // Loop through the AI's practice plan to get the topics
      structuredRecommendations = savedAnalysis.analysis.practicePlan.map((plan) => {
        
        // Filter the flat array of populated problems to only include ones matching this topic
        // (Checking both 'topic' or 'tags' depending on how your CfProblem schema is structured)
        const matchedProblems = allPopulatedProblems.filter(
          (prob) => prob.topic === plan.topic || (prob.tags && prob.tags.includes(plan.topic))
        );

        return {
          topic: plan.topic,
          recommendedRating: plan.recommendedRating,
          problems: matchedProblems,
        };
      }).filter(group => group.problems.length > 0); // Clean up any empty groups
    }

    // 5. Respond matching the exact pattern of generateUserAnalysis
    return res.json({
      message: "Analysis fetched successfully",
      analysis: savedAnalysis.analysis,
      recommendations: structuredRecommendations 
    });

  } catch (err) {
    console.error("Fetch analysis error:", err);
    return res.status(500).json({
      message: "Failed to fetch analysis data",
    });
  }
};