"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/utils/api";
import { safeText } from "@/utils/normalize";

export default function NewsPreviewPage() {
  const params = useParams();
  const id = params?.id;

  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchNews();
    }
  }, [id]);

  /* ================= FETCH PREVIEW ================= */
  const fetchNews = async () => {
    try {
      setLoading(true);

      const data = await api(`/news/preview/${id}`);

      if (data?.success) {
        setNews(data.data);
      } else {
        setNews(null);
      }
    } catch (error) {
      console.error("Preview fetch error:", error);
      setNews(null);
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="admin-card">
        Loading preview...
      </div>
    );
  }

  /* ================= NOT FOUND ================= */
  if (!news) {
    return (
      <div className="empty-state">
        News not found
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
      <h1>{safeText(news.title)}</h1>

      {/* STATUS */}
      <p>
        <b>Status:</b> {safeText(news.status)}
      </p>

      {/* SCHEDULE DATE */}
      {news.scheduledPublishDate && (
        <p>
          <b>Scheduled For:</b>{" "}
          {new Date(
            news.scheduledPublishDate
          ).toLocaleString()}
        </p>
      )}

      {/* IMAGE */}
      {news.image && (
        <img
          src={
            news.image.startsWith("http")
              ? news.image
              : `http://localhost:5000${news.image}`
          }
          alt={news.title}
          style={{
            width: "100%",
            borderRadius: "10px",
            margin: "20px 0",
            maxHeight: "450px",
            objectFit: "cover",
          }}
        />
      )}

      {/* SUMMARY */}
      {news.summary && (
        <p
          style={{
            color: "#64748b",
            fontSize: "16px",
            marginBottom: "20px",
          }}
        >
          {safeText(news.summary)}
        </p>
      )}

      {/* CATEGORY */}
      {news.category && (
        <p>
          <b>Category:</b>{" "}
          {safeText(news.category)}
        </p>
      )}

      {/* SOURCE */}
      {news.source && (
        <p>
          <b>Source:</b>{" "}
          {safeText(news.source)}
        </p>
      )}

      {/* AUTHOR */}
      {news.author && (
        <p>
          <b>Author:</b>{" "}
          {safeText(news.author)}
        </p>
      )}

      <hr />

      {/* CONTENT */}
      <div
        style={{
          lineHeight: "1.8",
          marginTop: "20px",
        }}
      >
        {safeText(news.content)}
      </div>
    </div>
  );
}