'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { useDeleteMeal } from '@/hooks/meals/useDeleteMeal';
import classes from './meal-item.module.css';

interface MealItemProps {
    title: string;
    slug: string;
    image: string;
    summary: string;
    creator: string;
    creator_email: string;
}

export default function MealItem({ title, slug, image, summary, creator, creator_email }: MealItemProps) {
    const router = useRouter();
    const { data: session } = useSession();
    const deleteMeal = useDeleteMeal();

    const isCreator = session?.user?.email === creator_email;

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this meal?')) return;

        try {
            await deleteMeal.mutateAsync(slug);
            router.refresh();
        } catch (error) {
            console.error('Failed to delete meal:', error);
        }
    };

    return (
        <article className={classes.meal} aria-label={title} aria-busy={deleteMeal.isPending}>
            <header>
                <div className={classes.image}>
                    <Image src={`${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${image}`} alt={title} fill />
                </div>
                <div className={classes.headerText}>
                    <h2>{title}</h2>
                    <p>by {creator}</p>
                </div>
            </header>
            <div className={classes.content}>
                <p className={classes.summary}>{summary}</p>
                <div className={classes.actions}>
                    <Link href={`/meals/${slug}`} aria-label={`View details of ${title}`}>View Details</Link>
                    {isCreator && (
                        <button
                            className={classes.deleteBtn}
                            onClick={handleDelete}
                            disabled={deleteMeal.isPending}
                            aria-label={`Delete ${title}`}
                        >
                            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                <line x1="10" y1="11" x2="10" y2="17" />
                                <line x1="14" y1="11" x2="14" y2="17" />
                            </svg>
                            Delete
                        </button>
                    )}
                </div>
            </div>
        </article>
    );
}
