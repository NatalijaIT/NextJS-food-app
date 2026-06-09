"use client"
import Link from "next/link";
import classes from "./page.module.css";
import ImageSlideshow from "@/components/images/image-slideshow";
import Loader from "@/components/loader/loader";
import { useMeals } from "@/hooks/meals/useMeals";

export default function HomeContent() {
  const { data: meals, isLoading } = useMeals();

  return (
    <>
      <header className={classes.header}>
        <div className={classes.slideshow}>
          {isLoading ? <Loader /> : <ImageSlideshow meals={meals ?? []} />}
        </div>
        <div>
          <div className={classes.hero}>
            <h1>Dishes Around the World</h1>
            <p>Taste and share food from all over the world.</p>
          </div>
          <div className={classes.cta}>
            <Link href="/meals">Explore Meals</Link>
          </div>
        </div>
      </header>
      <main id="main-content">
        <section className={classes.section}>
          <h2>Why Dishes Around the World?</h2>
          <p>
            Dishes Around the World is built on the idea that food connects people.
            It&apos;s a place where users can share their favorite recipes, discover new cultures through cuisine,
            and feel part of a global community.
          </p>
        </section>
      </main>
    </>
  );
}
