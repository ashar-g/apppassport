import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "../styles/Home.module.css";

const FEATURES = [
  { icon: "🔐", title: "Enterprise SSO", desc: "Auth0-powered login supporting OAuth 2.0, OIDC, SAML, and social providers." },
  { icon: "📊", title: "Live Dashboard", desc: "Real-time metrics and service health monitoring at a glance." },
  { icon: "👤", title: "User Profiles", desc: "Rich user profiles synced directly from your identity provider." },
  { icon: "🛡️", title: "Zero Trust",   desc: "Every request authenticated. No implicit trust, ever." },
  { icon: "⚡", title: "Edge-Ready",   desc: "Deployed globally on Vercel Edge Network for sub-100ms response." },
  { icon: "🔄", title: "Auto Refresh", desc: "Silent token refresh keeps sessions alive without interrupting users." },
];

export default function Home() {
  const { user, isLoading } = useUser();

  return (
    <div className={styles.page}>
      <Navbar />

      <main className={styles.main}>
        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.heroInner + " fadeUp"}>
            <div className={styles.heroBadge}>
              <span className={styles.badgeDot} />
              Now with Auth0 Universal Login
            </div>
            <h1 className={styles.heroTitle}>
              Intelligence built in,<br />not bolted on.
            </h1>
            <p className={styles.heroSub}>
              AppPassport gives your team a secure, beautiful portal — SSO, user profiles,
              and a live dashboard — ready to deploy in minutes.
            </p>
            <div className={styles.heroCta}>
              {user ? (
                <>
                  <Link href="/dashboard" className="btn btn-primary">Go to Dashboard →</Link>
                  <Link href="/profile" className="btn btn-secondary">My Profile</Link>
                </>
              ) : (
                <>
                  {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                  <a href="/api/auth/login?returnTo=/dashboard" className="btn btn-primary">
                    Get started free
                  </a>
                  <Link href="/features" className="btn btn-secondary">See features</Link>
                </>
              )}
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.heroCard}>
              <div className={styles.cardHeader}>
                <span className={styles.cardDot} style={{ background: "#ef4444" }} />
                <span className={styles.cardDot} style={{ background: "#f59e0b" }} />
                <span className={styles.cardDot} style={{ background: "#05b169" }} />
                <span className={styles.cardTitle}>AppPassport Dashboard</span>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.statRow}>
                  {[["99.9%", "Uptime"], ["12ms", "P95 Latency"], ["2.4k", "Auth / day"]].map(([val, label]) => (
                    <div key={label} className={styles.statItem}>
                      <span className={styles.statVal}>{val}</span>
                      <span className={styles.statLabel}>{label}</span>
                    </div>
                  ))}
                </div>
                <div className={styles.userRow}>
                  <div className={styles.fakeAvatar}>JD</div>
                  <div>
                    <div className={styles.fakeName}>Jane Doe</div>
                    <div className={styles.fakeEmail}>jane@company.com</div>
                  </div>
                  <div className={styles.activePill}>● Active</div>
                </div>
                <div className={styles.progressSection}>
                  {[["API Quota", 72], ["Storage", 41], ["Seats", 88]].map(([label, pct]) => (
                    <div key={label} className={styles.progressItem}>
                      <div className={styles.progressHeader}>
                        <span>{label}</span><span>{pct}%</span>
                      </div>
                      <div className={styles.progressTrack}>
                        <div className={styles.progressFill} style={{ width: `${pct}%`, opacity: pct > 80 ? 1 : 0.7 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features grid */}
        <section className={styles.featuresSection}>
          <div className="container">
            <div className={styles.sectionHead}>
              <span className={styles.eyebrow}>Why AppPassport</span>
              <h2>Everything your team needs</h2>
              <p>A complete, production-ready authentication and user management platform.</p>
            </div>
            <div className={styles.featureGrid}>
              {FEATURES.map(f => (
                <div key={f.title} className={styles.featureCard}>
                  <div className={styles.featureIcon}>{f.icon}</div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA banner */}
        <section className={styles.ctaBanner}>
          <div className="container">
            <div className={styles.ctaInner}>
              <div>
                <h2>Ready to get started?</h2>
                <p>Connect your Auth0 tenant and deploy in under 5 minutes.</p>
              </div>
              {user ? (
                <Link href="/dashboard" className="btn btn-primary">Open Dashboard →</Link>
              ) : (
                {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                <a href="/api/auth/login?returnTo=/dashboard" className="btn btn-primary">Sign in with Auth0</a>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
