"use client";

import { useEffect, useState } from "react";
import ArticleCard from "../../components/ArticleCard";
import { useTheme } from "../../context/ThemeContext";

export default function ArticlesPage() {
  const { theme } = useTheme();

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH ARTICLES ================= */
  const fetchArticles = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/articles");

      if (!res.ok) {
        throw new Error("Failed to fetch articles");
      }

      const data = await res.json();

      const fetchedArticles = Array.isArray(data?.data)
        ? data.data
        : [];

      setArticles(fetchedArticles);
    } catch (error) {
      console.error("Error fetching articles:", error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  /* ================= THEME TOKENS ================= */
  const styles = {
    light: {
      bg: "#f7f7fb",
      text: "#1a1a1a",
      muted: "#666666",
      accent: "#ff4d6d",
      border: "#e5e7eb",
      card: "#ffffff",
    },

    dark: {
      bg: "#0f0f14",
      text: "#f5f5f5",
      muted: "#b5b5c0",
      accent: "#ff4d6d",
      border: "#2a2a35",
      card: "#17171f",
    },

    corporate: {
      bg: "#f5f3f0",
      text: "#1f2937",
      muted: "#6b7280",
      accent: "#b45309",
      border: "#d6d3d1",
      card: "#ffffff",
    },
  };

  const t = styles[theme] || styles.light;

  return (
    <div
      style={{
        background: t.bg,
        color: t.text,
        minHeight: "100vh",
        paddingBottom: "80px",
        transition: "all 0.3s ease",
      }}
    >
      {/* HEADER */}
      <section
        style={{
          textAlign: "center",
          padding: "70px 20px 35px",
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
          Editorial Insights
        </p>

        <h1
          style={{
            fontSize: "52px",
            fontWeight: 900,
            marginBottom: "16px",
            lineHeight: "1.2",
          }}
        >
          Articles
        </h1>

        <p
          style={{
            maxWidth: "700px",
            margin: "0 auto",
            fontSize: "18px",
            lineHeight: "1.8",
            color: t.muted,
          }}
        >
          Discover leadership, innovation, technology,
          global business trends, and visionary insights.
        </p>
      </section>

      {/* CONTENT */}
      <section
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "20px",
        }}
      >
        {/* LOADING */}
        {loading && (
          <p
            style={{
              textAlign: "center",
              color: t.muted,
              fontSize: "18px",
            }}
          >
            Loading articles...
          </p>
        )}

        {/* EMPTY */}
        {!loading && articles.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "80px 20px",
              border: `1px dashed ${t.border}`,
              borderRadius: "20px",
              background: t.card,
            }}
          >
            <h2>No Articles Yet</h2>

            <p style={{ color: t.muted }}>
              Articles will appear here once published.
            </p>
          </div>
        )}

        {/* GRID */}
        {!loading && articles.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "28px",
            }}
          >
            {articles.map((article, index) => {
              const categoryName =
                typeof article.category === "object"
                  ? article.category?.name || "General"
                  : article.category || "General";

              const authorName =
                typeof article.author === "object"
                  ? article.author?.name || "Admin"
                  : article.author || "Admin";

              const imageUrl =
                article.featuredImage &&
                article.featuredImage.trim() !== ""
                  ? article.featuredImage.startsWith("http")
                    ? article.featuredImage
                    : `http://localhost:5000/uploads/articles/${article.featuredImage}`
                  : "/placeholder.jpg";

              return (
                <ArticleCard
                  key={article._id || article.id || index}
                  title={article.title}
                  summary={
                    article.summary?.slice(0, 140) ||
                    "No summary available"
                  }
                  category={categoryName}
                  author={authorName}
                  image={imageUrl}
                  articleId={article._id || article.id || ""}
                />
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}