import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "../styles/Features.module.css";

const FEATURES = [
  {
    tag: "Authentication",
    icon: "🔐",
    title: "Universal Login via Auth0",
    desc: "Industry-standard OIDC/OAuth 2.0 flow handled entirely by Auth0. Support for social logins (Google, GitHub, Microsoft), database connections, and enterprise SSO — all with one integration.",
    points: ["PKCE-secured authorization code flow", "Automatic token rotation and refresh", "MFA support via Auth0 Guardian", "Breached password detection"],
  },
  {
    tag: "Authorization",
    icon: "🛡️",
    title: "Route-level protection",
    desc: "Next.js middleware and withPageAuthRequired() guard every protected page server-side, so unauthenticated requests never reach your application logic.",
    points: ["Server-side session validation on every request", "Automatic redirect to login", "Role-based access control ready", "Zero-trust default posture"],
    reverse: true,
  },
  {
    tag: "User Experience",
    icon: "👤",
    title: "Rich user profiles",
    desc: "Display verified identity data directly from the Auth0 ID token. Name, email, avatar, provider, and all standard OIDC claims rendered beautifully — no extra API calls needed.",
    points: ["Profile picture from identity provider", "Email verification status", "Token claims inspector", "Multi-provider attribution"],
  },
  {
    tag: "Operations",
    icon: "📊",
    title: "Live dashboard & metrics",
    desc: "A real-time executive dashboard gives you instant visibility into authentication activity, service health, and platform KPIs — all secured behind login.",
    points: ["5 live KPI cards", "Service health table with status pills", "Alert feed with severity levels", "Quick-action shortcuts"],
    reverse: true,
  },
];

export default function Features() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />

      <main className={styles.main}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.eyebrow}>Platform Features</span>
          <h1>Built for production from day one</h1>
          <p>Everything you need to ship a secure, polished authentication experience — without the boilerplate.</p>
        </div>

        {/* Deep features */}
        <div className="container">
          <div className={styles.deepSection}>
            {FEATURES.map(f => (
              <div key={f.title} className={`${styles.deepFeature} ${f.reverse ? styles.reverse : ""}`}>
                <div className={styles.deepVisual}>
                  <div className={styles.deepVisualBox}>{f.icon}</div>
                </div>
                <div className={styles.deepContent}>
                  <span className={styles.featureTag}>{f.tag}</span>
                  <h2>{f.title}</h2>
                  <p>{f.desc}</p>
                  <ul className={styles.points}>
                    {f.points.map(pt => (
                      <li key={pt}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <circle cx="7" cy="7" r="7" fill="var(--blue-50)"/>
                          <path d="M4 7l2 2 4-4" stroke="var(--blue-600)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className={styles.cta}>
          <div className="container">
            <h2>Ready to ship?</h2>
            <p>Clone the repo, add your Auth0 credentials, deploy to Vercel.</p>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/api/auth/login?returnTo=/dashboard" className="btn btn-primary">
              Sign in and explore →
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
