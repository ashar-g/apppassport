import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "../styles/Dashboard.module.css";

const SERVICES = [
  { name: "Auth Service",    status: "healthy",  p95: "11ms",  uptime: "99.99%", rpm: "1,240", errors: "0" },
  { name: "API Gateway",     status: "healthy",  p95: "28ms",  uptime: "99.97%", rpm: "4,810", errors: "3" },
  { name: "User Store",      status: "healthy",  p95: "6ms",   uptime: "100%",   rpm: "980",   errors: "0" },
  { name: "Webhook Service", status: "degraded", p95: "142ms", uptime: "98.4%",  rpm: "220",   errors: "17" },
  { name: "Email Delivery",  status: "healthy",  p95: "54ms",  uptime: "99.91%", rpm: "340",   errors: "1" },
];

const ALERTS = [
  { level: "warn",  icon: "⚠", msg: "Webhook Service p95 latency elevated (142ms)", time: "3 min ago" },
  { level: "info",  icon: "ℹ", msg: "Scheduled maintenance window begins in 4 hours", time: "12 min ago" },
  { level: "good",  icon: "✓", msg: "Auth Service deployment completed successfully", time: "1 hr ago" },
  { level: "warn",  icon: "⚠", msg: "API Gateway error spike — 17 4xx responses/min", time: "2 hr ago" },
];

const STATUS_COLORS = {
  healthy:  { bg: "#ecfdf5", color: "#05b169" },
  degraded: { bg: "#fffbeb", color: "#f59e0b" },
  down:     { bg: "#fef2f2", color: "#ef4444" },
};

export default function Dashboard({ user }) {
  const initials = (
    [user.name?.split(" ")[0]?.[0], user.name?.split(" ")[1]?.[0]]
      .filter(Boolean).join("") ||
    user.email?.[0] ||
    "U"
  ).toUpperCase();

  const displayName =
    user.name?.split(" ")[0] ||
    user.nickname ||
    user.email?.split("@")[0] ||
    "User";

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />

      <main className={styles.main}>
        <div className="container">
          {/* Page header */}
          <div className={styles.pageHead}>
            <div>
              <span className={styles.pageEyebrow}>AppPassport Platform</span>
              <h1 className={styles.pageTitle}>Executive Dashboard</h1>
            </div>
            <div className={styles.headRight}>
              <div className={styles.liveBadge}>
                <span className={styles.liveDot} />
                Live
              </div>
              <div className={styles.userChip}>
                {user.picture ? (
                  <img src={user.picture} alt="" className={styles.userAvatarImg} />
                ) : (
                  <div className={styles.userAvatar}>{initials}</div>
                )}
                <div>
                  <span className={styles.userName}>{displayName}</span>
                  <span className={styles.userEmail}>{user.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* KPI row */}
          <div className={styles.kpiRow}>
            {[
              { label: "Auth / day",       value: "2,410",  sub: "+8.2% vs yesterday",  good: true  },
              { label: "Active Sessions",  value: "147",    sub: "across 3 apps",        good: true  },
              { label: "Global Uptime",    value: "99.94%", sub: "last 30 days",         good: true  },
              { label: "P95 Latency",      value: "28ms",   sub: "⬆ +4ms vs baseline",  good: false },
              { label: "Error Rate",       value: "0.07%",  sub: "below SLA target",     good: true  },
            ].map(kpi => (
              <div key={kpi.label} className={styles.kpiCard}>
                <span className={styles.kpiLabel}>{kpi.label}</span>
                <span className={styles.kpiValue}>{kpi.value}</span>
                <span className={`${styles.kpiSub} ${kpi.good ? styles.good : styles.warn}`}>{kpi.sub}</span>
              </div>
            ))}
          </div>

          {/* Main grid */}
          <div className={styles.grid}>
            {/* Services table */}
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <h2>Service Health</h2>
                <span className={styles.alertBadge}>1 degraded</span>
              </div>
              <div className={styles.table}>
                <div className={styles.tableHead}>
                  <span>Service</span>
                  <span>Status</span>
                  <span>P95</span>
                  <span>Uptime</span>
                  <span>Errors/min</span>
                </div>
                {SERVICES.map(svc => {
                  const sc = STATUS_COLORS[svc.status];
                  return (
                    <div key={svc.name} className={styles.tableRow}>
                      <span className={styles.svcName}>{svc.name}</span>
                      <span>
                        <span className={styles.statusPill} style={{ background: sc.bg, color: sc.color }}>
                          <span className={styles.statusDot} style={{ background: sc.color }} />
                          {svc.status}
                        </span>
                      </span>
                      <span className={svc.status === "degraded" ? styles.warnText : ""}>{svc.p95}</span>
                      <span>{svc.uptime}</span>
                      <span className={parseInt(svc.errors) > 0 ? styles.warn : styles.good}>{svc.errors}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right column */}
            <div className={styles.rightCol}>
              {/* Alerts */}
              <div className={styles.card}>
                <div className={styles.cardHead}>
                  <h2>Recent Alerts</h2>
                </div>
                <div className={styles.alertList}>
                  {ALERTS.map((a, i) => {
                    const colors = { warn: { bg: "#fffbeb", color: "#f59e0b" }, info: { bg: "#eff6ff", color: "#0052ff" }, good: { bg: "#ecfdf5", color: "#05b169" } };
                    const c = colors[a.level];
                    return (
                      <div key={i} className={styles.alertItem}>
                        <div className={styles.alertIcon} style={{ background: c.bg, color: c.color }}>{a.icon}</div>
                        <div className={styles.alertBody}>
                          <p>{a.msg}</p>
                          <span>{a.time}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick actions */}
              <div className={styles.card}>
                <div className={styles.cardHead}><h2>Quick Actions</h2></div>
                <div className={styles.actions}>
                  {[
                    { icon: "🔄", label: "Force token refresh" },
                    { icon: "📋", label: "Copy session token" },
                    { icon: "👥", label: "Manage users" },
                    { icon: "📊", label: "Export metrics" },
                  ].map(a => (
                    <button key={a.label} className={styles.actionBtn}>
                      <span className={styles.actionIcon}>{a.icon}</span>
                      {a.label}
                    </button>
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
    return {
      props: {
        user: {
          name:     session.user.name     || null,
          email:    session.user.email    || null,
          picture:  session.user.picture  || null,
          nickname: session.user.nickname || null,
        },
      },
    };
  },
});
