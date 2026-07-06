"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreateMagazinePage() {
  const router = useRouter();

  const [categories, setCategories] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [edition, setEdition] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [coverImage, setCoverImage] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);

  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState("DRAFT");

  const [publishedDate, setPublishedDate] = useState("");
  const [scheduledPublishDate, setScheduledPublishDate] =
    useState("");

  const [loading, setLoading] = useState(false);

  /* ================= FETCH CATEGORIES ================= */
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/categories"
      );

      const data = await res.json();

      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  /* ================= SLUG ================= */
  const generateSlug = (text) =>
    text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

  /* ================= PREVIEW ================= */
  const handlePreview = () => {
    if (!title || !description || !edition) {
      alert("Fill Title, Description and Edition first");
      return;
    }

    const selectedCategory = categories.find(
      (cat) => cat.id === Number(categoryId)
    );

    const previewData = {
      title,
      description,
      edition,
      category: selectedCategory?.name || "",
      featured,
      status,
      publishedDate,
      scheduledPublishDate,
      coverImage: coverImage
        ? URL.createObjectURL(coverImage)
        : null,
      pdfFile: pdfFile ? pdfFile.name : null,
    };

    localStorage.setItem(
      "magazinePreview",
      JSON.stringify(previewData)
    );

    window.open("/admin/preview/magazine", "_blank");
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login again");
        return;
      }

      if (!title || !edition || !categoryId) {
        alert(
          "Title, Edition and Category are required"
        );
        return;
      }

      if (
        status === "SCHEDULED" &&
        scheduledPublishDate &&
        new Date(scheduledPublishDate) <= new Date()
      ) {
        alert("Schedule date must be in future");
        return;
      }

      const formData = new FormData();

      formData.append("title", title);
      formData.append("slug", generateSlug(title));
      formData.append("description", description);
      formData.append("edition", edition);
      formData.append("categoryId", categoryId);
      formData.append("featured", String(featured));
      formData.append("status", status);

      if (publishedDate) {
        formData.append(
          "publishedDate",
          new Date(publishedDate).toISOString()
        );
      }

      if (
        status === "SCHEDULED" &&
        scheduledPublishDate
      ) {
        formData.append(
          "scheduledPublishDate",
          new Date(
            scheduledPublishDate
          ).toISOString()
        );
      }

      if (coverImage) {
        formData.append("coverImage", coverImage);
      }

      if (pdfFile) {
        formData.append("pdf", pdfFile);
      }

      const response = await fetch(
        "http://localhost:5000/api/magazines",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to create magazine"
        );
      }

      alert("Magazine created successfully ✔");

      setTitle("");
      setDescription("");
      setEdition("");
      setCategoryId("");
      setCoverImage(null);
      setPdfFile(null);
      setFeatured(false);
      setStatus("DRAFT");
      setPublishedDate("");
      setScheduledPublishDate("");

      router.push("/admin/magazines");
    } catch (error) {
      console.error(error);
      alert(
        error.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "40px auto",
      }}
    >
      <h1 className="admin-title">
        Upload New Magazine
      </h1>

      <form
        onSubmit={handleSubmit}
        className="admin-form"
      >
        {/* TITLE */}
        <label>Magazine Title</label>
        <input
          className="admin-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {/* DESCRIPTION */}
        <label>Description</label>
        <textarea
          className="admin-textarea"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />

        {/* EDITION */}
        <label>Edition</label>
        <input
          className="admin-input"
          value={edition}
          onChange={(e) => setEdition(e.target.value)}
          required
        />

        {/* CATEGORY DROPDOWN */}
        <label>Category</label>
        <select
          className="admin-select"
          value={categoryId}
          onChange={(e) =>
            setCategoryId(e.target.value)
          }
          required
        >
          <option value="">Select Category</option>

          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* PUBLISH DATE */}
        <label>Published Date</label>
        <input
          type="date"
          className="admin-input"
          value={publishedDate}
          onChange={(e) =>
            setPublishedDate(e.target.value)
          }
        />

        {/* COVER */}
        <label>Cover Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setCoverImage(
              e.target.files?.[0] || null
            )
          }
        />

        {/* PDF */}
        <label>PDF File</label>
        <input
          type="file"
          accept=".pdf"
          onChange={(e) =>
            setPdfFile(
              e.target.files?.[0] || null
            )
          }
        />

        {/* FEATURED */}
        <label>
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) =>
              setFeatured(e.target.checked)
            }
          />
          Featured Magazine
        </label>

        {/* STATUS */}
        <label>Status</label>
        <select
          className="admin-select"
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
        >
          <option value="DRAFT">Draft</option>
          <option value="SCHEDULED">Scheduled</option>
          <option value="PUBLISHED">Published</option>
        </select>

        {/* SCHEDULE */}
        {status === "SCHEDULED" && (
          <>
            <label>Schedule Date & Time</label>
            <input
              type="datetime-local"
              value={scheduledPublishDate}
              onChange={(e) =>
                setScheduledPublishDate(
                  e.target.value
                )
              }
              className="admin-input"
            />
          </>
        )}

        {/* BUTTONS */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "20px",
          }}
        >
          <button
            type="submit"
            className="admin-button"
            disabled={loading}
          >
            {loading
              ? "Uploading..."
              : "Upload Magazine"}
          </button>

          <button
            type="button"
            onClick={handlePreview}
            style={{
              background: "#f59e0b",
              color: "#fff",
              border: "none",
              padding: "12px 20px",
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