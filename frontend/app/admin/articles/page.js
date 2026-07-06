"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import { safeText } from "@/utils/normalize";

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  /* ================= FETCH ARTICLES ================= */
  const fetchArticles = async (searchTerm = "") => {
    try {
      setLoading(true);

      const query = searchTerm
        ? `?search=${encodeURIComponent(searchTerm)}`
        : "";

      const data = await api(`/articles${query}`);

      setArticles(Array.isArray(data?.data) ? data.data : []);
    } catch (error) {
      console.error("Fetch articles error:", error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this article?"
    );

    if (!confirmDelete) return;

    try {
      setActionLoading(id);

      const data = await api(`/articles/${id}`, {
        method: "DELETE",
      });

      if (!data?.success) {
        alert(data?.message || "Failed to delete article");
        return;
      }

      alert("Article deleted successfully ✔");
      fetchArticles(search);
    } catch (error) {
      console.error(error);
      alert("Delete failed");
    } finally {
      setActionLoading(null);
    }
  };

  /* ================= PUBLISH NOW ================= */
  const handlePublish = async (id) => {
    try {
      setActionLoading(id);

      const data = await api(`/articles/publish/${id}`, {
        method: "PUT",
      });

      if (!data?.success) {
        alert(data?.message || "Publish failed");
        return;
      }

      alert("Article published successfully ✔");
      fetchArticles(search);
    } catch (error) {
      console.error(error);
      alert("Publish failed");
    } finally {
      setActionLoading(null);
    }
  };

  /* ================= ARCHIVE ================= */
  const handleArchive = async (id) => {
    try {
      setActionLoading(id);

      const data = await api(`/articles/archive/${id}`, {
        method: "PUT",
      });

      if (!data?.success) {
        alert(data?.message || "Archive failed");
        return;
      }

      alert("Article archived successfully ✔");
      fetchArticles(search);
    } catch (error) {
      console.error(error);
      alert("Archive failed");
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PUBLISHED":
        return "#16a34a";
      case "SCHEDULED":
        return "#f59e0b";
      case "ARCHIVED":
        return "#6b7280";
      default:
        return "#2563eb";
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <div>
          <h1 className="admin-title">Articles</h1>
          <p style={{ color: "#64748b", marginTop: "-8px" }}>
            Manage all articles
          </p>
        </div>

        <Link href="/admin/articles/create">
          <button className="admin-button">
            + Create Article
          </button>
        </Link>
      </div>

      {/* SEARCH */}
      <div className="admin-card">
        <input
          type="text"
          placeholder="Search articles..."
          value={search}
          onChange={(e) => {
            const value = e.target.value;
            setSearch(value);
            fetchArticles(value);
          }}
          className="admin-input"
        />
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="admin-card">
          <p>Loading articles...</p>
        </div>
      ) : articles.length === 0 ? (
        <div className="empty-state">
          <h2>No Articles Found</h2>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "20px",
            marginTop: "25px",
          }}
        >
          {articles.map((article) => {
            const articleId = article.id;

            return (
              <div
                key={articleId}
                className="admin-card"
                style={{
                  display: "flex",
                  gap: "20px",
                  alignItems: "flex-start",
                }}
              >
                {/* IMAGE */}
                <img
                  src={
                    article.featuredImage
                      ? `http://localhost:5000${article.featuredImage}`
                      : "/placeholder.jpg"
                  }
                  alt={safeText(article.title)}
                  style={{
                    width: "180px",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />

                {/* CONTENT */}
                <div style={{ flex: 1 }}>
                  <h2>{safeText(article.title)}</h2>

                  <p>
                    <strong>Category:</strong>{" "}
                    {safeText(article.category?.name)}
                  </p>

                  <p>
                    <strong>Author:</strong>{" "}
                    {safeText(article.author?.name)}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      style={{
                        color: getStatusColor(article.status),
                        fontWeight: "bold",
                      }}
                    >
                      {safeText(article.status)}
                    </span>
                  </p>

                  {article.status === "SCHEDULED" &&
                    article.scheduledPublishDate && (
                      <p>
                        <strong>Scheduled For:</strong>{" "}
                        {new Date(
                          article.scheduledPublishDate
                        ).toLocaleString()}
                      </p>
                    )}

                  <p
                    style={{
                      marginTop: "10px",
                      color: "#64748b",
                    }}
                  >
                    {safeText(article.summary)?.slice(0, 180)}
                  </p>
                </div>

                {/* ACTIONS */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    minWidth: "150px",
                  }}
                >
                  {/* PREVIEW */}
                  {article.status === "SCHEDULED" && (
                    <Link
                      href={`/admin/preview/articles/${articleId}`}
                      className="admin-button"
                    >
                      Preview
                    </Link>
                  )}

                  {/* PUBLISH */}
                  {article.status === "SCHEDULED" && (
                    <button
                      onClick={() =>
                        handlePublish(articleId)
                      }
                      className="admin-button"
                    >
                      Publish Now
                    </button>
                  )}

                  {/* ARCHIVE */}
                  {article.status === "PUBLISHED" && (
                    <button
                      onClick={() =>
                        handleArchive(articleId)
                      }
                      className="admin-button"
                    >
                      Archive
                    </button>
                  )}

                  {/* EDIT */}
                  <Link
                    href={`/admin/articles/edit/${articleId}`}
                    className="admin-button"
                  >
                    Edit
                  </Link>

                  {/* DELETE */}
                  <button
                    onClick={() =>
                      handleDelete(articleId)
                    }
                    disabled={actionLoading === articleId}
                    style={{
                      background: "#ef4444",
                      color: "#fff",
                      border: "none",
                      padding: "12px",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    {actionLoading === articleId
                      ? "Processing..."
                      : "Delete"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}