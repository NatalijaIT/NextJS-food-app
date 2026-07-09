import { ReactNode } from 'react';
import MainHeader from '@/components/main-header/main-header';
import Footer from '@/components/footer/footer';
import NavigationLoader from '@/components/navigation-loader/navigation-loader';
import { Providers } from './providers';
import './globals.css';

export const metadata = {
  title: 'Taste the World',
  description: 'Delicious meals, shared by a food-loving community.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Providers>
          <a href="#main-content" className="skip-link">Skip to main content</a>
          <div id="modal"></div>
          <NavigationLoader />
          <MainHeader />
          {children}
          <Footer />
        </Providers>
      </body>
    </html >
  );
}
