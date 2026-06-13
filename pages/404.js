import Link from "next/link";
import Navbar from "../components/Navbar";
import styles from "../styles/404.module.css";

export default function NotFound() {
  return (
    <div>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.code}>404</div>
        <h1 className={styles.title}>Page not found</h1>
        <p className={styles.desc}>The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <Link href="/" className="btn btn-primary">Go home</Link>
      </main>
    </div>
  );
}
