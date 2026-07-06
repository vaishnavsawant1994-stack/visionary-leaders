"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/utils/api";
import {
  safeText,
  getImageUrl,
  safeArray,
} from "@/utils/normalize";

export default function MagazinesPage() {
  const [magazines, setMagazines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchMagazines();
  }, []);

  /* FETCH MAGAZINES */
  const fetchMagazines = async () => {
    try {
      setLoading(true);

      const data = await api("/magazines");

      setMagazines(safeArray(data?.data));
    } catch (error) {
      console.error("Fetch magazines error:", error);
      setMagazines([]);
    } finally {
      setLoading(false);
    }
  };

  /* DELETE MAGAZINE */
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this magazine?"
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(id);

      const data = await api(`/magazines/${id}`, {
        method: "DELETE",
      });

      if (!data?.success) {
        alert(
          data?.message || "Failed to delete magazine"
        );
        return;
      }

      setMagazines((prev) =>
        prev.filter((mag) => mag.id !== id)
      );

      alert("Magazine deleted successfully ✔");
    } catch (error) {
      console.error(
        "Delete magazine error:",
        error
      );
      alert(
        "Something went wrong while deleting"
      );
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
        <div>
          <p
            style={{
              color: "#2563eb",
              fontWeight: 700,
              fontSize: "13px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: "8px",
            }}
          >
            Magazine Control
          </p>

          <h1 className="admin-title">
            Magazine Management
          </h1>
        </div>

        <Link href="/admin/magazines/create">
          <button className="admin-button">
            + Upload Magazine
          </button>
        </Link>
      </div>

      {/* INFO CARD */}
      <div
        className="admin-card"
        style={{ marginBottom: "30px" }}
      >
        <h2>
          Published & Scheduled Magazines
        </h2>
        <p>
          Manage uploaded magazines,
          preview scheduled editions,
          edit content, and remove
          outdated publications.
        </p>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="admin-card">
          <p>Loading magazines...</p>
        </div>
      ) : magazines.length === 0 ? (
        <div className="empty-state">
          <h2>No Magazines Found</h2>
          <p>
            Uploaded magazines will
            appear here.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(280px,1fr))",
            gap: "24px",
          }}
        >
          {magazines.map((mag) => {
            const status = String(
              mag.status || ""
            ).toLowerCase();

            return (
              <div
                key={mag.id}
                className="admin-card"
                style={{
                  padding: "0",
                  overflow: "hidden",
                  borderRadius: "18px",
                }}
              >
                {/* IMAGE */}
                <div
                  style={{
                    height: "220px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={getImageUrl(
                      mag.coverImage
                    )}
                    alt={safeText(
                      mag.title
                    )}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>

                {/* CONTENT */}
                <div
                  style={{
                    padding: "22px",
                  }}
                >
                  {/* STATUS */}
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "700",
                      color:
                        status === "scheduled"
                          ? "#f59e0b"
                          : status === "published"
                          ? "#16a34a"
                          : "#64748b",
                      textTransform: "uppercase",
                    }}
                  >
                    {safeText(mag.status)}
                  </span>

                  {/* CATEGORY */}
                  <p
                    style={{
                      marginTop: "8px",
                      color: "#2563eb",
                      fontWeight: "600",
                    }}
                  >
                    Category:{" "}
                    {mag.category?.name ||
                      "Uncategorized"}
                  </p>

                  {/* TITLE */}
                  <h3
                    style={{
                      marginTop: "10px",
                      marginBottom: "10px",
                      fontSize: "22px",
                      lineHeight: "1.4",
                    }}
                  >
                    {safeText(mag.title)}
                  </h3>

                  {/* EDITION */}
                  <p
                    style={{
                      color: "#64748b",
                      marginBottom: "20px",
                    }}
                  >
                    {safeText(mag.edition)}
                  </p>

                  {/* SCHEDULE DATE */}
                  {status === "scheduled" &&
                    mag.scheduledPublishDate && (
                      <p
                        style={{
                          marginBottom: "15px",
                          fontSize: "13px",
                          color: "#f59e0b",
                          fontWeight: "600",
                        }}
                      >
                        Scheduled for:{" "}
                        {new Date(
                          mag.scheduledPublishDate
                        ).toLocaleString()}
                      </p>
                    )}

                  {/* ACTION BUTTONS */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "1fr 1fr 1fr",
                      gap: "10px",
                    }}
                  >
                    {/* VIEW / PREVIEW */}
                    {status === "scheduled" ? (
                      <Link
                        href={`/admin/preview/magazines/${mag.id}`}
                        style={{
                          textAlign: "center",
                          padding: "12px",
                          background: "#f59e0b",
                          color: "#fff",
                          borderRadius: "10px",
                          textDecoration: "none",
                          fontWeight: "600",
                        }}
                      >
                        Preview
                      </Link>
                    ) : (
                      <Link
                        href={`/magazines/${mag.id}/read`}
                        style={{
                          textAlign: "center",
                          padding: "12px",
                          background: "#2563eb",
                          color: "#fff",
                          borderRadius: "10px",
                          textDecoration: "none",
                          fontWeight: "600",
                        }}
                      >
                        View
                      </Link>
                    )}

                    {/* EDIT */}
                    <Link
                      href={`/admin/magazines/edit/${mag.id}`}
                      style={{
                        textAlign: "center",
                        padding: "12px",
                        background: "#16a34a",
                        color: "#fff",
                        borderRadius: "10px",
                        textDecoration: "none",
                        fontWeight: "600",
                      }}
                    >
                      Edit
                    </Link>

                    {/* DELETE */}
                    <button
                      onClick={() =>
                        handleDelete(mag.id)
                      }
                      disabled={
                        deletingId === mag.id
                      }
                      style={{
                        padding: "12px",
                        background:
                          deletingId === mag.id
                            ? "#fca5a5"
                            : "#dc2626",
                        color: "#fff",
                        border: "none",
                        borderRadius: "10px",
                        cursor: "pointer",
                        fontWeight: "600",
                      }}
                    >
                      {deletingId === mag.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}