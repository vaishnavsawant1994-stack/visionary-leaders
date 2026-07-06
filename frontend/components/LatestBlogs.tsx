"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BlogCard from "./BlogCard";

type Blog = {
  _id?: string;
  id?: string;
  title: string;
  summary?: string;
  coverImage?: string;
  author?: string | { name?: string } | null;
  category?: string | { name?: string } | null;
  scheduledAt?: string;
  status?: string;
};

type Props = {
  limit?: number;
  showViewAll?: boolean;
};

export default function LatestBlogs({
  limit = 6,
  showViewAll = true,
}: Props) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, [limit]);

  const getImageUrl = (image?: string) => {
    if (!image || image.trim() === "") {
      return "/placeholder.jpg";
    }

    if (image.startsWith("http")) {
      return image;
    }

    if (image.startsWith("/uploads")) {
      return `http://localhost:5000${image}`;
    }

    return `http://localhost:5000/uploads/blogs/${image}`;
  };

  const fetchBlogs = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        "http://localhost:5000/api/blogs"
      );

      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}`);
      }

      const data = await response.json();

      let fetchedBlogs: Blog[] = Array.isArray(data?.data)
        ? data.data
        : [];

      const now = new Date();

      /* FILTER SCHEDULED BLOGS */
      fetchedBlogs = fetchedBlogs.filter((blog) => {
        if (!blog.scheduledAt) return true;
        return new Date(blog.scheduledAt) <= now;
      });

      /* FILTER ONLY PUBLISHED */
      fetchedBlogs = fetchedBlogs.filter((blog) => {
        if (!blog.status) return true;
        return blog.status === "PUBLISHED";
      });

      /* IMAGE FIX */
      fetchedBlogs = fetchedBlogs.map((blog) => ({
        ...blog,
        coverImage: getImageUrl(blog.coverImage),
      }));

      /* LIMIT ONLY WHEN REQUIRED */
      setBlogs(
        limit && limit > 0
          ? fetchedBlogs.slice(0, limit)
          : fetchedBlogs
      );
    } catch (err) {
      console.error("Blog Fetch Error:", err);
      setError("Unable to load blogs");
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      style={{
        padding: "20px 0",
        maxWidth: "1400px",
        margin: "0 auto",
      }}
    >
      {/* VIEW ALL */}
      {showViewAll && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "30px",
          }}
        >
          <Link
            href="/blogs"
            style={{
              padding: "12px 22px",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              fontWeight: 600,
              background: "var(--card)",
              textDecoration: "none",
              color: "var(--text)",
              transition: "all 0.3s ease",
            }}
          >
            View All →
          </Link>
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <p
          style={{
            textAlign: "center",
            color: "var(--muted)",
            fontSize: "18px",
          }}
        >
          Loading blogs...
        </p>
      )}

      {/* ERROR */}
      {error && !loading && (
        <p
          style={{
            textAlign: "center",
            color: "red",
            fontSize: "16px",
          }}
        >
          {error}
        </p>
      )}

      {/* EMPTY */}
      {!loading && !error && blogs.length === 0 && (
        <p
          style={{
            textAlign: "center",
            color: "var(--muted)",
            fontSize: "18px",
          }}
        >
          No blogs available yet.
        </p>
      )}

      {/* BLOG GRID */}
      {!loading && !error && blogs.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "28px",
            alignItems: "stretch",
          }}
        >
          {blogs.map((blog, index) => (
            <BlogCard
              key={blog._id || blog.id || index}
              blog={blog}
            />
          ))}
        </div>
      )}
    </section>
  );
}