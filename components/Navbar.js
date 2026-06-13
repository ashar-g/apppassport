import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!userMenuOpen) return;
    const handler = () => setUserMenuOpen(false);
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [userMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [router.pathname]);

  const navLinks = [
    { href: "/",          label: "Home",      protected: false },
    { href: "/features",  label: "Features",  protected: false },
    { href: "/dashboard", label: "Dashboard", protected: true  },
    { href: "/profile",   label: "Profile",   protected: true  },
  ];

  const initials = user
    ? (
        [user.name?.split(" ")[0]?.[0], user.name?.split(" ")[1]?.[0]]
          .filter(Boolean).join("") ||
        user.email?.[0] ||
        "U"
      ).toUpperCase()
    : "";

  const displayName =
    user?.name?.split(" ")[0] ||
    user?.nickname ||
    user?.email?.split("@")[0] ||
    "Account";

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.inner}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <div className={styles.logoMark}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8l3-3 3 3 3-3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 12l3-3 3 3 3-3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
            </svg>
          </div>
          <span>AppPassport</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className={styles.links}>
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.protected && !user ? "/api/auth/login" : link.href}
              className={`${styles.link} ${router.pathname === link.href ? styles.active : ""}`}
            >
              {link.label}
              {link.protected && !user && !isLoading && (
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none" className={styles.lock}>
                  <rect x="2" y="5.5" width="8" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                  <path d="M4 5.5V4a2 2 0 014 0v1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
              )}
            </Link>
          ))}
        </div>

        {/* Desktop Auth Area */}
        <div className={styles.actions}>
          {isLoading ? (
            <div className={styles.loadingDot} />
          ) : user ? (
            <div
              className={styles.userArea}
              onClick={e => { e.stopPropagation(); setUserMenuOpen(o => !o); }}
            >
              {user.picture ? (
                <img src={user.picture} alt={displayName} className={styles.avatarImg} />
              ) : (
                <div className={styles.avatar}>{initials}</div>
              )}
              <span className={styles.userName}>{displayName}</span>
              <svg
                width="12" height="12" viewBox="0 0 12 12" fill="none"
                style={{ transform: userMenuOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}
              >
                <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>

              {userMenuOpen && (
                <div className={styles.userMenu} onClick={e => e.stopPropagation()}>
                  <div className={styles.userMenuHeader}>
                    {user.picture ? (
                      <img src={user.picture} alt="" className={styles.menuAvatarImg} />
                    ) : (
                      <div className={styles.menuAvatar}>{initials}</div>
                    )}
                    <div>
                      <span className={styles.menuName}>{user.name || displayName}</span>
                      <span className={styles.menuEmail}>{user.email}</span>
                    </div>
                  </div>
                  <div className={styles.menuDivider} />
                  <Link href="/profile" className={styles.menuItem} onClick={() => setUserMenuOpen(false)}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
                      <path d="M2 12c0-2.761 2.239-5 5-5s5 2.239 5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                    My Profile
                  </Link>
                  <Link href="/dashboard" className={styles.menuItem} onClick={() => setUserMenuOpen(false)}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                      <rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                      <rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                      <rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                    </svg>
                    Dashboard
                  </Link>
                  <div className={styles.menuDivider} />
                  <a href="/api/auth/logout" className={styles.menuItemDanger}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M5 7h7M9 5l3 2-3 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M5 2H2a1 1 0 00-1 1v8a1 1 0 001 1h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                    Sign out
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.authBtns}>
              <a href="/api/auth/login" className="btn btn-ghost btn-sm">Sign in</a>
              <a href="/api/auth/login?returnTo=/dashboard" className="btn btn-primary btn-sm">Get started</a>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className={styles.mobileBtn} onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            {mobileOpen
              ? <><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>
              : <><path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>
            }
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className={styles.mobileMenu}>
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.protected && !user ? "/api/auth/login" : link.href}
              className={`${styles.mobileLink} ${router.pathname === link.href ? styles.mobileLinkActive : ""}`}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className={styles.mobileDivider} />
          {user
            ? <a href="/api/auth/logout" className="btn btn-secondary" style={{ width: "100%", justifyContent: "center" }}>Sign out</a>
            : <a href="/api/auth/login?returnTo=/dashboard" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>Sign in with Auth0</a>
          }
        </div>
      )}
    </nav>
  );
}
