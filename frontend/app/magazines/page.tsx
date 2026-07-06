"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTheme } from "../../context/ThemeContext";
import MagazineCard from "../../components/MagazineCard";

import "./../../styles/pages.css";
import "@/styles/magazines.css";

type Category = {
  id?: number;
  _id?: string;
  name?: string;
  slug?: string;
};

type Magazine = {
  id?: number;
  _id?: string;
  title: string;
  description?: string;
  coverImage?: string;
  slug?: string;
  edition?: string;
  publishDate?: string;
  averageRating?: number;
  totalRatings?: number;
  category?: {
    id?: number;
    name?: string;
    slug?: string;
  };
};

export default function MagazinesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme } = useTheme();

  const urlCategory = searchParams.get("category") || "All";

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState(urlCategory);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [loading, setLoading] = useState(false);

  /* ================= THEME TOKENS ================= */
  const styles = {
    light: {
      bg: "#f7f7fb",
      text: "#1a1a1a",
      muted: "#666666",
      primary: "#ff4d6d",
      card: "#ffffff",
      border: "#e5e7eb",
    },

    dark: {
      bg: "#0f0f14",
      text: "#f5f5f5",
      muted: "#b5b5c0",
      primary: "#ff4d6d",
      card: "#17171f",
      border: "#2a2a35",
    },

    corporate: {
      bg: "#f5f3f0",
      text: "#1f2937",
      muted: "#6b7280",
      primary: "#b45309",
      card: "#ffffff",
      border: "#d6d3d1",
    },
  };

  const t =
    styles[theme as keyof typeof styles] || styles.light;

  /* FETCH CATEGORIES */
  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/categories"
      );

      const data = await response.json();

      const fetchedCategories = Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data)
        ? data
        : [];

      setCategories(fetchedCategories);
    } catch (error) {
      console.error("Fetch categories error:", error);
      setCategories([]);
    }
  };

  /* FETCH MAGAZINES */
  const fetchMagazines = async (category: string) => {
    try {
      setLoading(true);

      let url = "http://localhost:5000/api/magazines";

      if (category !== "All") {
        url += `?category=${encodeURIComponent(category)}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      const fetchedMagazines = Array.isArray(data?.data)
        ? data.data
        : [];

      setMagazines(fetchedMagazines);
    } catch (error) {
      console.error("Fetch magazines error:", error);
      setMagazines([]);
    } finally {
      setLoading(false);
    }
  };

  /* INIT */
  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setSelectedCategory(urlCategory);
    fetchMagazines(urlCategory);
  }, [urlCategory]);

  const handleCategoryChange = (cat: string) => {
    setDropdownOpen(false);
    setSelectedCategory(cat);

    if (cat === "All") {
      router.push("/magazines");
    } else {
      router.push(
        `/magazines?category=${encodeURIComponent(cat)}`
      );
    }
  };

  return (
    <div
      style={{
        background: t.bg,
        color: t.text,
        minHeight: "100vh",
        transition: "all 0.3s ease",
      }}
    >
      {/* HEADER */}
      <section
        className="page-header"
        style={{
          padding: "70px 20px 30px",
          textAlign: "center",
          maxWidth: "900px",
          margin: "-20px auto 0",
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
          Premium Editions
        </p>

        <h1
          style={{
            marginBottom: "16px",
            lineHeight: "1.2",
            fontSize: "52px",
            fontWeight: 800,
          }}
        >
          {selectedCategory === "All"
            ? "Our Magazines"
            : `${selectedCategory} Magazines`}
        </h1>

        <p
          style={{
            color: t.muted,
            lineHeight: "1.8",
            maxWidth: "720px",
            margin: "0 auto",
            fontSize: "18px",
          }}
        >
          Explore premium editions featuring startups,
          innovation, business intelligence, and leadership.
        </p>
      </section>

      {/* CATEGORY DROPDOWN */}
      <div className="category-dropdown-wrapper">
        <button
          className="category-dropdown-btn"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          style={{
            background: t.card,
            color: t.text,
            border: `1px solid ${t.border}`,
          }}
        >
          {selectedCategory} ▼
        </button>

        {dropdownOpen && (
          <div
            className="category-dropdown-menu"
            style={{
              background: t.card,
              color: t.text,
              border: `1px solid ${t.border}`,
            }}
          >
            <div onClick={() => handleCategoryChange("All")}>
              All
            </div>

            {categories.map((cat, index) => (
              <div
                key={cat.id || cat._id || index}
                onClick={() =>
                  handleCategoryChange(cat.name || "General")
                }
              >
                {cat.name || "General"}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="page-container">
        {/* LOADING */}
        {loading && (
          <p
            style={{
              textAlign: "center",
              color: t.muted,
              fontSize: "18px",
            }}
          >
            Loading magazines...
          </p>
        )}

        {/* EMPTY */}
        {!loading && magazines.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "80px 20px",
              border: `1px dashed ${t.border}`,
              borderRadius: "20px",
              background: t.card,
            }}
          >
            <h2>No Magazines Found</h2>

            <p style={{ color: t.muted }}>
              No magazines available for this category yet.
            </p>
          </div>
        )}

        {/* GRID */}
        {!loading && magazines.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "28px",
              maxWidth: "1400px",
              margin: "0 auto",
            }}
          >
            {magazines.map((magazine, index) => (
              <MagazineCard
                key={magazine.id || magazine._id || index}
                magazine={{
                  ...magazine,
                  category: {
                    ...magazine.category,
                    name:
                      magazine.category?.name || "General",
                  },
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}