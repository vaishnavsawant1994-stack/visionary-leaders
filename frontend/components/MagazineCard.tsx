"use client";

import Link from "next/link";
import { useTheme } from "../context/ThemeContext";

export interface Magazine {
  id?: number;
  _id?: string;
  title: string;
  description?: string;
  edition?: string;
  coverImage?: string;
  category?: {
    id?: number;
    name: string;
    slug?: string;
  };
}

type Props = {
  magazine: Magazine;
};

export default function MagazineCard({ magazine }: Props) {
  const { theme } = useTheme();

  if (!magazine) return null;

  const categoryName = magazine.category?.name || "General";

  const imageUrl =
    magazine.coverImage && magazine.coverImage.trim() !== ""
      ? magazine.coverImage.startsWith("http")
        ? magazine.coverImage
        : `http://localhost:5000${magazine.coverImage}`
      : "/default-magazine.jpg";

  const magazineId = magazine.id || magazine._id;

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
      editionBg: "#f43f5e",
      button: "#f43f5e",
      shadow: "0 14px 35px rgba(244,114,182,0.14)",
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
      editionBg: "#dc2626",
      button: "#dc2626",
      shadow: "0 14px 35px rgba(220,38,38,0.15)",
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
      editionBg: "#d97706",
      button: "#d97706",
      shadow: "0 14px 35px rgba(217,119,6,0.14)",
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
        position: "relative",
        cursor: "pointer",
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
          height: "290px",
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

        {/* EDITION BADGE */}
        {magazine.edition && (
          <div
            style={{
              position: "absolute",
              bottom: "16px",
              left: "16px",
              zIndex: 2,
              padding: "8px 14px",
              borderRadius: "999px",
              fontSize: "12px",
              fontWeight: "700",
              background: t.editionBg,
              color: "#fff",
              boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
            }}
          >
            {magazine.edition}
          </div>
        )}

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
          src={imageUrl}
          alt={magazine.title}
          onError={(e) =>
            ((e.currentTarget as HTMLImageElement).src =
              "/default-magazine.jpg")
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
          gap: "16px",
          flexGrow: 1,
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
          {magazine.title}
        </h3>

        {/* DESCRIPTION */}
        <p
          style={{
            fontSize: "14px",
            color: t.muted,
            lineHeight: "1.8",
            margin: 0,
            flexGrow: 1,
          }}
        >
          {magazine.description?.slice(0, 120) ||
            "Exclusive editorial insights, business intelligence and leadership stories."}
        </p>

        {/* BUTTON */}
        {magazineId ? (
          <Link
            href={`/magazines/${magazineId}/read`}
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
            Read Magazine →
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
            Read Magazine →
          </span>
        )}
      </div>
    </div>
  );
}