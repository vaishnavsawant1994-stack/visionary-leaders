"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MagazineCard from "./MagazineCard";

interface Magazine {
  id?: number;
  _id?: string;
  title: string;
  description?: string;
  coverImage?: string;
  edition?: string;
  featured?: boolean;
  category?: {
    id?: number;
    name: string;
    slug?: string;
  };
}

type Props = {
  category?: string;
  limit?: number;
};

export default function FeaturedMagazines({
  category = "All",
  limit = 6,
}: Props) {
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMagazines();
  }, [category, limit]);

  const fetchMagazines = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/magazines?featured=true"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch magazines");
      }

      const data = await response.json();

      let fetchedMagazines: Magazine[] = Array.isArray(data?.data)
        ? data.data
        : [];

      /* CATEGORY FILTER */
      if (category !== "All") {
        fetchedMagazines = fetchedMagazines.filter(
          (magazine) =>
            magazine.category?.name?.toLowerCase() ===
            category.toLowerCase()
        );
      }

      setMagazines(
        limit
          ? fetchedMagazines.slice(0, limit)
          : fetchedMagazines
      );
    } catch (error: any) {
      console.error("Fetch Magazine Error:", error);
      setError(error.message || "Something went wrong");
      setMagazines([]);
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
      {/* VIEW ALL BUTTON */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "30px",
        }}
      >
        <Link
          href="/magazines"
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

      {/* LOADING */}
      {loading && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "28px",
          }}
        >
          {[...Array(limit)].map((_, i) => (
            <div
              key={i}
              style={{
                height: "420px",
                borderRadius: "20px",
                background: "var(--card)",
                border: "1px solid var(--border)",
                opacity: 0.5,
              }}
            />
          ))}
        </div>
      )}

      {/* ERROR */}
      {!loading && error && (
        <div
          style={{
            textAlign: "center",
            padding: "60px",
            border: "1px solid rgba(255,0,0,0.2)",
            borderRadius: "18px",
            background: "var(--card)",
          }}
        >
          <h3
            style={{
              color: "var(--text)",
              marginBottom: "10px",
            }}
          >
            Error Loading Magazines
          </h3>

          <p
            style={{
              color: "var(--muted)",
            }}
          >
            {error}
          </p>
        </div>
      )}

      {/* EMPTY */}
      {!loading && !error && magazines.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "80px 20px",
            border: "1px dashed var(--border)",
            borderRadius: "20px",
            background: "var(--card)",
          }}
        >
          <h3
            style={{
              color: "var(--text)",
            }}
          >
            No magazines found
          </h3>

          <p
            style={{
              marginTop: "10px",
              color: "var(--muted)",
            }}
          >
            This category has no featured magazines yet.
          </p>
        </div>
      )}

      {/* MAGAZINES GRID */}
      {!loading && !error && magazines.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)", // exact 3 cards
            gap: "28px",
          }}
        >
          {magazines.map((magazine, index) => (
            <MagazineCard
              key={magazine.id || magazine._id || index}
              magazine={magazine}
            />
          ))}
        </div>
      )}
    </section>
  );
}