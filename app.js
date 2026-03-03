const BASE_URL = "https://api.edamam.com";
const APP_ID = process.env.EDAMAM_APP_ID;
const APP_KEY = process.env.EDAMAM_APP_KEY;

if (!APP_ID || !APP_KEY) {
  throw new Error(
    "Missing EDAMAM_APP_ID or EDAMAM_APP_KEY environment variables.",
  );
}

export async function analyzeRecipe(recipe, opts = {}) {
  const url = new URL(`${BASE_URL}/api/nutrition-details`);

  url.searchParams.set("app_id", APP_ID);
  url.searchParams.set("app_key", APP_KEY);

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (opts.ifNoneMatch) {
    headers["If-None-Match"] = opts.ifNoneMatch;
  }

  const res = await fetch(url.toString(), {
    method: "POST",
    headers,
    body: JSON.stringify(recipe),
  });

  const etag = res.headers.get("etag");

  if (res.status === 304) {
    return { status: 304, etag, data: null };
  }

  let payload = null;
  const contentType = res.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    payload = await res.json();
  } else {
    payload = await res.text();
  }

  if (!res.ok) {
    throw new Error(`Edamam error ${res.status}`);
  }

  return { status: res.status, etag, data: payload };
}
