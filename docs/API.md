# DroneTV AI Support & Lead Assistant - REST API Specification

## 1. Overview & Conventions

- **Base URL**: `/api`
- **Protocol**: HTTP/1.1 or HTTP/2
- **Data Format**: JSON (`Content-Type: application/json`)
- **Authentication**: None required (open public lead capture + admin dashboard demo as per assignment specification)
- **Standard Envelope**: All responses return a consistent envelope structure.

### Standard Response Formats

#### Success Response
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

#### Error Response
```json
{
  "success": false,
  "message": "User-friendly description of the error",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

---

## 2. API Endpoints

### 2.1. Health Check
- **URL**: `GET /api/health`
- **Description**: Returns server uptime, environment status, and database connection state.
- **Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2026-10-04T12:00:00.000Z",
    "uptime": 124.5,
    "database": "connected"
  }
}
```

---

### 2.2. List All Enquiries
- **URL**: `GET /api/enquiries`
- **Query Parameters**:
  - `search` *(optional, string)*: Filter by matching name, email, or message text.
  - `userType` *(optional, string)*: Filter by `Student`, `Customer`, or `Other`.
  - `status` *(optional, string)*: Filter by `New`, `Contacted`, `InProgress`, or `Closed`.
  - `page` *(optional, integer, default: 1)*: Page number for pagination.
  - `limit` *(optional, integer, default: 50)*: Number of records per page.
  - `sortBy` *(optional, string, default: 'createdAt')*: Column to sort by.
  - `order` *(optional, string, default: 'desc')*: Sort order (`asc` or `desc`).
- **Response**: `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "clxyz12340001",
      "name": "Priya Sharma",
      "email": "priya.sharma@example.com",
      "phone": "+91-9876543210",
      "userType": "Student",
      "serviceInterest": "Drone Pilot Certification Course",
      "message": "Interested in batch timings and eligibility requirements.",
      "status": "New",
      "createdAt": "2026-10-04T10:30:00.000Z",
      "updatedAt": "2026-10-04T10:30:00.000Z"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 50,
    "totalPages": 1
  }
}
```

---

### 2.3. Get Enquiry by ID
- **URL**: `GET /api/enquiries/:id`
- **URL Parameters**: `id` *(string, cuid format)*
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "id": "clxyz12340001",
    "name": "Priya Sharma",
    "email": "priya.sharma@example.com",
    "phone": "+91-9876543210",
    "userType": "Student",
    "serviceInterest": "Drone Pilot Certification Course",
    "message": "Interested in batch timings and eligibility requirements.",
    "status": "New",
    "createdAt": "2026-10-04T10:30:00.000Z",
    "updatedAt": "2026-10-04T10:30:00.000Z"
  }
}
```
- **Response `404 Not Found`**:
```json
{
  "success": false,
  "message": "Enquiry with ID 'clxyz_invalid' not found"
}
```

---

### 2.4. Create a New Enquiry
- **URL**: `POST /api/enquiries`
- **Request Body**:
```json
{
  "name": "Rajesh Kumar",
  "email": "rajesh.kumar@agritech.in",
  "phone": "+91-9123456789",
  "userType": "Customer",
  "serviceInterest": "Agricultural Crop Health Survey",
  "message": "Requesting a quote for 400 acres multispectral drone survey."
}
```
- **Validation Rules**:
  - `name`: Required, 2-150 characters, trimmed.
  - `email`: Required, valid RFC 5322 email format.
  - `phone`: Optional, 7-20 characters if provided, valid international format.
  - `userType`: Required, must be one of `['Student', 'Customer', 'Other']`.
  - `serviceInterest`: Optional, max 255 characters.
  - `message`: Required, min 5 characters, max 3000 characters.
- **Response `201 Created`**:
```json
{
  "success": true,
  "message": "Enquiry submitted successfully",
  "data": {
    "id": "clxyz12340002",
    "name": "Rajesh Kumar",
    "email": "rajesh.kumar@agritech.in",
    "phone": "+91-9123456789",
    "userType": "Customer",
    "serviceInterest": "Agricultural Crop Health Survey",
    "message": "Requesting a quote for 400 acres multispectral drone survey.",
    "status": "New",
    "createdAt": "2026-10-04T11:00:00.000Z",
    "updatedAt": "2026-10-04T11:00:00.000Z"
  }
}
```
- **Response `400 Bad Request`**:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

---

### 2.5. Update Enquiry Status / Details
- **URL**: `PATCH /api/enquiries/:id`
- **URL Parameters**: `id` *(string)*
- **Request Body**:
```json
{
  "status": "Contacted"
}
```
- **Validation Rules**:
  - `status`: Must be one of `['New', 'Contacted', 'InProgress', 'Closed']`.
- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "Enquiry updated successfully",
  "data": {
    "id": "clxyz12340001",
    "name": "Priya Sharma",
    "email": "priya.sharma@example.com",
    "status": "Contacted",
    "updatedAt": "2026-10-04T11:15:00.000Z"
  }
}
```

---

### 2.6. Delete an Enquiry
- **URL**: `DELETE /api/enquiries/:id`
- **URL Parameters**: `id` *(string)*
- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "Enquiry successfully deleted",
  "data": {
    "id": "clxyz12340001"
  }
}
```
- **Response `404 Not Found`**:
```json
{
  "success": false,
  "message": "Enquiry with ID 'clxyz_invalid' not found"
}
```

---

## 3. Status Code Summary

| HTTP Status | Meaning | When Used |
|---|---|---|
| **200 OK** | Request succeeded | Standard response for GET, PATCH, DELETE |
| **201 Created** | Resource created | Successful POST `/api/enquiries` |
| **400 Bad Request** | Client error / Validation failure | Missing required fields, invalid format |
| **404 Not Found** | Resource does not exist | Invalid enquiry ID or non-existent endpoint |
| **429 Too Many Requests** | Rate limit exceeded | Exceeded 100 requests / 15 minutes window |
| **500 Internal Server Error** | Unexpected server condition | Generic safe error message (no stack traces exposed) |
