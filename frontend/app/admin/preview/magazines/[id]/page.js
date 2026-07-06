"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/utils/api";
import { safeText, getImageUrl } from "@/utils/normalize";

export default function MagazinePreviewPage() {
  const { id } = useParams();

  const [mag, setMag] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchMagazine();
    }
  }, [id]);

  /* ================= FETCH MAGAZINE PREVIEW ================= */
  const fetchMagazine = async () => {
    try {
      setLoading(true);

      const data = await api(`/magazines/preview/${id}`);

      if (data?.success) {
        setMag(data.data);
      } else {
        setMag(null);
      }
    } catch (error) {
      console.error("Preview fetch error:", error);
      setMag(null);
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="admin-card">
        <p>Loading preview...</p>
      </div>
    );
  }

  /* ================= NOT FOUND ================= */
  if (!mag) {
    return (
      <div className="empty-state">
        Magazine not found
      </div>
    );
  }

  return (
    <div
      className="admin-card"
      style={{
        maxWidth: "900px",
        margin: "30px auto",
        padding: "30px",
      }}
    >
      {/* TITLE */}
      <h1>{safeText(mag.title)}</h1>

      {/* STATUS */}
      <p>
        <b>Status:</b> {safeText(mag.status)}
      </p>

      {/* SCHEDULE DATE */}
      {mag.scheduledPublishDate && (
        <p>
          <b>Scheduled For:</b>{" "}
          {new Date(
            mag.scheduledPublishDate
          ).toLocaleString()}
        </p>
      )}

      {/* COVER IMAGE */}
      {mag.coverImage && (
        <img
          src={getImageUrl(mag.coverImage)}
          alt={mag.title}
          style={{
            width: "100%",
            borderRadius: "12px",
            margin: "20px 0",
            maxHeight: "500px",
            objectFit: "cover",
          }}
        />
      )}

      {/* EDITION */}
      {mag.edition && (
        <p>
          <b>Edition:</b>{" "}
          {safeText(mag.edition)}
        </p>
      )}

      {/* DESCRIPTION */}
      {mag.description && (
        <>
          <hr />
          <h3>Description</h3>
          <p style={{ lineHeight: "1.8" }}>
            {safeText(mag.description)}
          </p>
        </>
      )}

      {/* PDF */}
      {mag.pdfUrl && (
        <>
          <hr />
          <h3>Magazine PDF</h3>

          <a
            href={`http://localhost:5000${mag.pdfUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="admin-button"
            style={{
              display: "inline-block",
              marginTop: "10px",
            }}
          >
            View PDF
          </a>
        </>
      )}
    </div>
  );
}