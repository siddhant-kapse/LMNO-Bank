# LMNO Bank - Modern Banking System

## 🚀 Project Structure

```bash
A monorepo powered by Turborepo with:
lmno-bank/
├── apps/
│ ├── client-react/ # Customer-facing CSR app (Vite + React)
│ ├── client-next/ # Marketing SSR site (Next.js 14)
│ └── server-next/ # Backend API (Next.js API routes)
├── packages/
│ ├── common/ # Shared validation & types
│ ├── prisma-client/ # Database client
│ └── ui/ # Shared UI components
└── turbo.json # Turborepo configuration
```

## 🌟 Key Features

- **Multi-app Architecture**: Separate frontends for different use cases
- **Type Safety**: End-to-end TypeScript
- **Modern Auth**: Cookie-based sessions with JWT
- **Database**: MongoDB with Prisma



# 🏗️ Core Technologies

| Area       | Technology Stack                       |
|------------|----------------------------------------|
| Frontend   | Next.js 14, React 18, Tailwind CSS     |
| Backend    | Next.js API Routes, Prisma            |
| Database   | MongoDB                                |
| Auth       | JWT, Cookie sessions                   |
| Validation | Zod                                    |



# 📄 API Endpoints

**Authentication**

POST /api/auth/signup - User registration

POST /api/auth/login - User login

**Customer Onboarding**

POST /api/onboarding - Create customer profile



# Key improvements made:
1. **Clear Structure**: Visual hierarchy showing Turborepo layout
2. **Onboarding Flow**: Added example API request
3. **Tech Stack Table**: Quick overview of technologies
4. **Future Roadmap**: Frontend
