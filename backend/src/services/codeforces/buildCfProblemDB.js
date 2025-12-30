import axios from "axios";
import CfProblem from "../../models/CfProblem.js";

const CF_API =
  "https://codeforces.com/api/problemset.problems";

const RATING_BUCKETS = [1100, 1200, 1400, 1600, 1900];

const TOPICS = {
  Array: "arrays",
  DP: "dp",
  Graph: "graphs",
  Tree: "trees",
  Greedy: "greedy",
  Math: "math",
  String: "strings",
  Other: null,
};

export const buildCfProblemDB = async () => {
  const { data } = await axios.get(CF_API);

  if (data.status !== "OK") {
    throw new Error("CF API failed");
  }

  const { problems, problemStatistics } = data.result;

  // Map stats by contestId+index
  const statsMap = new Map();
  for (const s of problemStatistics) {
    statsMap.set(`${s.contestId}${s.index}`, s.solvedCount);
  }

  for (const [topic, tag] of Object.entries(TOPICS)) {
    const topicProblems = problems.filter((p) =>
      tag ? p.tags.includes(tag) : true
    );

    for (const rating of RATING_BUCKETS) {
      const bucket = topicProblems
        .filter(
          (p) =>
            p.rating === rating &&
            statsMap.has(`${p.contestId}${p.index}`)
        )
        .map((p) => ({
          contestId: p.contestId,
          index: p.index,
          name: p.name,
          rating: p.rating,
          topic,
          tags: p.tags,
          solvedCount: statsMap.get(`${p.contestId}${p.index}`),
        }))
        .sort((a, b) => b.solvedCount - a.solvedCount)
        .slice(0, 20);

      for (const prob of bucket) {
        await CfProblem.updateOne(
          { contestId: prob.contestId, index: prob.index },
          { $set: prob },
          { upsert: true }
        );
      }
    }
  }

  console.log("CF problem DB updated");
};
