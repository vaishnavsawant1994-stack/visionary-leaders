"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/utils/api";

export default function CreateArticlePage() {
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [status, setStatus] = useState("DRAFT");
  const [scheduledPublishDate, setScheduledPublishDate] = useState("");

  // CHANGED: image url instead of file
  const [featuredImage, setFeaturedImage] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    summary: "",
    categoryId: "",
    content: "",
    seoTitle: "",
    seoDescription: "",
    tags: "",
    featured: false,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await api("/categories");
      setCategories(Array.isArray(data?.data) ? data.data : []);
    } catch (error) {
      console.error(error);
      setCategories([]);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePreview = () => {
    if (!formData.title || !formData.summary || !formData.content) {
      alert("Fill Title, Summary and Content first");
      return;
    }

    const previewData = {
      ...formData,
      status,
      scheduledPublishDate,
      featuredImage: featuredImage ? featuredImage : null,
    };

    localStorage.setItem("articlePreview", JSON.stringify(previewData));
    window.open("/admin/preview/article", "_blank");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login again");
        router.push("/login");
        return;
      }

      let authorId = null;

      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        authorId = payload.id || payload.userId;
      } catch (err) {
        console.error("Token decode error:", err);
      }

      if (!authorId) {
        alert("Invalid user session. Please login again.");
        router.push("/login");
        return;
      }

      // CHANGED: still using FormData but image is URL string
      const articleData = new FormData();

      articleData.append("title", formData.title);
      articleData.append("slug", formData.slug);
      articleData.append("summary", formData.summary);
      articleData.append("authorId", authorId);
      articleData.append("categoryId", formData.categoryId);
      articleData.append("content", formData.content);
      articleData.append("seoTitle", formData.seoTitle);
      articleData.append("seoDescription", formData.seoDescription);
      articleData.append("featured", String(formData.featured));

      articleData.append(
        "tags",
        JSON.stringify(
          formData.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        )
      );

      // IMPORTANT: ALWAYS uppercase status
      articleData.append("status", status.toUpperCase());

      // IMPORTANT: send only valid scheduled date
      if (status === "SCHEDULED" && scheduledPublishDate) {
        articleData.append(
          "scheduledPublishDate",
          new Date(scheduledPublishDate).toISOString()
        );
      }

      // CHANGED: send image url
      if (featuredImage) {
        articleData.append("featuredImage", featuredImage);
      }

      const data = await api("/articles", {
        method: "POST",
        body: articleData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!data?.success) {
        alert(data?.message || "Failed to create article");
        return;
      }

      alert("Article created successfully ✔");
      router.push("/admin/articles");

    } catch (error) {
      console.error(error);
      alert(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="admin-title">Create Article</h1>

      <form onSubmit={handleSubmit} className="admin-form">

        <label>Title</label>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="admin-input"
          required
        />

        <label>Slug</label>
        <input
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          className="admin-input"
          required
        />

        <label>Summary</label>
        <textarea
          name="summary"
          value={formData.summary}
          onChange={handleChange}
          className="admin-textarea"
          required
        />

        <label>Category</label>
        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          className="admin-select"
          required
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <label>Content</label>
        <textarea
          rows="10"
          name="content"
          value={formData.content}
          onChange={handleChange}
          className="admin-textarea"
          required
        />

        <label>Featured Image</label>
        <input
          type="text"
          placeholder="Paste image URL here..."
          value={featuredImage}
          onChange={(e) => setFeaturedImage(e.target.value)}
          className="admin-input"
        />

        {featuredImage && (
          <img
            src={featuredImage}
            alt="Preview"
            style={{
              width: "100%",
              maxHeight: "220px",
              objectFit: "cover",
              borderRadius: "10px",
              marginTop: "10px",
            }}
          />
        )}

        <label>SEO Title</label>
        <input
          name="seoTitle"
          value={formData.seoTitle}
          onChange={handleChange}
          className="admin-input"
        />

        <label>SEO Description</label>
        <textarea
          name="seoDescription"
          value={formData.seoDescription}
          onChange={handleChange}
          className="admin-textarea"
        />

        <label>Tags</label>
        <input
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          className="admin-input"
        />

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

        {status === "SCHEDULED" && (
          <>
            <label>Schedule Date</label>
            <input
              type="datetime-local"
              value={scheduledPublishDate}
              onChange={(e) =>
                setScheduledPublishDate(e.target.value)
              }
              className="admin-input"
            />
          </>
        )}

        <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
          <button
            type="submit"
            disabled={loading}
            className="admin-button"
          >
            {loading ? "Creating..." : "Create Article"}
          </button>

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
  );
}