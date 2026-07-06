"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/utils/api";

export default function CreateNewsPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    content: "",
    image: "",
    category: "",
    source: "",
    author: "",
  });

  const [status, setStatus] = useState("DRAFT");
  const [scheduledPublishDate, setScheduledPublishDate] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ================= PREVIEW ================= */
  const handlePreview = () => {
    const previewData = {
      ...formData,
      status,
      scheduledPublishDate: scheduledPublishDate || null,
      type: "news",
    };

    localStorage.setItem(
      "newsPreview",
      JSON.stringify(previewData)
    );

    window.open("/admin/preview/news1", "_blank");
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        ...formData,
        status,
      };

      if (status === "SCHEDULED" && scheduledPublishDate) {
        payload.scheduledPublishDate = new Date(
          scheduledPublishDate
        ).toISOString();
      } else {
        payload.scheduledPublishDate = null;
      }

      const data = await api("/news", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!data?.success) {
        throw new Error(data?.message || "Failed to create news");
      }

      alert("News created successfully ✔");

      router.push("/admin/news");
    } catch (error) {
      console.error("Create news error:", error);
      alert(error.message || "Error creating news");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="admin-title">Create News</h1>

      <form onSubmit={handleSubmit} className="admin-form">

        {/* TITLE */}
        <label>News Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="admin-input"
          required
        />

        {/* CATEGORY */}
        <label>Category</label>
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="admin-input"
        />

        {/* SOURCE */}
        <label>Source</label>
        <input
          type="text"
          name="source"
          value={formData.source}
          onChange={handleChange}
          className="admin-input"
        />

        {/* AUTHOR */}
        <label>Author</label>
        <input
          type="text"
          name="author"
          value={formData.author}
          onChange={handleChange}
          className="admin-input"
        />

        {/* IMAGE */}
        <label>Image URL</label>
        <input
          type="text"
          name="image"
          value={formData.image}
          onChange={handleChange}
          className="admin-input"
        />

        {/* SUMMARY */}
        <label>Summary</label>
        <textarea
          name="summary"
          value={formData.summary}
          onChange={handleChange}
          className="admin-textarea"
          required
        />

        {/* CONTENT */}
        <label>Content</label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          className="admin-textarea"
          rows={10}
          required
        />

        {/* STATUS */}
        <label>Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="admin-select"
        >
          <option value="DRAFT">Draft</option>
          <option value="SCHEDULED">Scheduled</option>
          <option value="PUBLISHED">Published</option>
        </select>

        {/* SCHEDULE DATE */}
        {status === "SCHEDULED" && (
          <>
            <label>Schedule Publish Date</label>
            <input
              type="datetime-local"
              value={scheduledPublishDate}
              onChange={(e) =>
                setScheduledPublishDate(e.target.value)
              }
              className="admin-input"
              required
            />
          </>
        )}

        {/* ================= BOTTOM BUTTONS ================= */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "30px",
          }}
        >
          {/* PREVIEW (ALWAYS VISIBLE) */}
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
              flex: 1,
            }}
          >
            Preview
          </button>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="admin-button"
            style={{ flex: 1 }}
          >
            {loading ? "Creating..." : "Create News"}
          </button>
        </div>
      </form>
    </div>
  );
}