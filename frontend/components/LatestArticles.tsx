"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "../context/ThemeContext";
import ArticleCard from "./ArticleCard";

type Article = {
  _id?: string;
  id?: string;
  title: string;
  summary?: string;
  author?: string | { name: string };
  image?: string;
  featuredImage?: string;
  category?:
    | string
    | {
        id?: number;
        name?: string;
        slug?: string;
        description?: string;
      };
};

type Props = {
  limit?: number;
};

export default function LatestArticles({ limit = 6 }: Props) {
  const { theme } = useTheme();

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchArticles();
  }, [limit]);

  const fetchArticles = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("http://localhost:5000/api/articles");

      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);

      const data = await res.json();

      const fetchedArticles: Article[] = Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data)
        ? data
        : [];

      setArticles(
        limit ? fetchedArticles.slice(0, limit) : fetchedArticles
      );
    } catch (err) {
      console.error("Article Fetch Error:", err);
      setError("Unable to load articles");
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const isLight = theme === "light";
  const isDark = theme === "dark";

  const style = {
    light: {
      text: "#111827",
      muted: "#6b7280",
      buttonBg: "#ffffff",
      border: "rgba(0,0,0,0.08)",
    },

    dark: {
      text: "#f5f5f5",
      muted: "#b5b5c0",
      buttonBg: "#17171f",
      border: "rgba(255,255,255,0.08)",
    },

    corporate: {
      text: "#1f2937",
      muted: "#6b7280",
      buttonBg: "#ffffff",
      border: "rgba(0,0,0,0.08)",
    },
  };

  const t = isLight
    ? style.light
    : isDark
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
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "35px",
        }}
      >
        <Link
          href="/articles"
          style={{
            padding: "12px 22px",
            border: `1px solid ${t.border}`,
            borderRadius: "12px",
            fontWeight: 600,
            background: t.buttonBg,
            textDecoration: "none",
            color: t.text,
          }}
        >
          View All →
        </Link>
      </div>

      {/* LOADING */}
      {loading && (
        <p
          style={{
            textAlign: "center",
            fontSize: "18px",
            color: t.muted,
          }}
        >
          Loading articles...
        </p>
      )}

      {/* ERROR */}
      {error && !loading && (
        <p
          style={{
            textAlign: "center",
            color: "red",
          }}
        >
          {error}
        </p>
      )}

      {/* EMPTY */}
      {!loading && !error && articles.length === 0 && (
        <p
          style={{
            textAlign: "center",
            fontSize: "18px",
            color: t.muted,
          }}
        >
          No articles found.
        </p>
      )}

      {/* GRID */}
      {!loading && !error && articles.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "28px",
          }}
        >
          {articles.map((article, index) => {
            const authorName =
              typeof article.author === "object"
                ? article.author.name
                : article.author || "Admin";

            const categoryName =
              typeof article.category === "object"
                ? article.category?.name || "General"
                : article.category || "General";

            return (
              <ArticleCard
                key={article._id || article.id || index}
                articleId={article._id || article.id}
                title={article.title}
                summary={article.summary}
                author={authorName}
                image={
                  article.featuredImage || article.image
                }
                category={categoryName}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}