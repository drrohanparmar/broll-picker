import React, { useState, useRef, useMemo } from "react";
import PasswordGate from "./components/PasswordGate.jsx";
import Sidebar from "./components/Sidebar.jsx";
import SceneDetail from "./components/SceneDetail.jsx";

export default function App() {
  const [password, setPassword] = useState(() => sessionStorage.getItem("broll_password"));
  const [plan, setPlan] = useState(null);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [fileName, setFileName] = useState("project");
  const fileInputRef = useRef(null);
  const resultsCache = useMemo(() => new Map(), [plan]);

  if (!password) {
    return <PasswordGate onUnlock={setPassword} />;
  }

  function handleFile(file) {
    setUploadError(null);
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (!Array.isArray(parsed.beats) || parsed.beats.length === 0) {
          setUploadError("JSON must contain a non-empty 'beats' array (the MedMotion plan format).");
          return;
        }
        setPlan(parsed);
        setSelectedIdx(0);
        setFileName(file.name.replace(/\.json$/i, ""));
      } catch (e) {
        setUploadError(`Invalid JSON: ${e.message}`);
      }
    };
    reader.readAsText(file);
  }

  function onPick(beatIndex, video) {
    setPlan((prev) => {
      const next = { ...prev, beats: [...prev.beats] };
      const beat = { ...next.beats[beatIndex] };
      beat.layers = beat.layers.map((l, i) =>
        i === 0 ? { ...l, src: video.previewUrl, pexels_id: video.pexelsId } : l
      );
      next.beats[beatIndex] = beat;
      return next;
    });
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(plan, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}-picked.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function logout() {
    sessionStorage.removeItem("broll_password");
    setPassword(null);
    setPlan(null);
  }

  if (!plan) {
    return (
      <div className="upload-screen">
        <div className="upload-card">
          <h1>
            B-Roll <span className="brandword">Picker</span>
          </h1>
          <p>Upload the MedMotion project JSON. Pick a clip for each scene, then download it back.</p>
          <div
            className="drop-zone"
            onClick={() => fileInputRef.current.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
            }}
          >
            Click or drop the project .json here
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
            />
          </div>
          {uploadError && <div className="error-text">{uploadError}</div>}
          <p style={{ marginTop: 20 }}>
            <button className="secondary" onClick={logout}>
              Log out
            </button>
          </p>
        </div>
      </div>
    );
  }

  const beats = plan.beats;
  const pickedCount = beats.filter((b) => b.layers?.[0]?.src).length;
  const beat = beats[selectedIdx];

  return (
    <div>
      <div className="topbar">
        <div className="brand">
          B-Roll <span>Picker</span>
        </div>
        <div className="progress">
          {pickedCount} / {beats.length} scenes picked
        </div>
        <div className="actions">
          <button className="secondary" onClick={() => setPlan(null)}>
            New file
          </button>
          <button className="accent" onClick={exportJson}>
            Download JSON
          </button>
        </div>
      </div>
      <div className="layout">
        <Sidebar beats={beats} selectedIdx={selectedIdx} onSelect={setSelectedIdx} />
        <div className="main">
          {beat ? (
            <SceneDetail
              beat={beat}
              beatIndex={selectedIdx}
              resultsCache={resultsCache}
              onPick={onPick}
              password={password}
            />
          ) : (
            <div className="empty-state">
              <h3>Select a scene</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
