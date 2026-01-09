import CfProblemModel from "../../models/cfProblemModel.js";

/**
 * Fetch recommended CF problems based on AI practice plan
 * Ensures NO duplicate problems across topics
 *
 * @param {Object} analysisResult - AI generated analysis JSON
 * @returns {Array} recommended problems grouped by topic
 */
export const getRecommendedProblems = async (analysisResult) => {
  const recommendations = [];
  const usedProblemIds = new Set(); // 🔑 dedupe set

  if (!analysisResult?.practicePlan?.length) {
    return recommendations;
  }

  for (const plan of analysisResult.practicePlan) {
    const { topic, recommendedRating } = plan;

    const problems = await CfProblemModel.find({
      topic,
      rating: recommendedRating,
    })
      .sort({ solvedCount: -1 })
      .limit(10) // fetch extra to allow dedup
      .lean();

    const uniqueProblems = [];

    for (const p of problems) {
      const id = p._id.toString();

      if (!usedProblemIds.has(id)) {
        usedProblemIds.add(id);
        uniqueProblems.push(p);
      }

      if (uniqueProblems.length === 5) break; // only top 5
    }

    if (uniqueProblems.length) {
      recommendations.push({
        topic,
        recommendedRating,
        problems: uniqueProblems,
      });
    }
  }

  return recommendations;
};
