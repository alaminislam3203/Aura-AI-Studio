<div align="center">

<img src="public/logo.png" alt="Aura AI Studio Logo" width="120" height="120" />

# Aura AI Studio

**Next-Generation Neural AI Image Studio — Background Removal, Generative Scene Fill, 4K Super-Resolution & Multi-Step Chained Editing**

[![Live Demo](https://img.shields.io/badge/Live_Demo-aura--ai--studio--peach.vercel.app-FF6A00?style=for-the-badge&logo=vercel&logoColor=white)](https://aura-ai-studio-peach.vercel.app/)
[![Next.js 16](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma_ORM-PostgreSQL-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Stripe](https://img.shields.io/badge/Stripe-Billing-635BFF?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)

<br />

[**🚀 Launch Live Application**](https://aura-ai-studio-peach.vercel.app/) · [**🎨 Open AI Playground**](https://aura-ai-studio-peach.vercel.app/playground) · [**🔐 Login / Sign Up Portal**](https://aura-ai-studio-peach.vercel.app/login) · [**🛡️ Admin Vault**](https://aura-ai-studio-peach.vercel.app/admin-vault)

<br />

<img src="public/aura-demo.png" alt="Aura AI Studio Workspace Preview" width="100%" />

</div>

---

## ✨ Overview

**Aura AI Studio** is a production-grade SaaS platform and interactive visual workbench for creators, designers, and e-commerce teams. Powered by **Next.js 16 (App Router & Turbopack)**, **ImageKit Neural Transformations**, **Neon Serverless PostgreSQL (Prisma)**, **NextAuth**, and **Stripe Subscription Billing**, it delivers studio-grade AI image transformations directly in the browser with sub-second cloud GPU execution.

- 🌐 **Live Production URL**: [https://aura-ai-studio-peach.vercel.app/](https://aura-ai-studio-peach.vercel.app/)
- 📦 **GitHub Repository**: [https://github.com/alaminislam3203/Aura-AI-Studio](https://github.com/alaminislam3203/Aura-AI-Studio)

---

## 🔥 Core Platform Features

### 1. 🧠 16 Neural AI Studio Tools (4 Specialized Suites)
| Category | Tool Name | ID | Description |
| :--- | :--- | :--- | :--- |
| **AI Background** | **AI Remove BG** | `bg-remove` | Instant subject isolation with sub-pixel edge detection and alpha transparency |
| **AI Background** | **Change Scene** | `change-bg` | Replace backgrounds with custom text prompts and scene synthesis |
| **AI Background** | **Generative Fill** | `gen-fill` | Outpaint and expand image canvas into 16:9 widescreen using generative AI |
| **AI Background** | **Studio Drop Shadow** | `drop-shadow` | Add realistic 3D studio drop shadows behind isolated subjects |
| **AI Generative** | **AI Edit Image** | `ai-edit` | Modify objects, attire, or lighting via natural language instructions |
| **AI Generative** | **Generative Recolor** | `gen-recolor` | Recolor targeted items or clothing using prompt-driven hex/color names |
| **AI Generative** | **Object Eraser** | `obj-remove` | Cleanly erase unwanted objects, people, or text and reconstruct background textures |
| **AI Enhance** | **AI Upscale 2x / 4x** | `upscale` | Super-resolution neural upscaling with micro-texture recovery |
| **AI Enhance** | **Face Portrait Retouch** | `retouch` | Studio skin smoothing, blemish removal, and eye/detail enhancement |
| **AI Enhance** | **Auto Color & Light** | `color-boost` | Automatic dynamic range, contrast, and color balance optimization |
| **AI Enhance** | **Smart Face Crop** | `face-crop` | AI face-detection auto-centering for 800×800 avatars and portraits |
| **AI Enhance** | **Smart Subject Crop** | `smart-crop` | Saliency-aware auto-framing around the main subject (1080×1080) |
| **Effects & Brand** | **Text Watermark** | `watermark` | Dynamic typography overlays with customizable text, color, size, and position |
| **Effects & Brand** | **Artistic Blur** | `blur-fx` | Gaussian depth-of-field blur for background plates |
| **Effects & Brand** | **Grayscale Noir** | `grayscale` | High-contrast monochrome cinema conversion |
| **Effects & Brand** | **Vintage Sepia** | `sepia` | Warm retro film color grading and tonal styling |

---

### 2. 🎨 Interactive Dual-Canvas Workbench (`/playground`)
- **Draggable Split-View Comparison Slider**: Inspect `Before` (original) and `After` (AI processed) pixel fidelity in real time.
- **Multi-Step Chain Editing (`Chain Edit`)**: Use the output of one AI transformation directly as the input for the next tool—stacking background removal, relighting, upscaling, and watermarking sequentially.
- **Multi-Format Lossless Export (`PNG` / `WEBP` / `JPG`)**: Choose your target delivery format directly from the canvas toolbar before downloading.
- **Cloud History Gallery**: Automatically syncs every generated asset to PostgreSQL with one-click reload, inspection, and individual history deletion.
- **Quick Sample Presets**: Test all 16 AI tools immediately using built-in high-resolution studio portraits and product shots without uploading a file.

---

### 3. 🔑 Bring Your Own Key (BYOK) — Unlimited Quota Mode
- Users can connect their own free **ImageKit API Credentials** (`URL Endpoint`, `Public Key`, `Private Key`) via the **API Config Modal**.
- Credentials are stored locally in the browser and automatically bypass server credit limits—enabling **100% unlimited free transformations**.

---

### 4. 🔐 Premium 2-Column Login & Sign Up Portal (`/login` & `/signup`)
- **Left Column**: Interactive live `Raw Input` vs `AI Enhanced 4K` toggle preview card, neural engine highlights, and verified creator social proof.
- **Right Column**: Animated tab switcher (`Sign In` / `Create Account`), **1-Click Google OAuth**, and **Email & Password authentication** with a live 4-bar password strength meter.
- Automatically provisions **3 Free AI Credits** for every new account.

---

### 5. 💳 Freemium Credit Engine & Stripe Billing
- **Starter Free Plan (`$0/mo`)**: Includes 3 complimentary AI transformations + BYOK support.
- **Aura Pro Plan (`$19/mo`)**: Unlocks unlimited transformations (with a fair-use rolling rate limit of 15 generations/hour), priority cloud GPU pipeline, and a **1-Click Stripe Customer Billing Portal** to manage or cancel subscriptions anytime.
- Dual verification via **Stripe Webhooks** (`/api/webhooks/stripe`) and instant client-side session verification (`/api/verify-checkout-session`).

---

### 6. 🛡️ Operator Command Center (`/admin-vault`)
- Dedicated **Sidebar Admin Dashboard** restricted to authorized administrator emails (`ADMIN_EMAILS`).
- **5 Specialized Views**:
  1. **Overview**: Real-time KPI cards (Total Users, Pro Subscribers, Total Generations, Active MRR), Pro conversion telemetry, and Recent Activity feed.
  2. **AI Tool Analytics**: Visual usage breakdown across all 16 AI tools with percentage share bars.
  3. **User Directory & Live Controls**: Searchable & filterable user table with **1-Click Free ↔ Pro Plan Toggle**, **Reset Usage to 0**, **+5 Bonus Credits**, **Delete User**, and **Export CSV**.
  4. **Generations Vault**: Visual inspection grid of all user generations with prompt badges, original/result links, and **1-Click Delete**.
  5. **System & Security**: Live telemetry for Neon PostgreSQL, ImageKit AI Engine, Stripe Billing, and authorized admin accounts.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 16.1.6 (App Router, Server & Client Components, Turbopack) |
| **Language** | TypeScript 5 |
| **Styling & Motion** | Tailwind CSS v4, Motion (Framer Motion), Radix UI, Lucide Icons, Sonner |
| **AI Image Pipeline** | ImageKit Media Transformation Engine (`@imagekit/next`, `@imagekit/nodejs`) |
| **Database & ORM** | Neon Serverless PostgreSQL + Prisma ORM v6 |
| **Authentication** | NextAuth.js v4 (Google OAuth 2.0 + Email/Password Credentials Provider) |
| **Payments & Billing** | Stripe Checkout Sessions, Billing Portal & Signed Webhooks |
| **Deployment** | Vercel ([aura-ai-studio-peach.vercel.app](https://aura-ai-studio-peach.vercel.app/)) |

---

## 📂 Project Architecture

```text
Aura-AI-Studio/
├── app/
│   ├── admin-vault/                 # Sidebar Admin Command Center (/admin-vault)
│   ├── api/
│   │   ├── admin/
│   │   │   ├── actions/             # Operator actions (togglePlan, resetCredits, bonus, delete)
│   │   │   └── overview/            # Admin telemetry, MRR & AI tool breakdown analytics
│   │   ├── auth/[...nextauth]/      # NextAuth handler (Google + Credentials)
│   │   ├── billing-portal/          # Stripe Customer Billing Portal session generator
│   │   ├── create-checkout-session/ # Stripe Pro subscription checkout initializer
│   │   ├── generations/             # Cloud generation history CRUD (GET, POST, DELETE)
│   │   ├── upload-auth/             # ImageKit cryptographic upload signature endpoint
│   │   ├── usage/                   # Credit quota tracker, Pro hourly limiter & BYOK bypass
│   │   ├── verify-checkout-session/ # Instant post-checkout Pro upgrade verifier
│   │   └── webhooks/stripe/         # Stripe subscription lifecycle webhook receiver
│   ├── login/                       # 2-Column Sign In portal (/login)
│   ├── signup/                      # 2-Column Create Account portal (/signup)
│   ├── playground/                  # Interactive AI Studio Workbench (/playground)
│   ├── globals.css                  # Custom obsidian & warm amber design system tokens
│   ├── layout.tsx                   # Root layout, fonts, SessionProvider & Toaster
│   └── page.tsx                     # Marketing landing page
├── components/
│   ├── auth/
│   │   └── AuthPortal.tsx           # Reusable 2-column Login & Sign Up component
│   ├── modals/
│   │   ├── ApiConfigModal.tsx       # Bring Your Own Key (BYOK) configuration modal
│   │   └── UpgradeModal.tsx         # Stripe Pro upgrade modal
│   ├── playground/
│   │   ├── CanvasViewer.tsx         # Split-view slider, Chain Edit & PNG/WEBP/JPG export
│   │   ├── HistoryGallery.tsx       # Cloud history strip with delete support
│   │   ├── PlaygroundWorkbench.tsx  # Main state orchestrator for the AI Studio
│   │   └── ToolControls.tsx         # 16 AI tool selector & prompt/parameter controls
│   ├── HomeHeroSection.tsx          # Hero section with seamless dual-video background
│   ├── GalleryShowcaseSection.tsx   # Visual transformation showcase & benchmarks
│   ├── HowItWorksSection.tsx        # 3-step workflow guide
│   ├── PricingSection.tsx           # Free vs Pro pricing cards + BYOK banner
│   └── Footer.tsx                   # Brand identity & platform navigation
├── lib/
│   ├── admin-auth.ts                # Admin email authorization helper
│   ├── auth.ts                      # NextAuth configuration & auto-production URL resolver
│   ├── byok-storage.ts              # Browser storage manager for custom ImageKit keys
│   ├── imagekit.ts                  # AI transformation URL builder & chained pass support
│   ├── prisma.ts                    # Prisma client singleton with auto-recovery
│   ├── stripe.ts                    # Stripe SDK singleton
│   └── tools-config.ts              # Metadata & categories for all 16 AI tools
└── prisma/
    └── schema.prisma                # PostgreSQL models: User, Generation, Subscription
```

---

## 🚀 Getting Started Locally

### 1. Clone the Repository
```bash
git clone https://github.com/alaminislam3203/Aura-AI-Studio.git
cd Aura-AI-Studio
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env` in the project root and add your credentials:

```env
# 1. Application & NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="https://aura-ai-studio-peach.vercel.app"
NEXTAUTH_SECRET="your-generated-nextauth-secret"

# 2. Admin Vault Access (/admin-vault)
ADMIN_EMAILS="merxodevsolutions@gmail.com,alaminislam3203@gmail.com"
NEXT_PUBLIC_ADMIN_EMAILS="merxodevsolutions@gmail.com,alaminislam3203@gmail.com"

# 3. Database (Neon Serverless PostgreSQL)
DATABASE_URL="postgresql://user:password@endpoint.neon.tech/neondb?sslmode=require"

# 4. Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# 5. ImageKit AI Engine
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/your_id"
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY="public_..."
IMAGEKIT_PRIVATE_KEY="private_..."

# 6. Stripe Subscription Billing
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_PRICE_ID="price_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### 4. Sync the Database Schema
```bash
npx prisma generate
npx prisma db push
```

### 5. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Production Deployment (Vercel)

1. Push your repository to GitHub and import it into [Vercel](https://vercel.com/).
2. Copy the environment variables from `.env.production` into **Vercel Project Settings → Environment Variables**.
3. Set `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` to `https://aura-ai-studio-peach.vercel.app`.
4. Add the production callback URI in **Google Cloud Console**:
   ```text
   https://aura-ai-studio-peach.vercel.app/api/auth/callback/google
   ```
5. Add the production webhook endpoint in **Stripe Dashboard**:
   ```text
   https://aura-ai-studio-peach.vercel.app/api/webhooks/stripe
   ```

---

## 👨‍💻 Author

**Al Amin Islam**
- GitHub: [@alaminislam3203](https://github.com/alaminislam3203)
- Live App: [https://aura-ai-studio-peach.vercel.app/](https://aura-ai-studio-peach.vercel.app/)

---

## 📄 License

This project is licensed under the **MIT License**.
