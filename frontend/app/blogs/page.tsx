"use client";

import LatestBlogs from "../../components/LatestBlogs";
import { useTheme } from "../../context/ThemeContext";

export default function BlogsPage() {
  const { theme } = useTheme();

  /* ================= THEME TOKENS ================= */
  const styles = {
    light: {
      bg: "#f7f7fb",
      text: "#1a1a1a",
      muted: "#666666",
      accent: "#ff4d6d",
      card: "#ffffff",
      border: "#e5e7eb",
    },

    dark: {
      bg: "#0f0f14",
      text: "#f5f5f5",
      muted: "#b5b5c0",
      accent: "#ff4d6d",
      card: "#17171f",
      border: "#2a2a35",
    },

    corporate: {
      bg: "#f5f3f0",
      text: "#1f2937",
      muted: "#6b7280",
      accent: "#b45309",
      card: "#ffffff",
      border: "#d6d3d1",
    },
  };

  const t =
    styles[theme as keyof typeof styles] || styles.light;

  return (
    <main
      style={{
        width: "100%",
        overflow: "hidden",
        paddingTop: "70px",
        paddingBottom: "80px",
        background: t.bg,
        color: t.text,
        minHeight: "100vh",
        transition: "all 0.3s ease",
      }}
    >
      {/* HEADER */}
      <section
        style={{
          textAlign: "center",
          padding: "20px 20px 35px",
          maxWidth: "900px",
          margin: "-20px auto 0",
        }}
      >
        <p
          style={{
            color: t.accent,
            fontWeight: 700,
            letterSpacing: "2px",
            textTransform: "uppercase",
            marginBottom: "14px",
          }}
        >
          Latest Insights
        </p>

        <h1
          style={{
            fontSize: "52px",
            fontWeight: 900,
            marginBottom: "16px",
            lineHeight: "1.2",
          }}
        >
          Blogs
        </h1>

        <p
          style={{
            maxWidth: "720px",
            margin: "0 auto",
            fontSize: "18px",
            lineHeight: "1.8",
            color: t.muted,
          }}
        >
          Explore the latest stories, business insights,
          startup journeys, leadership advice, and industry
          updates published by our editorial team.
        </p>
      </section>

      {/* BLOG LIST */}
      <section
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 20px",
        }}
      >
        <LatestBlogs
          limit={0}
          showViewAll={false}
        />
      </section>
    </main>
  );
}