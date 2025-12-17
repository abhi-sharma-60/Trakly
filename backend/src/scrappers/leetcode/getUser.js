export async function getUser(username) {
    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          username
          profile {
            ranking
            reputation
            starRating
          }
          submitStats {
            acSubmissionNum {
              difficulty
              count
            }
          }
        }
      }
    `;
  
    const res = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
    });
  
    const json = await res.json();
  
    if (!json.data || !json.data.matchedUser) {
      throw new Error("LeetCode user not found");
    }
  
    return json.data.matchedUser;
  }
  