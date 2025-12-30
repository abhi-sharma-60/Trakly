import axios from "axios";

/**
 * Generates AI-based analysis of a user's CP profile
 * @param {Object} profileData - normalized CF + LC stats
 * @returns {Object} structured analysis JSON
 */
export const generateAnalysis = async (profileData) => {
  try {
    const prompt = `
You are a competitive programming performance analyst.

You are given a user's aggregated statistics from Codeforces and LeetCode.
Analyze the data and return a STRICT JSON OBJECT ONLY.

Rules:
- Do NOT include markdown
- Do NOT include explanations outside JSON
- Do NOT hallucinate platforms or topics not present
- Weak topics are those significantly below the user's average
- Practice topics MUST be chosen from weak topics
- Suggested ratings must be realistic relative to the user's rating
- Output MUST match the schema exactly

User data:
${JSON.stringify(profileData, null, 2)}

Return JSON in the following format:

{
  "weakTopics": [],
  "strongTopics": [],
  "analysisSummary": "",
  "practicePlan": [
    {
      "topic": "",
      "recommendedRating": 0,
      "reason": ""
    }
  ]
}
`;

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent",
      {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          topP: 0.9,
          maxOutputTokens: 2048,
          responseMimeType: "application/json", // 🔑 forces JSON
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GENAI_API_KEY,
        },
      }
    );

    const textOutput =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textOutput) {
      throw new Error("Empty response from Gemini");
    }

    // Gemini already returns JSON text, parse safely
    const analysisJSON = JSON.parse(textOutput);

    return analysisJSON;
  } catch (error) {
    console.error("Gemini analysis error:", error?.response?.data || error);
    throw new Error("Failed to generate AI analysis");
  }
};
