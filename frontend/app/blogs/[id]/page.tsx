"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { uiTranslations } from "@/utils/translations";

export default function BlogDetailsPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [aiSummary, setAiSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);

  const t = uiTranslations.en;

  useEffect(() => {
    if (id) fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `http://localhost:5000/api/blogs/${id}`
      );

      const data = await response.json();

      if (data?.success) {
        setBlog(data.data);
      } else {
        setError("Blog not found");
      }
    } catch (err) {
      setError("Unable to load blog");
    } finally {
      setLoading(false);
    }
  };

  const generateSummary = async () => {
    try {
      setSummaryLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/ai/summarize",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: blog.content,
            type: "blog",
          }),
        }
      );

      const data = await res.json();

      if (data?.success) {
        setAiSummary(data.summary);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSummaryLoading(false);
    }
  };

  const getImageUrl = (image?: string) => {
    if (!image) return "/placeholder.jpg";
    if (image.startsWith("http")) return image;
    return image;
  };

  if (loading) {
    return (
      <div style={{ padding: 80, textAlign: "center" }}>
        {t.loading}
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div style={{ padding: 80, textAlign: "center" }}>
        <h2>{error || "Blog not found"}</h2>
      </div>
    );
  }

  return (
    <>
      <section
        style={{
          padding: "80px 20px 40px",
          textAlign: "center",
          maxWidth: 900,
          margin: "auto",
        }}
      >
        <p>Thought Leadership</p>

        <h1>{blog.title}</h1>

        <p>{blog.excerpt}</p>
      </section>

      <img
        src={getImageUrl(blog.image)}
        alt={blog.title}
        style={{
          width: "100%",
          maxHeight: 550,
          objectFit: "cover",
        }}
      />

      <section
        style={{
          maxWidth: 900,
          margin: "50px auto",
          padding: "0 20px",
        }}
      >
        {/* BLOG SUMMARY BUTTON */}
        <button
          onClick={generateSummary}
          style={{
            background: "linear-gradient(135deg, #ff4d6d, #ff7a59)",
            color: "#fff",
            border: "none",
            padding: "12px 18px",
            borderRadius: "12px",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 6px 18px rgba(255, 77, 109, 0.25)",
            transition: "all 0.3s ease",
            marginBottom: "15px",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0px)";
          }}
        >
          {summaryLoading ? t.loading : t.blogSummary}
        </button>

        {aiSummary && (
          <p
            style={{
              background: "#f7f7fb",
              padding: "12px",
              borderRadius: "10px",
              marginBottom: "20px",
            }}
          >
            {aiSummary}
          </p>
        )}

        <div
          style={{
            whiteSpace: "pre-wrap",
            lineHeight: 1.9,
            fontSize: 18,
          }}
        >
          {blog.content}
        </div>
      </section>
    </>
  );
}