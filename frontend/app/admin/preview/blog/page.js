"use client";

import { useEffect, useState } from "react";

export default function BlogPreviewPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("blogPreview");

    if (stored) {
      setData(JSON.parse(stored));
    }
  }, []);

  if (!data) {
    return (
      <div style={{ padding: "40px" }}>
        <h2>No blog preview found</h2>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto" }}>
      <h1>{data.title}</h1>

      {data.image && (
        <img
          src={data.image}
          alt="blog"
          style={{
            width: "100%",
            borderRadius: "10px",
            margin: "20px 0",
          }}
        />
      )}

      <p style={{ color: "#666", marginBottom: "20px" }}>
        {data.excerpt}
      </p>

      <div style={{ lineHeight: "1.8", whiteSpace: "pre-wrap" }}>
        {data.content}
      </div>

      <div style={{ marginTop: "20px" }}>
        <p><b>Author:</b> {data.author}</p>
        <p><b>Category:</b> {data.category}</p>
        <p><b>Status:</b> {data.status}</p>
      </div>
    </div>
  );
}