"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/utils/api";

export default function EditMagazinePage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const [coverImage, setCoverImage] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);

  const [scheduledPublishDate, setScheduledPublishDate] =
    useState("");

  const [publishedOn, setPublishedOn] =
    useState("");

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    edition: "",
    categoryId: "",
    featured: false,
    status: "DRAFT",
  });

  useEffect(() => {
    if (id) {
      fetchMagazine();
      fetchCategories();
    }
  }, [id]);

  /* ================= FETCH CATEGORIES ================= */
  const fetchCategories = async () => {
    try {
      const data = await api("/categories");

      if (data?.success) {
        setCategories(data.data || []);
      }
    } catch (error) {
      console.error("Fetch categories error:", error);
    }
  };

  /* ================= FETCH MAGAZINE ================= */
  const fetchMagazine = async () => {
    try {
      setLoading(true);

      const data = await api(`/magazines/${id}`);

      if (data?.success) {
        const mag = data.data;

        setFormData({
          title: mag.title || "",
          slug: mag.slug || "",
          description: mag.description || "",
          edition: mag.edition || "",
          categoryId: mag.categoryId?.toString() || "",
          featured: mag.featured || false,
          status: mag.status || "DRAFT",
        });

        if (mag.scheduledPublishDate) {
          setScheduledPublishDate(
            new Date(mag.scheduledPublishDate)
              .toISOString()
              .slice(0, 16)
          );
        }

        if (mag.publishDate) {
          setPublishedOn(
            new Date(mag.publishDate)
              .toISOString()
              .slice(0, 16)
          );
        }
      }
    } catch (error) {
      console.error(error);
      alert("Failed to load magazine");
    } finally {
      setLoading(false);
    }
  };

  /* ================= HANDLE INPUT ================= */
  const handleChange = (e) => {
    const { name, value, type, checked } =
      e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  /* ================= UPDATE MAGAZINE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const updatedData = new FormData();

      updatedData.append(
        "title",
        formData.title
      );
      updatedData.append(
        "slug",
        formData.slug
      );
      updatedData.append(
        "description",
        formData.description
      );
      updatedData.append(
        "edition",
        formData.edition
      );
      updatedData.append(
        "categoryId",
        formData.categoryId
      );
      updatedData.append(
        "featured",
        formData.featured.toString()
      );
      updatedData.append(
        "status",
        formData.status
      );

      /* Publish Date */
      if (publishedOn) {
        updatedData.append(
          "publishedDate",
          new Date(publishedOn).toISOString()
        );
      }

      /* Scheduled Date */
      if (
        formData.status === "SCHEDULED" &&
        scheduledPublishDate
      ) {
        updatedData.append(
          "scheduledPublishDate",
          new Date(
            scheduledPublishDate
          ).toISOString()
        );
      }

      if (coverImage) {
        updatedData.append(
          "coverImage",
          coverImage
        );
      }

      if (pdfFile) {
        updatedData.append(
          "pdf",
          pdfFile
        );
      }

      const data = await api(
        `/magazines/${id}`,
        {
          method: "PUT",
          body: updatedData,
        }
      );

      if (!data?.success) {
        alert(
          data?.message ||
            "Update failed"
        );
        return;
      }

      alert(
        "Magazine updated successfully ✔"
      );

      router.push("/admin/magazines");
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ================= PREVIEW ================= */
  const handlePreview = () => {
    window.open(
      `/preview/magazines/${id}`,
      "_blank"
    );
  };

  return (
    <div>
      <h1 className="admin-title">
        Edit Magazine
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

        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="admin-textarea"
        />

        <label>Edition</label>
        <input
          name="edition"
          value={formData.edition}
          onChange={handleChange}
          className="admin-input"
        />

        {/* CATEGORY DROPDOWN */}
        <label>Category</label>
        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          className="admin-select"
        >
          <option value="">
            Select Category
          </option>

          {categories.map((cat) => (
            <option
              key={cat.id}
              value={cat.id}
            >
              {cat.name}
            </option>
          ))}
        </select>

        <label>Published On</label>
        <input
          type="datetime-local"
          value={publishedOn}
          onChange={(e) =>
            setPublishedOn(
              e.target.value
            )
          }
          className="admin-input"
        />

        <label>Cover Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setCoverImage(
              e.target.files?.[0] ||
                null
            )
          }
        />

        <label>PDF File</label>
        <input
          type="file"
          accept=".pdf"
          onChange={(e) =>
            setPdfFile(
              e.target.files?.[0] ||
                null
            )
          }
        />

        <label>
          <input
            type="checkbox"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
          />
          Featured Magazine
        </label>

        <label>Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="admin-select"
        >
          <option value="DRAFT">
            Draft
          </option>
          <option value="SCHEDULED">
            Scheduled
          </option>
          <option value="PUBLISHED">
            Published
          </option>
        </select>

        {formData.status ===
          "SCHEDULED" && (
          <>
            <label>
              Schedule Date & Time
            </label>
            <input
              type="datetime-local"
              value={
                scheduledPublishDate
              }
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

        {formData.status ===
          "SCHEDULED" && (
          <button
            type="button"
            onClick={handlePreview}
            className="admin-button"
          >
            Preview Scheduled Magazine
          </button>
        )}

        <button
          type="submit"
          disabled={loading}
          className="admin-button"
        >
          {loading
            ? "Updating..."
            : "Update Magazine"}
        </button>
      </form>
    </div>
  );
}