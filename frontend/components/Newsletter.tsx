"use client";

import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import "../styles/newsletter.css";

export default function Newsletter() {
  const { theme } = useTheme();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  /* AUTO CLEAR MESSAGE */
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage("");
    }, 4000);

    return () => clearTimeout(timer);
  }, [message]);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubscribe = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!email.trim()) {
      setMessage("⚠️ Please enter your email.");
      return;
    }

    if (!validateEmail(email)) {
      setMessage("⚠️ Please enter a valid email.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/subscribers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Thank you for subscribing!");
        setEmail("");
      } else {
        setMessage(
          data.message || "❌ Subscription failed"
        );
      }
    } catch (error) {
      console.error(error);
      setMessage(
        "❌ Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* THEME TOKENS */
  const style = {
    light: {
      bg: "#ffffff",
      card: "#ffffff",
      text: "#111827",
      muted: "#6b7280",
      border: "rgba(0,0,0,0.08)",
      primary: "#ff4d6d",
      inputBg: "#f9fafb",
    },

    dark: {
      bg: "#0f172a",
      card: "#17171f",
      text: "#ffffff",
      muted: "#b5b5c0",
      border: "rgba(255,255,255,0.08)",
      primary: "#ff4d6d",
      inputBg: "#222232",
    },

    corporate: {
      bg: "#f8f5f0",
      card: "#ffffff",
      text: "#1f2937",
      muted: "#6b7280",
      border: "rgba(0,0,0,0.08)",
      primary: "#b45309",
      inputBg: "#f9fafb",
    },
  };

  const t =
    theme === "light"
      ? style.light
      : theme === "dark"
      ? style.dark
      : style.corporate;

  return (
    <section
      id="newsletter"
      className="newsletter"
      style={{
        background: t.bg,
      }}
    >
      <div
        className="newsletter-container"
        style={{
          background: t.card,
          border: `1px solid ${t.border}`,
        }}
      >
        {/* LABEL */}
        <p
          className="newsletter-label"
          style={{
            color: t.primary,
          }}
        >
          Stay Updated
        </p>

        {/* TITLE */}
        <h2
          className="newsletter-title"
          style={{
            color: t.text,
          }}
        >
          Subscribe to Our Newsletter
        </h2>

        {/* SUBTITLE */}
        <p
          className="newsletter-subtitle"
          style={{
            color: t.muted,
          }}
        >
          Get exclusive access to business insights,
          startup trends, leadership stories, and
          global market intelligence delivered directly
          to your inbox.
        </p>

        {/* FORM */}
        <form
          onSubmit={handleSubscribe}
          className="newsletter-form"
        >
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            disabled={loading}
            required
            style={{
              background: t.inputBg,
              color: t.text,
              border: `1px solid ${t.border}`,
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              background: t.primary,
              color: "#ffffff",
            }}
          >
            {loading
              ? "Subscribing..."
              : "Subscribe"}
          </button>
        </form>

        {/* MESSAGE */}
        {message && (
          <p
            className="newsletter-message"
            style={{
              marginTop: "15px",
              fontWeight: 600,
              color: t.text,
            }}
          >
            {message}
          </p>
        )}
      </div>
    </section>
  );
}