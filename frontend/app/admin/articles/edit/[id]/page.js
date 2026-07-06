"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/utils/api";

export default function EditArticlePage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [featuredImage, setFeaturedImage] = useState(null);

  const [status, setStatus] = useState("draft");
  const [scheduledPublishDate, setScheduledPublishDate] =
    useState("");

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    summary: "",
    content: "",
    seoTitle: "",
    seoDescription: "",
    tags: "",
    categoryId: "",
    authorId: "",
    featured: false,
  });

  useEffect(() => {
    if (id) fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      setLoading(true);

      const data = await api(`/articles/${id}`);

      if (data?.success) {
        const article = data.data;

        setFormData({
          title: article.title || "",
          slug: article.slug || "",
          summary: article.summary || "",
          content: article.content || "",
          seoTitle: article.seoTitle || "",
          seoDescription: article.seoDescription || "",
          tags: article.tags?.join(", ") || "",
          categoryId: article.categoryId || "",
          authorId: article.authorId || "",
          featured: article.featured || false,
        });

        setStatus(
          article.status
            ? article.status.toLowerCase()
            : "draft"
        );

        if (article.scheduledPublishDate) {
          setScheduledPublishDate(
            new Date(article.scheduledPublishDate)
              .toISOString()
              .slice(0, 16)
          );
        }
      }
    } catch (error) {
      console.error(error);
      alert("Failed to load article");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      /* SCHEDULE VALIDATION */
      if (status === "scheduled") {
        if (!scheduledPublishDate) {
          alert("Please select schedule date");
          return;
        }

        if (
          new Date(scheduledPublishDate) <=
          new Date()
        ) {
          alert(
            "Schedule date must be in the future"
          );
          return;
        }
      }

      const updatedData = new FormData();

      Object.entries(formData).forEach(
        ([key, value]) => {
          if (key === "tags") {
            updatedData.append(
              "tags",
              JSON.stringify(
                value
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean)
              )
            );
          } else {
            updatedData.append(key, value);
          }
        }
      );

      /* STATUS */
      updatedData.append("status", status);

      /* SCHEDULE DATE */
      if (
        status === "scheduled" &&
        scheduledPublishDate
      ) {
        updatedData.append(
          "scheduledPublishDate",
          new Date(
            scheduledPublishDate
          ).toISOString()
        );
      } else {
        updatedData.append(
          "scheduledPublishDate",
          ""
        );
      }

      /* FEATURED IMAGE */
      if (featuredImage) {
        updatedData.append(
          "featuredImage",
          featuredImage
        );
      }

      const data = await api(`/articles/${id}`, {
        method: "PUT",
        body: updatedData,
      });

      if (!data?.success) {
        alert(data?.message || "Update failed");
        return;
      }

      alert("Article updated successfully ✔");
      router.push("/admin/articles");
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="admin-title">
        Edit Article
      </h1>

      <form
        onSubmit={handleSubmit}
        className="admin-form"
      >
        <label>Title</label>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="admin-input"
        />

        <label>Slug</label>
        <input
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          className="admin-input"
        />

        <label>Summary</label>
        <textarea
          name="summary"
          value={formData.summary}
          onChange={handleChange}
          className="admin-textarea"
        />

        <label>Content</label>
        <textarea
          rows="10"
          name="content"
          value={formData.content}
          onChange={handleChange}
          className="admin-textarea"
        />

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

        <label>Category ID</label>
        <input
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          className="admin-input"
        />

        <label>Author ID</label>
        <input
          name="authorId"
          value={formData.authorId}
          onChange={handleChange}
          className="admin-input"
        />

        <label>Featured Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setFeaturedImage(
              e.target.files?.[0] || null
            )
          }
        />

        <label>Status</label>
        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
        >
          <option value="draft">Draft</option>
          <option value="scheduled">
            Scheduled
          </option>
          <option value="published">
            Published
          </option>
        </select>

        {status === "scheduled" && (
          <>
            <label>Schedule Date</label>
            <input
              type="datetime-local"
              value={scheduledPublishDate}
              onChange={(e) =>
                setScheduledPublishDate(
                  e.target.value
                )
              }
              className="admin-input"
              required
            />
          </>
        )}

        <button
          className="admin-button"
          disabled={loading}
        >
          {loading
            ? "Updating..."
            : "Update Article"}
        </button>
      </form>
    </div>
  );
}