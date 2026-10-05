# VAYUDHARA AERO - Architecture Document

## 1. System Overview

The **VAYUDHARA AERO** is a production-grade full-stack web application designed for VAYUDHARA AERO (an innovative drone services and pilot training organization). The system serves two primary functions:
1. **Rule-Based Intelligent Support & Triage**: Providing interactive, instant, and deterministic answers regarding VAYUDHARA's enterprise drone services, DGCA-certified training courses, registration procedures, and direct team contact.
2. **Lead & Enquiry Management System**: Capturing validated multi-channel inquiries (from both the landing page enquiry forms and the conversational assistant) and providing an administrator dashboard for enquiry lifecycle management (New → Contacted → In Progress → Closed).

---

## 2. High-Level System Architecture

```
+-------------------------------------------------------------------------+
|                              CLIENT TIER                                |
|  React 18 + TypeScript + Vite + Tailwind CSS + Lucide Icons             |
|  - Modern, responsive landing page (Home, Services, Courses, Contact)  |
|  - Intelligent rule-based Chatbot Widget with intent engine & triage    |
|  - Full-featured Lead Capture Form with client validation               |
|  - Admin Dashboard with search, filter, status management, & analytics  |
+-------------------------------------------------------------------------+
                                    │
                                    │ HTTP / REST (JSON)
                                    │ CORS + Helmet Protected
                                    ▼
+-------------------------------------------------------------------------+
|                              SERVER TIER                                |
|  Node.js + Express.js + TypeScript                                      |
|  - Security Middleware: Helmet, CORS, Rate Limiting, Body Parsers       |
|  - Request Validation Middleware (Zod / Joi Schema Engine)              |
|  - Route Handlers & Controllers (/api/enquiries, /api/health)           |
|  - Business Logic & Service Layer (EnquiryService)                      |
|  - Centralized Safe Error Handling & Sanitization                       |
+-------------------------------------------------------------------------+
                                    │
                                    │ Prisma ORM (Type-Safe Client)
                                    ▼
+-------------------------------------------------------------------------+
|                              DATA TIER                                  |
|  PostgreSQL Database (or SQLite for local fallback)                     |
|  - Table: enquiries                                                     |
|  - Enums: UserType (Student, Customer, Other)                           |
|           EnquiryStatus (New, Contacted, InProgress, Closed)            |
|  - Indexes: status, userType, email, createdAt, status+createdAt        |
+-------------------------------------------------------------------------+
```

---

## 3. Data Flow Architecture

### 3.1. Lead Capture Flow (Chatbot & Web Form)
1. **User Interaction**: The user enters an enquiry via the dedicated Contact Form or the interactive Chatbot widget.
2. **Client Validation**: Frontend checks required fields (Name, Email, Message), validates email format with regex, verifies phone number format, and ensures valid UserType (`Student`, `Customer`, `Other`).
3. **API Request**: Frontend dispatches `POST /api/enquiries` with a structured JSON payload.
4. **Backend Security & Middleware**:
   - Helmet sets HTTP security headers.
   - Rate limiter validates request volume.
   - CORS ensures requests originate from allowed domains.
5. **Backend Schema Validation**: Validates the payload against strict schema rules (sanitizing strings, verifying enum values, trimming whitespace).
6. **Service Layer**: Handles business logic and passes the sanitized data to the Prisma ORM client.
7. **Database Persistence**: PostgreSQL writes the record with an auto-generated unique identifier (`cuid`), default status (`New`), and timestamp (`createdAt`).
8. **Response Propagation**: A structured success envelope `{ success: true, data: { ...enquiry } }` is returned with HTTP status `201 Created`.
9. **UI Feedback**: Frontend displays a clear success banner/toast and updates UI state.

### 3.2. Admin Management Flow
1. **Data Fetching**: Admin dashboard requests `GET /api/enquiries` with query parameters (`search`, `userType`, `status`, `page`, `limit`).
2. **Filtered Querying**: Backend translates parameters into optimized Prisma queries using indexed database columns.
3. **Status Updates**: Admin updates enquiry status (`PATCH /api/enquiries/:id`) to `Contacted`, `InProgress`, or `Closed`.
4. **Deletion**: Admin confirms deletion in a confirmation modal (`DELETE /api/enquiries/:id`).

---

## 4. Chatbot Architecture & Rule Engine

The chatbot operates on a **deterministic rule-based intent engine** designed to give reliable, explainable responses without external LLM API dependencies.

### 4.1. Core Components
- **Intents Registry (`intents.ts`)**: Defines all supported intents with keyword aliases, regex patterns, priority scoring, detailed responses, and suggested follow-up quick replies.
- **Intent Matcher (`matcher.ts`)**: Tokenizes user input, normalizes text (lowercasing, punctuation removal), computes keyword/phrase match scores, and resolves the highest-confidence intent.
- **Stateful Conversation Session (`useChatbot.ts`)**: Manages chat message history, typing indicators, active quick replies, and contextual lead capture handoff.
- **Graceful Fallback**: Unrecognized inputs trigger a contextual fallback response with actionable options (view services, browse courses, contact support).

### 4.2. Supported Intents
1. **Services Overview**: Details aerial surveying, agricultural crop health analytics, cinematography, and industrial inspections.
2. **Courses & Pilot Training**: Details DGCA pilot certification, mapping/photogrammetry, and precision flight training.
3. **Contact Information**: Provides official contact channels, operating hours, email, and location.
4. **Registration / Admission**: Step-by-step instructions on applying for training and services.
5. **Service Inquiry (Customer Focus)**: Tailored path for commercial clients with instant enquiry trigger.
6. **Student Guidance (Student Focus)**: Tailored path for aspiring pilots and academic researchers.
7. **Human Representative / Speak to Someone**: Direct handoff to consultation and callback booking.

---

## 5. Technology Stack

| Layer | Technology | Version / Tool | Rationale |
|---|---|---|---|
| **Frontend Framework** | React.js | 18.3+ | Component-driven, robust ecosystem |
| **Language** | TypeScript | 5.x | End-to-end type safety, fewer runtime bugs |
| **Build Tool** | Vite | 5.x | Ultra-fast HMR and optimized production bundles |
| **Styling** | Tailwind CSS + Custom Tokens | 3.4+ | Utility-first, responsive, accessible color system |
| **Icons** | Lucide React | Latest | Clean, modern, lightweight SVG icons |
| **Backend Framework** | Node.js + Express.js | Express 4.x | Lightweight, industry standard for REST APIs |
| **Backend Language** | TypeScript | 5.x | Type safety across controllers, services, and models |
| **ORM** | Prisma ORM | 6.x | Type-safe queries, automated migrations, clean schema |
| **Database** | PostgreSQL | 14+ | ACID compliance, relational integrity, enum support |
| **Security** | Helmet, CORS, Express-Rate-Limit | Standard | Enterprise API hardening and DoS protection |
| **Validation** | Zod | 3.x | Schema declaration and static type inference |

---

## 6. Directory Structure

```
FullStack_Chatbot_Task_Ritesh_Yadav/
├── .env.example
├── .gitignore
├── README.md
├── docs/
│   ├── API.md
│   ├── DATABASE.md
│   └── ARCHITECTURE.md
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── routes/
│       ├── services/
│       ├── types/
│       ├── utils/
│       ├── validators/
│       ├── app.ts
│       └── server.ts
├── frontend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── index.html
│   └── src/
│       ├── assets/
│       ├── chatbot/
│       ├── components/
│       │   ├── common/
│       │   ├── sections/
│       │   ├── chatbot/
│       │   ├── enquiry/
│       │   └── admin/
│       ├── hooks/
│       ├── pages/
│       ├── services/
│       ├── types/
│       ├── utils/
│       ├── validators/
│       ├── App.tsx
│       ├── index.css
│       └── main.tsx
└── 01_Source_Code/ ... (Submission Packages)
```
