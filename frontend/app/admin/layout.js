import AdminSidebar from "../../components/AdminSidebar";
import "../../styles/admin.css";

export default function AdminLayout({ children }) {
  return (
    <div
      className="admin-layout"
      style={{
        minHeight: "100vh",
        display: "flex",
        background:
          "linear-gradient(to bottom right, #f8fafc, #eef2ff, #ffffff)",
      }}
    >
      {/* SIDEBAR */}
      <aside
        style={{
          width: "260px",
          flexShrink: 0,
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
          background: "#fff",
          borderRight: "1px solid #e5e7eb",
          boxShadow: "2px 0 10px rgba(0,0,0,0.03)",
        }}
      >
        <AdminSidebar />
      </aside>

      {/* MAIN CONTENT */}
      <main
        className="admin-content"
        style={{
          flex: 1,
          padding: "30px",
          overflowY: "auto",
        }}
      >
        {/* TOP HEADER */}
        <div
          style={{
            marginBottom: "30px",
            padding: "20px 24px",
            borderRadius: "18px",
            background: "rgba(255,255,255,0.8)",
            backdropFilter: "blur(14px)",
            border: "1px solid rgba(255,255,255,0.6)",
            boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
          }}
        >
          <h1
            style={{
              fontSize: "28px",
              fontWeight: 800,
              marginBottom: "6px",
              color: "#0f172a",
            }}
          >
            Admin Panel
          </h1>

          <p
            style={{
              fontSize: "15px",
              color: "#64748b",
            }}
          >
            Manage your magazine platform efficiently
          </p>
        </div>

        {/* PAGE CONTENT */}
        <div
          style={{
            animation: "fadeIn 0.3s ease-in-out",
          }}
        >
          {children}
        </div>
      </main>
    </div>
  );
}