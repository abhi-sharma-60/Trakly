import axios from "axios";

/**
 * Generates AI-based analysis of a user's CP profile
 * @param {Object} profileData - normalized CF + LC stats
 * @returns {Object} structured analysis JSON
 */
export const generateAnalysis = async (profileData) => {
  const prompt = `
You are a competitive programming performance analyst.

You are given a user's aggregated statistics from Codeforces and LeetCode.
Analyze the data and return a STRICT JSON OBJECT ONLY.

Rules:
- Do NOT include markdown formatting (no \`\`\`json blocks).
- Do NOT use literal newlines inside strings. Use "\\n" if needed.
- Keep the "analysisSummary" concise (maximum 3 sentences).
- Do NOT hallucinate platforms or topics not present.
- Weak topics are those significantly below the user's average.
- Practice topics MUST be chosen from weak topics.
- Suggested ratings must be realistic relative to the user's rating.
- Output MUST match the schema exactly.

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

  // --- ADDED: Auto-Retry Logic ---
  const MAX_RETRIES = 2; // It will try up to 3 times total

  for (let attempt = 1; attempt <= MAX_RETRIES + 1; attempt++) {
    try {
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
            maxOutputTokens: 8192, // Increased from 2048 to prevent cut-offs
            responseMimeType: "application/json",
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": process.env.GENAI_API_KEY,
          },
        }
      );

      const textOutput = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!textOutput) {
        throw new Error("Empty response from Gemini");
      }

      // 1. Strip markdown blocks if the AI accidentally includes them
      let cleanText = textOutput.replace(/```json/gi, "").replace(/```/gi, "").trim();
      
      // 2. Parse the sanitized string
      const analysisJSON = JSON.parse(cleanText);
      
      // If we made it here, parsing succeeded! Return the data.
      return analysisJSON;

    } catch (error) {
      const isSyntaxError = error instanceof SyntaxError;
      
      console.error(`[Attempt ${attempt}] AI analysis failed:`, isSyntaxError ? "Incomplete/Invalid JSON" : error.message);

      // If we have exhausted all retries, throw the final error to the controller
      if (attempt > MAX_RETRIES) {
        console.error("All AI generation attempts failed.");
        throw new Error("Failed to generate AI analysis after multiple attempts");
      }

      // Otherwise, wait 1 second and try again (helps clear transient network glitches)
      console.log(`Retrying in 1 second... (${attempt}/${MAX_RETRIES} retries used)`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
};