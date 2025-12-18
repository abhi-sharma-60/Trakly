import axios from "axios";

const CF_BASE_URL = "https://codeforces.com/api";

export const fetchUserSubmissions = async (handle, from = 1, count = 50) => {
  try {
    const res = await axios.get(`${CF_BASE_URL}/user.status`, {
      params: {
        handle,
        from,
        count,
      },
      timeout: 10000,
    });

    if (res.data.status !== "OK") {
      throw new Error(res.data.comment || "CF API error");
    }

    return res.data.result;
  } catch (err) {
    console.error("CF API error:", err.message);
    throw err;
  }
};
