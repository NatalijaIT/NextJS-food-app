import { Metadata } from 'next';
import ShareContent from './share-content';

export const metadata: Metadata = {
    title: 'Share a Meal | Taste the World',
    description: 'Share your favorite meal recipe with the community.',
};

export default function ShareMealPage() {
    return <ShareContent />;
}
