"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "../context/ThemeContext";

import { FiSearch, FiChevronDown } from "react-icons/fi";
import { BiCategory } from "react-icons/bi";

export default function Navbar() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const [search, setSearch] = useState("");
  const [showCategories, setShowCategories] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSearch = () => {
    if (!search.trim()) return;
    router.push(`/search?query=${encodeURIComponent(search.trim())}`);
    setSearch("");
  };

  const categories = [
    "All",
    "Business",
    "Technology",
    "Startups",
    "AI",
    "Finance",
    "Leadership",
    "Innovation",
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowCategories(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= THEME TOKENS ================= */
  const isLight = theme === "light";
  const isDark = theme === "dark";
  const isCorporate = theme === "corporate";

  /* 🌞 LIGHT MODE */
  const lightStyle = {
    navBg: "rgba(247,247,251,0.95)",
    text: "#1a1a1a",
    border: "rgba(0,0,0,0.08)",
    dropdown: "#ffffff",
    shadow: "0 10px 30px rgba(0,0,0,0.08)",
    accent: "#ff4d6d",
  };

  /* 🌙 DARK MODE */
  const darkStyle = {
    navBg: "rgba(15,15,20,0.95)",
    text: "#f5f5f5",
    border: "rgba(255,255,255,0.08)",
    dropdown: "#17171f",
    shadow: "0 0 25px rgba(255,77,109,0.15)",
    accent: "#ff4d6d",
  };

  /* 🏢 CORPORATE MODE */
  const corporateStyle = {
    navBg: "rgba(245,243,240,0.95)",
    text: "#1f2937",
    border: "rgba(0,0,0,0.08)",
    dropdown: "#ffffff",
    shadow: "0 6px 20px rgba(0,0,0,0.06)",
    accent: "#b45309",
  };

  const style = isLight
    ? lightStyle
    : isDark
    ? darkStyle
    : corporateStyle;

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 40px",
        background: style.navBg,
        backdropFilter: "blur(14px)",
        borderBottom: `1px solid ${style.border}`,
        position: "sticky",
        top: 0,
        zIndex: 1000,
        transition: "all 0.3s ease",
      }}
    >
      {/* LOGO */}
      <Link
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          textDecoration: "none",
        }}
      >
        <img
          src="/logo.png"
          alt="Visionary Leaders"
          onError={(e) =>
            ((e.currentTarget as HTMLImageElement).src =
              "/placeholder.jpg")
          }
          style={{
            width: "58px",
            height: "58px",
            objectFit: "contain",
          }}
        />

        <span
          style={{
            fontSize: "24px",
            fontWeight: 800,
            color: style.text,
          }}
        >
          Visionary Leaders
        </span>
      </Link>

      {/* RIGHT SIDE */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "18px",
        }}
      >
        {/* NAV LINKS */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "22px",
          }}
        >
          {[
            { name: "Home", href: "/" },
            { name: "Articles", href: "/articles" },
            { name: "Magazines", href: "/magazines" },
            { name: "About", href: "/about" },
            { name: "Contact", href: "/contact" },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              style={{
                color: style.text,
                fontWeight: 500,
                fontSize: "15px",
                textDecoration: "none",
              }}
            >
              {item.name}
            </Link>
          ))}

          {/* CATEGORY DROPDOWN */}
          <div ref={dropdownRef} style={{ position: "relative" }}>
            <button
              onClick={() => setShowCategories(!showCategories)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "transparent",
                border: "none",
                color: style.text,
                fontWeight: 600,
                cursor: "pointer",
                fontSize: "15px",
              }}
            >
              <BiCategory size={18} />
              Categories
              <FiChevronDown size={16} />
            </button>

            {showCategories && (
              <div
                style={{
                  position: "absolute",
                  top: "48px",
                  left: "0",
                  background: style.dropdown,
                  borderRadius: "14px",
                  minWidth: "240px",
                  overflow: "hidden",
                  boxShadow: style.shadow,
                  border: `1px solid ${style.border}`,
                  zIndex: 2000,
                }}
              >
                {categories.map((cat) => (
                  <Link
                    key={cat}
                    href={`/magazines?category=${encodeURIComponent(cat)}`}
                    onClick={() => setShowCategories(false)}
                    style={{
                      display: "block",
                      padding: "14px 18px",
                      color: style.text,
                      textDecoration: "none",
                      fontSize: "14px",
                      fontWeight: 500,
                      borderBottom: `1px solid ${style.border}`,
                    }}
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SEARCH */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background:
              isLight
                ? "#ffffff"
                : isDark
                ? "#17171f"
                : "#ffffff",
            border: `1px solid ${style.border}`,
            borderRadius: "10px",
            padding: "4px 8px",
          }}
        >
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            style={{
              padding: "8px 10px",
              border: "none",
              outline: "none",
              background: "transparent",
              color: style.text,
              width: "170px",
            }}
          />

          <button
            onClick={handleSearch}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "8px",
              background: style.accent,
              color: "#fff",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
            }}
          >
            <FiSearch size={18} />
          </button>
        </div>

        {/* THEME SWITCH */}
        <select
          value={theme}
          onChange={(e) =>
            setTheme(
              e.target.value as
                | "light"
                | "dark"
                | "corporate"
            )
          }
          style={{
            padding: "9px 12px",
            borderRadius: "8px",
            border: `1px solid ${style.border}`,
            background: isDark
              ? "#17171f"
              : "#ffffff",
            color: style.text,
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          <option value="light">☀️ Light</option>
          <option value="dark">🌙 Dark</option>
          <option value="corporate">🏢 Corporate</option>
        </select>

        {/* SUBSCRIBE */}
        <Link
          href="/#newsletter"
          style={{
            background: style.accent,
            color: "#fff",
            padding: "10px 18px",
            borderRadius: "10px",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Subscribe
        </Link>
      </div>
    </nav>
  );
}               