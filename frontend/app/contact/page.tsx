"use client";

import { useState } from "react";
import "../../styles/contact.css";

type FormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  /* ================= HANDLE INPUT ================= */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /* ================= HANDLE SUBMIT ================= */
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      await new Promise((res) =>
        setTimeout(res, 800)
      );

      alert("Message sent successfully ✔");

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      {/* ================= HERO SECTION ================= */}
      <section className="contact-hero">
        <div className="contact-hero-overlay"></div>

        <div className="contact-hero-content">
          <div className="contact-hero-badge">
            Contact • Support • Connect
          </div>

          <h1 className="contact-hero-title">
            Let’s Build Something{" "}
            <span className="contact-highlight">
              Meaningful Together
            </span>
          </h1>

          <p className="contact-hero-subtitle">
            We’d love to hear from you. Reach out for collaborations,
            feedback, partnerships, or editorial inquiries.
          </p>
        </div>
      </section>

      {/* ================= CONTACT FORM ================= */}
      <section className="contact-container">
        <div className="contact-card">
          <h2 className="contact-form-title">
            Get In Touch
          </h2>

          <p className="contact-form-subtitle">
            Fill out the form below and we’ll get back to you.
          </p>

          <form onSubmit={handleSubmit}>
            <input
              className="contact-input"
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              className="contact-input"
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              className="contact-input"
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />

            <textarea
              className="contact-input"
              name="message"
              rows={6}
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              required
            />

            <button
              className="contact-btn"
              disabled={loading}
              type="submit"
            >
              {loading ? "Sending..." : "Send Message →"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}