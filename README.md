<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/shield-check.svg" width="80" height="80" alt="MySafeVault Logo" />
  <h1>MySafeVault</h1>
  <p><strong>A highly secure, offline-capable, and user-friendly enterprise digital life vault.</strong></p>

  <p>
    <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
    <img alt="Next.js" src="https://img.shields.io/badge/Next.js-15-black" />
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.0-blue" />
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </p>
</div>

<br/>

## 📖 Overview

**MySafeVault** is an enterprise-grade digital vault designed to give users absolute control and security over their most sensitive digital assets. Built with a modern zero-trust architecture approach, the platform provides seamless management of passwords, secure notes, identities, and documents with end-to-end security practices.

### Core Capabilities
* **🔐 Advanced Password Manager**: Built-in cryptographic password generator, entropy calculations (strength meters), and secure copy-to-clipboard functionality.
* **📄 Secure Document Storage**: Upload and encrypt important documents. Tracks file sizes and allows setting exact expiration dates for warranties and IDs.
* **📝 Privacy-First Notes**: Secure notes hidden behind a dynamic "Lock/Unlock" privacy screen to prevent shoulder-surfing.
* **📊 Live Storage Calculator**: A backend-powered calculation engine that sums the exact byte lengths of your encrypted records and visualizes usage dynamically across your dashboard.

---

## 🏗 System Architecture

The application is built using a highly scalable **Monorepo** structure powered by Turborepo.

```mermaid
graph TD;
    Client[Web Client (Next.js 15)] -->|Server Actions| NextServer[Next.js Server];
    NextServer -->|Prisma Client| DB[(PostgreSQL Database)];
    NextServer -->|Supabase Auth| Auth[Authentication Layer];
    
    subgraph Monorepo Packages
    UI[Shared UI Components]
    Types[TypeScript Types]
    Utils[Cryptographic Utils]
    end

    Client --> UI
    NextServer --> Utils
    NextServer --> Types
```

---

## 🚀 Tech Stack

We utilize industry-leading technologies to guarantee maximum performance and security:

* **Framework**: [Next.js 15](https://nextjs.org/) (App Router & Server Actions)
* **Frontend**: React 19, TypeScript
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), shadcn/ui, Recharts
* **Database**: PostgreSQL hosted via [Supabase](https://supabase.com/), queried with Prisma ORM
* **Authentication**: Supabase Auth (Magic Links, OAuth)
* **Tooling**: Turborepo, pnpm, ESLint, Husky

---

## 📂 Project Structure

This project follows a strict **feature-based architecture**. Domain logic is contained within dedicated feature directories rather than generic global folders.

```text
mysafevault/
├── apps/
│   └── web/                   # Main Next.js Application
│       ├── app/               # App Router & Layouts
│       ├── features/          # Feature-based Domain Logic
│       │   ├── auth/          # Authentication flows
│       │   ├── dashboard/     # Analytics & Storage Widgets
│       │   └── vault/         # Vault CRUD & Cryptography
│       └── lib/               # Shared libraries (Prisma, Utils)
├── packages/
│   ├── ui/                    # Reusable UI Library (shadcn)
│   ├── types/                 # Shared TypeScript models
│   └── utils/                 # Utility functions
└── docs/                      # Extensive Documentation
```

---

## 🔒 Security Practices

Security is the foundational principle of MySafeVault:
1. **Server Actions Over APIs**: Data mutations are handled securely on the server via Next.js Server Actions, minimizing client-side vulnerabilities.
2. **Strict Content Security Policy (CSP)**: The application is protected by a robust CSP (`next.config.ts`) blocking unauthorized scripts, framing, and strict protocol enforcement.
3. **Optimized Payloads**: Decryption and cryptographic rendering happen via secure channels, utilizing built-in Web Crypto APIs (`crypto.getRandomValues()`) for generating unguessable passwords.

---

## 🛠️ Installation & Setup

1. **Prerequisites**: Ensure you have Node.js 18+ and `pnpm` installed on your machine.
2. **Clone & Install**:
   ```bash
   git clone https://github.com/WAJIDALI0/MySafeVault.git
   cd MySafeVault
   pnpm install
   ```
3. **Environment Setup**:
   Copy `.env.example` to `.env.local` inside `apps/web` and configure your Supabase Keys & Prisma Database URL.
   ```bash
   cp apps/web/.env.example apps/web/.env.local
   ```
4. **Database Migration**:
   ```bash
   pnpm dlx prisma db push
   ```
5. **Start the Development Server**:
   ```bash
   pnpm dev
   ```

---

## 🤝 Contribution Guidelines

* We default to **Server Components**. Only use Client Components (`"use client"`) at the absolute edge of the rendering tree when interactivity is required.
* **Strict Typing**: All code must pass strict mode TypeScript checks without `any` bypasses.
* Pre-commit hooks (`husky`) will automatically lint, format, and typecheck your code before allowing a push.

<br/>

<div align="center">
  <sub>Built with ❤️ for privacy and security.</sub>
</div>
