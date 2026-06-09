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
                <Link href="/" className={styles.logo}>
                    <Image src={logoImg} alt="Main logo" priority />
                    Dishes Around the World
                </Link>
                <nav className={styles.nav} aria-label="Main navigation">
                    <AuthStatus />
                </nav>
            </header>
        </>
    )
}
