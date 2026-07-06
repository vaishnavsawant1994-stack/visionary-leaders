"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "../context/ThemeContext";

type NewsItem = {
  _id?: string;
  id?: string;
  title: string;
  summary?: string;
  image?: string;
  category?: string | { name?: string } | null;
};

type Props = {
  limit?: number;
  showViewAll?: boolean;
};

export default function LatestNews({
  limit,
  showViewAll = true,
}: Props) {
  const { theme } = useTheme();

  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchNews();
  }, [limit]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/news"
      );

      const data = await response.json();

      const fetchedNews = Array.isArray(data?.data)
        ? data.data
        : [];

      setNews(
        limit
          ? fetchedNews.slice(0, limit)
          : fetchedNews
      );
    } catch (err) {
      setError("Failed to load news");
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= THEME TOKENS ================= */
  const style = {
    light: {
      bg: "#ffffff",
      text: "#1a1a1a",
      muted: "#64748b",
      border: "rgba(0,0,0,0.08)",
      overlay:
        "linear-gradient(to top, rgba(0,0,0,0.55), transparent)",
      badgeBg: "rgba(255,255,255,0.92)",
      badgeText: "#111827",
      button: "#ff4d6d",
    },

    dark: {
      bg: "#17171f",
      text: "#f8fafc",
      muted: "#cbd5e1",
      border: "rgba(255,255,255,0.08)",
      overlay:
        "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
      badgeBg: "rgba(20,20,30,0.85)",
      badgeText: "#ffffff",
      button: "#ff4d6d",
    },

    corporate: {
      bg: "#ffffff",
      text: "#1f2937",
      muted: "#6b7280",
      border: "rgba(0,0,0,0.08)",
      overlay:
        "linear-gradient(to top, rgba(0,0,0,0.45), transparent)",
      badgeBg: "rgba(255,255,255,0.95)",
      badgeText: "#1f2937",
      button: "#b45309",
    },
  };

  const t =
    theme === "light"
      ? style.light
      : theme === "dark"
      ? style.dark
      : style.corporate;

  return (
    <section
      style={{
        padding: "70px 20px",
        maxWidth: "1400px",
        margin: "0 auto",
      }}
    >
      {/* VIEW ALL */}
      {showViewAll && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "35px",
          }}
        >
          <Link
            href="/news"
            style={{
              padding: "12px 22px",
              border: `1px solid ${t.border}`,
              borderRadius: "12px",
              fontWeight: 600,
              background: t.bg,
              color: t.text,
              textDecoration: "none",
            }}
          >
            View All →
          </Link>
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <p
          style={{
            textAlign: "center",
            color: t.muted,
          }}
        >
          Loading news...
        </p>
      )}

      {/* ERROR */}
      {error && (
        <p
          style={{
            textAlign: "center",
            color: "red",
          }}
        >
          {error}
        </p>
      )}

      {/* NEWS GRID */}
      {!loading && !error && news.length > 0 && (
        <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "30px",
  }}
>
          {news.map((item, index) => {
            const category =
              typeof item.category === "object"
                ? item.category?.name
                : item.category || "News";

            return (
              <div
                key={item._id || item.id || index}
                style={{
                  background: t.bg,
                  border: `1px solid ${t.border}`,
                  borderRadius: "20px",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.3s ease",
                  boxShadow:
                    "0 12px 30px rgba(0,0,0,0.08)",
                }}
              >
                {/* IMAGE */}
                <div
                  style={{
                    position: "relative",
                    height: "240px",
                    overflow: "hidden",
                  }}
                >
                  {/* CATEGORY BADGE */}
                  <div
                    style={{
                      position: "absolute",
                      top: "14px",
                      left: "14px",
                      zIndex: 2,
                      padding: "7px 12px",
                      borderRadius: "999px",
                      fontSize: "12px",
                      fontWeight: 600,
                      background: t.badgeBg,
                      color: t.badgeText,
                      border: `1px solid ${t.border}`,
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    {category}
                  </div>

                  {/* OVERLAY */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: t.overlay,
                      zIndex: 1,
                    }}
                  />

                  <img
                    src={
                      item.image || "/placeholder.jpg"
                    }
                    alt={item.title}
                    onError={(e) =>
                      ((e.currentTarget as HTMLImageElement).src =
                        "/placeholder.jpg")
                    }
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition:
                        "transform 0.4s ease",
                    }}
                  />
                </div>

                {/* CONTENT */}
                <div
                  style={{
                    padding: "22px",
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: 1,
                    gap: "14px",
                  }}
                >
                  {/* TITLE */}
                  <h3
                    style={{
                      fontSize: "22px",
                      fontWeight: 700,
                      lineHeight: "1.4",
                      color: t.text,
                      margin: 0,
                    }}
                  >
                    {item.title}
                  </h3>

                  {/* SUMMARY */}
                  <p
                    style={{
                      fontSize: "14px",
                      color: t.muted,
                      lineHeight: "1.7",
                      flexGrow: 1,
                      margin: 0,
                    }}
                  >
                    {item.summary ||
                      "No summary available for this news article."}
                  </p>

                  {/* BUTTON */}
                  <Link
                    href={`/news/${item._id || item.id}`}
                    style={{
                      marginTop: "auto",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "14px 18px",
                      borderRadius: "12px",
                      background: t.button,
                      color: "#fff",
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    Read News →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}