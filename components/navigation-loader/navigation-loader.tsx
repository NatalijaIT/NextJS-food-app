'use client';

import { useEffect, useState } from 'react';
import styles from './navigation-loader.module.css';

export default function NavigationLoader() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
    }, []);

    if (!loading) return null;

    return (
        <div className={styles.overlay} role="status" aria-label="Loading page">
            <div className={styles.spinner} aria-hidden="true" />
        </div>
    );
}
