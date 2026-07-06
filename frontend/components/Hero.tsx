"use client";

import Link from "next/link";
import { useTheme } from "../context/ThemeContext";
import "../styles/hero.css";

export default function Hero() {
  const { theme } = useTheme();

  const isLight = theme === "light";
  const isDark = theme === "dark";

  const themeStyle = {
    light: {
      overlay: "rgba(255,255,255,0.75)",
      badgeBg: "rgba(255,77,109,0.08)",
      badgeBorder: "rgba(255,77,109,0.15)",
      text: "#111827",
      muted: "#6b7280",
      primary: "#ff4d6d",
      cardBg: "rgba(255,255,255,0.92)",
      border: "rgba(255,77,109,0.08)",
    },

    dark: {
      overlay: "rgba(10,10,20,0.75)",
      badgeBg: "rgba(255,77,109,0.12)",
      badgeBorder: "rgba(255,77,109,0.18)",
      text: "#ffffff",
      muted: "#cbd5e1",
      primary: "#ff4d6d",
      cardBg: "rgba(20,20,30,0.85)",
      border: "rgba(255,255,255,0.06)",
    },

    corporate: {
      overlay: "rgba(255,250,245,0.8)",
      badgeBg: "rgba(180,83,9,0.08)",
      badgeBorder: "rgba(180,83,9,0.18)",
      text: "#111827",
      muted: "#6b7280",
      primary: "#b45309",
      cardBg: "rgba(255,255,255,0.95)",
      border: "rgba(180,83,9,0.08)",
    },
  };

  const t = isLight
    ? themeStyle.light
    : isDark
    ? themeStyle.dark
    : themeStyle.corporate;

  const articles = [
    {
      image: "/images/article1.jpg",
      category: "TECHNOLOGY",
      title: "The Future of Artificial Intelligence",
      desc: "Explore how AI is transforming industries and leadership worldwide.",
    },
    {
      image: "/images/article2.jpg",
      category: "BUSINESS",
      title: "Startup Trends That Will Dominate 2026",
      desc: "Discover the next generation of startup innovations and founders.",
    },
    {
      image: "/images/article3.jpg",
      category: "MEDIA",
      title: "How Digital Publishing is Redefining Magazines",
      desc: "See how online media is reshaping modern magazine platforms.",
    },
  ];

  return (
    <section className="hero hero-section" aria-label="Hero Section">
      {/* Overlay */}
      <div
        className="hero-overlay"
        style={{ background: t.overlay }}
      />

      <div className="hero-container">
        {/* LEFT SECTION */}
        <div className="hero-content">
          <div
            className="hero-badge"
            style={{
              color: "#ffffff",
              background: t.primary,
              border: `1px solid ${t.primary}`,
              boxShadow: `0 8px 20px ${t.primary}30`,
            }}
          >
            Global Business • Leadership • Innovation
          </div>

          <h1 className="hero-title">
            <span
              className="hero-subline"
              style={{ color: t.muted }}
            >
              The Future Belongs to
            </span>

            <span
              className="hero-brand-text"
              style={{ color: t.text }}
            >
              Visionary Leaders
            </span>
          </h1>

          <p
            className="hero-subtitle"
            style={{ color: t.muted }}
          >
            Discover exclusive stories, startup journeys,
            leadership insights, technology revolutions,
            business intelligence, and the next generation
            of global changemakers.
          </p>

          <div className="hero-actions">
            <Link
              href="/articles"
              className="hero-btn primary"
              style={{
                background: t.primary,
                color: "#fff",
              }}
            >
              Explore Articles
            </Link>

            <Link
              href="/magazines"
              className="hero-btn secondary"
              style={{
                border: `1px solid ${t.primary}`,
                color: t.primary,
                background: "transparent",
              }}
            >
              Read Magazines
            </Link>
          </div>
        </div>

        {/* CENTER IMAGE */}
        <div className="hero-main-wrapper">
          <img
            src="/images/hero-main.jpg"
            alt="Main Magazine Cover"
            className="hero-main-image"
          />
        </div>

        {/* RIGHT ARTICLES */}
        <div className="hero-articles">
          {articles.map((article, index) => (
            <div
              key={index}
              className="hero-article-card"
              style={{
                background: t.cardBg,
                border: `1px solid ${t.border}`,
              }}
            >
              <img
                src={article.image}
                alt={article.title}
              />

              <div className="hero-article-content">
                <span style={{ color: t.primary }}>
                  {article.category}
                </span>

                <h4 style={{ color: t.text }}>
                  {article.title}
                </h4>

                <p style={{ color: t.muted }}>
                  {article.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}