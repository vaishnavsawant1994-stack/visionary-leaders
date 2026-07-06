"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/utils/api";

export default function AdminBlogsPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    image: "",
    author: "",
    category: "",
    status: "DRAFT",
    scheduledPublishDate: "",
  });

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = { ...formData };

      if (
        formData.status === "SCHEDULED" &&
        formData.scheduledPublishDate
      ) {
        payload.scheduledPublishDate = new Date(
          formData.scheduledPublishDate
        ).toISOString();
      } else {
        payload.scheduledPublishDate = null;
      }

      const data = await api("/blogs", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!data?.success) {
        alert(data?.message || "Failed to create blog");
        return;
      }

      alert("Blog created successfully ✔");

      setFormData({
        title: "",
        excerpt: "",
        content: "",
        image: "",
        author: "",
        category: "",
        status: "DRAFT",
        scheduledPublishDate: "",
      });

    } catch (error) {
      console.error(error);
      alert(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ================= PREVIEW (ALWAYS WORKS) ================= */
  const handlePreview = () => {
    if (!formData.title || !formData.content) {
      alert("Fill title and content first");
      return;
    }

    const previewData = {
      ...formData,
    };

    localStorage.setItem(
      "blogPreview",
      JSON.stringify(previewData)
    );

    window.open("/admin/preview/blog", "_blank");
  };

  return (
    <div>
      <h1 className="admin-title">Create Blog</h1>

      <div className="admin-card">
        <form onSubmit={handleSubmit} className="admin-form">

          <input
            type="text"
            name="title"
            placeholder="Blog Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="admin-input"
          />

          <textarea
            name="excerpt"
            placeholder="Short Excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            rows="4"
            className="admin-textarea"
          />

          <textarea
            name="content"
            placeholder="Blog Content"
            value={formData.content}
            onChange={handleChange}
            rows="12"
            className="admin-textarea"
            required
          />

          <input
            type="text"
            name="image"
            placeholder="Image URL"
            value={formData.image}
            onChange={handleChange}
            className="admin-input"
          />

          <input
            type="text"
            name="author"
            placeholder="Author Name"
            value={formData.author}
            onChange={handleChange}
            className="admin-input"
          />

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            className="admin-input"
          />

          <label>Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="admin-select"
          >
            <option value="DRAFT">Draft</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="PUBLISHED">Published</option>
          </select>

          {formData.status === "SCHEDULED" && (
            <>
              <label>Schedule Date</label>
              <input
                type="datetime-local"
                name="scheduledPublishDate"
                value={formData.scheduledPublishDate}
                onChange={handleChange}
                className="admin-input"
              />
            </>
          )}

          {/* BUTTONS */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "15px",
            }}
          >
            <button
              type="submit"
              disabled={loading}
              className="admin-button"
              style={{ flex: 1 }}
            >
              {loading ? "Creating..." : "Create Blog"}
            </button>

            {/* ✅ ALWAYS VISIBLE PREVIEW */}
            <button
              type="button"
              onClick={handlePreview}
              style={{
                background: "#f59e0b",
                color: "#fff",
                border: "none",
                padding: "12px 18px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Preview
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}