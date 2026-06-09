import { ReactNode } from 'react';
import MainHeader from '@/components/main-header/main-header';
import { Providers } from './providers';
import './globals.css';

export const metadata = {
  title: 'Dishes Around the World',
  description: 'Delicious meals, shared by a food-loving community.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Providers>
          <a href="#main-content" className="skip-link">Skip to main content</a>
          <div id="modal"></div>
          <MainHeader />
          {children}
        </Providers>
      </body>
    </html >
  );
}
