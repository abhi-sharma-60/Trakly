// controllers/analyticsController.js
import UserPlatform from '../../models/userPlatform.js';

export const getAnalyticsData = async (req, res) => {
  try {
    const userId = req.userId; // Assuming auth middleware sets this

    // Fetch both platforms for this user
    const platforms = await UserPlatform.find({ 
      user: userId, 
      platform: { $in: ['LeetCode', 'Codeforces'] } 
    }).lean();

    if (!platforms.length) {
      return res.status(200).json({ heatmap: {}, topicStats: {} });
    }

    const combinedHeatmap = {};
    const combinedTopics = { Array: 0, DP: 0, Graph: 0, Tree: 0, Greedy: 0, String: 0, Math: 0, Other: 0 };

    platforms.forEach(doc => {
      // 1. Merge Heatmap Data
      if (doc.heatmap) {
        for (const [timestamp, count] of Object.entries(doc.heatmap)) {
          combinedHeatmap[timestamp] = (combinedHeatmap[timestamp] || 0) + count;
        }
      }

      // 2. Merge Topic Stats (Optional, but great for your TopicDistributionChart!)
      if (doc.topicStats) {
        for (const [topic, count] of Object.entries(doc.topicStats)) {
          combinedTopics[topic] = (combinedTopics[topic] || 0) + count;
        }
      }
    });

    res.status(200).json({
      success: true,
      data: {
        heatmap: combinedHeatmap,
        topicStats: combinedTopics
      }
    });

  } catch (error) {
    console.error("Analytics fetch error:", error);
    res.status(500).json({ success: false, message: "Error fetching analytics data" });
  }
};