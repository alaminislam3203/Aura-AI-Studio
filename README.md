# Aura AI Studio

A high-performance web platform for AI-powered image isolation, prompt-guided background generation, super-resolution upscaling, and dynamic branding overlays.

Built with Next.js App Router, ImageKit Transformation Engine, PostgreSQL via Prisma ORM, NextAuth, and Stripe subscription billing.

## Overview

Aura Studio provides a suite of image processing tools accessible through an interactive dual-canvas workbench:

- **Background Removal**: Automated subject isolation with sub-pixel edge detection and alpha mask transparency.
- **Scene Replacement**: Generative AI background replacement driven by user text prompts.
- **Super-Resolution Upscaling**: 2x and 4x detail enhancement with micro-texture reconstruction.
- **Watermark Engine**: Custom text and branding overlays with controllable positioning, sizing, and color.
- **Split-View Canvas**: Draggable before-and-after comparison slider for real-time edge inspection.
- **Credit & Subscription Pipeline**: Free tier usage tracking (3 complimentary transformations) with automated upgrade provisioning via Stripe Checkout and webhooks.

## Architecture & Technologies

- **Frontend**: Next.js 16 (App Router, Server & Client Components, Turbopack)
- **Styling & Motion**: Tailwind CSS v4, Framer Motion, Radix UI Primitives, Lucide Icons
- **Image Pipeline**: ImageKit Media Services with signed client-side upload tokens and on-the-fly transformation pipelines
- **Database & State**: PostgreSQL (Neon Serverless) managed through Prisma ORM
- **Authentication**: NextAuth.js with Google OAuth provider
- **Billing**: Stripe Checkout Sessions and signed webhook handlers

## Project Structure

```
├── app/
│   ├── admin-vault/               # Operator dashboard for users, images & MRR
│   ├── api/                       # Backend routes (auth, checkout, imagekit auth)
│   ├── playground/                # Interactive canvas & workbench interface
│   ├── layout.tsx                 # Root layout & providers
│   └── page.tsx                   # Marketing landing page
├── components/
│   ├── playground/                # Studio tools, canvas inspector, split slider
│   ├── ui/                        # Base interface primitives (buttons, dialogs)
│   ├── HomeHeroSection.tsx        # Landing hero with video & interactive showcase
│   ├── GalleryShowcaseSection.tsx # Technical benchmarks & masonry gallery
│   ├── HowItWorksSection.tsx      # Step-by-step processing workflow
│   ├── PricingSection.tsx         # Free vs Pro subscription cards
│   └── Footer.tsx                 # Navigation, brand identity, and platform links
├── lib/
│   ├── admin-auth.ts              # Admin authorization helper
│   ├── constants.ts               # Static application constants and feature definitions
│   ├── imagekit.ts                # Transformation URL generators and client configuration
│   ├── prisma.ts                  # Prisma database client singleton
│   └── utils.ts                   # Class merger and formatting utilities
└── prisma/
    └── schema.prisma              # User, Generation, and Subscription models
```

## Getting Started

### Prerequisites

- Node.js 20+ or Bun runtime
- PostgreSQL database instance (local or hosted on Neon)
- Google Cloud Console project with OAuth credentials
- ImageKit account with public and private keys
- Stripe account for subscription testing

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/alaminislam3203/Aura-AI-Studio.git
   cd Aura-AI-Studio
   ```

2. Install dependencies:
   ```bash
   npm install
   # or bun install
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env` in the project root and fill in your credentials:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@endpoint.neon.tech/neondb?sslmode=require"

   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-generated-nextauth-secret"

   # Admin Vault
   ADMIN_EMAILS="alaminislam3203@gmail.com"
   NEXT_PUBLIC_ADMIN_EMAILS="alaminislam3203@gmail.com"

   # Google OAuth
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"

   # ImageKit
   NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY="public_..."
   NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/your_id"
   IMAGEKIT_PRIVATE_KEY="private_..."

   # Stripe
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_PUBLISHABLE_KEY="pk_test_..."
   STRIPE_PRICE_ID="price_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."
   ```

4. Push database migrations:
   ```bash
   npx prisma db push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The application will be accessible at `http://localhost:3000`. The image editor workbench is located at `/playground`.

## License

This project is licensed under the MIT License.
