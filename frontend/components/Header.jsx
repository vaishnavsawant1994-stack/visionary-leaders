"use client";

import Link from "next/link";

export default function Header() {
  const navLinkStyle = {
    textDecoration: "none",
    color: "var(--text)",
    fontWeight: "500",
    transition: "0.3s ease",
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        width: "100%",
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
        padding: "16px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
      }}
    >
      {/* LOGO */}
      <Link
        href="/"
        style={{
          textDecoration: "none",
          fontSize: "28px",
          fontWeight: "800",
          lineHeight: "1.2",
          color: "var(--text)",
        }}
      >
        Visionary{" "}
        <span
          style={{
            color: "var(--primary)",
          }}
        >
          Leaders
        </span>
      </Link>

      {/* NAVIGATION */}
      <nav>
        <ul
          style={{
            display: "flex",
            listStyle: "none",
            gap: "28px",
            margin: 0,
            padding: 0,
            alignItems: "center",
          }}
        >
          <li>
            <Link
              href="/"
              style={navLinkStyle}
            >
              Home
            </Link>
          </li>

          <li>
            <Link
              href="/articles"
              style={navLinkStyle}
            >
              Articles
            </Link>
          </li>

          <li>
            <Link
              href="/magazines"
              style={navLinkStyle}
            >
              Magazines
            </Link>
          </li>

          <li>
            <Link
              href="/blogs"
              style={navLinkStyle}
            >
              Blogs
            </Link>
          </li>

          <li>
            <Link
              href="/news"
              style={navLinkStyle}
            >
              News
            </Link>
          </li>

          <li>
            <Link
              href="/categories"
              style={navLinkStyle}
            >
              Categories
            </Link>
          </li>

          <li>
            <Link
              href="/contact"
              style={navLinkStyle}
            >
              Contact
            </Link>
          </li>

          <li>
            <Link
              href="/admin"
              style={navLinkStyle}
            >
              Admin
            </Link>
          </li>

          {/* SUBSCRIBE BUTTON */}
          <li>
            <a
              href="#subscribe"
              style={{
                background:
                  "linear-gradient(135deg,#2563eb,#7c3aed)",
                color: "#fff",
                padding: "10px 18px",
                borderRadius: "10px",
                textDecoration: "none",
                fontWeight: "600",
                boxShadow:
                  "0 8px 20px rgba(37,99,235,0.25)",
                transition: "0.3s ease",
              }}
            >
              Subscribe →
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}