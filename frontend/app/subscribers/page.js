"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SubscribersPage() {
  const router = useRouter();

  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      setError("");

      // Get token from localStorage
      const token = localStorage.getItem("token");

      // If no token, redirect to login
      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch(
        "http://localhost:5000/api/subscribers",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to fetch subscribers");
      }

      const data = await res.json();

      if (Array.isArray(data?.data)) {
        setSubscribers(data.data);
      } else {
        setSubscribers([]);
      }
    } catch (err) {
      console.error("FETCH ERROR:", err);
      setError("Unable to load subscribers");
      setSubscribers([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* TITLE */}
      <h1 className="admin-title">Subscribers</h1>

      {/* ERROR */}
      {error && (
        <div
          className="admin-card"
          style={{
            background: "#fee2e2",
            color: "#b91c1c",
          }}
        >
          <p>{error}</p>
        </div>
      )}

      {/* COUNT CARD */}
      <div className="admin-card">
        <h2>Total Subscribers</h2>

        <p
          style={{
            fontSize: "32px",
            fontWeight: "700",
            color: "#2563eb",
            marginTop: "10px",
          }}
        >
          {subscribers.length}
        </p>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="admin-card">
          <p>Loading subscribers...</p>
        </div>
      ) : subscribers.length === 0 ? (
        <div className="empty-state">
          <h2>No Subscribers Yet</h2>
          <p>
            Subscribers will appear here once users subscribe.
          </p>
        </div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Joined Date</th>
            </tr>
          </thead>

          <tbody>
            {subscribers.map((subscriber) => (
              <tr key={subscriber.id}>
                <td>{subscriber.email}</td>
                <td>
                  {subscriber.createdAt
                    ? new Date(
                        subscriber.createdAt
                      ).toLocaleDateString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}