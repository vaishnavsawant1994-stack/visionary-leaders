"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/utils/api";
import { safeText } from "@/utils/normalize";

export default function ArticlePreviewPage() {
  const { id } = useParams();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchArticle();
    }
  }, [id]);

  /* ================= FETCH PREVIEW ARTICLE ================= */
  const fetchArticle = async () => {
    try {
      setLoading(true);

      const data = await api(`/articles/preview/${id}`);

      if (data?.success) {
        setArticle(data.data);
      } else {
        setArticle(null);
      }
    } catch (error) {
      console.error("Preview fetch error:", error);
      setArticle(null);
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="admin-card">
        <p>Loading preview...</p>
      </div>
    );
  }

  /* ================= NOT FOUND ================= */
  if (!article) {
    return (
      <div className="empty-state">
        Article not found
      </div>
    );
  }

  return (
    <div
      className="admin-card"
      style={{
        maxWidth: "900px",
        margin: "30px auto",
        padding: "30px",
      }}
    >
      {/* TITLE */}
      <h1>{safeText(article.title)}</h1>

      {/* STATUS */}
      <p>
        <b>Status:</b>{" "}
        {safeText(article.status)}
      </p>

      {/* SCHEDULE DATE */}
      {article.scheduledPublishDate && (
        <p>
          <b>Scheduled For:</b>{" "}
          {new Date(
            article.scheduledPublishDate
          ).toLocaleString()}
        </p>
      )}

      {/* IMAGE */}
      {article.featuredImage &&
        article.featuredImage !==
          "/placeholder.jpg" && (
          <img
            src={`http://localhost:5000${article.featuredImage}`}
            alt={article.title}
            style={{
              width: "100%",
              borderRadius: "10px",
              margin: "20px 0",
              maxHeight: "500px",
              objectFit: "cover",
            }}
          />
        )}

      {/* META */}
      <p>
        <b>Category:</b>{" "}
        {safeText(article.category?.name)}
      </p>

      <p>
        <b>Author:</b>{" "}
        {safeText(article.author?.name)}
      </p>

      {/* SUMMARY */}
      {article.summary && (
        <>
          <hr />
          <h3>Summary</h3>
          <p>{safeText(article.summary)}</p>
        </>
      )}

      {/* CONTENT */}
      <hr />
      <h3>Content</h3>

      <p style={{ lineHeight: "1.8" }}>
        {safeText(article.content)}
      </p>

      {/* TAGS */}
      {Array.isArray(article.tags) &&
        article.tags.length > 0 && (
          <>
            <hr />
            <h3>Tags</h3>

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              {article.tags.map((tag, index) => (
                <span
                  key={index}
                  style={{
                    padding: "6px 12px",
                    background: "#f3f4f6",
                    borderRadius: "20px",
                  }}
                >
                  {safeText(tag)}
                </span>
              ))}
            </div>
          </>
        )}

      {/* SEO */}
      {(article.seoTitle ||
        article.seoDescription) && (
        <>
          <hr />
          <h3>SEO</h3>

          <p>
            <b>SEO Title:</b>{" "}
            {safeText(article.seoTitle)}
          </p>

          <p>
            <b>SEO Description:</b>{" "}
            {safeText(article.seoDescription)}
          </p>
        </>
      )}
    </div>
  );
}