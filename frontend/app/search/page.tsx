"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface Article {
  id: number;
  title: string;
  summary?: string;
}

interface Magazine {
  id: number;
  title: string;
  description?: string;
  coverImage?: string;
}

interface Blog {
  id: number;
  title: string;
  excerpt?: string;
  coverImage?: string;
}

interface News {
  id: number;
  title: string;
  content?: string;
  image?: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query")?.trim() || "";

  const [articles, setArticles] = useState<Article[]>([]);
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(false);

  const BASE_URL = "http://localhost:5000";

  const getImageUrl = (path?: string) => {
    if (!path || path.trim() === "") return "/placeholder.jpg";
    if (path.startsWith("http")) return path;
    return `${BASE_URL}${path}`;
  };

  const fetchSearchResults = async (searchTerm: string) => {
    try {
      setLoading(true);

      const encodedQuery = encodeURIComponent(searchTerm);

      const [articlesRes, magazinesRes, blogsRes, newsRes] =
        await Promise.all([
          fetch(`${BASE_URL}/api/articles?search=${encodedQuery}`),
          fetch(`${BASE_URL}/api/magazines?search=${encodedQuery}`),
          fetch(`${BASE_URL}/api/blogs?search=${encodedQuery}`),
          fetch(`${BASE_URL}/api/news?search=${encodedQuery}`),
        ]);

      const [articlesData, magazinesData, blogsData, newsData] =
        await Promise.all([
          articlesRes.json(),
          magazinesRes.json(),
          blogsRes.json(),
          newsRes.json(),
        ]);

      setArticles(Array.isArray(articlesData?.data) ? articlesData.data : []);
      setMagazines(Array.isArray(magazinesData?.data) ? magazinesData.data : []);
      setBlogs(Array.isArray(blogsData?.data) ? blogsData.data : []);
      setNews(Array.isArray(newsData?.data) ? newsData.data : []);
    } catch (err) {
      console.error("Search error:", err);

      setArticles([]);
      setMagazines([]);
      setBlogs([]);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!query || query.length < 2) {
      setArticles([]);
      setMagazines([]);
      setBlogs([]);
      setNews([]);
      return;
    }

    fetchSearchResults(query);
  }, [query]);

  const sectionTitleStyle = {
    fontSize: "28px",
    fontWeight: "800",
    margin: "50px 0 20px",
    color: "var(--text)",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "22px",
  };

  const cardStyle = {
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
    color: "var(--text)",
  };

  return (
    <section
      style={{
        padding: "100px 40px",
        maxWidth: "1400px",
        margin: "0 auto",
        color: "var(--text)",
      }}
    >
      {/* HEADER */}
      <div style={{ textAlign: "center", marginBottom: "60px" }}>
        <p
          style={{
            color: "var(--primary)",
            fontWeight: 700,
            letterSpacing: "2px",
            textTransform: "uppercase",
          }}
        >
          Search Results
        </p>

        <h1
          className="gradient-text"
          style={{
            fontSize: "44px",
            fontWeight: "900",
          }}
        >
          "{query || "Search"}"
        </h1>
      </div>

      {!query && (
        <p style={{ textAlign: "center", color: "var(--muted)" }}>
          Please enter a search term.
        </p>
      )}

      {loading ? (
        <p style={{ textAlign: "center", color: "var(--muted)" }}>
          Loading results...
        </p>
      ) : (
        <>
          {/* ARTICLES */}
          <h2 style={sectionTitleStyle}>Articles</h2>

          {articles.length === 0 ? (
            <p style={{ color: "var(--muted)" }}>No articles found</p>
          ) : (
            <div style={gridStyle}>
              {articles.map((article) => (
                <Link key={article.id} href={`/articles/${article.id}`}>
                  <div style={cardStyle}>
                    <div style={{ padding: "20px" }}>
                      <h3>{article.title}</h3>
                      <p style={{ color: "var(--muted)" }}>
                        {article.summary || "No summary available"}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* MAGAZINES */}
          <h2 style={sectionTitleStyle}>Magazines</h2>

          {magazines.length === 0 ? (
            <p style={{ color: "var(--muted)" }}>No magazines found</p>
          ) : (
            <div style={gridStyle}>
              {magazines.map((mag) => (
                <Link key={mag.id} href={`/magazines/${mag.id}`}>
                  <div style={cardStyle}>
                    <img
                      src={getImageUrl(mag.coverImage)}
                      alt={mag.title}
                      style={{
                        width: "100%",
                        height: "240px",
                        objectFit: "cover",
                      }}
                    />
                    <div style={{ padding: "20px" }}>
                      <h3>{mag.title}</h3>
                      <p style={{ color: "var(--muted)" }}>
                        {mag.description?.slice(0, 100) ||
                          "No description available"}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* BLOGS */}
          <h2 style={sectionTitleStyle}>Blogs</h2>

          {blogs.length === 0 ? (
            <p style={{ color: "var(--muted)" }}>No blogs found</p>
          ) : (
            <div style={gridStyle}>
              {blogs.map((blog) => (
                <Link key={blog.id} href={`/blogs/${blog.id}`}>
                  <div style={cardStyle}>
                    <img
                      src={getImageUrl(blog.coverImage)}
                      alt={blog.title}
                      style={{
                        width: "100%",
                        height: "240px",
                        objectFit: "cover",
                      }}
                    />
                    <div style={{ padding: "20px" }}>
                      <h3>{blog.title}</h3>
                      <p style={{ color: "var(--muted)" }}>
                        {blog.excerpt || "No excerpt available"}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* NEWS */}
          <h2 style={sectionTitleStyle}>News</h2>

          {news.length === 0 ? (
            <p style={{ color: "var(--muted)" }}>No news found</p>
          ) : (
            <div style={gridStyle}>
              {news.map((item) => (
                <Link key={item.id} href={`/news/${item.id}`}>
                  <div style={cardStyle}>
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.title}
                      style={{
                        width: "100%",
                        height: "240px",
                        objectFit: "cover",
                      }}
                    />
                    <div style={{ padding: "20px" }}>
                      <h3>{item.title}</h3>
                      <p style={{ color: "var(--muted)" }}>
                        {item.content?.slice(0, 100) ||
                          "No content available"}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}