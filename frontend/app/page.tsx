"use client";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import FeaturedMagazines from "../components/FeaturedMagazines";
import LatestArticles from "../components/LatestArticles";
import LatestBlogs from "../components/LatestBlogs";
import LatestNews from "../components/LatestNews";
import Newsletter from "../components/Newsletter";
import SiteFooter from "../components/SiteFooter";

export default function Home() {
  const sectionStyle: React.CSSProperties = {
    padding: "60px 20px",
    maxWidth: "1400px",
    margin: "0 auto",
  };

  const Title = ({ text }: { text: string }) => (
    <div style={{ marginBottom: "35px" }}>
      <h2
        style={{
          fontSize: "42px",
          fontWeight: 800,
          margin: 0,
        }}
      >
        {text}
      </h2>
    </div>
  );

  return (
    <>
      {/* NAVBAR */}
      <Navbar />

      {/* HERO */}
      <Hero />

      {/* MAIN CONTENT */}
      <main style={{ width: "100%", overflow: "hidden" }}>
        
        {/* FEATURED MAGAZINES */}
        <section style={sectionStyle}>
          <Title text="Featured Magazines" />
          <FeaturedMagazines limit={6} />
        </section>

        {/* LATEST ARTICLES */}
        <section style={sectionStyle}>
          <Title text="Latest Articles" />
          <LatestArticles limit={6} />
        </section>

        {/* LATEST BLOGS */}
        <section style={sectionStyle}>
          <Title text="Latest Blogs" />
          <LatestBlogs limit={6} />
        </section>

        {/* LATEST NEWS */}
        <section style={sectionStyle}>
          <Title text="Latest News" />
          <LatestNews limit={6} />
        </section>

        {/* NEWSLETTER */}
        <section style={{ ...sectionStyle, paddingBottom: "100px" }}>
          <Newsletter />
        </section>

      </main>

      {/* FOOTER */}
      <SiteFooter />
    </>
  );
}   