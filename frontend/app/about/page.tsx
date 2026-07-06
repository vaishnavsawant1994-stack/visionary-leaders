import "../../styles/about.css";

export default function AboutPage() {
  return (
    <>
      {/* HERO SECTION */}
      <section className="about-hero">
        <div className="about-hero-overlay"></div>

        <div className="about-hero-content">
          <div className="about-hero-badge">
            About • Vision • Story
          </div>

          <h1 className="about-hero-title">
            Building the Future of{" "}
            <span className="gradient-text">
              Digital Leadership Media
            </span>
          </h1>

          <p className="about-hero-subtitle theme-text-secondary">
            Visionary Leaders is a premium digital magazine focused on
            business innovation, entrepreneurship, technology transformation,
            and global leadership stories that shape tomorrow.
          </p>

          <div className="about-hero-stats">
            <div className="about-stat">
              <h3 className="theme-text-primary">100+</h3>
              <p className="theme-text-secondary">Stories</p>
            </div>

            <div className="about-stat">
              <h3 className="theme-text-primary">50+</h3>
              <p className="theme-text-secondary">Leaders</p>
            </div>

            <div className="about-stat">
              <h3 className="theme-text-primary">10+</h3>
              <p className="theme-text-secondary">Industries</p>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="about-container">
        <div className="about-card">
          <h2 className="theme-text-primary">Our Mission</h2>
          <p className="theme-text-secondary">
            To highlight visionary entrepreneurs, innovators, and leaders making
            a global impact through ideas, execution, and transformation.
          </p>
        </div>

        <div className="about-card">
          <h2 className="theme-text-primary">Our Vision</h2>
          <p className="theme-text-secondary">
            To become a globally trusted digital publication showcasing
            leadership, innovation, and future-driven business stories.
          </p>
        </div>

        <div className="about-card">
          <h2 className="theme-text-primary">What We Cover</h2>
          <ul className="theme-text-secondary">
            <li>Business Leadership</li>
            <li>Women Entrepreneurs</li>
            <li>Technology & AI Innovation</li>
            <li>Startups & Growth Stories</li>
            <li>Healthcare Transformation</li>
            <li>Global Innovation Trends</li>
          </ul>
        </div>
      </div>
    </>
  );
}