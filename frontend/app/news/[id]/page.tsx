"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface News {
  id: number;
  title: string;
  summary?: string;
  aiSummary?: string;
  content: string;
  image?: string;
  category?: string;
  source?: string;
  createdAt?: string;
}

export default function NewsDetailsPage() {
  const params = useParams();

  const id = Array.isArray(params?.id)
    ? params.id[0]
    : params?.id;

  const [news, setNews] = useState<News | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [aiSummary, setAiSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);

  useEffect(() => {
    if (id) fetchNews();
  }, [id]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `http://localhost:5000/api/news/${id}`
      );

      const data = await response.json();

      if (!data?.success || !data?.data) {
        setNews(null);
        setError("This news is not available yet (it may be scheduled).");
        return;
      }

      setNews(data.data);

      if (data.data.aiSummary) {
        setAiSummary(data.data.aiSummary);
      }
    } catch (error) {
      console.error(error);
      setError("Unable to load news");
    } finally {
      setLoading(false);
    }
  };

  const generateSummary = async () => {
    if (!news?.content) return;

    try {
      setSummaryLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/ai/summarize",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: news.content,
            type: "news",
            id: news.id,
          }),
        }
      );

      const data = await response.json();

      if (data?.success) {
        setAiSummary(data.summary);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSummaryLoading(false);
    }
  };

  /* ================= THEME BUTTON UI ================= */
  const newsSummaryButtonStyle = {
    light: {
      background: "linear-gradient(135deg, #ff4d6d, #ff7a59)",
      color: "#fff",
      shadow: "0 6px 18px rgba(255, 77, 109, 0.25)",
    },
    dark: {
      background: "linear-gradient(135deg, #ff4d6d, #ffd700)",
      color: "#fff",
      shadow: "0 6px 18px rgba(255, 215, 0, 0.18)",
    },
    corporate: {
      background: "linear-gradient(135deg, #b45309, #22c55e)",
      color: "#fff",
      shadow: "0 6px 18px rgba(46, 125, 50, 0.25)",
    },
  };

  const theme = "light"; // (replace with your actual theme from context)
  const summaryBtn = newsSummaryButtonStyle[theme || "light"];

  if (loading) {
    return (
      <div style={{ padding: "80px", textAlign: "center" }}>
        Loading...
      </div>
    );
  }

  if (error || !news) {
    return (
      <div style={{ padding: "80px", textAlign: "center" }}>
        <h2>{error || "News not found"}</h2>
        <p style={{ color: "#666", marginTop: "10px" }}>
          This article may be scheduled or not published yet.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "50px 20px",
      }}
    >
      <img
        src={news.image || "/placeholder.jpg"}
        alt={news.title}
        style={{
          width: "100%",
          height: "500px",
          objectFit: "cover",
          borderRadius: "15px",
          marginBottom: "30px",
        }}
      />

      {/* SUMMARY BUTTON (THEMED) */}
      <button
        onClick={generateSummary}
        disabled={summaryLoading}
        style={{
          background: summaryBtn.background,
          color: summaryBtn.color,
          border: "none",
          padding: "12px 18px",
          borderRadius: "12px",
          fontWeight: "600",
          cursor: "pointer",
          boxShadow: summaryBtn.shadow,
          marginTop: "10px",
          transition: "all 0.3s ease",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = "translateY(0px)";
        }}
      >
        {summaryLoading ? "Generating..." : "Generate Summary"}
      </button>

      {aiSummary && (
        <div
          style={{
            background: "#f8fafc",
            padding: "20px",
            marginTop: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>AI Summary</h3>
          <p>{aiSummary}</p>
        </div>
      )}

      <p style={{ whiteSpace: "pre-wrap", marginTop: "20px" }}>
        {news.content}
      </p>
    </div>
  );
}