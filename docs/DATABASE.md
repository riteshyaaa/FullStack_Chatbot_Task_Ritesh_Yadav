# VAYUDHARA AERO - Database Documentation

## 1. Database Overview

- **Database Engine**: PostgreSQL 14+ (Relational Database Management System)
- **Object-Relational Mapping (ORM)**: Prisma ORM v6
- **Schema Location**: `backend/prisma/schema.prisma`
- **Table Name**: `enquiries`

---

## 2. Entity Relationship & Data Model

### `Enquiry` Model

| Column Name | Data Type | Modifiers / Constraints | Default Value | Description |
|---|---|---|---|---|
| `id` | `String` | `@id`, `@default(cuid())`, Primary Key | Generated `cuid` | URL-safe, globally unique identifier |
| `name` | `String` | `@db.VarChar(150)`, Not Null | None | Full name of the applicant or client |
| `email` | `String` | `@db.VarChar(255)`, Not Null | None | Verified contact email address |
| `phone` | `String` | `@db.VarChar(20)`, Nullable | `null` | Contact telephone number (supports international format) |
| `userType` | `UserType` (Enum) | Not Null | `Other` | Role: `'Student'`, `'Customer'`, or `'Other'` |
| `serviceInterest` | `String` | `@db.VarChar(255)`, Nullable | `null` | Drone service or course title of interest |
| `message` | `String` | `@db.Text`, Not Null | None | Detailed enquiry or message content |
| `status` | `EnquiryStatus` (Enum) | Not Null | `New` | Lifecycle status: `'New'`, `'Contacted'`, `'InProgress'`, `'Closed'` |
| `createdAt` | `DateTime` | `@default(now())`, Not Null | Current UTC timestamp | Timestamp when enquiry was created |
| `updatedAt` | `DateTime` | `@updatedAt`, Not Null | Auto-updated UTC timestamp | Timestamp of last status or content modification |

---

## 3. Enumerations

### `UserType` Enum
- `Student`: Aspiring drone pilots, university researchers, certification seekers.
- `Customer`: Commercial businesses, agricultural managers, infrastructure firms.
- `Other`: General public, press, media, academic partners.

### `EnquiryStatus` Enum
- `New`: Unprocessed initial lead submission.
- `Contacted`: DroneTV representative reached out via email/phone.
- `InProgress`: Active consultation, quotation discussion, or enrollment counseling.
- `Closed`: Completed engagement, successful admission, or resolved enquiry.

---

## 4. Indexes & Performance Optimization

```prisma
@@index([status])
@@index([userType])
@@index([email])
@@index([createdAt])
@@index([status, createdAt])
@@map("enquiries")
```

- **`status` Index**: Accelerates administrative dashboard tab filtering (e.g., viewing all `New` enquiries).
- **`userType` Index**: Enables fast segregation between student applicants and commercial customer leads.
- **`email` Index**: Allows rapid lookup to group prior enquiries from the same user.
- **`createdAt` Index**: Optimizes descending chronological sorting (`ORDER BY createdAt DESC`).
- **Composite `[status, createdAt]` Index**: Specifically optimizes the primary dashboard query: fetching recent enquiries filtered by status.

---

## 5. Prisma Schema (`backend/prisma/schema.prisma`)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

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

---

## 6. Seed Data & Verification

The seed script (`backend/prisma/seed.ts`) populates realistic initial data for testing and demonstrations:
- Drone Pilot Certification enquiry from a student.
- Agricultural Drone Survey inquiry from a farm estate manager.
- Aerial Cinematography collaboration enquiry from a media producer.
- Infrastructure Inspection request from a public works official.
- Academic Research inquiry from a university scholar.

### Running Migrations & Seeding:
```bash
# Push schema to database
npx prisma db push

# Or run Prisma migrations
npx prisma migrate dev --name init

# Seed the database
npx prisma db seed
```
