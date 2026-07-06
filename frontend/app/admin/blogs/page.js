"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import { safeText } from "@/utils/normalize";

export default function BlogsAdminPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  /* ================= FETCH BLOGS ================= */
  const fetchBlogs = async () => {
    try {
      setLoading(true);

      const data = await api("/blogs");

      setBlogs(Array.isArray(data?.data) ? data.data : []);
    } catch (error) {
      console.error("FETCH BLOG ERROR:", error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE BLOG ================= */
  const deleteBlog = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog?"
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(id);

      const data = await api(`/blogs/${id}`, {
        method: "DELETE",
      });

      if (!data?.success) {
        alert(data?.message || "Delete failed");
        return;
      }

      alert("Blog deleted successfully ✔");

      setBlogs((prev) =>
        prev.filter((blog) => (blog.id || blog._id) !== id)
      );
    } catch (error) {
      console.error("DELETE BLOG ERROR:", error);
      alert(error.message || "Failed to delete blog");
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
          marginBottom: "30px",
        }}
      >
        <h1 className="admin-title">Blog Management</h1>

        <Link href="/admin/blogs/create" className="admin-button">
          + Create Blog
        </Link>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="admin-card">
          <p>Loading blogs...</p>
        </div>
      ) : blogs.length === 0 ? (
        <div className="empty-state">
          <h2>No Blogs Yet</h2>
          <p>Blogs will appear here once created.</p>
        </div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Status</th>
              <th>Scheduled For</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {blogs.map((blog) => {
              const blogId = blog.id || blog._id;

              const isScheduled =
                blog.status?.toLowerCase() === "scheduled";

              return (
                <tr key={blogId}>
                  <td>{safeText(blog.title)}</td>
                  <td>{safeText(blog.author)}</td>
                  <td>{safeText(blog.category)}</td>
                  <td>{safeText(blog.status)}</td>

                  <td>
                    {isScheduled && blog.scheduledPublishDate
                      ? new Date(
                          blog.scheduledPublishDate
                        ).toLocaleString()
                      : "-"}
                  </td>

                  <td>
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        flexWrap: "wrap",
                      }}
                    >
                      {/* PREVIEW BUTTON */}
                      {isScheduled && (
                        <Link
                          href={`/admin/preview/blogs/${blogId}`}
                          style={{
                            background: "#2563eb",
                            color: "#fff",
                            padding: "8px 14px",
                            borderRadius: "8px",
                            textDecoration: "none",
                            fontWeight: "600",
                          }}
                        >
                          Preview
                        </Link>
                      )}

                      {/* EDIT BUTTON */}
                      <Link
                        href={`/admin/blogs/edit/${blogId}`}
                        style={{
                          background: "#f59e0b",
                          color: "#fff",
                          padding: "8px 14px",
                          borderRadius: "8px",
                          textDecoration: "none",
                          fontWeight: "600",
                        }}
                      >
                        Edit
                      </Link>

                      {/* DELETE BUTTON */}
                      <button
                        onClick={() => deleteBlog(blogId)}
                        disabled={deletingId === blogId}
                        style={{
                          background:
                            deletingId === blogId
                              ? "#fca5a5"
                              : "#dc2626",
                          color: "#fff",
                          border: "none",
                          padding: "8px 14px",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontWeight: "600",
                        }}
                      >
                        {deletingId === blogId
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