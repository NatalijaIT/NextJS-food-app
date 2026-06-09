import { Metadata } from 'next';
import MealsContent from './meals-content';

export const metadata: Metadata = {
    title: 'All Meals | Dishes Around the World',
    description: 'Browse delicious meals from around the world shared by our food-loving community.',
};

export default function MealPage() {
    return <MealsContent />;
}
