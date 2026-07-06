"use client";

import { useEffect, useState } from "react";

export default function NewsPreviewPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("newsPreview");

    if (stored) {
      setData(JSON.parse(stored));
    }
  }, []);

  if (!data) {
    return (
      <div style={{ padding: "40px" }}>
        <h2>No news preview found</h2>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto" }}>
      <h1>{data.title}</h1>

      {data.image && (
        <img
          src={data.image}
          alt="news"
          style={{
            width: "100%",
            borderRadius: "10px",
            margin: "20px 0",
          }}
        />
      )}

      <p style={{ color: "#666", marginBottom: "20px" }}>
        {data.summary}
      </p>

      <div style={{ lineHeight: "1.8", whiteSpace: "pre-wrap" }}>
        {data.content}
      </div>

      <div style={{ marginTop: "20px" }}>
        <p><b>Category:</b> {data.category}</p>
        <p><b>Source:</b> {data.source}</p>
        <p><b>Author:</b> {data.author}</p>
        <p><b>Status:</b> {data.status}</p>

        {data.scheduledPublishDate && (
          <p>
            <b>Scheduled:</b>{" "}
            {new Date(data.scheduledPublishDate).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}