"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/utils/api";
import { safeText } from "@/utils/normalize";

export default function BlogPreviewPage() {
  const { id } = useParams();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchBlog();
    }
  }, [id]);

  /* ================= FETCH BLOG PREVIEW ================= */
  const fetchBlog = async () => {
    try {
      setLoading(true);

      const data = await api(`/blogs/preview/${id}`);

      if (data?.success) {
        setBlog(data.data);
      } else {
        setBlog(null);
      }
    } catch (error) {
      console.error("Preview fetch error:", error);
      setBlog(null);
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
  if (!blog) {
    return (
      <div className="empty-state">
        Blog not found
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
      <h1>{safeText(blog.title)}</h1>

      {/* STATUS */}
      <p>
        <b>Status:</b> {safeText(blog.status)}
      </p>

      {/* SCHEDULE DATE */}
      {blog.scheduledPublishDate && (
        <p>
          <b>Scheduled For:</b>{" "}
          {new Date(
            blog.scheduledPublishDate
          ).toLocaleString()}
        </p>
      )}

      {/* IMAGE */}
      {blog.image && (
        <img
          src={blog.image}
          alt={blog.title}
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
      {blog.author && (
        <p>
          <b>Author:</b>{" "}
          {safeText(blog.author)}
        </p>
      )}

      {blog.category && (
        <p>
          <b>Category:</b>{" "}
          {safeText(blog.category)}
        </p>
      )}

      {/* EXCERPT */}
      {blog.excerpt && (
        <>
          <hr />
          <h3>Excerpt</h3>
          <p
            style={{
              color: "#64748b",
              lineHeight: "1.8",
            }}
          >
            {safeText(blog.excerpt)}
          </p>
        </>
      )}

      {/* CONTENT */}
      <hr />
      <h3>Content</h3>

      <p style={{ lineHeight: "1.8" }}>
        {safeText(blog.content)}
      </p>
    </div>
  );
}