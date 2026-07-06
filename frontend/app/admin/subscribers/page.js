"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/api";

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSubscribers();
  }, []);

  /* ================= FETCH SUBSCRIBERS ================= */
  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await api("/subscribers", {
        method: "GET",
      });

      console.log("SUBSCRIBERS RESPONSE:", data);

      if (!data) {
        throw new Error("No response from server");
      }

      setSubscribers(
        Array.isArray(data?.data) ? data.data : []
      );
    } catch (err) {
      console.error("FETCH SUBSCRIBERS ERROR:", err);
      setError(err.message || "Failed to load subscribers");
      setSubscribers([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="admin-title">Subscribers</h1>

      {/* ERROR STATE */}
      {error && (
        <div
          className="admin-card"
          style={{ borderLeft: "4px solid red" }}
        >
          <p style={{ color: "red" }}>{error}</p>
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
              <tr key={subscriber._id || subscriber.id}>
                <td>{subscriber.email || "N/A"}</td>
                <td>
                  {subscriber.createdAt
                    ? new Date(subscriber.createdAt).toLocaleDateString()
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