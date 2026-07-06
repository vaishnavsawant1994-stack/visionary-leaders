"use client";

import { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import "./../../styles/pages.css";

export default function CategoriesPage() {
  const { theme } = useTheme();

  const [selected, setSelected] = useState("All");
  const [magazines, setMagazines] = useState([]);
  const [loading, setLoading] = useState(false);

  const categories = [
    "All",
    "Technology",
    "Artificial Intelligence",
    "Healthcare",
    "Finance",
    "Startups",
    "Leadership",
  ];

  /* ================= THEME SYSTEM ================= */
  const themeStyles = {
    light: {
      bg: "#f7f7fb",
      text: "#1a1a1a",
      muted: "#666",
      primary: "#ff4d6d",
      card: "#ffffff",
      border: "#e5e7eb",
    },
    dark: {
      bg: "#0f0f14",
      text: "#f5f5f5",
      muted: "#b5b5c0",
      primary: "#ff4d6d",
      card: "#1a1a22",
      border: "#2a2a35",
    },
    corporate: {
      bg: "#f5f3f0",
      text: "#1f2937",
      muted: "#6b7280",
      primary: "#b45309",
      card: "#ffffff",
      border: "#e5e7eb",
    },
  };

  const t = themeStyles[theme] || themeStyles.light;

  useEffect(() => {
    fetchMagazines(selected);
  }, [selected]);

  /* ================= FETCH MAGAZINES ================= */
  const fetchMagazines = async (category) => {
    try {
      setLoading(true);

      let url =
        category === "All"
          ? "http://localhost:5000/api/magazines"
          : `http://localhost:5000/api/magazines?category=${encodeURIComponent(
              category
            )}`;

      const res = await fetch(url);
      const data = await res.json();

      if (Array.isArray(data?.data)) {
        setMagazines(data.data);
      } else {
        setMagazines([]);
      }
    } catch (err) {
      console.error("FETCH ERROR:", err);
      setMagazines([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: t.bg, color: t.text, minHeight: "100vh" }}>
      {/* HEADER */}
      <section className="page-header">
        <h1>Categories</h1>
        <p style={{ color: t.muted }}>Browse magazines by category</p>
      </section>

      {/* CATEGORY FILTERS */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          padding: "20px",
          justifyContent: "center",
        }}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelected(cat)}
            style={{
              padding: "10px 15px",
              borderRadius: "10px",
              border: `1px solid ${t.border}`,
              cursor: "pointer",
              background: selected === cat ? t.primary : t.card,
              color: selected === cat ? "#fff" : t.text,
              fontWeight: "600",
              transition: "0.2s",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div className="page-container" style={{ padding: "30px" }}>
        {loading ? (
          <p style={{ textAlign: "center", color: t.muted }}>
            Loading magazines...
          </p>
        ) : magazines.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: t.muted,
            }}
          >
            <h2>No Magazines Found</h2>
            <p>Try selecting another category.</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "20px",
            }}
          >
            {magazines.map((mag) => (
              <div
                key={mag._id || mag.id}
                style={{
                  background: t.card,
                  padding: "15px",
                  borderRadius: "12px",
                  border: `1px solid ${t.border}`,
                  boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                  transition: "0.2s",
                }}
              >
                {/* IMAGE */}
                <img
                  src={mag.coverImage || "/placeholder.jpg"}
                  alt={mag.title}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginBottom: "10px",
                  }}
                />

                {/* TITLE */}
                <h3 style={{ marginBottom: "5px", color: t.text }}>
                  {mag.title}
                </h3>

                {/* EDITION */}
                <p style={{ color: t.muted }}>{mag.edition}</p>

                {/* CATEGORY BADGE */}
                <span
                  style={{
                    display: "inline-block",
                    marginTop: "8px",
                    padding: "4px 10px",
                    fontSize: "12px",
                    borderRadius: "20px",
                    background: t.primary,
                    color: "#fff",
                    fontWeight: "600",
                  }}
                >
                  {mag.category?.name || "Magazine"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}