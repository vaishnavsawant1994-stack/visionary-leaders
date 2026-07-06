"use client";

import { useEffect, useState } from "react";

export default function MagazinePreviewPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("magazinePreview");

    if (stored) {
      setData(JSON.parse(stored));
    }
  }, []);

  if (!data) {
    return (
      <div
        style={{
          padding: "60px",
          textAlign: "center",
          fontSize: "18px",
        }}
      >
        No preview data found
      </div>
    );
  }

  return (
    <>
      {/* HERO */}
      <section
        style={{
          padding: "80px 20px 40px",
          textAlign: "center",
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <p
          style={{
            color: "#2563eb",
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: "1px",
            marginBottom: "15px",
          }}
        >
          Magazine Preview
        </p>

        <h1
          style={{
            fontSize: "48px",
            fontWeight: "800",
            lineHeight: "1.2",
            marginBottom: "20px",
          }}
        >
          {data.title}
        </h1>

        <p
          style={{
            color: "#64748b",
            fontSize: "17px",
            maxWidth: "700px",
            margin: "0 auto",
            lineHeight: "1.8",
          }}
        >
          {data.description}
        </p>
      </section>

      {/* MAIN CONTENT */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "20px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "380px 1fr",
            gap: "50px",
            alignItems: "start",
          }}
        >
          {/* COVER */}
          <div>
            {data.coverImage ? (
              <img
                src={data.coverImage}
                alt="Magazine Cover"
                style={{
                  width: "100%",
                  borderRadius: "20px",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
                }}
              />
            ) : (
              <div
                style={{
                  height: "520px",
                  background: "#f1f5f9",
                  borderRadius: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                No Cover Image
              </div>
            )}
          </div>

          {/* DETAILS */}
          <div>
            {/* BADGES */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
                marginBottom: "25px",
              }}
            >
              <span
                style={{
                  background: "#dbeafe",
                  color: "#2563eb",
                  padding: "8px 16px",
                  borderRadius: "30px",
                  fontWeight: "600",
                }}
              >
                Edition: {data.edition}
              </span>

              <span
                style={{
                  background:
                    data.status === "PUBLISHED"
                      ? "#dcfce7"
                      : data.status === "SCHEDULED"
                      ? "#fef3c7"
                      : "#f1f5f9",
                  color:
                    data.status === "PUBLISHED"
                      ? "#16a34a"
                      : data.status === "SCHEDULED"
                      ? "#d97706"
                      : "#475569",
                  padding: "8px 16px",
                  borderRadius: "30px",
                  fontWeight: "600",
                }}
              >
                Status: {data.status}
              </span>

              {data.featured && (
                <span
                  style={{
                    background: "#ede9fe",
                    color: "#7c3aed",
                    padding: "8px 16px",
                    borderRadius: "30px",
                    fontWeight: "600",
                  }}
                >
                  Featured
                </span>
              )}
            </div>

            {/* ABOUT */}
            <h2
              style={{
                marginBottom: "20px",
                fontSize: "30px",
              }}
            >
              About This Edition
            </h2>

            <p
              style={{
                fontSize: "18px",
                lineHeight: "2",
                marginBottom: "30px",
                color: "#334155",
              }}
            >
              {data.description}
            </p>

            {/* SCHEDULE */}
            {data.scheduledPublishDate && (
              <div
                style={{
                  marginBottom: "25px",
                  padding: "20px",
                  background: "#fff7ed",
                  borderRadius: "12px",
                  border: "1px solid #fed7aa",
                }}
              >
                <h3>Scheduled Publish Date</h3>

                <p>
                  {new Date(
                    data.scheduledPublishDate
                  ).toLocaleString()}
                </p>
              </div>
            )}

            {/* PDF */}
            {data.pdfFile && (
              <div
                style={{
                  padding: "20px",
                  background: "#f8fafc",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <h3>PDF File Selected</h3>
                <p>{data.pdfFile}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}