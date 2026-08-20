# MySafeVault 🛡️

A production-ready, highly secure personal vault application built with the modern Next.js ecosystem. MySafeVault enables users to securely store and manage passwords, documents, secure notes, identities, and receipts with client/server encryption, rigorous authentication, and a sleek, dynamic UI.

## Features 🚀
- **End-to-End Encryption Architecture**: Uses AES-256-GCM to ensure that all vault item payloads are fully encrypted before persisting to the database.
- **Authentication & Security**: Integrated with Supabase Auth for JWT-based session management, Row-Level Security (RLS) scoping, and strict Server Action validations.
- **Dynamic Dashboard**: View storage metrics, upcoming expirations, and recent activities.
- **Responsive & Accessible UI**: Built with Tailwind CSS, Radix UI primitives, and `next-themes` (Dark/Light/System modes) for a premium, accessible user experience.
- **Comprehensive Activity Logging**: Tracks user interactions securely to provide audit trails for sensitive operations.

## Tech Stack 💻
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Server Actions, Turbopack)
- **Frontend**: [React 19](https://react.dev/), [Tailwind CSS 4](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/)
- **Backend & Database**: [Supabase](https://supabase.com/) (PostgreSQL), [Prisma ORM](https://www.prisma.io/)
- **Validation**: [Zod](https://zod.dev/), `react-hook-form`

## Getting Started 🛠️

### Prerequisites
- Node.js >= 20
- pnpm >= 9
- A Supabase project (PostgreSQL)

### Installation
1. Clone the repository and install dependencies:
```bash
pnpm install
```

2. Configure environment variables:
Copy `.env.example` to `.env` and fill in your Supabase credentials and a secure 32-byte encryption key.
```bash
cp .env.example .env
```
*(You can generate a secure encryption key using `openssl rand -hex 32`)*

3. Run Prisma Migrations:
```bash
cd apps/web
npx prisma generate
npx prisma db push
```

4. Start the development server:
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Security & Deployment 🔒
- **Security Headers**: `next.config.ts` is configured with strict CSP, X-Frame-Options, HSTS, and Referrer-Policy headers.
- **Encryption**: Do not lose your `ENCRYPTION_KEY`. If the key is lost, all encrypted vault items become permanently irrecoverable.
- **Deployment**: The application is optimized for deployment on [Vercel](https://vercel.com). Ensure all environment variables are properly set in your Vercel project settings before deploying.

---
*Developed during the MERN Stack Internship 2026*
