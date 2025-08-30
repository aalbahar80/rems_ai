# API Endpoints Documentation

## Table of Contents

1. [Overview](#overview)
2. [API Standards](#api-standards)
3. [Authentication Endpoints](#authentication-endpoints)
4. [Property Management](#property-management)
5. [Tenant Management](#tenant-management)
6. [Financial Management](#financial-management)
7. [Maintenance Management](#maintenance-management)
8. [Reporting & Analytics](#reporting--analytics)
9. [System Management](#system-management)
10. [Error Handling](#error-handling)
11. [Implementation Priority](#implementation-priority)

---

## Overview

The REMS API provides a comprehensive RESTful interface for managing all aspects of the real estate
management system. Built on Node.js with Express, it interfaces with the PostgreSQL database
containing 23 tables across 10 business modules.

### Base URL

```
Development: http://localhost:3001/api/v1
Staging:     https://staging-api.rems.com/api/v1
Production:  https://api.rems.com/api/v1
```

### API Versioning

The API uses URL versioning: `/api/v1/...`

Future versions will maintain backward compatibility or provide migration guides.

---

## API Standards

### Request/Response Format

**Content-Type:** `application/json`

**Standard Response Structure:**

```json
{
  "success": true,
  "data": {},
  "message": "Operation successful",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

**Error Response Structure:**

```json
{
  "success": false,
  "error": {
    "code": "ERR_CODE",
    "message": "Human-readable error message",
    "details": {}
  },
  "timestamp": "2024-01-01T12:00:00Z"
}
```

### HTTP Status Codes

| Code | Meaning               | Usage                          |
| ---- | --------------------- | ------------------------------ |
| 200  | OK                    | Successful GET, PUT            |
| 201  | Created               | Successful POST                |
| 204  | No Content            | Successful DELETE              |
| 400  | Bad Request           | Invalid request data           |
| 401  | Unauthorized          | Missing/invalid authentication |
| 403  | Forbidden             | Insufficient permissions       |
| 404  | Not Found             | Resource doesn't exist         |
| 409  | Conflict              | Duplicate/conflicting data     |
| 422  | Unprocessable Entity  | Validation errors              |
| 500  | Internal Server Error | Server error                   |

### Authentication

**Header:** `Authorization: Bearer <jwt-token>`

**Token Expiration:** 24 hours (configurable)

---

## Authentication Endpoints

### Login

```http
POST /api/v1/auth/login
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "user_type": "owner",
      "full_name": "John Doe"
    },
    "expires_in": "24h"
  }
}
```

### Logout

```http
POST /api/v1/auth/logout
```

**Headers:** `Authorization: Bearer <token>`

### Refresh Token

```http
POST /api/v1/auth/refresh
```

**Headers:** `Authorization: Bearer <expired-token>`

### Get Profile

```http
GET /api/v1/auth/profile
```

**Headers:** `Authorization: Bearer <token>`

### Update Profile

```http
PUT /api/v1/auth/profile
```

**Request Body:**

```json
{
  "full_name": "John Smith",
  "phone": "+965-9999-0001",
  "preferred_language": "en"
}
```

### Password Reset Request

```http
POST /api/v1/auth/password/reset
```

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

### Password Reset Confirmation

```http
PUT /api/v1/auth/password/reset
```

**Request Body:**

```json
{
  "token": "reset-token-from-email",
  "new_password": "newSecurePassword123"
}
```

---

## Property Management

### List Properties

```http
GET /api/v1/properties
```

**Query Parameters:**

- `page` (default: 1)
- `limit` (default: 20)
- `sort` (property_code, property_name, created_at)
- `order` (asc, desc)
- `location` (filter by location)
- `property_type` (residential, commercial, mixed_use)
- `is_active` (true, false)

**Response:**

```json
{
  "success": true,
  "data": {
    "properties": [
      {
        "property_id": 1,
        "property_code": "Z1",
        "property_name": "Richardson Tower One",
        "location": "Salmiya",
        "total_units": 5,
        "property_type": "residential",
        "valuation_amount": 1571785.71
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 15,
      "pages": 1
    }
  }
}
```

### Get Property Details

```http
GET /api/v1/properties/:id
```

**Response includes:**

- Property details
- Current ownership information
- Unit summary
- Active contracts count

### Create Property

```http
POST /api/v1/properties
```

**Request Body:**

```json
{
  "property_code": "Z11",
  "property_name": "New Tower",
  "location": "Kuwait City",
  "address": "Block 4, Street 15",
  "area_sqm": 1200.5,
  "property_type": "residential",
  "construction_year": 2020
}
```

### Update Property

```http
PUT /api/v1/properties/:id
```

### Delete Property

```http
DELETE /api/v1/properties/:id
```

**Note:** Soft delete - sets `is_active = false`

### Get Property Units

```http
GET /api/v1/properties/:id/units
```

### Get Property Owners

```http
GET /api/v1/properties/:id/owners
```

### Search Properties

```http
GET /api/v1/properties/search
```

**Query Parameters:**

- `q` - Search term (searches code, name, location)
- `min_value` - Minimum valuation
- `max_value` - Maximum valuation

---

## Tenant Management

### List Tenants

```http
GET /api/v1/tenants
```

**Query Parameters:**

- `page`, `limit`, `sort`, `order`
- `nationality`
- `has_active_contract` (true, false)
- `search` (name, email, phone)

### Get Tenant Details

```http
GET /api/v1/tenants/:id
```

### Create Tenant

```http
POST /api/v1/tenants
```

**Request Body:**

```json
{
  "first_name": "Ahmed",
  "last_name": "Al-Salem",
  "full_name": "Ahmed Al-Salem",
  "nationality": "Kuwaiti",
  "mobile": "+965-9999-1234",
  "email": "ahmed@example.com",
  "national_id_type": "civil_id",
  "national_id": "290010012345"
}
```

### Update Tenant

```http
PUT /api/v1/tenants/:id
```

### Get Tenant Contracts

```http
GET /api/v1/tenants/:id/contracts
```

### Get Tenant Payment History

```http
GET /api/v1/tenants/:id/payments
```

---

## Financial Management

### Invoices

#### List Invoices

```http
GET /api/v1/invoices
```

**Query Parameters:**

- `status` (draft, sent, paid, overdue)
- `invoice_type` (rental, expense, deposit, late_fee)
- `entity_type` (rental_contract, maintenance_order)
- `date_from`, `date_to`

#### Create Invoice

```http
POST /api/v1/invoices
```

**Request Body:**

```json
{
  "invoice_type": "rental",
  "entity_id": 1,
  "entity_type": "rental_contract",
  "due_date": "2024-01-31",
  "total_amount": 450.0,
  "description": "Monthly rent - January 2024",
  "is_recurring": true,
  "recurring_frequency": "monthly"
}
```

#### Send Invoice

```http
POST /api/v1/invoices/:id/send
```

**Sends invoice via email to tenant/owner**

#### Get Overdue Invoices

```http
GET /api/v1/invoices/overdue
```

### Receipts

#### Create Receipt

```http
POST /api/v1/receipts
```

**Request Body:**

```json
{
  "invoice_id": 1,
  "amount_received": 450.0,
  "payment_method": "bank_transfer",
  "payment_provider": "NBK",
  "external_transaction_id": "TXN-123456"
}
```

#### List Receipts

```http
GET /api/v1/receipts
```

### Transactions

#### Rental Transactions

```http
GET /api/v1/transactions/rental
POST /api/v1/transactions/rental
```

#### Expense Transactions

```http
GET /api/v1/transactions/expenses
POST /api/v1/transactions/expenses
```

**Request Body for Expense:**

```json
{
  "property_id": 1,
  "expense_category_id": 2,
  "expense_type_id": 5,
  "vendor_id": 3,
  "amount": 150.0,
  "description": "Plumbing repair",
  "expense_date": "2024-01-15"
}
```

---

## Maintenance Management

### List Maintenance Orders

```http
GET /api/v1/maintenance
```

**Query Parameters:**

- `status` (submitted, approved, in_progress, completed)
- `priority` (low, medium, high, emergency)
- `requestor_type` (tenant, owner)
- `property_id`

### Create Maintenance Order

```http
POST /api/v1/maintenance
```

**Request Body:**

```json
{
  "unit_id": 5,
  "property_id": 1,
  "tenant_id": 3,
  "requestor_type": "tenant",
  "expense_type_id": 11,
  "title": "AC Not Working",
  "description": "Air conditioning unit not cooling",
  "priority": "high",
  "estimated_cost": 200.0
}
```

### Update Maintenance Order

```http
PUT /api/v1/maintenance/:id
```

### Assign to Vendor

```http
POST /api/v1/maintenance/:id/assign
```

**Request Body:**

```json
{
  "vendor_id": 4,
  "scheduled_date": "2024-01-20T10:00:00Z",
  "estimated_duration_hours": 3
}
```

### Update Status

```http
PUT /api/v1/maintenance/:id/status
```

**Request Body:**

```json
{
  "status": "in_progress",
  "notes": "Vendor has started work"
}
```

### Get Pending Orders

```http
GET /api/v1/maintenance/pending
```

---

## Reporting & Analytics

### Dashboard Overview

```http
GET /api/v1/dashboard/overview
```

**Response:**

```json
{
  "success": true,
  "data": {
    "properties_total": 15,
    "units_total": 26,
    "units_occupied": 22,
    "occupancy_rate": 84.6,
    "monthly_income": 12500.0,
    "pending_maintenance": 5,
    "overdue_payments": 3,
    "expiring_contracts": 2
  }
}
```

### Occupancy Report

```http
GET /api/v1/reports/occupancy
```

**Query Parameters:**

- `property_id` (optional)
- `date_from`, `date_to`
- `group_by` (property, month)

### Income Report

```http
GET /api/v1/reports/income
```

**Query Parameters:**

- `year` (required)
- `month` (optional)
- `property_id` (optional)

### Expense Report

```http
GET /api/v1/reports/expenses
```

**Query Parameters:**

- `date_from`, `date_to`
- `category_id`
- `property_id`

### Maintenance Report

```http
GET /api/v1/reports/maintenance
```

### Trend Analysis

```http
GET /api/v1/analytics/trends
```

**Query Parameters:**

- `metric` (income, expenses, occupancy)
- `period` (monthly, quarterly, yearly)
- `year`

---

## System Management

### System Settings

```http
GET /api/v1/system/settings
PUT /api/v1/system/settings
```

### Currencies

```http
GET /api/v1/system/currencies
```

### Audit Logs

```http
GET /api/v1/audit/logs
```

**Query Parameters:**

- `table_name`
- `entity_id`
- `operation_type` (INSERT, UPDATE, DELETE)
- `date_from`, `date_to`

### Notifications

```http
GET /api/v1/notifications
```

**Query Parameters:**

- `is_read` (true, false)
- `type` (info, warning, error, maintenance)

### Mark Notification as Read

```http
PUT /api/v1/notifications/:id/read
```

### File Upload

```http
POST /api/v1/upload
```

**Request:**

- Method: `multipart/form-data`
- Field name: `file`
- Max size: 10MB

**Response:**

```json
{
  "success": true,
  "data": {
    "filename": "uploaded_file_123456.pdf",
    "url": "/api/v1/files/uploaded_file_123456.pdf",
    "size": 245632,
    "mimetype": "application/pdf"
  }
}
```

---

## Error Handling

### Common Error Codes

| Code                      | Description              | Example                          |
| ------------------------- | ------------------------ | -------------------------------- |
| `AUTH_REQUIRED`           | Authentication required  | Missing token                    |
| `AUTH_INVALID`            | Invalid authentication   | Expired token                    |
| `PERMISSION_DENIED`       | Insufficient permissions | Tenant accessing owner endpoints |
| `VALIDATION_ERROR`        | Input validation failed  | Invalid email format             |
| `NOT_FOUND`               | Resource not found       | Property doesn't exist           |
| `DUPLICATE_ENTRY`         | Duplicate data           | Email already exists             |
| `FOREIGN_KEY_VIOLATION`   | Related data constraint  | Deleting property with units     |
| `BUSINESS_RULE_VIOLATION` | Business logic error     | Contract dates invalid           |

### Error Response Example

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "fields": {
        "email": "Invalid email format",
        "monthly_rent": "Must be a positive number"
      }
    }
  },
  "timestamp": "2024-01-01T12:00:00Z"
}
```

---

## Implementation Priority

### Phase 1: Core Functionality (Week 1-2)

1. **Authentication Module**
   - Login/Logout
   - Token management
   - Profile management

2. **Property Management**
   - CRUD operations
   - Unit management

3. **Tenant Management**
   - CRUD operations
   - Contract creation

### Phase 2: Financial (Week 3-4)

1. **Invoice System**
   - Invoice generation
   - Payment recording

2. **Transaction Management**
   - Rental transactions
   - Basic reporting

### Phase 3: Operations (Week 5-6)

1. **Maintenance System**
   - Order creation
   - Vendor assignment

2. **Dashboard & Reports**
   - Basic metrics
   - Occupancy reports

### Phase 4: Advanced Features (Week 7-8)

1. **Advanced Analytics**
   - Trend analysis
   - Predictive metrics

2. **System Management**
   - Settings
   - Audit logs
   - Notifications

---

## Testing Endpoints

### Postman Collection

Import the following collection for testing:

```json
{
  "info": {
    "name": "REMS API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{jwt_token}}",
        "type": "string"
      }
    ]
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:3001/api/v1"
    },
    {
      "key": "jwt_token",
      "value": ""
    }
  ]
}
```

### cURL Examples

**Login:**

```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@rems.local","password":"password"}'
```

**Get Properties:**

```bash
curl -X GET http://localhost:3001/api/v1/properties \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Rate Limiting

Default limits (configurable in .env):

- **Anonymous**: 100 requests per 15 minutes
- **Authenticated**: 1000 requests per 15 minutes
- **File Upload**: 10 requests per hour

Headers returned:

- `X-RateLimit-Limit`: Request limit
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Reset timestamp

---

## Webhooks (Future)

Planned webhook events:

- `contract.created`
- `contract.expiring`
- `payment.received`
- `maintenance.completed`
- `invoice.overdue`

---

_Last Updated: [23/08/2025]_  
_API Version: 1.0_
