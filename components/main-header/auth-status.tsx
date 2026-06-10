'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import styles from './auth-status.module.css';

export default function AuthStatus() {
    const { data: session, status } = useSession();

    if (status === 'loading') {
        return (
            <div className={styles.loading} role="status" aria-label="Loading authentication status">
                <span aria-hidden="true">...</span>
            </div>
        );
    }

    if (session?.user) {
        return (
            <div className={styles.authStatus}>
                <button
                    className={styles.signOutBtn}
                    onClick={() => signOut({ callbackUrl: '/' })}
                >
                    Sign Out
                </button>
            </div>
        );
    }

    return (
        <div className={styles.authStatus}>
            <Link href="/auth/login" className={styles.loginLink}>Login</Link>
            <Link href="/auth/register" className={styles.registerLink}>Register</Link>
        </div>
    );
}
