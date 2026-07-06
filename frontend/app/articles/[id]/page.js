"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ArticleDetails() {
  const params = useParams();

  const id = Array.isArray(params?.id)
    ? params.id[0]
    : params?.id;

  const [article, setArticle] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [summaryLoading, setSummaryLoading] =
    useState(false);

  const [aiSummary, setAiSummary] =
    useState("");

  useEffect(() => {
    if (id) fetchArticle();
  }, [id]);

  /* ================= FETCH ARTICLE ================= */
  const fetchArticle = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:5000/api/articles/${id}`
      );

      const data = await res.json();

      if (
        data.success &&
        data.data
      ) {
        const articleData = data.data;

        const isPublished =
          articleData.status === "PUBLISHED";

        const isScheduledReady =
          articleData.status === "SCHEDULED" &&
          articleData.scheduledPublishDate &&
          new Date(
            articleData.scheduledPublishDate
          ) <= new Date();

        if (
          isPublished ||
          isScheduledReady
        ) {
          setArticle(articleData);

          if (articleData.aiSummary) {
            setAiSummary(
              articleData.aiSummary
            );
          }
        } else {
          setError(
            "Article not available yet"
          );
        }
      } else {
        setError("Article not found");
      }
    } catch (error) {
      setError("Unable to load article");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SUMMARY ================= */
  const handleSummarize =
    async () => {
      try {
        setSummaryLoading(true);

        const res = await fetch(
          "http://localhost:5000/api/ai/summarize",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              content:
                article.content,
              type: "article",
              id: article.id,
            }),
          }
        );

        const data =
          await res.json();

        if (data.success) {
          setAiSummary(data.summary);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setSummaryLoading(false);
      }
    };

  /* ================= IMAGE URL ================= */
  const getImageUrl = (image) => {
    if (!image || image.trim() === "") {
      return "/placeholder.jpg";
    }

    if (image.startsWith("http")) {
      return image;
    }

    if (image.startsWith("/uploads")) {
      return `http://localhost:5000${image}`;
    }

    return "/placeholder.jpg";
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div
        style={{
          padding: "80px",
          textAlign: "center",
        }}
      >
        Loading...
      </div>
    );
  }

  /* ================= ERROR ================= */
  if (error || !article) {
    return (
      <div
        style={{
          padding: "80px",
          textAlign: "center",
        }}
      >
        <h2>
          {error ||
            "Article not found"}
        </h2>
      </div>
    );
  }

  return (
    <>
      {/* HEADER */}
      <section
        style={{
          padding: "80px 20px 40px",
          textAlign: "center",
        }}
      >
        <p>Digital Reader</p>

        <h1>{article.title}</h1>

        <p>{article.summary}</p>
      </section>

      {/* IMAGE */}
      <img
        src={getImageUrl(
          article.featuredImage
        )}
        alt={article.title}
        style={{
          width: "100%",
          maxHeight: "550px",
          objectFit: "cover",
        }}
      />

      {/* CONTENT */}
      <section
        style={{
          maxWidth: "900px",
          margin: "50px auto",
          padding: "0 20px",
        }}
      >
        <button
          onClick={handleSummarize}
          style={{
            ...buttonStyle,
            background:
              "#f59e0b",
            marginBottom: "20px",
          }}
        >
          {summaryLoading
            ? "Generating..."
            : "Article Summary"}
        </button>

        {aiSummary && (
          <div
            style={{
              background: "#f8fafc",
              padding: "20px",
              borderRadius: "12px",
              marginBottom: "30px",
              border:
                "1px solid #e2e8f0",
            }}
          >
            <h3>
              Article Summary
            </h3>
            <p>{aiSummary}</p>
          </div>
        )}

        <div
          style={{
            whiteSpace: "pre-wrap",
            lineHeight: "1.9",
            fontSize: "18px",
          }}
        >
          {article.content}
        </div>
      </section>
    </>
  );
}

const buttonStyle = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  padding: "10px 18px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
};