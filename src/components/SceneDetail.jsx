import React, { useEffect, useState, useRef } from "react";
// hinglish.js auto-translation removed — instruction now comes from JSON field

function Thumb({ video, isPicked, onPick }) {
  const [hovering, setHovering] = useState(false);

  return (
    <div
      className={"thumb" + (isPicked ? " picked" : "")}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onClick={() => onPick(video)}
    >
      {hovering ? (
        <video
          src={video.previewUrl}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
        />
      ) : (
        <img src={video.thumbnail} alt="" />
      )}
      <span className="dur">{video.duration}s</span>
      <div className="pick-overlay">✓</div>
    </div>
  );
}

export default function SceneDetail({ beat, beatIndex, resultsCache, onPick, password }) {
  const [results, setResults] = useState(resultsCache.get(beatIndex) || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const query = beat.layers?.[0]?.query || beat.say;
  const instruction = beat.layers?.[0]?.instruction || null;
  const pickedId = beat.layers?.[0]?.pexels_id;
  const lastSearchedFor = useRef(null);

  async function runSearch() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/search-pexels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-app-password": password,
        },
        body: JSON.stringify({ query, count: 10 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Search failed");
      setResults(data);
      resultsCache.set(beatIndex, data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const cached = resultsCache.get(beatIndex);
    if (cached) {
      setResults(cached);
      setError(null);
      return;
    }
    if (lastSearchedFor.current !== beatIndex) {
      lastSearchedFor.current = beatIndex;
      setResults(null);
      runSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beatIndex]);

  return (
    <div className="scene-detail">
      <h2>Scene {beatIndex + 1}</h2>
      <div className="say">{beat.say}</div>

      {instruction && (
        <div className="instruction-box">
          <div className="label">Kaisa clip dhundhna hai</div>
          <div className="hinglish">{instruction}</div>
          <div className="english">English: {query}</div>
        </div>
      )}

      {loading && <p className="loading-text">Clips dhundh rahe hain…</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && results && results.length === 0 && (
        <p className="loading-text">Koi clip nahi mila — thodi der baad "Search again" try karo.</p>
      )}

      {!loading && results && results.length > 0 && (
        <>
          <p className="hint-text">Mouse le jao kisi clip ke upar — preview chal jayega.</p>
          <div className="thumb-grid">
            {results.map((v) => (
              <Thumb
                key={v.pexelsId}
                video={v}
                isPicked={v.pexelsId === pickedId}
                onPick={(video) => onPick(beatIndex, video)}
              />
            ))}
          </div>
        </>
      )}

      <p style={{ marginTop: 16 }}>
        <button className="secondary" onClick={runSearch} disabled={loading}>
          Search again
        </button>
      </p>
    </div>
  );
}
