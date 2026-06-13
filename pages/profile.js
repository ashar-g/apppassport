import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "../styles/Profile.module.css";

export default function Profile({ user, rawClaims }) {
  const initials = (
    [user.name?.split(" ")[0]?.[0], user.name?.split(" ")[1]?.[0]]
      .filter(Boolean).join("") ||
    user.email?.[0] ||
    "U"
  ).toUpperCase();

  const displayName = user.name || user.nickname || user.email?.split("@")[0] || "User";

  // Format the sub claim for display
  const provider = user.sub?.split("|")[0] || "auth0";
  const providerLabels = {
    auth0: "Auth0 Database",
    google: "Google",
    github: "GitHub",
    facebook: "Facebook",
    twitter: "Twitter",
    microsoft: "Microsoft",
    apple: "Apple",
    okta: "Okta",
  };
  const providerLabel = providerLabels[provider] || provider;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />

      <main className={styles.main}>
        <div className="container">
          <div className={styles.pageHead}>
            <span className={styles.eyebrow}>Account</span>
            <h1 className={styles.pageTitle}>My Profile</h1>
          </div>

          <div className={styles.layout}>
            {/* Left: identity card */}
            <div>
              <div className={styles.identityCard}>
                <div className={styles.avatarWrap}>
                  {user.picture ? (
                    <img src={user.picture} alt={displayName} className={styles.avatarImg} />
                  ) : (
                    <div className={styles.avatar}>{initials}</div>
                  )}
                  <div className={styles.verifiedBadge}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>

                <div className={styles.identityInfo}>
                  <h2 className={styles.identityName}>{displayName}</h2>
                  <p className={styles.identityEmail}>{user.email}</p>
                  <div className={styles.badges}>
                    <span className={styles.badge} style={{ background: "var(--green-bg)", color: "var(--green)" }}>
                      ● Verified
                    </span>
                    <span className={styles.badge} style={{ background: "var(--blue-50)", color: "var(--blue-600)" }}>
                      {providerLabel}
                    </span>
                  </div>
                </div>

                <div className={styles.identityActions}>
                  <a href="/api/auth/logout" className="btn btn-secondary btn-sm">Sign out</a>
                </div>
              </div>

              {/* Info fields */}
              <div className={styles.card}>
                <div className={styles.cardHead}><h3>Account Information</h3></div>
                <div className={styles.fieldList}>
                  {[
                    { label: "Full Name",     value: user.name     || "—" },
                    { label: "Email Address", value: user.email    || "—" },
                    { label: "Nickname",      value: user.nickname || "—" },
                    { label: "Email Verified",value: user.email_verified ? "Yes ✓" : "No" },
                    { label: "Auth Provider", value: providerLabel },
                    { label: "Locale",        value: user.locale   || "—" },
                  ].map(f => (
                    <div key={f.label} className={styles.field}>
                      <span className={styles.fieldLabel}>{f.label}</span>
                      <span className={styles.fieldValue}>{f.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: claims + security */}
            <div className={styles.rightCol}>
              {/* Auth0 Token Claims */}
              <div className={styles.card}>
                <div className={styles.cardHead}>
                  <h3>Token Claims</h3>
                  <span className={styles.pill}>JWT</span>
                </div>
                <div className={styles.claimsBox}>
                  <pre className={styles.claimsPre}>
                    {JSON.stringify(rawClaims, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Session info */}
              <div className={styles.card}>
                <div className={styles.cardHead}><h3>Session</h3></div>
                <div className={styles.sessionGrid}>
                  {[
                    { icon: "🌐", label: "Provider",  value: providerLabel },
                    { icon: "🔐", label: "Scope",     value: "openid profile email" },
                    { icon: "✅", label: "Status",    value: "Active" },
                    { icon: "🛡️", label: "Protocol",  value: "OIDC / OAuth 2.0" },
                  ].map(item => (
                    <div key={item.label} className={styles.sessionItem}>
                      <span className={styles.sessionIcon}>{item.icon}</span>
                      <div>
                        <span className={styles.sessionLabel}>{item.label}</span>
                        <span className={styles.sessionValue}>{item.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const session = await getSession(ctx.req, ctx.res);
    const u = session.user;

    // Safe subset for display
    const user = {
      name:           u.name           || null,
      email:          u.email          || null,
      email_verified: u.email_verified ?? null,
      picture:        u.picture        || null,
      nickname:       u.nickname       || null,
      locale:         u.locale         || null,
      sub:            u.sub            || null,
    };

    // All claims minus sensitive internal ones
    const exclude = new Set(["__raw"]);
    const rawClaims = Object.fromEntries(
      Object.entries(u).filter(([k]) => !exclude.has(k))
    );

    return { props: { user, rawClaims } };
  },
});
