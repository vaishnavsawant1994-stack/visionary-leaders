"use client";

import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";

type Category = {
  _id?: string;
  id?: string;
  name: string;
  slug?: string;
  description?: string;
};

type Props = {
  onSelectCategory?: (category: string) => void;
};

export default function Categories({
  onSelectCategory,
}: Props) {
  const { theme } = useTheme();

  const [categories, setCategories] = useState<
    Category[]
  >([]);
  const [selected, setSelected] =
    useState<string>("All");
  const [loading, setLoading] =
    useState<boolean>(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async (): Promise<void> => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/categories"
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch categories"
        );
      }

      const data = await response.json();

      const fetchedCategories: Category[] =
        Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
          ? data
          : [];

      setCategories(fetchedCategories);
    } catch (error) {
      console.error(
        "Category Fetch Error:",
        error
      );
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (
    category: string
  ): void => {
    const normalizedCategory =
      category.trim();

    setSelected(normalizedCategory);

    if (onSelectCategory) {
      onSelectCategory(normalizedCategory);
    }
  };

  /* THEME TOKENS */
  const style = {
    light: {
      bg: "#ffffff",
      card: "#ffffff",
      text: "#111827",
      muted: "#6b7280",
      border: "rgba(0,0,0,0.08)",
      primary: "#ff4d6d",
    },

    dark: {
      bg: "#0f172a",
      card: "#17171f",
      text: "#ffffff",
      muted: "#b5b5c0",
      border: "rgba(255,255,255,0.08)",
      primary: "#ff4d6d",
    },

    corporate: {
      bg: "#f8f5f0",
      card: "#ffffff",
      text: "#1f2937",
      muted: "#6b7280",
      border: "rgba(0,0,0,0.08)",
      primary: "#b45309",
    },
  };

  const t =
    theme === "light"
      ? style.light
      : theme === "dark"
      ? style.dark
      : style.corporate;

  const getCardStyle = (
    active: boolean
  ): React.CSSProperties => ({
    background: active
      ? t.primary
      : t.card,
    color: active ? "#fff" : t.text,
    padding: "30px",
    borderRadius: "20px",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.35s ease",
    border: `1px solid ${t.border}`,
    boxShadow: active
      ? `0 15px 35px ${t.primary}20`
      : "0 8px 20px rgba(0,0,0,0.05)",
  });

  return (
    <section
      style={{
        padding: "100px 40px",
        background: t.bg,
      }}
    >
      {/* HEADER */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "55px",
        }}
      >
        <p
          style={{
            color: t.primary,
            fontWeight: 700,
            letterSpacing: "2px",
            marginBottom: "12px",
            textTransform: "uppercase",
            fontSize: "14px",
          }}
        >
          Explore Content
        </p>

        <h2
          style={{
            fontSize: "42px",
            fontWeight: 800,
            color: t.text,
            marginBottom: "14px",
          }}
        >
          Browse by Categories
        </h2>

        <p
          style={{
            maxWidth: "720px",
            margin: "0 auto",
            fontSize: "17px",
            color: t.muted,
            lineHeight: "1.8",
          }}
        >
          Discover insights across business,
          technology, leadership, startups,
          innovation, and global affairs.
        </p>
      </div>

      {/* LOADING */}
      {loading && (
        <p
          style={{
            textAlign: "center",
            color: t.muted,
            fontSize: "18px",
          }}
        >
          Loading categories...
        </p>
      )}

      {/* GRID */}
      {!loading && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(230px,1fr))",
            gap: "26px",
            maxWidth: "1250px",
            margin: "0 auto",
          }}
        >
          {/* ALL CARD */}
          <div
            onClick={() => handleClick("All")}
            style={getCardStyle(
              selected === "All"
            )}
          >
            <div
              style={{
                fontSize: "30px",
                marginBottom: "14px",
              }}
            >
              🌍
            </div>

            <h3
              style={{
                fontSize: "20px",
                fontWeight: 700,
                margin: 0,
              }}
            >
              All
            </h3>
          </div>

          {/* CATEGORY CARDS */}
          {categories.map(
            (
              category: Category,
              index: number
            ) => (
              <div
                key={
                  category._id ||
                  category.id ||
                  index
                }
                onClick={() =>
                  handleClick(category.name)
                }
                style={getCardStyle(
                  selected === category.name
                )}
              >
                <div
                  style={{
                    fontSize: "30px",
                    marginBottom: "14px",
                  }}
                >
                  {index % 2 === 0
                    ? "📘"
                    : "🚀"}
                </div>

                <h3
                  style={{
                    fontSize: "20px",
                    fontWeight: 700,
                    margin: 0,
                  }}
                >
                  {category.name}
                </h3>
              </div>
            )
          )}
        </div>
      )}
    </section>
  );
}