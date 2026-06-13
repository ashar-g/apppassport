# AppPassport

A clean, production-ready Next.js application with Auth0 SSO, user profiles, and a live dashboard.

## Tech Stack

- **Framework**: Next.js 15 (Pages Router)
- **Auth**: Auth0 via `@auth0/nextjs-auth0` v3
- **Styling**: CSS Modules + custom design system
- **Deployment**: Vercel

## Pages

| Route | Protection | Description |
|-------|-----------|-------------|
| `/` | Public | Marketing home page |
| `/features` | Public | Feature overview |
| `/dashboard` | 🔐 Auth required | Live KPI & service health dashboard |
| `/profile` | 🔐 Auth required | User profile with all token claims |
| `/api/auth/login` | — | Auth0 login redirect |
| `/api/auth/logout` | — | Auth0 logout |
| `/api/auth/callback` | — | Auth0 callback handler |

## Setup

### 1. Create an Auth0 Application

1. Go to [auth0.com](https://auth0.com) → Dashboard → Applications → Create Application
2. Choose **Regular Web Application**
3. Under **Settings**, set:
   - **Allowed Callback URLs**: `http://localhost:3000/api/auth/callback`
   - **Allowed Logout URLs**: `http://localhost:3000`
   - **Allowed Web Origins**: `http://localhost:3000`
4. Save changes

### 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in `.env.local`:

```env
AUTH0_ISSUER_BASE_URL=https://YOUR_DOMAIN.auth0.com
AUTH0_CLIENT_ID=YOUR_CLIENT_ID
AUTH0_CLIENT_SECRET=YOUR_CLIENT_SECRET
AUTH0_SECRET=GENERATE_WITH_openssl_rand_-base64_32
AUTH0_BASE_URL=http://localhost:3000
```

### 3. Install and run

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Deploying to Vercel

1. Push to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Add all environment variables from `.env.local.example` in Vercel → Settings → Environment Variables
4. Set `AUTH0_BASE_URL` to your production URL (e.g. `https://your-app.vercel.app`)
5. In Auth0, add your production URLs to Callback/Logout/Origins allow-lists
6. Deploy

## Architecture

Auth is handled entirely server-side using `withPageAuthRequired()` for protected pages, which redirects unauthenticated users to Auth0 Universal Login. The `UserProvider` on the client side exposes the session via the `useUser()` hook for the Navbar and other UI components.

```
User → /dashboard
  → withPageAuthRequired() checks session
  → if no session: redirect to /api/auth/login → Auth0 Universal Login
  → on success: Auth0 redirects to /api/auth/callback
  → session cookie set → user lands on /dashboard
```
