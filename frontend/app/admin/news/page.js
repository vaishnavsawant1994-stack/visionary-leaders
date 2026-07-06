"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function NewsAdminPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchNews();
  }, []);

  /* ================= FETCH NEWS ================= */
  const fetchNews = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/news"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch news");
      }

      const data = await response.json();

      const list = Array.isArray(data?.data)
        ? data.data
        : [];

      setNews(list);
    } catch (error) {
      console.error("Fetch news error:", error);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE NEWS ================= */
  const deleteNews = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this news?"
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(id);

      // FIX: get token
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login again");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/news/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Delete failed");
      }

      alert("News deleted successfully ✔");

      setNews((prev) =>
        prev.filter(
          (item) => (item.id || item._id) !== id
        )
      );
    } catch (error) {
      console.error("Delete news error:", error);
      alert(error.message || "Failed to delete news");
    } finally {
      setDeletingId(null);
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
          marginBottom: "25px",
        }}
      >
        <h1 className="admin-title">News Management</h1>

        <Link href="/admin/news/create">
          <button className="admin-button">
            + Create News
          </button>
        </Link>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="admin-card">
          <p>Loading news...</p>
        </div>
      ) : news.length === 0 ? (
        <div className="empty-state">
          <h2>No News Found</h2>
          <p>
            News articles will appear here after publishing.
          </p>
        </div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Source</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {news.map((item) => {
              const id = item.id || item._id;
              const status = String(
                item.status || ""
              ).toLowerCase();

              return (
                <tr key={id}>
                  {/* TITLE */}
                  <td>{item.title || "Untitled"}</td>

                  {/* CATEGORY */}
                  <td>{item.category || "N/A"}</td>

                  {/* SOURCE */}
                  <td>{item.source || "N/A"}</td>

                  {/* STATUS */}
                  <td>
                    <span
                      style={{
                        padding: "6px 10px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#fff",
                        background:
                          status === "published"
                            ? "#16a34a"
                            : status === "scheduled"
                            ? "#f59e0b"
                            : "#64748b",
                      }}
                    >
                      {item.status || "draft"}
                    </span>
                  </td>

                  {/* DATE */}
                  <td>
                    {status === "scheduled" &&
                    item.scheduledPublishDate
                      ? new Date(
                          item.scheduledPublishDate
                        ).toLocaleString()
                      : item.publishDate
                      ? new Date(
                          item.publishDate
                        ).toLocaleDateString()
                      : item.createdAt
                      ? new Date(
                          item.createdAt
                        ).toLocaleDateString()
                      : "N/A"}
                  </td>

                  {/* ACTIONS */}
                  <td>
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        flexWrap: "wrap",
                      }}
                    >
                      {/* PREVIEW */}
                      {status === "scheduled" && (
                        <Link
                          href={`/admin/preview/news/${id}`}
                        >
                          <button
                            style={{
                              background: "#f59e0b",
                              color: "#fff",
                              border: "none",
                              padding: "8px 12px",
                              borderRadius: "6px",
                              cursor: "pointer",
                            }}
                          >
                            Preview
                          </button>
                        </Link>
                      )}

                      {/* EDIT */}
                      <Link
                        href={`/admin/news/edit/${id}`}
                      >
                        <button
                          style={{
                            background: "#16a34a",
                            color: "#fff",
                            border: "none",
                            padding: "8px 12px",
                            borderRadius: "6px",
                            cursor: "pointer",
                          }}
                        >
                          Edit
                        </button>
                      </Link>

                      {/* DELETE */}
                      <button
                        onClick={() => deleteNews(id)}
                        disabled={deletingId === id}
                        style={{
                          background:
                            deletingId === id
                              ? "#fca5a5"
                              : "#dc2626",
                          color: "#fff",
                          border: "none",
                          padding: "8px 12px",
                          borderRadius: "6px",
                          cursor: "pointer",
                        }}
                      >
                        {deletingId === id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}