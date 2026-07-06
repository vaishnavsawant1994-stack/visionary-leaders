"use client";

import Link from "next/link";
import { useTheme } from "../context/ThemeContext";

interface ArticleCardProps {
  title?: string;
  category?: string;
  summary?: string;
  author?: string;
  image?: string;
  articleId?: string;
}

export default function ArticleCard({
  title = "Untitled Article",
  category = "General",
  summary = "No summary available",
  author = "Admin",
  image,
  articleId,
}: ArticleCardProps) {
  const { theme } = useTheme();

  const isLight = theme === "light";
  const isDark = theme === "dark";

  const style = {
    light: {
      bg: "#ffffff",
      text: "#111827",
      muted: "#6b7280",
      border: "rgba(0,0,0,0.08)",
      categoryBg: "#f3f4f6",
      overlay:
        "linear-gradient(to top, rgba(0,0,0,0.45), transparent)",
      button: "#ff4d6d",
    },

    dark: {
      bg: "#17171f",
      text: "#f5f5f5",
      muted: "#b5b5c0",
      border: "rgba(255,255,255,0.08)",
      categoryBg: "#222232",
      overlay:
        "linear-gradient(to top, rgba(0,0,0,0.65), transparent)",
      button: "#ff4d6d",
    },

    corporate: {
      bg: "#ffffff",
      text: "#1f2937",
      muted: "#6b7280",
      border: "rgba(0,0,0,0.08)",
      categoryBg: "#f9fafb",
      overlay:
        "linear-gradient(to top, rgba(0,0,0,0.35), transparent)",
      button: "#b45309",
    },
  };

  const t = isLight
    ? style.light
    : isDark
    ? style.dark
    : style.corporate;

  // FIXED IMAGE URL HANDLING
  const getImageUrl = (img?: string) => {
    if (!img || img.trim() === "") {
      return "/placeholder.jpg";
    }

    // If full URL (new system)
    if (img.startsWith("http")) {
      return img;
    }

    // If local upload path (old system)
    return `http://localhost:5000${img}`;
  };

  return (
    <div
      style={{
        background: t.bg,
        border: `1px solid ${t.border}`,
        borderRadius: "18px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        transition: "all 0.3s ease",
      }}
    >
      {/* IMAGE SECTION */}
      <div
        style={{
          position: "relative",
          height: "220px",
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
            padding: "7px 14px",
            borderRadius: "999px",
            fontSize: "12px",
            fontWeight: 600,
            background: t.categoryBg,
            color: t.text,
            border: `1px solid ${t.border}`,
            backdropFilter: "blur(8px)",
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

        {/* IMAGE */}
        <img
          src={getImageUrl(image)}
          alt={title}
          onError={(e) =>
            ((e.currentTarget as HTMLImageElement).src =
              "/placeholder.jpg")
          }
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.4s ease",
          }}
        />
      </div>

      {/* CONTENT */}
      <div
        style={{
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          gap: "14px",
        }}
      >
        {/* TITLE */}
        <h3
          style={{
            fontSize: "20px",
            fontWeight: 700,
            lineHeight: "1.4",
            color: t.text,
            margin: 0,
          }}
        >
          {title}
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
          {summary}
        </p>

        {/* AUTHOR */}
        <p
          style={{
            fontSize: "13px",
            color: t.muted,
            margin: 0,
          }}
        >
          By {author}
        </p>

        {/* BUTTON */}
        {articleId ? (
          <Link
            href={`/articles/${articleId}`}
            style={{
              marginTop: "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "14px 18px",
              borderRadius: "12px",
              backgroundColor: t.button,
              textDecoration: "none",
              width: "100%",
            }}
          >
            <span
              style={{
                color: "#ffffff",
                fontWeight: "700",
                WebkitTextFillColor: "#ffffff",
              }}
            >
              Read Article →
            </span>
          </Link>
        ) : (
          <span
            style={{
              marginTop: "auto",
              padding: "14px 18px",
              borderRadius: "12px",
              background: t.border,
              color: t.muted,
              textAlign: "center",
            }}
          >
            Read Article →
          </span>
        )}
      </div>
    </div>
  );
}