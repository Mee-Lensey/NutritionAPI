// server.js (Express)
import dotenv from "dotenv";
dotenv.config();
import express from "express";

const app = express();
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Server is running. Use POST /api/analyze-recipe");
});

const BASE_URL = "https://api.edamam.com";
const APP_ID = process.env.EDAMAM_APP_ID;
const APP_KEY = process.env.EDAMAM_APP_KEY;
if (!APP_ID || !APP_KEY) {
  console.error(
    "Missing EDAMAM_APP_ID or EDAMAM_APP_KEY. Check your .env file location/name.",
  );
  process.exit(1);
}

app.post("/api/analyze-recipe", async (req, res) => {
  try {
    const url = new URL(`${BASE_URL}/api/nutrition-details`);
    url.searchParams.set("app_id", APP_ID);
    url.searchParams.set("app_key", APP_KEY);
    url.searchParams.set("beta", "true");

    // Optional: pass ETag from client if you store it
    const ifNoneMatch = req.header("If-None-Match");

    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    if (ifNoneMatch) headers["If-None-Match"] = ifNoneMatch;

    const edamamRes = await fetch(url.toString(), {
      method: "POST",
      headers,
      body: JSON.stringify(req.body),
    });

    // Forward ETag to client so you can store it
    const etag = edamamRes.headers.get("etag");
    if (etag) res.setHeader("ETag", etag);

    if (edamamRes.status === 304) return res.sendStatus(304);

    const contentType = edamamRes.headers.get("content-type") || "";
    const bodyText = await edamamRes.text();

    // If Edamam says "json", parse it. Otherwise just send text.
    if (contentType.includes("application/json")) {
      const data = JSON.parse(bodyText);
      return res.status(edamamRes.status).json(data);
    }

    return res.status(edamamRes.status).send(bodyText);
  } catch (err) {
    return res.status(500).json({ error: String(err.message || err) });
  }
});

app.listen(3000, () => console.log("Server on http://localhost:3000"));
