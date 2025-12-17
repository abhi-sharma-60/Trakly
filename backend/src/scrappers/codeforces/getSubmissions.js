import crypto from "crypto";
import "dotenv/config";


export async function getSubmissions(handle, from = 1, count = 50) {
  const apiKey = process.env.CODEFORCES_API_KEY;
  const apiSecret = process.env.CODEFORCES_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error("Missing Codeforces API key or secret in .env");
  }

  const methodName = "user.status";
  const baseUrl = "https://codeforces.com/api";
  const time = Math.floor(Date.now() / 1000);

  // random 6-char prefix
  const rand = Math.random().toString(36).substring(2, 8);

  // request parameters (excluding apiSig)
  const params = {
    apiKey,
    count,
    from,
    handle,
    time,
  };

  // sort params lexicographically
  const sortedParams = Object.entries(params)
    .sort(([aKey, aVal], [bKey, bVal]) =>
      aKey === bKey
        ? String(aVal).localeCompare(String(bVal))
        : aKey.localeCompare(bKey)
    )
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  // string to hash
  const toHash = `${rand}/${methodName}?${sortedParams}#${apiSecret}`;

  // sha512
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
