"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
  const [stats, setStats] = useState({
    articles: 0,
    magazines: 0,
    blogs: 0,
    news: 0,
    categories: 0,
    subscribers: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  /* ================= SAFE FETCH HELPER ================= */
  const safeFetch = async (url) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.warn("No token found");
        return [];
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error(
          `API Error: ${response.status} - ${url}`
        );
        return [];
      }

      const data = await response.json();

      // support both array and { data: [] }
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.data)) return data.data;

      return [];
    } catch (error) {
      console.error(
        "Fetch failed:",
        url,
        error
      );
      return [];
    }
  };

  /* ================= FETCH DASHBOARD STATS ================= */
  const fetchStats = async () => {
    try {
      setLoading(true);

      const [
        articles,
        magazines,
        blogs,
        news,
        categories,
        subscribers,
      ] = await Promise.all([
        safeFetch(
          "http://localhost:5000/api/articles"
        ),
        safeFetch(
          "http://localhost:5000/api/magazines"
        ),
        safeFetch(
          "http://localhost:5000/api/blogs"
        ),
        safeFetch(
          "http://localhost:5000/api/news"
        ),
        safeFetch(
          "http://localhost:5000/api/categories"
        ),
        safeFetch(
          "http://localhost:5000/api/subscribers"
        ),
      ]);

      setStats({
        articles: articles.length,
        magazines: magazines.length,
        blogs: blogs.length,
        news: news.length,
        categories: categories.length,
        subscribers: subscribers.length,
      });
    } catch (error) {
      console.error(
        "Dashboard stats error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* HEADER */}
      <div style={{ marginBottom: "30px" }}>
        <p
          style={{
            color: "#2563eb",
            fontWeight: 700,
            letterSpacing: "2px",
            textTransform: "uppercase",
            marginBottom: "8px",
            fontSize: "13px",
          }}
        >
          Admin Control Center
        </p>

        <h1 className="admin-title">
          Dashboard
        </h1>
      </div>

      {/* WELCOME CARD */}
      <div
        className="admin-card"
        style={{
          background:
            "linear-gradient(135deg,#0f172a,#1e3a8a,#2563eb)",
          color: "white",
          position: "relative",
          overflow: "hidden",
          marginBottom: "35px",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-40px",
            right: "-40px",
            width: "180px",
            height: "180px",
            borderRadius: "50%",
            background:
              "rgba(255,255,255,0.08)",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
          }}
        >
          <h2
            style={{
              color: "#fff",
              marginBottom: "14px",
              fontSize: "28px",
            }}
          >
            Welcome to Visionary Leaders
          </h2>

          <p
            style={{
              color:
                "rgba(255,255,255,0.9)",
              maxWidth: "650px",
              lineHeight: "1.8",
            }}
          >
            Manage your entire digital
            publication from one place —
            articles, magazines, blogs,
            categories, subscribers, and
            editorial operations.
          </p>
        </div>
      </div>

      {/* STATS */}
      {loading ? (
        <div className="admin-card">
          <p>Loading dashboard...</p>
        </div>
      ) : (
        <div className="stats-grid">
          <div className="stat-card">
            <h2>{stats.articles}</h2>
            <p>Articles</p>
          </div>

          <div className="stat-card">
            <h2>{stats.magazines}</h2>
            <p>Magazines</p>
          </div>

          <div className="stat-card">
            <h2>{stats.blogs}</h2>
            <p>Blogs</p>
          </div>

          <div className="stat-card">
            <h2>{stats.news}</h2>
            <p>News</p>
          </div>

          <div className="stat-card">
            <h2>{stats.categories}</h2>
            <p>Categories</p>
          </div>

          <div className="stat-card">
            <h2>{stats.subscribers}</h2>
            <p>Subscribers</p>
          </div>
        </div>
      )}
    </>
  );
}