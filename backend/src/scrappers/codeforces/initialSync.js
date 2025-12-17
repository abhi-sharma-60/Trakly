import { getSubmissions } from "./getSubmissions.js";

export async function initialSyncCodeforces(handle, from=1) {
  const PAGE_SIZE = 1000;
  let allSubmissions = [];

  while (true) {
    const batch = await getSubmissions(handle, from, PAGE_SIZE);

    if (!batch.length) break;

    allSubmissions.push(...batch);
    from += PAGE_SIZE;

    // MUST respect CF rate limit
    await new Promise(resolve => setTimeout(resolve, 2100));
  }

  return allSubmissions;
}
