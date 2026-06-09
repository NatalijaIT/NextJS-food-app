import { Metadata } from 'next';
import { getMealBySlug } from '@/lib/services/meals.service';
import MealDetailsContent from './meal-details-content';

type Props = {
    params: Promise<{ order_slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { order_slug } = await params;
    const meal = await getMealBySlug(order_slug);

    if (!meal) {
        return {
            title: 'Meal Not Found | Dishes Around the World',
        };
    }

    return {
        title: `${meal.title} | Dishes Around the World`,
        description: meal.summary,
    };
}

export default function MealDetailsPage() {
    return <MealDetailsContent />;
}
