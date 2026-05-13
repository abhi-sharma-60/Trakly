import axios from "axios";

const LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql";

export const fetchLeetCodeProfile = async (username) => {
  const query = `
    query userProfile($username: String!) {
      matchedUser(username: $username) {
        profile {
          ranking
        }
        submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
          }
        }
        userCalendar {
          submissionCalendar
        }
        # 🌟 FETCH TOPIC TAGS HERE 🌟
        tagProblemCounts {
          advanced {
            tagName
            problemsSolved
          }
          intermediate {
            tagName
            problemsSolved
          }
          fundamental {
            tagName
            problemsSolved
          }
        }
      }
      userContestRanking(username: $username) {
        rating
      }
    }
  `;

  const res = await axios.post(
    LEETCODE_GRAPHQL_URL,
    { query, variables: { username } },
    { headers: { "Content-Type": "application/json" } }
  );

  return {
    ...res.data.data.matchedUser,
    userContestRanking: res.data.data.userContestRanking,
  };
};