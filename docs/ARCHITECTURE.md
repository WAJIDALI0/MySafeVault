# Architecture

## Monorepo
We use Turborepo to manage `apps/web` alongside shared `packages/`.

## Folder Structure

The Next.js app strictly follows a feature-sliced design.

```text
apps/web/
├── app/
│   ├── (auth)/        # Public authentication routes
│   └── (dashboard)/   # Protected application shell
├── components/
│   └── ui/            # Primitive UI components (buttons, inputs)
├── features/
│   ├── auth/          # Authentication domain logic, components, actions
│   └── dashboard/     # Dashboard shell, widgets, navigation
├── lib/
│   ├── logger/        # Activity tracking
│   ├── prisma/        # Database client singleton
│   ├── security/      # CSRF, Rate Limiting, Encryption
│   └── supabase/      # Edge middleware & SSR clients
```
