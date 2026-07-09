import Link from 'next/link';
import styles from './footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.inner}>
                <nav className={styles.nav} aria-label="Footer navigation">
                    <Link href="/">Home</Link>
                    <Link href="/meals">Meals</Link>
                    <Link href="/meals/share">Share a Meal</Link>
                </nav>
                <p className={styles.copy}>
                    &copy; {new Date().getFullYear()} Taste the World. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
