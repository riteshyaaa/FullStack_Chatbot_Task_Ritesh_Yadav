# VAYUDHARA AERO
## 🌐 Live Demo

[![Live Demo](https://img.shields.io/badge/Live-Demo-2563EB?style=for-the-badge)](https://full-stack-chatbot-task-ritesh-yada.vercel.app/)

---

## Summary

The **VAYUDHARA AERO** is a full-stack platform combining an interactive conversational AI chatbot and an enterprise lead management system for DGCA-certified drone pilot training and commercial aerial operations.

---

##  Key Features

- **Autonomous AI Chatbot**: Fast, deterministic rule-based intent engine supporting 7 core intents (`services`, `courses`, `contact`, `register`, `student`, etc.), scored keyword matching, and interactive quick-reply chips.
- **Dual Lead Capture**: High-contrast modal forms and in-chat lead triage with real-time field validation (Email, Phone, UserType).
- **Admin Command Center**: Live KPI metrics, status lifecycle tracking (`New` → `Contacted` → `InProgress` → `Closed`), multi-field search/filtering, and CSV export.
- **Enterprise REST API**: Type-safe Express endpoints powered by Prisma ORM, Zod validation, rate limiting, and Helmet security headers.

---

##  System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND (Vite + React + TS)               │
│  - Landing Page (Hero, Services, Academy, Contact, Testimonials)       │
│  - AI Chatbot Widget (Rule Engine, Intent Matcher, Quick Replies)       │
│  - Lead Capture Modal & Standalone Forms                               │
│  - Admin Lead Management Dashboard                                     │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ JSON / REST HTTP
                                     │ (Rate Limited & CORS Protected)
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                              BACKEND (Node.js + Express + TS)           │
│  - Middleware: Helmet, CORS, Morgan, RateLimiter, Zod Validator         │
│  - Controllers: EnquiryController, HealthController                     │
│  - Service Layer: EnquiryService (Business Logic)                       │
│  - Error Handling: Centralized AppError with Sanitized Safe Responses   │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ Prisma ORM Client
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                              DATABASE (PostgreSQL)                      │
│  - Table: enquiries                                                     │
│  - Enums: UserType (Customer, Student, Other)                           │
│           EnquiryStatus (New, Contacted, InProgress, Closed)            │
│  - Indexes: [status], [userType], [email], [createdAt], [status+created]│
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

| Domain | Technology | Description |
|---|---|---|
| **Frontend** | React 18.3 + TypeScript | Component-based UI with strict typing |
| **Styling** | Tailwind CSS + Custom Tokens | Modern dark/light aero-themed design system |
| **Icons** | Lucide React | High-performance SVG icon set |
| **Build Tool** | Vite 6 | Instant hot module replacement and optimized bundle |
| **Backend** | Node.js + Express.js | High-throughput asynchronous REST API |
| **Backend Typing** | TypeScript 5 | End-to-end type safety |
| **Database** | PostgreSQL 14+ | Relational data integrity and enum support |
| **ORM** | Prisma ORM 6 | Type-safe schema, migrations, and query generation |
| **Validation** | Zod | Runtime request body and query schema enforcement |
| **Security** | Helmet, Express-Rate-Limit, CORS | API hardening and defense against DoS |

---

##  Quick Start Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **PostgreSQL**: Local instance or cloud database (e.g. Supabase, Neon, AWS RDS)

---

### 1. Repository Setup
```bash
# Clone the repository
https://github.com/riteshyaaa/FullStack_Chatbot_Task_Ritesh_Yadav.git

# Navigate into project root
cd FullStack_Chatbot_Task_Ritesh_Yadav
```

---

### 2. Backend Configuration & Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env

# Edit .env with your PostgreSQL credentials:
# DATABASE_URL="postgresql://postgres:password@localhost:5432/dronetv_db?schema=public"
# PORT=5000
# CLIENT_URL="http://localhost:5173"

# Generate Prisma Client & Run Database Migrations
npx prisma generate
npx prisma db push

# (Optional) Seed the database with sample leads
npx ts-node prisma/seed.ts

# Start the Backend Server (Development Mode)
npm run dev
```
*Backend API will start on: `http://localhost:5000`*  
*Health check available at: `http://localhost:5000/api/health`*

---

### 3. Frontend Configuration & Setup

```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the Frontend Development Server
npm run dev
```
*Frontend application will launch at: `http://localhost:5173`*

---

### 4. Production Build Verification

```bash
# Build Frontend
cd frontend
npm run build

# Build Backend
cd ../backend
npm run build
```

---

##  REST API Reference

| Method | Endpoint | Description | Query / Body Params |
|---|---|---|---|
| `GET` | `/api/health` | Service uptime and database connection status | None |
| `GET` | `/api/enquiries` | Fetch paginated, filtered, and sorted enquiries | `page`, `limit`, `search`, `userType`, `status`, `sortBy`, `order` |
| `GET` | `/api/enquiries/:id` | Fetch single enquiry details by ID | `:id` (cuid) |
| `POST` | `/api/enquiries` | Create a new enquiry (via form or bot) | `{ name, email, phone?, userType, serviceInterest?, message }` |
| `PATCH` | `/api/enquiries/:id` | Update enquiry status or details | `{ status?, name?, email?, phone?, serviceInterest?, message? }` |
| `DELETE` | `/api/enquiries/:id` | Permanently delete an enquiry | `:id` (cuid) |

*For detailed request/response schemas and examples, refer to [`docs/API.md`](docs/API.md).*

---

##  Database Schema & Prisma Model

```prisma
enum UserType {
  Student
  Customer
  Other
}

enum EnquiryStatus {
  New
  Contacted
  InProgress
  Closed
}

model Enquiry {
  id              String         @id @default(cuid())
  name            String         @db.VarChar(150)
  email           String         @db.VarChar(255)
  phone           String?        @db.VarChar(20)
  userType        UserType       @default(Other)
  serviceInterest String?        @db.VarChar(255)
  message         String         @db.Text
  status          EnquiryStatus  @default(New)
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  @@index([status])
  @@index([userType])
  @@index([email])
  @@index([createdAt])
  @@index([status, createdAt])
  @@map("enquiries")
}
```

*For comprehensive database diagrams and indexing strategies, refer to [`docs/DATABASE.md`](docs/DATABASE.md).*

---

##  Chatbot Rule Engine & Matching Logic

The DroneTV chatbot uses a transparent, deterministic matching pipeline:
1. **Input Normalization**: Trims whitespace, strips non-essential punctuation, and lowercases text.
2. **Exact & Phrase Matching**: Evaluates regular expression patterns for high-confidence intents.
3. **Keyword Frequency Scoring**: Computes match weight against intent keyword dictionaries.
4. **Response Resolution**: Selects the highest scoring intent (or triggers `FALLBACK_INTENT` if below threshold).
5. **Follow-Up Dispatch**: Appends tailored `QuickReply` pill options for zero-friction conversational flow.

*For complete intent definitions and conversational test matrices, refer to [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).*

---

## 📂 Project Directory Structure

```
├── backend/                           # Node.js + Express + TypeScript Backend
│   ├── prisma/                        # Database Schema & Seeders
│   └── src/
│       ├── config/                    # Environment Configuration
│       ├── controllers/               # Express Request Controllers
│       ├── middleware/                # Rate Limiter, Helmet & Validation
│       ├── routes/                    # RESTful Route Handlers
│       ├── services/                  # Enquiry Business Logic Layer
│       ├── types/                     # Shared TypeScript Interfaces
│       └── validators/                # Request Validation Schemas
├── frontend/                          # React + TypeScript + Vite + Tailwind
│   ├── public/                        # Static Videos, Media & Imagery
│   └── src/
│       ├── chatbot/                   # Chatbot Intent Engine & Rule Matcher
│       ├── components/
│       │   ├── admin/                 # Dashboard Analytics & Tables
│       │   ├── chatbot/               # Chat Widget, Bubbles & Quick Replies
│       │   ├── common/                # UI Primitives (Button, Modal, Toast)
│       │   ├── forms/                 # Lead Capture Enquiry Form
│       │   ├── layout/                # Navbar, Footer & Page Layout
│       │   └── sections/              # Hero, Services, Academy & Contact
│       ├── contexts/                  # Global Toast & Notification Provider
│       ├── hooks/                     # Custom useChatbot & useEnquiries Hooks
│       ├── pages/                     # App Views (Home, Courses, Admin)
│       └── services/                  # API Client & Network Service
├── docs/                              # Architecture, Database & API Specs
├── .env.example                       # Root Environment Template
├── .gitignore                         # Git Exclusion Rules
└── README.md                          # Master Project Documentation
```

---
