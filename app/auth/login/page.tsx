import { Suspense } from 'react';
import { Metadata } from 'next';
import LoginContent from './login-content';

export const metadata: Metadata = {
    title: 'Login | Taste the World',
    description: 'Sign in to share your favorite meals from around the world.',
};

export default function LoginPage() {
    return (
        <Suspense>
            <LoginContent />
        </Suspense>
    );
}
