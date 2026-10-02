import React, { useState, useMemo } from "react";

export default function Sidebar({ beats, selectedIdx, onSelect }) {
  const [filter, setFilter] = useState("all"); // all | picked | unpicked
  const [search, setSearch] = useState("");

  const rows = useMemo(() => {
    return beats
      .map((b, i) => ({ i, b, picked: !!b.layers?.[0]?.src }))
      .filter((r) => {
        if (filter === "picked" && !r.picked) return false;
        if (filter === "unpicked" && r.picked) return false;
        if (search && !r.b.say?.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      });
  }, [beats, filter, search]);

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <input
          placeholder="Search scenes…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="filter-row">
          <button
            className={filter === "all" ? "" : "secondary"}
            onClick={() => setFilter("all")}
          >
            All ({beats.length})
          </button>
          <button
            className={filter === "unpicked" ? "" : "secondary"}
            onClick={() => setFilter("unpicked")}
          >
            Unpicked
          </button>
          <button
            className={filter === "picked" ? "" : "secondary"}
            onClick={() => setFilter("picked")}
          >
            Picked
          </button>
        </div>
      </div>

      {rows.map(({ i, b, picked }) => (
        <div
          key={i}
          className={"scene-row" + (i === selectedIdx ? " active" : "")}
          onClick={() => onSelect(i)}
        >
          <span className="scene-row-num">{i + 1}</span>
          <span className={"dot " + (picked ? "picked" : "empty")} />
          <span className="scene-row-text">{b.say || "(no text)"}</span>
        </div>
      ))}
    </div>
  );
}
