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
  const usedProblemIds = []; // 🔑 Array instead of Set for Mongoose $nin operator

  if (!analysisResult?.practicePlan?.length) {
    return recommendations;
  }

  for (const plan of analysisResult.practicePlan) {
    const { topic, recommendedRating } = plan;

    // Fetch exactly 5 problems, excluding any we have already used
    const problems = await CfProblemModel.find({
      topic, // Note: if your DB schema uses 'tags', this should be `tags: topic`
      rating: recommendedRating,
      _id: { $nin: usedProblemIds } // 🚀 DB-Level Deduplication!
    })
      .sort({ solvedCount: -1 })
      .limit(5) // Just grab exactly what we need
      .lean();

    if (problems.length) {
      // Add the newly found problem IDs to our used list
      // We push the raw ObjectIds so Mongoose can use them in the next loop's $nin
      problems.forEach((p) => usedProblemIds.push(p._id));

      recommendations.push({
        topic,
        recommendedRating,
        problems, // They are already unique and limited to 5!
      });
    }
  }

  return recommendations;
};