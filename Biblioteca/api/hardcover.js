const HARDCOVER_API_URL = "https://api.hardcover.app/v1/graphql";

/**
 * Vercel Serverless Function — Hardcover API Proxy
 *
 * Purpose:
 *   Acts as a secure proxy between the frontend and the Hardcover GraphQL API.
 *   The frontend (Apollo Client) sends all GraphQL requests to /api/hardcover
 *   instead of directly to Hardcover. This function forwards those requests and
 *   injects the bearer token server-side, so the token is never exposed in the
 *   client bundle or browser.
 *
 * How it works:
 *   1. Receives a POST request from Apollo Client containing a GraphQL query/mutation.
 *   2. Reads HARDCOVER_API_BEARER from the server environment (Vercel env vars).
 *   3. Forwards the request body to the Hardcover API with the Authorization header attached.
 *   4. Streams the response (status + body) back to the client as-is.
 *
 * Used by:
 *   - src/contexts/ApolloClient.tsx — Apollo Client's HttpLink points to "/api/hardcover"
**/

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
