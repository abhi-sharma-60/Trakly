export async function getUserSubmissions(username, limit = 20) {
    const query = `
      query recentSubmissions($username: String!, $limit: Int!) {
        recentSubmissionList(username: $username, limit: $limit) {
          title
          titleSlug
          timestamp
          statusDisplay
          lang
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
        variables: { username, limit },
      }),
    });
  
    const json = await res.json();
  
    if (!json.data) {
      throw new Error("Failed to fetch submissions");
    }
  
    // sort latest first (timestamp is string, convert to number)
    const submissions = json.data.recentSubmissionList.sort(
      (a, b) => Number(b.timestamp) - Number(a.timestamp)
    );
  
    return submissions;
  }
  