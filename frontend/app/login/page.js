"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      // clear old token first
      localStorage.removeItem("token");

      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      console.log("LOGIN RESPONSE:", data);

      // ✅ strict validation
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (!data?.token) {
        throw new Error("Token not received from server");
      }

      // ✅ store token safely
      localStorage.setItem("token", data.token);

      alert("Login successful ✔");

      router.push("/admin");
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "420px",
        margin: "100px auto",
        padding: "35px",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
        background: "#fff",
      }}
    >
      <h1 style={{ marginBottom: "20px" }}>Admin Login</h1>

      {error && (
        <p style={{ color: "red", marginBottom: "15px", fontSize: "14px" }}>
          {error}
        </p>
      )}

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            background: loading ? "#94a3b8" : "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}