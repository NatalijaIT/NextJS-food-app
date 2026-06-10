'use client';

import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { useRegister } from '@/hooks/auth/useRegister';
import classes from './page.module.css';

interface RegisterFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export default function RegisterContent() {
    const router = useRouter();
    const registerMutation = useRegister();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterFormData>({
        defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
    });

    const onSubmit = async (data: RegisterFormData) => {
        try {
            await registerMutation.mutateAsync({
                name: data.name,
                email: data.email,
                password: data.password,
            });

            const result = await signIn('credentials', {
                email: data.email,
                password: data.password,
                redirect: false,
            });

            if (!result?.error) {
                router.push('/meals/share');
                router.refresh();
            }
        } catch {
            // Error is handled by registerMutation.error
        }
    };

    return (
        <>
            <div className={classes.header}>
                <h1 id="register-heading">
                    <span className={classes.highlight}>Register</span>
                </h1>
                <p>Create an account to share your favorite meals.</p>
            </div>
            <main id="main-content" className={classes.main}>
                <form
                    className={classes.form}
                    onSubmit={handleSubmit(onSubmit)}
                    aria-labelledby="register-heading"
                    noValidate
                >
                    <p>
                        <label htmlFor="name">Your Name</label>
                        <input
                            type="text"
                            id="name"
                            autoComplete="name"
                            aria-required="true"
                            aria-invalid={!!errors.name}
                            aria-describedby={errors.name ? 'name-error' : undefined}
                            {...register('name', { required: 'Name is required' })}
                        />
                        {errors.name && (
                            <span id="name-error" className={classes.error} role="alert">
                                {errors.name.message}
                            </span>
                        )}
                    </p>
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
                            autoComplete="new-password"
                            aria-required="true"
                            aria-invalid={!!errors.password}
                            aria-describedby={`password-hint${errors.password ? ' password-error' : ''}`}
                            {...register('password', {
                                required: 'Password is required',
                                minLength: { value: 6, message: 'Minimum 6 characters' },
                            })}
                        />
                        <span id="password-hint" className={classes.hint}>Minimum 6 characters</span>
                        {errors.password && (
                            <span id="password-error" className={classes.error} role="alert">
                                {errors.password.message}
                            </span>
                        )}
                    </p>
                    <p>
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            autoComplete="new-password"
                            aria-required="true"
                            aria-invalid={!!errors.confirmPassword}
                            aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
                            {...register('confirmPassword', {
                                required: 'Please confirm your password',
                                validate: (value) =>
                                    value === watch('password') || 'Passwords do not match',
                            })}
                        />
                        {errors.confirmPassword && (
                            <span id="confirm-password-error" className={classes.error} role="alert">
                                {errors.confirmPassword.message}
                            </span>
                        )}
                    </p>
                    {registerMutation.error && (
                        <p className={classes.error} role="alert">{registerMutation.error.message}</p>
                    )}
                    <p className={classes.actions}>
                        <button type="submit" disabled={registerMutation.isPending} aria-busy={registerMutation.isPending}>
                            {registerMutation.isPending ? 'Creating account...' : 'Register'}
                        </button>
                    </p>
                    <p className={classes.switchLink}>
                        Already have an account?{' '}
                        <Link href="/auth/login">Login here</Link>
                    </p>
                </form>
            </main>
        </>
    );
}
