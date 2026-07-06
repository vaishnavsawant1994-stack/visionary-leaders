"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/utils/api";

export default function EditNewsPage() {
  const params = useParams();
  const router = useRouter();

  const id =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
      ? params.id[0]
      : "";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [scheduledPublishDate, setScheduledPublishDate] =
    useState("");

  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    content: "",
    image: "",
    category: "",
    source: "",
    author: "",
    status: "draft",
  });

  /* ================= FETCH NEWS ================= */
  useEffect(() => {
    if (id) fetchNews();
  }, [id]);

  const fetchNews = async () => {
    try {
      setLoading(true);

      const data = await api(`/news/${id}`);

      if (data?.success && data?.data) {
        const n = data.data;

        setFormData({
          title: n.title || "",
          summary: n.summary || "",
          content: n.content || "",
          image: n.image || "",
          category: n.category || "",
          source: n.source || "",
          author: n.author || "",
          status: n.status
            ? n.status.toLowerCase()
            : "draft",
        });

        if (n.scheduledPublishDate) {
          setScheduledPublishDate(
            new Date(n.scheduledPublishDate)
              .toISOString()
              .slice(0, 16)
          );
        }
      } else {
        throw new Error(
          data?.message || "News not found"
        );
      }
    } catch (error) {
      console.error("Fetch news error:", error);
      alert(error.message || "Failed to load news");
    } finally {
      setLoading(false);
    }
  };

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ================= HANDLE SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login again");
        router.push("/login");
        return;
      }

      const payload = {
        ...formData,
      };

      if (
        formData.status === "scheduled" &&
        scheduledPublishDate
      ) {
        payload.scheduledPublishDate =
          new Date(
            scheduledPublishDate
          ).toISOString();
      } else {
        payload.scheduledPublishDate = null;
      }

      const data = await api(`/news/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!data?.success) {
        throw new Error(
          data?.message ||
            "Failed to update news"
        );
      }

      alert("News updated successfully ✔");
      router.push("/admin/news");
    } catch (error) {
      console.error(
        "Update news error:",
        error
      );
      alert(
        error.message || "Failed to update news"
      );
    } finally {
      setSaving(false);
    }
  };

  /* ================= PREVIEW ================= */
  const handlePreview = () => {
    window.open(
      `/admin/preview/news/${id}`,
      "_blank"
    );
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div style={{ padding: "30px" }}>
        Loading news...
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ marginBottom: "30px" }}>
        Edit News
      </h1>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          type="text"
          name="source"
          placeholder="Source"
          value={formData.source}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          type="text"
          name="author"
          placeholder="Author"
          value={formData.author}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={handleChange}
          style={inputStyle}
        />

        <textarea
          name="summary"
          placeholder="Summary"
          value={formData.summary}
          onChange={handleChange}
          rows={4}
          style={textareaStyle}
        />

        <textarea
          name="content"
          placeholder="Content"
          value={formData.content}
          onChange={handleChange}
          rows={12}
          style={textareaStyle}
        />

        {/* STATUS */}
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          style={inputStyle}
        >
          <option value="draft">Draft</option>
          <option value="scheduled">
            Scheduled
          </option>
          <option value="published">
            Published
          </option>
        </select>

        {/* SCHEDULE DATE */}
        {formData.status === "scheduled" && (
          <>
            <input
              type="datetime-local"
              value={scheduledPublishDate}
              onChange={(e) =>
                setScheduledPublishDate(
                  e.target.value
                )
              }
              style={inputStyle}
              required
            />

            <button
              type="button"
              onClick={handlePreview}
              style={previewButtonStyle}
            >
              Preview Scheduled News
            </button>
          </>
        )}

        <button
          type="submit"
          disabled={saving}
          style={buttonStyle}
        >
          {saving
            ? "Updating..."
            : "Update News"}
        </button>
      </form>
    </div>
  );
}

/* ================= STYLES ================= */
const inputStyle = {
  padding: "12px",
  border: "1px solid #ddd",
  borderRadius: "8px",
};

const textareaStyle = {
  padding: "12px",
  border: "1px solid #ddd",
  borderRadius: "8px",
};

const buttonStyle = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  padding: "14px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};

const previewButtonStyle = {
  background: "#16a34a",
  color: "#fff",
  border: "none",
  padding: "12px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};