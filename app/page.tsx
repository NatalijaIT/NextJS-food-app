import { Metadata } from 'next';
import HomeContent from './home-content';

export const metadata: Metadata = {
  title: 'Home | Dishes Around the World',
  description: 'Taste and share food from all over the world. Discover recipes and connect with food lovers.',
};

export default function Home() {
  return <HomeContent />;
}
