import Link from "next/link";
import Image from "next/image";

import MainHeaderBackground from "./main-header-background";
import AuthStatus from "./auth-status";
import logoImg from "@/assets/logo.png";
import styles from "./main-header.module.css";

export default function MainHeader() {
    return (
        <>
            <MainHeaderBackground />
            <header className={styles.header}>
                <div className={styles.inner}>
                    <Link href="/" className={styles.logo} aria-label="Taste the World – home">
                        <Image src={logoImg} alt="" priority />
                        <span className={styles.logoText}>Taste the World</span>
                    </Link>
                    <div className={styles.authArea}>
                        <AuthStatus />
                    </div>
                </div>
            </header>
        </>
    )
}
