'use client';

import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

import { LoginInput } from '@/types/user';
import classes from './page.module.css';

export default function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/meals/share';
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginInput>({
        defaultValues: { email: '', password: '' },
    });

    const onSubmit = async (data: LoginInput) => {
        setIsLoading(true);
        setError(null);

        const result = await signIn('credentials', {
            email: data.email,
            password: data.password,
            redirect: false,
        });

        setIsLoading(false);

        if (result?.error) {
            setError('Invalid email or password.');
        } else {
            router.push(callbackUrl);
            router.refresh();
        }
    };

    return (
        <>
            <div className={classes.header}>
                <h1 id="login-heading">
                    <span className={classes.highlight}>Login</span>
                </h1>
                <p>Sign in to share your favorite meals.</p>
            </div>
            <main id="main-content" className={classes.main}>
                <form
                    className={classes.form}
                    onSubmit={handleSubmit(onSubmit)}
                    aria-labelledby="login-heading"
                    noValidate
                >
                    <p>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            autoComplete="email"
                            aria-required="true"
                            aria-invalid={!!errors.email}
                            aria-describedby={errors.email ? 'email-error' : undefined}
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Invalid email address',
                                },
                            })}
                        />
                        {errors.email && (
                            <span id="email-error" className={classes.error} role="alert">
                                {errors.email.message}
                            </span>
                        )}
                    </p>
                    <p>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            aria-required="true"
                            aria-invalid={!!errors.password}
                            aria-describedby={errors.password ? 'password-error' : undefined}
                            {...register('password', {
                                required: 'Password is required',
                                minLength: { value: 6, message: 'Minimum 6 characters' },
                            })}
                        />
                        {errors.password && (
                            <span id="password-error" className={classes.error} role="alert">
                                {errors.password.message}
                            </span>
                        )}
                    </p>
                    {error && <p className={classes.error} role="alert">{error}</p>}
                    <p className={classes.actions}>
                        <button type="submit" disabled={isLoading} aria-busy={isLoading}>
                            {isLoading ? 'Signing in...' : 'Login'}
                        </button>
                    </p>
                    <p className={classes.switchLink}>
                        Don&apos;t have an account?{' '}
                        <Link href="/auth/register">Register here</Link>
                    </p>
                </form>
            </main>
        </>
    );
}
