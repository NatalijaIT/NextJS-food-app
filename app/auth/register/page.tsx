import { Metadata } from 'next';
import RegisterContent from './register-content';

export const metadata: Metadata = {
    title: 'Register | Dishes Around the World',
    description: 'Create an account to share your favorite meals from around the world.',
};

export default function RegisterPage() {
    return <RegisterContent />;
}
