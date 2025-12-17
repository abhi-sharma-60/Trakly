import crypto from "crypto";
import "dotenv/config";


export async function getUser(handle) {
  const apiKey = process.env.CODEFORCES_API_KEY;
  const apiSecret = process.env.CODEFORCES_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error("Missing Codeforces API key or secret in .env");
  }

  const methodName = "user.info";
  const baseUrl = "https://codeforces.com/api";
  const time = Math.floor(Date.now() / 1000);

  // Random 6-character prefix
  const rand = Math.random().toString(36).substring(2, 8);

  // Parameters (excluding apiSig)
  const params = {
    apiKey,
    handles: handle,
    time,
  };

  // Sort parameters lexicographically
  const sortedParams = Object.entries(params)
    .sort(([aKey, aVal], [bKey, bVal]) =>
      aKey === bKey ? String(aVal).localeCompare(String(bVal)) : aKey.localeCompare(bKey)
    )
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  // String to hash
  const toHash = `${rand}/${methodName}?${sortedParams}#${apiSecret}`;

  // SHA-512 hash
  const hash = crypto.createHash("sha512").update(toHash).digest("hex");

  const apiSig = rand + hash;

  const url = `${baseUrl}/${methodName}?${sortedParams}&apiSig=${apiSig}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.status !== "OK") {
    throw new Error(data.comment || "Codeforces API error");
  }

  return data.result;
}
