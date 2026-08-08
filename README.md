# MySafeVault

A highly secure, offline-capable, and user-friendly digital life vault.

## Project Vision
To build an enterprise-grade digital life vault where users can securely store documents, passwords, notes, IDs, and important digital assets with robust offline access and end-to-end security practices.

## Tech Stack
- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui, Framer Motion
- **Database**: PostgreSQL (via Supabase), Prisma ORM
- **Authentication**: Supabase Auth
- **Monorepo**: Turborepo, pnpm

## Folder Structure
This project uses a monorepo setup designed for long-term scalability.

```text
mysafevault/
├── apps/
│   └── web/               # Next.js 15 Application
│       ├── app/
│       ├── actions/
│       ├── components/
│       ├── features/
│       │   ├── auth/
│       │   ├── dashboard/
│       │   ├── vault/
│       │   └── ...
│       ├── hooks/
│       ├── lib/
│       │   ├── auth/
│       │   ├── prisma/
│       │   ├── supabase/
│       │   └── ...
│       └── ...
├── packages/
│   ├── ui/                # Shared UI Components
│   ├── types/             # Shared TypeScript types
│   └── utils/             # Shared utility functions
├── docs/                  # Project documentation
└── ...
```

## Installation

1. Ensure you have Node.js 18+ and `pnpm` installed.
2. Clone the repository.
3. Install dependencies:
   ```bash
   pnpm install
   ```

## Environment Variables

Copy the `.env.example` in `apps/web` to `.env.local` and fill in your Supabase credentials.

```bash
cp apps/web/.env.example apps/web/.env.local
```

## Commands

Run the development server across the monorepo:
```bash
pnpm dev
```

Build for production:
```bash
pnpm build
```

Linting and Typechecking:
```bash
pnpm lint
pnpm typecheck
```

## Coding Standards
- We strictly adhere to a **feature-based architecture**. Do not place domain logic in generic components or generic `lib` folders. Use the dedicated feature folders (e.g. `features/auth`).
- **Server Components First**: Default to Server Components. Only use Client Components at the lowest level in the tree when interactivity is absolutely necessary.
- **Strict Typing**: All TypeScript code must pass strict mode checks without utilizing `any`.
- **Pre-commit Checks**: Husky runs `lint-staged` and `commitlint` on every commit. Unformatted or failing code cannot be committed.

## Branch Strategy
- `main`: Production-ready code. Commits to main automatically trigger a production deployment.
- `develop`: Pre-production testing and staging.
- `feature/*`: New features, branching off `develop`.
- `hotfix/*`: Urgent fixes, branching off `main`.
