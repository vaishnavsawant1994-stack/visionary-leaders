"use client";

import Link from "next/link";
import "../styles/footer.css";

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "Instagram",
      href: "https://instagram.com",
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com",
    },
    {
      name: "X",
      href: "https://x.com",
    },
    {
      name: "YouTube",
      href: "https://youtube.com",
    },
  ];

  const exploreLinks = [
    { name: "Home", href: "/" },
    { name: "Articles", href: "/articles" },
    { name: "Magazines", href: "/magazines" },
    { name: "Blogs", href: "/blogs" },
    { name: "News", href: "/news" },
    { name: "Categories", href: "/categories" },
  ];

  const companyLinks = [
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
    {
      name: "Privacy Policy",
      href: "/privacy-policy",
    },
    {
      name: "Terms & Conditions",
      href: "/terms-and-conditions",
    },
    {
      name: "Editorial Policy",
      href: "/editorial-policy",
    },
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* LEFT BRAND */}
        <div className="footer-brand">
          <h2 className="footer-logo">
            Visionary Leaders
          </h2>

          <p className="footer-description">
            Visionary Leaders is a premium
            digital magazine focused on
            entrepreneurship, leadership,
            innovation, finance, technology,
            and global business excellence.
          </p>

          <div className="footer-socials">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {social.name}
              </a>
            ))}
          </div>
        </div>

        {/* EXPLORE */}
        <div className="footer-links">
          <h3>Explore</h3>

          <ul>
            {exploreLinks.map((link) => (
              <li key={link.name}>
                <Link href={link.href}>
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* COMPANY */}
        <div className="footer-links">
          <h3>Company</h3>

          <ul>
            {companyLinks.map((link) => (
              <li key={link.name}>
                <Link href={link.href}>
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* NEWSLETTER */}
        <div className="footer-newsletter">
          <h3>Stay Updated</h3>

          <p>
            Weekly insights on startups,
            leadership, innovation, and
            the future of business.
          </p>

          <Link
            href="/#newsletter"
            className="footer-subscribe"
          >
            Subscribe Now
          </Link>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="footer-bottom">
        <p>
          © {currentYear} Visionary Leaders.
          All Rights Reserved.
        </p>

        <span>
          Inspiring leadership,
          innovation & business excellence.
        </span>
      </div>
    </footer>
  );
}