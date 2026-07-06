export default function PreviewRenderer({ item, type }) {
  if (!item) return <p>No data</p>;

  return (
    <div style={{ padding: "20px" }}>
      {/* PREVIEW BADGE */}
      <div style={{ marginBottom: "20px" }}>
        {item.status === "SCHEDULED" ? (
          <span style={{ color: "orange" }}>
            🔮 Scheduled Preview
          </span>
        ) : (
          <span style={{ color: "green" }}>
            ✅ Published Preview
          </span>
        )}
      </div>

      {/* TITLE */}
      <h1>{item.title}</h1>

      {/* IMAGE */}
      {item.featuredImage && (
        <img
          src={item.featuredImage}
          style={{ width: "100%", maxHeight: "400px" }}
        />
      )}

      {/* CONTENT */}
      <p style={{ marginTop: "20px" }}>
        {item.summary || item.excerpt || item.content}
      </p>

      {/* TYPE INFO */}
      <hr />
      <small>Preview Type: {type}</small>
    </div>
  );
}