"use client";

import { useEffect, useState } from "react";

export default function ArticlePreviewPage() {
  const [article, setArticle] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("articlePreview");

    if (stored) {
      setArticle(JSON.parse(stored));
    }
  }, []);

  if (!article) {
    return (
      <div style={{ padding: "30px" }}>
        No preview data found
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto" }}>
      <h1>{article.title}</h1>

      <p style={{ color: "#64748b" }}>
        {article.summary}
      </p>

      {article.featuredImage && (
        <img
          src={article.featuredImage}
          alt="preview"
          style={{
            width: "100%",
            borderRadius: "10px",
            margin: "20px 0",
          }}
        />
      )}

      <p>
        <b>Status:</b> {article.status}
      </p>

      <hr />

      <p style={{ lineHeight: "1.8", whiteSpace: "pre-wrap" }}>
        {article.content}
      </p>
    </div>
  );
}