const { searchPexels } = require("./lib/pexels");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const providedPassword = req.headers["x-app-password"];
  const expected = process.env.APP_PASSWORD;
  if (!expected || providedPassword !== expected) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const { query, count } = req.body || {};
    if (!query || !query.trim()) {
      return res.status(400).json({ error: "query is required" });
    }
    const results = await searchPexels(query.trim(), count || 10);
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
