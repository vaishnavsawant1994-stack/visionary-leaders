"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import "../styles/admin.css";

import {
  FiGrid,
  FiFileText,
  FiFolder,
  FiBookOpen,
  FiUsers,
  FiStar,
} from "react-icons/fi";

import { MdOutlineArticle } from "react-icons/md";
import { RiNewspaperLine } from "react-icons/ri";

export default function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: <FiGrid size={18} />,
    },
    {
      name: "Articles",
      href: "/admin/articles",
      icon: <FiFileText size={18} />,
    },
    {
      name: "Categories",
      href: "/admin/categories",
      icon: <FiFolder size={18} />,
    },
    {
      name: "Magazines",
      href: "/admin/magazines",
      icon: <FiBookOpen size={18} />,
    },
    {
      name: "Subscribers",
      href: "/admin/subscribers",
      icon: <FiUsers size={18} />,
    },
    {
      name: "Blogs",
      href: "/admin/blogs",
      icon: <MdOutlineArticle size={18} />,
    },
    {
      name: "News",
      href: "/admin/news",
      icon: <RiNewspaperLine size={18} />,
    },
    {
      name: "Ratings Analytics",
      href: "/admin/ratings",
      icon: <FiStar size={18} />,
    },
  ];

  // ✅ better active check (works for subroutes too)
  const isActive = (href) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      className="admin-sidebar"
      style={{
        width: "280px",
        minHeight: "100vh",
        padding: "28px 20px",
        background: "linear-gradient(180deg, #0f172a, #1e3a8a)",
        color: "#fff",
        borderRight: "1px solid rgba(255,255,255,0.08)",
        position: "sticky",
        top: 0,
      }}
    >
      {/* LOGO */}
      <div
        style={{
          marginBottom: "40px",
          paddingBottom: "20px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <h2 style={{ fontSize: "24px", fontWeight: "800", lineHeight: "1.3" }}>
          Visionary
          <span style={{ color: "#60a5fa", display: "block" }}>
            Leaders
          </span>
        </h2>
      </div>

      {/* MENU */}
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {menuItems.map((item) => (
          <li key={item.name}>
            <Link
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "14px 16px",
                borderRadius: "12px",
                color: "#fff",
                textDecoration: "none",
                fontWeight: "500",
                transition: "0.25s ease",
                background: isActive(item.href)
                  ? "rgba(96,165,250,0.25)"
                  : "rgba(255,255,255,0.04)",
                border: isActive(item.href)
                  ? "1px solid rgba(96,165,250,0.4)"
                  : "1px solid transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  "rgba(255,255,255,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = isActive(item.href)
                  ? "rgba(96,165,250,0.25)"
                  : "rgba(255,255,255,0.04)";
              }}
            >
              {item.icon}
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}