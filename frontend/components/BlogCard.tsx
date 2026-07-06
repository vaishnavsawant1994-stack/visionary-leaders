"use client";

import Link from "next/link";
import { useTheme } from "../context/ThemeContext";

type Blog = {
  _id?: string;
  id?: string;
  title: string;
  summary?: string;
  coverImage?: string;
  author?: string | { name?: string } | null;
  category?: string | { name?: string } | null;
};

type Props = {
  blog: Blog;
};

export default function BlogCard({ blog }: Props) {
  const { theme } = useTheme();

  if (!blog) return null;

  const blogId = blog._id || blog.id || "";

  const authorName =
    blog.author && typeof blog.author === "object"
      ? blog.author.name || "Admin"
      : blog.author || "Admin";

  const categoryName =
    blog.category && typeof blog.category === "object"
      ? blog.category.name || "Blog"
      : blog.category || "Blog";

  /* ================= IMAGE URL FIX ================= */
  const getImageUrl = (image?: string) => {
    if (!image || image.trim() === "") {
      return "/placeholder.jpg";
    }

    if (image.startsWith("http")) {
      return image;
    }

    if (image.startsWith("/uploads")) {
      return `http://localhost:5000${image}`;
    }

    return `http://localhost:5000/uploads/blogs/${image}`;
  };

  /* ================= THEME TOKENS ================= */
  const style = {
    light: {
      bg: "#ffffff",
      text: "#111827",
      muted: "#64748b",
      border: "rgba(244, 114, 182, 0.12)",
      overlay:
        "linear-gradient(to top, rgba(15,23,42,0.65), transparent)",
      badgeBg: "rgba(255,255,255,0.92)",
      badgeText: "#111827",
      accent: "#f43f5e",
      button: "#f43f5e",
      shadow: "0 12px 30px rgba(244, 114, 182, 0.12)",
    },

    dark: {
      bg: "#111111",
      text: "#ffffff",
      muted: "#cbd5e1",
      border: "rgba(255,255,255,0.06)",
      overlay:
        "linear-gradient(to top, rgba(0,0,0,0.75), transparent)",
      badgeBg: "rgba(20,20,20,0.88)",
      badgeText: "#ffffff",
      accent: "#dc2626",
      button: "#dc2626",
      shadow: "0 14px 35px rgba(220, 38, 38, 0.15)",
    },

    corporate: {
      bg: "#ffffff",
      text: "#1f2937",
      muted: "#6b7280",
      border: "rgba(245, 158, 11, 0.14)",
      overlay:
        "linear-gradient(to top, rgba(0,0,0,0.55), transparent)",
      badgeBg: "rgba(255,255,255,0.94)",
      badgeText: "#1f2937",
      accent: "#d97706",
      button: "#d97706",
      shadow: "0 12px 30px rgba(217, 119, 6, 0.14)",
    },
  };

  const t =
    theme === "light"
      ? style.light
      : theme === "dark"
      ? style.dark
      : style.corporate;

  return (
    <div
      style={{
        background: t.bg,
        border: `1px solid ${t.border}`,
        borderRadius: "22px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        transition: "all 0.35s ease",
        boxShadow: t.shadow,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-8px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0px)";
      }}
    >
      {/* IMAGE SECTION */}
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
            top: "16px",
            left: "16px",
            zIndex: 2,
            padding: "8px 14px",
            borderRadius: "999px",
            fontSize: "12px",
            fontWeight: "700",
            background: t.badgeBg,
            color: t.badgeText,
            border: `1px solid ${t.border}`,
            backdropFilter: "blur(14px)",
          }}
        >
          {categoryName}
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
          src={getImageUrl(blog.coverImage)}
          alt={blog.title || "Blog"}
          onError={(e) =>
            ((e.currentTarget as HTMLImageElement).src =
              "/placeholder.jpg")
          }
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.45s ease",
          }}
        />
      </div>

      {/* CONTENT */}
      <div
        style={{
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          gap: "16px",
        }}
      >
        {/* TITLE */}
        <h3
          style={{
            fontSize: "22px",
            fontWeight: "800",
            lineHeight: "1.4",
            color: t.text,
            margin: 0,
          }}
        >
          {blog.title || "Untitled"}
        </h3>

        {/* SUMMARY */}
        <p
          style={{
            fontSize: "14px",
            color: t.muted,
            lineHeight: "1.8",
            flexGrow: 1,
            margin: 0,
          }}
        >
          {blog.summary ||
            "No summary available for this blog."}
        </p>

        {/* AUTHOR */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginTop: "8px",
          }}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              background: t.accent,
              boxShadow: `0 0 0 4px ${t.border}`,
            }}
          />

          <div>
            <p
              style={{
                fontWeight: "700",
                color: t.text,
                margin: 0,
                fontSize: "14px",
              }}
            >
              {authorName}
            </p>

            <small
              style={{
                color: t.muted,
                fontSize: "12px",
              }}
            >
              Contributor
            </small>
          </div>
        </div>

        {/* BUTTON */}
        {blogId ? (
          <Link
            href={`/blogs/${blogId}`}
            style={{
              marginTop: "auto",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "14px 18px",
              borderRadius: "14px",
              background: t.button,
              color: "#fff",
              fontWeight: "700",
              textDecoration: "none",
              transition: "all 0.3s ease",
            }}
          >
            Read Blog →
          </Link>
        ) : (
          <span
            style={{
              marginTop: "auto",
              padding: "14px 18px",
              borderRadius: "14px",
              background: t.border,
              color: t.muted,
              textAlign: "center",
            }}
          >
            Read Blog →
          </span>
        )}
      </div>
    </div>
  );
}