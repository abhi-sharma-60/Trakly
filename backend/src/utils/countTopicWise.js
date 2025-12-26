import { CF_TOPIC_MAP } from "./cfTopicMap.js";

export const countTopicWise = (submissions) => {
  const solvedProblems = new Set();
  console.log("entered")

  const topicStats = {
    Array: 0,
    DP: 0,
    Graph: 0,
    Tree: 0,
    Greedy: 0,
    String: 0,
    Math: 0,
    Other: 0,
  };

  let lastQuestionID = 0;

  for (const sub of submissions) {
    // Only accepted solutions
    if (sub.verdict !== "OK") continue;

    const problem = sub.problem;
    if (!problem) continue;

    // Unique problem key
    const problemKey = `${problem.contestId}-${problem.index}`;

    if (solvedProblems.has(problemKey)) continue;

    solvedProblems.add(problemKey);

    // Track latest submission ID
    lastQuestionID = Math.max(lastQuestionID, sub.id);

    // Normalize tags
    const tags = (problem.tags || []).map((t) => t.toLowerCase());

    let matched = false;

    for (const [topic, keywords] of Object.entries(CF_TOPIC_MAP)) {
      if (tags.some((tag) => keywords.includes(tag))) {
        topicStats[topic]++;
        matched = true;
      }
    }

    if (!matched) {
      topicStats.Other++;
    }
  }
  console.log("entered2")
  console.log(solvedProblems.size)
  return {
    totalSolvedCount: solvedProblems.size,
    topicStats,
  };
};
