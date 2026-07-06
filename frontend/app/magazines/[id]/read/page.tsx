"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";

/* ICON */
import { BookOpen } from "lucide-react";

const FlipBookViewer = dynamic(
  () => import("../../../../components/FlipBookViewer"),
  { ssr: false }
);

interface Magazine {
  id: number;
  title: string;
  pdfUrl?: string;
}

export default function ReadMagazinePage() {
  const params = useParams();

  const id =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
      ? params.id[0]
      : "";

  const [magazine, setMagazine] = useState<Magazine | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    fetchMagazine();
  }, [id]);

  const fetchMagazine = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `http://localhost:5000/api/magazines/${id}`
      );

      const data = await res.json();

      if (data.success && data.data) {
        setMagazine(data.data);
      } else {
        setError("Magazine not found");
      }
    } catch (error) {
      console.error("Fetch magazine error:", error);
      setError("Failed to load magazine");
    } finally {
      setLoading(false);
    }
  };

  const getPdfUrl = (pdf?: string) => {
    if (!pdf || pdf.trim() === "") return "";
    if (pdf.startsWith("http")) return pdf;
    return `http://localhost:5000${pdf}`;
  };

  /* LOADING */
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f7f7fb",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#1a1a1a",
          fontSize: "20px",
          fontWeight: 600,
        }}
      >
        Loading Magazine...
      </div>
    );
  }

  /* ERROR */
  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f7f7fb",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          color: "#1a1a1a",
          gap: "12px",
        }}
      >
        <h2>{error}</h2>
      </div>
    );
  }

  if (!magazine) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f7f7fb",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#1a1a1a",
        }}
      >
        Magazine not found
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#f7f7fb",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          width: "100%",
          height: "72px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 30px",
          background: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          position: "sticky",
          top: 0,
          zIndex: 999,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <BookOpen size={18} color="#ff4d6d" />

          <span
            style={{
              fontWeight: 800,
              fontSize: "13px",
              letterSpacing: "1px",
              color: "#1f2937",
            }}
          >
            MAGAZINE VIEWER
          </span>
        </div>

        <div style={{ width: "100px" }} />
      </div>

      {/* READER */}
      <div
        style={{
          width: "100%",
          padding: "0",
          marginTop: "0px",
        }}
      >
        {magazine.pdfUrl ? (
          <FlipBookViewer
            pdfUrl={getPdfUrl(magazine.pdfUrl)}
            title={magazine.title}
          />
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "60px",
              background: "#ffffff",
              borderRadius: "16px",
              maxWidth: "800px",
              margin: "40px auto",
              border: "1px solid #e5e7eb",
            }}
          >
            <h3>No PDF uploaded</h3>
            <p
              style={{
                color: "#64748b",
                marginTop: "10px",
              }}
            >
              This magazine currently has no readable PDF.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}