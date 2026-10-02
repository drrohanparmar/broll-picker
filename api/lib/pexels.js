const PEXELS_BASE = "https://api.pexels.com/videos";

async function searchPexels(query, count = 10) {
  const key = process.env.PEXELS_API_KEY;
  if (!key) {
    throw new Error("PEXELS_API_KEY is not set in Vercel's environment variables.");
  }

  const url = new URL(`${PEXELS_BASE}/search`);
  url.searchParams.set("query", query);
  url.searchParams.set("orientation", "landscape");
  url.searchParams.set("size", "medium");
  url.searchParams.set("per_page", String(Math.min(Math.max(count, 1), 15)));

  const res = await fetch(url, { headers: { Authorization: key } });
  if (!res.ok) {
    throw new Error(`Pexels API error: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  const videos = data.videos || [];

  return videos
    .map((v) => {
      const files = (v.video_files || []).filter((f) => f.file_type === "video/mp4");
      const hd =
        files.find((f) => f.width >= 1280 && f.width <= 1920 && f.height <= 1080) ||
        files.sort((a, b) => (b.width || 0) - (a.width || 0))[0];
      if (!hd) return null;
      return {
        pexelsId: String(v.id),
        thumbnail: v.image,
        previewUrl: hd.link, // streamed directly for hover-preview; never saved to disk
        duration: v.duration,
        width: hd.width,
        height: hd.height,
      };
    })
    .filter(Boolean);
}

module.exports = { searchPexels };
