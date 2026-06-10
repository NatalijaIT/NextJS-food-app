# Dishes Around the World

A full-stack Next.js 16 application for sharing and discovering meal recipes from around the world. Users can register, log in, browse meals, share their own recipes with images, and edit or delete recipes they created.

## Features

- **Browse meals** — public gallery of all shared recipes with creator info
- **Meal detail page** — full instructions, image, and creator contact
- **Share a meal** — authenticated users can submit recipes with image upload
- **Edit & delete** — creators can update or remove their own meals
- **Authentication** — email/password registration and login via Auth.js v5
- **Route protection** — `/meals/share` redirects unauthenticated users to login
- **Ownership enforcement** — edit/delete API routes verify the session user is the meal's creator
- **Image slideshow** — home page hero auto-rotates real meal photos from the database
- **Unsaved changes guard** — navigating away from a dirty form shows a confirmation dialog
- **Accessible** — skip link, ARIA labels, `role="alert"` on errors, `prefers-reduced-motion` support, form field validation linked to inputs

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5.9 |
| UI | React 19 |
| Authentication | Auth.js v5 (NextAuth) — JWT, Credentials provider |
| State / Data fetching | TanStack Query v5 |
| Forms | React Hook Form v7 |
| Database | MongoDB 7 |
| Image storage | Cloudflare R2 |
| Password hashing | bcryptjs |
| XSS sanitization | xss |
| URL slugs | slugify |
| Linting | ESLint 8 + next/core-web-vitals |

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance (local or Atlas)
- Cloudflare account with an R2 bucket and a public R2.dev subdomain (or custom domain) enabled

### Installation

```bash
git clone <repository-url>
cd nextjs-ukr-food
npm install
```

### Environment Variables

Create a `.env.local` file in the root:

```env
# MongoDB
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>

# Cloudflare R2 — create an API token at R2 → Manage R2 API Tokens
CLOUDFLARE_R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
CLOUDFLARE_R2_BUCKET_NAME=<bucket-name>
CLOUDFLARE_R2_ACCESS_KEY_ID=your_r2_access_key_id
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_r2_secret_access_key

# Public URL — enable R2.dev subdomain (or custom domain) in the bucket Settings tab
NEXT_PUBLIC_R2_PUBLIC_URL=https://pub-<token>.r2.dev

# Auth.js — generate with: openssl rand -base64 32
AUTH_SECRET=your_auth_secret
```

### Running the App

```bash
npm run dev       # Start development server (http://localhost:3000)
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
npx tsc --noEmit  # Type-check without emitting
```

## Architecture

```
Client Components (React 19 + TanStack Query)
        │
Custom Hooks (hooks/meals/, hooks/auth/)
        │
API Client (lib/api/meals.ts, lib/api/auth.ts)
        │
API Routes (app/api/meals/, app/api/auth/)
        │
Service Layer (lib/services/meals.service.ts, users.service.ts)
        │
MongoDB + Cloudflare R2
```

Authentication sits alongside this flow — Auth.js handles session management via JWT, and the `proxy.ts` middleware protects the `/meals/share` route at the edge.

## Directory Structure

```
nextjs-ukr-food/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts   # Auth.js GET/POST handlers
│   │   │   └── register/route.ts        # POST /api/auth/register
│   │   └── meals/
│   │       ├── route.ts                 # GET /api/meals, POST /api/meals
│   │       └── [slug]/route.ts          # GET, PUT, DELETE /api/meals/:slug
│   ├── auth/
│   │   ├── login/                       # Login page + form
│   │   └── register/                    # Register page + form
│   ├── meals/
│   │   ├── [order_slug]/
│   │   │   ├── edit/page.tsx            # Edit meal page
│   │   │   ├── meal-details-content.tsx # Meal detail client component
│   │   │   └── page.tsx
│   │   ├── share/
│   │   │   ├── share-content.tsx        # Create/edit form (shared)
│   │   │   └── page.tsx
│   │   ├── meals-content.tsx            # Meals list client component
│   │   ├── error.tsx                    # Error boundary
│   │   └── loading-out.tsx
│   ├── home-content.tsx                 # Home page hero + intro
│   ├── layout.tsx                       # Root layout (skip link, Header, Providers)
│   ├── providers.tsx                    # SessionProvider + QueryClientProvider
│   └── not-found.tsx
│
├── components/
│   ├── images/image-slideshow.tsx       # Auto-rotating hero slideshow
│   ├── loader/loader.tsx                # Spinner with ARIA live region
│   ├── main-header/
│   │   ├── main-header.tsx
│   │   ├── main-header-background.tsx   # Decorative SVG wave
│   │   └── auth-status.tsx             # Login/Register links or username + Sign Out
│   ├── meals/
│   │   ├── meals-grid.tsx              # Responsive card grid
│   │   ├── meal-item.tsx               # Card with creator-only delete button
│   │   └── image-picker.tsx            # File input with live preview
│   └── modal-dialog/modal-dialog.tsx
│
├── hooks/
│   ├── auth/useRegister.ts             # useMutation — register user
│   └── meals/
│       ├── useMeals.ts                 # useQuery — all meals
│       ├── useMeal.ts                  # useQuery — single meal by slug
│       ├── useCreateMeal.ts            # useMutation — POST /api/meals
│       ├── useUpdateMeal.ts            # useMutation — PUT /api/meals/:slug
│       └── useDeleteMeal.ts            # useMutation — DELETE /api/meals/:slug
│
├── lib/
│   ├── api/
│   │   ├── meals.ts                    # Client fetch wrappers (CRUD)
│   │   └── auth.ts                     # Client fetch wrapper (register)
│   ├── services/
│   │   ├── meals.service.ts            # MongoDB meal CRUD + R2 image management
│   │   └── users.service.ts            # MongoDB user lookup, create, bcrypt verify
│   ├── utils/s3.ts                     # R2 putObject / deleteObject helpers
│   └── mongodb.ts                      # Cached MongoDB connection
│
├── types/
│   ├── meal.ts                         # Meal, MealFormData, EditMealFormData
│   ├── user.ts                         # User, RegisterInput, LoginInput
│   ├── next-auth.d.ts                  # Session type augmentation (user.id)
│   ├── css.d.ts
│   └── images.d.ts
│
├── auth.ts                             # Auth.js config (Credentials provider, callbacks)
└── proxy.ts                            # Edge middleware — protects /meals/share
```

## Pages & Routes

| Route | Auth required | Description |
|---|---|---|
| `/` | No | Home page — hero slideshow, intro section |
| `/meals` | No | Browse all meals |
| `/meals/[slug]` | No | Meal detail with instructions |
| `/meals/[slug]/edit` | Yes (creator) | Edit a meal |
| `/meals/share` | Yes | Share a new meal |
| `/auth/login` | No | Sign in |
| `/auth/register` | No | Create account |

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/meals` | No | Fetch all meals |
| `POST` | `/api/meals` | No | Create a new meal |
| `GET` | `/api/meals/[slug]` | No | Fetch a single meal |
| `PUT` | `/api/meals/[slug]` | Yes + owner | Update a meal |
| `DELETE` | `/api/meals/[slug]` | Yes + owner | Delete a meal |
| `POST` | `/api/auth/register` | No | Register a new user |
| `GET/POST` | `/api/auth/[...nextauth]` | — | Auth.js session handlers |

### POST /api/meals — Create Meal

Send as `multipart/form-data`:

| Field | Type | Required |
|---|---|---|
| `title` | string | Yes |
| `summary` | string | Yes |
| `instructions` | string | Yes |
| `name` | string | Yes |
| `email` | string | Yes |
| `image` | File (PNG/JPEG) | Yes |

### PUT /api/meals/[slug] — Update Meal

Send as `multipart/form-data` (session must belong to creator):

| Field | Type | Required |
|---|---|---|
| `title` | string | Yes |
| `summary` | string | Yes |
| `instructions` | string | Yes |
| `image` | File (PNG/JPEG) | No |

## Data Models

### Meal

```typescript
interface Meal {
    _id: string;
    title: string;
    slug: string;           // auto-generated from title via slugify
    summary: string;
    instructions: string;   // XSS-sanitized before storage
    creator: string;
    creator_email: string;
    image: string;          // R2 object key
}
```

### User (MongoDB)

```typescript
interface User {
    _id: string;
    name: string;
    email: string;
    password: string;       // bcrypt hash (12 rounds)
    createdAt: Date;
}
```

## Key Implementation Details

### Authentication

Auth.js v5 is configured in `auth.ts` with a Credentials provider. On login the server looks up the user by email, verifies the bcrypt hash, and issues a JWT session. The JWT and session callbacks expose `user.id` to the client session object. The `proxy.ts` middleware (Next.js `matcher`) redirects unauthenticated requests to `/meals/share` to `/auth/login`.

### Ownership Enforcement

The `PUT` and `DELETE` routes on `/api/meals/[slug]` fetch the existing meal, compare `creator_email` against `session.user.email`, and return `403` if they do not match. The edit and delete UI is only rendered for the creator on the client too (via the same comparison in component state).

### Image Upload & Cleanup

1. User selects a file via `ImagePicker`; a `FileReader` generates a local preview
2. On submit, the file is sent in `FormData` to the API route
3. The server generates an R2 object key from the meal slug and uploads via `putObject`
4. On meal update with a new image, the old R2 object is deleted before the new one is uploaded
5. On meal delete, the R2 object is deleted before the MongoDB document is removed

### Unsaved Changes Guard

`ShareContent` reads `isDirty` from React Hook Form. A `beforeunload` listener fires when `isDirty` is true (browser refresh / tab close). The back navigation link also calls `window.confirm` before navigating if the form is dirty.

### TanStack Query Caching

- All meals: query key `['meals']`
- Single meal: query key `['meal', slug]`
- `useCreateMeal` and `useDeleteMeal` invalidate `['meals']` on success
- `useUpdateMeal` invalidates both `['meals']` and `['meal', slug]` on success
- `refetchOnWindowFocus` is disabled; stale time: 60 seconds

### XSS Sanitization

Instructions submitted via the form are sanitized with the `xss` library in the service layer before being stored in MongoDB, and rendered via `dangerouslySetInnerHTML` on the detail page.

## Accessibility

The app follows WCAG 2.1 AA practices:

- **Skip link** — visible on focus, jumps keyboard users past the header to `#main-content`
- **Landmark labels** — `<nav aria-label>`, `<form aria-labelledby>`, `<ul aria-label>` on the meals list
- **ARIA on form fields** — `aria-required`, `aria-invalid`, and `aria-describedby` linked to inline error messages on all forms; errors use `role="alert"` so they are announced immediately
- **Button/link labels** — descriptive `aria-label` on all icon-only or ambiguous controls (e.g. "Delete Borshch" instead of "Delete")
- **Decorative content hidden** — `aria-hidden="true"` on SVG icons, the wave background, and inactive slideshow images
- **Live regions** — `role="status"` on the loader, `aria-live="polite"` on the image picker status
- **Reduced motion** — CSS `@media (prefers-reduced-motion: reduce)` disables slide-in animations and the spinner; JS stops the slideshow auto-rotation

## Styling

- **CSS Modules** for all component styles (`.module.css`)
- **Global styles** in `app/globals.css`
- **Fonts**: Quicksand (body text), Montserrat (headings and labels)
- Gradient backgrounds, CSS Grid for the meals gallery, Flexbox for layouts
- **Fluid responsive design** — `clamp()` used throughout for font sizes, spacing, and dimensions so layout scales continuously from mobile to wide desktop without abrupt jumps
- **Scalable SVG header** — the decorative wave background scales proportionally with the viewport via `width: 100%; height: auto` on the SVG
- **Header nav** — Sign Out / Login / Register buttons are absolutely positioned to the right corner of the header and scale with the viewport
- Single-column meal grid on narrow viewports via `minmax(min(20rem, 100%), 1fr)`
