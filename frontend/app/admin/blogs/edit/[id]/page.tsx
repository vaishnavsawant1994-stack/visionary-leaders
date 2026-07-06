"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/utils/api";

export default function EditBlogPage() {
  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    image: "",
    author: "",
    category: "",
    status: "draft",
    scheduledPublishDate: "",
  });

  /* ================= FETCH BLOG ================= */
  useEffect(() => {
    if (params?.id) {
      fetchBlog();
    }
  }, [params?.id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);

      const data = await api(`/blogs/${params.id}`);

      if (data?.success && data?.data) {
        const blog = data.data;

        setForm({
          title: blog.title || "",
          excerpt: blog.excerpt || "",
          content: blog.content || "",
          image: blog.image || "",
          author: blog.author || "",
          category: blog.category || "",
          status: blog.status?.toLowerCase() || "draft",
          scheduledPublishDate: blog.scheduledPublishDate
            ? new Date(blog.scheduledPublishDate)
                .toISOString()
                .slice(0, 16)
            : "",
        });
      }
    } catch (error) {
      console.error("Fetch blog error:", error);
      alert("Failed to load blog");
    } finally {
      setLoading(false);
    }
  };

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ================= UPDATE BLOG ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload: any = {
        ...form,
      };

      if (
        form.status === "scheduled" &&
        form.scheduledPublishDate
      ) {
        payload.scheduledPublishDate = new Date(
          form.scheduledPublishDate
        ).toISOString();
      } else {
        payload.scheduledPublishDate = null;
      }

      const data = await api(`/blogs/${params.id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      if (data?.success) {
        alert("Blog updated successfully ✔");
        router.push("/admin/blogs");
      } else {
        alert(data?.message || "Update failed");
      }
    } catch (error) {
      console.error("Update blog error:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !form.title) {
    return (
      <div className="admin-card">
        <p>Loading blog...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1 className="admin-title">Edit Blog</h1>

      <form onSubmit={handleSubmit} className="admin-form">

        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          className="admin-input"
          required
        />

        <textarea
          name="excerpt"
          value={form.excerpt}
          onChange={handleChange}
          placeholder="Excerpt"
          className="admin-textarea"
          required
        />

        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          placeholder="Content"
          className="admin-textarea"
          required
        />

        <input
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="Image URL"
          className="admin-input"
        />

        <input
          name="author"
          value={form.author}
          onChange={handleChange}
          placeholder="Author"
          className="admin-input"
        />

        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
          className="admin-input"
        />

        {/* STATUS */}
        <label>Status</label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="admin-select"
        >
          <option value="draft">Draft</option>
          <option value="scheduled">Scheduled</option>
          <option value="published">Published</option>
        </select>

        {/* SCHEDULE DATE */}
        {form.status === "scheduled" && (
          <>
            <label>Schedule Date</label>
            <input
              type="datetime-local"
              name="scheduledPublishDate"
              value={form.scheduledPublishDate}
              onChange={handleChange}
              className="admin-input"
              required
            />
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="admin-button"
        >
          {loading ? "Updating..." : "Update Blog"}
        </button>

      </form>
    </div>
  );
}