"use client";

import { useEffect, useState } from "react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] =
    useState([]);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter((cat) =>
        cat.name
          .toLowerCase()
          .includes(search.toLowerCase())
      );

      setFilteredCategories(filtered);
    }
  }, [search, categories]);

  /* ================= AUTO SLUG ================= */
  const generateSlug = (text) =>
    text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

  /* ================= FETCH ================= */
  const fetchCategories = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/categories"
      );

      const data = await response.json();

      const categoryData = Array.isArray(data?.data)
        ? data.data
        : [];

      setCategories(categoryData);
      setFilteredCategories(categoryData);
    } catch (error) {
      console.error("Fetch categories error:", error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= INPUT ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      setFormData((prev) => ({
        ...prev,
        name: value,
        slug: generateSlug(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  /* ================= CREATE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const exists = categories.some(
        (cat) =>
          cat.name.toLowerCase() ===
          formData.name.toLowerCase()
      );

      if (exists) {
        alert("Category already exists");
        return;
      }

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/categories",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token || ""}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(
          result?.message || "Failed to create category"
        );
        return;
      }

      alert("Category Created Successfully ✔");

      setFormData({
        name: "",
        slug: "",
        description: "",
      });

      fetchCategories();
    } catch (error) {
      console.error("Create category error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    const confirmDelete = confirm(
      "Delete this category?"
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(id);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/categories/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token || ""}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(
          result?.message || "Failed to delete category"
        );
        return;
      }

      alert("Category deleted successfully ✔");

      setCategories((prev) =>
        prev.filter((cat) => cat.id !== id)
      );
    } catch (error) {
      console.error("Delete category error:", error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      {/* HEADER */}
      <h1 className="admin-title">
        Category Management
      </h1>

      {/* CREATE FORM */}
      <div className="admin-card">
        <h2 style={{ marginBottom: "20px" }}>
          Create Category
        </h2>

        <form
          onSubmit={handleSubmit}
          className="admin-form"
        >
          <input
            type="text"
            name="name"
            placeholder="Category Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="admin-input"
          />

          <input
            type="text"
            name="slug"
            placeholder="Auto Generated Slug"
            value={formData.slug}
            readOnly
            className="admin-input"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="admin-textarea"
          />

          <button
            type="submit"
            disabled={submitting}
            className="admin-button"
          >
            {submitting
              ? "Creating..."
              : "Create Category"}
          </button>
        </form>
      </div>

      {/* CATEGORY LIST */}
      <div style={{ marginTop: "35px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
            alignItems: "center",
          }}
        >
          <h2>
            Categories ({filteredCategories.length})
          </h2>

          <input
            type="text"
            placeholder="Search category..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="admin-input"
            style={{ maxWidth: "280px" }}
          />
        </div>

        {loading ? (
          <div className="admin-card">
            <p>Loading categories...</p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="empty-state">
            <h2>No Categories Found</h2>
            <p>Create categories to get started.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "20px" }}>
            {filteredCategories.map((category) => (
              <div
                key={category.id}
                className="admin-card"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: "22px",
                      marginBottom: "8px",
                    }}
                  >
                    {category.name}
                  </h3>

                  <p
                    style={{
                      color: "#64748b",
                      marginBottom: "8px",
                    }}
                  >
                    {category.description ||
                      "No description"}
                  </p>

                  <small
                    style={{ color: "#94a3b8" }}
                  >
                    slug: {category.slug}
                  </small>
                </div>

                <button
                  onClick={() =>
                    handleDelete(category.id)
                  }
                  disabled={
                    deletingId === category.id
                  }
                  style={{
                    padding: "10px 14px",
                    background:
                      deletingId === category.id
                        ? "#fca5a5"
                        : "#ef4444",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  {deletingId === category.id
                    ? "Deleting..."
                    : "Delete"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}