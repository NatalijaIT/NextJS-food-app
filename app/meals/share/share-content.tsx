'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

import { useCreateMeal } from '@/hooks/meals/useCreateMeal';
import { useUpdateMeal } from '@/hooks/meals/useUpdateMeal';
import ImagePicker from '@/components/meals/image-picker';
import { Meal, MealFormData } from '@/types/meal';

import classes from './page.module.css';

interface ShareContentProps {
    meal?: Meal;
}

export default function ShareContent({ meal }: ShareContentProps) {
    const router = useRouter();
    const { data: session } = useSession();
    const createMeal = useCreateMeal();
    const updateMeal = useUpdateMeal();
    const isEditMode = !!meal;
    const mutation = isEditMode ? updateMeal : createMeal;

    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors, isDirty }
    } = useForm<MealFormData>({
        values: {
            name: meal?.creator ?? session?.user?.name ?? '',
            email: meal?.creator_email ?? session?.user?.email ?? '',
            title: meal?.title ?? '',
            summary: meal?.summary ?? '',
            instructions: meal?.instructions ?? '',
            image: null,
        },
    });

    const UNSAVED_CHANGES_MSG = 'You have unsaved changes. Are you sure you want to leave?';

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty) e.preventDefault();
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isDirty]);

    const handleBackClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (isDirty && !confirm(UNSAVED_CHANGES_MSG)) {
            e.preventDefault();
        }
    };

    const onSubmit = async (data: MealFormData) => {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('summary', data.summary);
        formData.append('instructions', data.instructions);
        if (data.image) formData.append('image', data.image);

        try {
            if (isEditMode) {
                await updateMeal.mutateAsync({ slug: meal.slug, formData });
                router.push(`/meals/${meal.slug}`);
            } else {
                formData.append('name', data.name);
                formData.append('email', data.email);
                await createMeal.mutateAsync(formData);
                router.push('/meals');
            }
        } catch (error) {
            console.error('Failed to submit meal:', error);
        }
    };

    return (
        <>
            <div className={classes.backNav}>
                <Link
                    href={isEditMode ? `/meals/${meal.slug}` : '/meals'}
                    className={classes.backLink}
                    aria-label={isEditMode ? `Back to ${meal.title}` : 'Back to meals list'}
                    onClick={handleBackClick}
                >
                    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12" />
                        <polyline points="12 19 5 12 12 5" />
                    </svg>
                    {isEditMode ? 'Back to meal' : 'Back to meals'}
                </Link>
            </div>
            <div className={classes.header}>
                <h1 id="form-heading">
                    {isEditMode
                        ? <>Edit <span className={classes.highlight}>{meal.title}</span></>
                        : <>Share your <span className={classes.highlight}>favorite meal</span></>
                    }
                </h1>
                {!isEditMode && <p>Or any other meal you feel needs sharing!</p>}
            </div>
            <main id="main-content" className={classes.main}>
                <form className={classes.form} onSubmit={handleSubmit(onSubmit)} aria-labelledby="form-heading" noValidate>
                    {!isEditMode && (
                        <div className={classes.row}>
                            <p>
                                <label htmlFor="name">Your name</label>
                                <input
                                    type="text"
                                    id="name"
                                    readOnly={!!session?.user?.name}
                                    aria-required="true"
                                    aria-invalid={!!errors.name}
                                    aria-describedby={errors.name ? 'name-error' : undefined}
                                    {...register('name', { required: 'Name is required' })}
                                />
                                {errors.name && <span id="name-error" className={classes.error} role="alert">{errors.name.message}</span>}
                            </p>
                            <p>
                                <label htmlFor="email">Your email</label>
                                <input
                                    type="email"
                                    id="email"
                                    readOnly={!!session?.user?.email}
                                    aria-required="true"
                                    aria-invalid={!!errors.email}
                                    aria-describedby={errors.email ? 'email-error' : undefined}
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Invalid email address'
                                        }
                                    })}
                                />
                                {errors.email && <span id="email-error" className={classes.error} role="alert">{errors.email.message}</span>}
                            </p>
                        </div>
                    )}
                    <p>
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            title={watch('title') || undefined}
                            aria-required="true"
                            aria-invalid={!!errors.title}
                            aria-describedby={errors.title ? 'title-error' : undefined}
                            {...register('title', { required: 'Title is required' })}
                        />
                        {errors.title && <span id="title-error" className={classes.error} role="alert">{errors.title.message}</span>}
                    </p>
                    <p>
                        <label htmlFor="summary">Short Summary</label>
                        <input
                            type="text"
                            id="summary"
                            title={watch('summary') || undefined}
                            aria-required="true"
                            aria-invalid={!!errors.summary}
                            aria-describedby={errors.summary ? 'summary-error' : undefined}
                            {...register('summary', { required: 'Summary is required' })}
                        />
                        {errors.summary && <span id="summary-error" className={classes.error} role="alert">{errors.summary.message}</span>}
                    </p>
                    <p>
                        <label htmlFor="instructions">Instructions</label>
                        <textarea
                            id="instructions"
                            rows={10}
                            aria-required="true"
                            aria-invalid={!!errors.instructions}
                            aria-describedby={errors.instructions ? 'instructions-error' : undefined}
                            {...register('instructions', { required: 'Instructions are required' })}
                        ></textarea>
                        {errors.instructions && <span id="instructions-error" className={classes.error} role="alert">{errors.instructions.message}</span>}
                    </p>

                    <Controller
                        name="image"
                        control={control}
                        rules={{ required: isEditMode ? false : 'Image is required' }}
                        render={({ field: { onChange }, fieldState: { error } }) => (
                            <ImagePicker
                                label={isEditMode ? 'New image (optional)' : 'Your image'}
                                name="image"
                                onChange={onChange}
                                error={error?.message}
                            />
                        )}
                    />

                    {mutation.error && (
                        <p className={classes.error} role="alert">{mutation.error.message}</p>
                    )}

                    <p className={classes.actions}>
                        <button type="submit" disabled={mutation.isPending} aria-busy={mutation.isPending}>
                            {mutation.isPending
                                ? (isEditMode ? 'Saving...' : 'Submitting...')
                                : (isEditMode ? 'Save Changes' : 'Share Meal')
                            }
                        </button>
                    </p>
                </form>
            </main>
        </>
    );
}
