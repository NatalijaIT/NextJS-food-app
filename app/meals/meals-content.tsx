'use client';

import MealsGrid from "@/components/meals/meals-grid";
import Link from "next/link";
import { useMeals } from "@/hooks/meals/useMeals";
import Loader from "@/components/loader/loader";
import classes from "./page.module.css";

export default function MealsContent() {
    const { data: meals, isLoading, error } = useMeals();

    return (
        <>
            <div className={classes.header}>
                <h1>
                    Delicious meals, created,{' '}
                    <span className={classes.highlight}>by you</span>
                </h1>
                <p>Choose your favourite recipe and cook it yourself. It&apos;s easy and fun!</p>
                <p className={classes.cta}>
                    <Link href="/meals/share">Share your favourite recipe</Link>
                </p>
            </div>
            <main id="main-content" className={classes.main}>
                {isLoading && <Loader message="Fetching meals..." />}
                {error && <p className={classes.error} role="alert">Failed to load meals.</p>}
                {meals && <MealsGrid meals={meals} />}
            </main>
        </>
    );
}
