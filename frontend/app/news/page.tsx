"use client";

import LatestNews from "../../components/LatestNews";
import { useTheme } from "../../context/ThemeContext";
import React from "react";

export default function NewsPage() {
  const { theme } = useTheme();

  /* ================= THEME TOKENS ================= */
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

  const t =
    themeStyles[theme as keyof typeof themeStyles] ||
    themeStyles.light;

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
      }}
    >
      {/* ================= HEADER ================= */}
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "20px 20px 50px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            color: t.primary,
            fontWeight: 700,
            letterSpacing: "2px",
            textTransform: "uppercase",
            marginBottom: "14px",
          }}
        >
          Breaking Updates
        </p>

        <h1
          style={{
            fontSize: "52px",
            fontWeight: 900,
            marginBottom: "15px",
            lineHeight: "1.2",
          }}
        >
          Latest News
        </h1>

        <p
          style={{
            fontSize: "17px",
            color: t.muted,
            maxWidth: "720px",
            margin: "0 auto",
            lineHeight: "1.8",
          }}
        >
          All latest news updates from our platform — breaking stories,
          industry updates, and global insights.
        </p>
      </div>

      {/* ================= NEWS LIST ================= */}
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 20px",
        }}
      >
        <LatestNews
          limit={0}
          showViewAll={false}
        />
      </div>
    </main>
  );
}