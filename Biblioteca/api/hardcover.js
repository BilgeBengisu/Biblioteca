const HARDCOVER_API_URL = "https://api.hardcover.app/v1/graphql";

function setCorsHeaders(req, res) {
  const origin = req.headers.origin || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Vary", "Origin");
}

export default async function handler(req, res) {
  setCorsHeaders(req, res);

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Allow", "POST, OPTIONS");
    res.end(JSON.stringify({ error: "Method Not Allowed" }));
    return;
  }

  const token = process.env.HARDCOVER_API_BEARER;
  if (!token) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: "Missing HARDCOVER_API_BEARER" }));
    return;
  }

  const body =
    typeof req.body === "string"
      ? req.body
      : req.body
        ? JSON.stringify(req.body)
        : "";

  try {
    const upstream = await fetch(HARDCOVER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body,
    });

    const text = await upstream.text();
    res.statusCode = upstream.status;
    res.setHeader("Content-Type", upstream.headers.get("content-type") || "application/json");
    res.setHeader("Cache-Control", "no-store");
    res.end(text);
  } catch (error) {
    res.statusCode = 502;
    res.end(JSON.stringify({ error: "Upstream request failed" }));
  }
}
