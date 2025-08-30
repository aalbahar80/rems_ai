# REMS Backend API Implementation Plan

**Created:** August 29, 2025  
**Status:** Planning Phase  
**Priority:** Phase 2 - Backend API Development

## 📋 Current State Analysis

### ✅ Environment Status

- **Node.js:** v24.6.0 ✅ (Installed)
- **npm:** v11.5.1 ✅ (Installed)
- **Dependencies:** ❌ **NOT INSTALLED** - Require `npm install`
- **Database:** ✅ PostgreSQL 15 with complete schema and seed data

### 🚨 Critical Discovery

**Package Dependencies Status:**

- ✅ `package.json` files exist (root and backend)
- ❌ `node_modules/` directories missing
- ❌ Dependencies not installed via `npm install`

**Required Action:** Run `npm install` in both root and backend directories before API development

### 📊 Database Schema Highlight

**Owner-Property Relationship Support:**

- Table: `rems.property_ownership` - Tracks shared ownership percentages
- Table: `rems.ownership_periods` - Temporal ownership tracking
- **Frontend Requirement:** APIs must support filtering properties by owner and displaying ownership
  percentages

## 🚀 Implementation Plan - Sequential Steps

### **Phase 1: Environment Setup & Database Foundation**

#### 1. **Package Installation**

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install
```

#### 2. **Database Connection Module**

Create `backend/src/config/database.js`

- PostgreSQL connection pool setup
- Connection validation and error handling
- Environment variable configuration

#### 3. **Project Structure Setup**

```
backend/src/
├── config/
│   ├── database.js
│   └── environment.js
├── middleware/
│   ├── auth.js
│   ├── validation.js
│   └── errorHandler.js
├── routes/
│   ├── auth.js
│   ├── properties.js
│   ├── tenants.js
│   └── index.js
├── controllers/
│   ├── authController.js
│   ├── propertyController.js
│   └── tenantController.js
├── models/
│   ├── User.js
│   ├── Property.js
│   └── Tenant.js
└── utils/
    ├── jwt.js
    ├── validation.js
    └── responses.js
```

#### 4. **Database Test Endpoints**

Update `backend/server.js`:

- Add database connection test endpoint `/api/v1/health/db`
- Verify schema table count and seed data
- Test basic CRUD operations

### **Phase 2: Authentication System**

#### 5. **Authentication Infrastructure**

Create `backend/src/config/environment.js`:

- JWT secret and expiration configuration
- Database connection parameters
- Security settings

#### 6. **Auth Middleware**

Create `backend/src/middleware/auth.js`:

- JWT token verification
- User role-based access control (Admin, Owner, Tenant, Vendor)
- Request authentication wrapper

#### 7. **User Management**

Create `backend/src/models/User.js`:

- User model with PostgreSQL queries
- Password hashing with bcryptjs
- Session management

#### 8. **Auth Routes & Controllers**

Create `backend/src/routes/auth.js`:

- `POST /api/v1/auth/login` - User authentication
- `POST /api/v1/auth/logout` - Session termination
- `GET /api/v1/auth/profile` - User profile retrieval
- `PUT /api/v1/auth/profile` - Profile updates
- `POST /api/v1/auth/password/reset` - Password reset request
- `PUT /api/v1/auth/password/reset` - Password reset confirmation

Create `backend/src/controllers/authController.js`:

- Login logic with JWT generation
- Password validation and hashing
- Profile management operations

### **Phase 3: Core API Endpoints**

#### 9. **Properties API** (Enhanced for Ownership)

Create `backend/src/routes/properties.js`:

- `GET /api/v1/properties` - List properties with pagination
- `GET /api/v1/properties/:id` - Property details with ownership info
- `POST /api/v1/properties` - Create property
- `PUT /api/v1/properties/:id` - Update property
- `DELETE /api/v1/properties/:id` - Soft delete property
- `GET /api/v1/properties/:id/units` - Property units
- **`GET /api/v1/properties/:id/owners`** - Property owners with percentages
- **`GET /api/v1/properties/owner/:ownerId`** - Properties by specific owner
- **`GET /api/v1/properties/owner/:ownerId/ownership`** - Ownership details with percentages
- `GET /api/v1/properties/search` - Property search

Create `backend/src/controllers/propertyController.js`:

- CRUD operations for properties table
- **Ownership relationship queries with percentage calculations**
- **Owner-property filtering and aggregation**
- Unit management integration

#### 10. **Tenants API**

Create `backend/src/routes/tenants.js`:

- `GET /api/v1/tenants` - List tenants with filters
- `GET /api/v1/tenants/:id` - Tenant details
- `POST /api/v1/tenants` - Create tenant
- `PUT /api/v1/tenants/:id` - Update tenant
- `GET /api/v1/tenants/:id/contracts` - Tenant contracts
- `GET /api/v1/tenants/:id/payments` - Payment history

Create `backend/src/controllers/tenantController.js`:

- Tenant CRUD operations
- Contract lifecycle management
- Payment history queries

### **Phase 4: Utility & Error Handling**

#### 11. **Middleware & Utilities**

Create `backend/src/middleware/validation.js`:

- Request body validation
- Parameter sanitization
- Input security checks

Create `backend/src/middleware/errorHandler.js`:

- Global error handling
- Standardized error responses
- Logging integration

Create `backend/src/utils/responses.js`:

- Standardized API response format
- Success/error response helpers
- Pagination utilities

#### 12. **Server Integration**

Update `backend/server.js`:

- Import all route modules
- Apply middleware stack
- Configure API versioning structure `/api/v1`
- Add comprehensive error handling

## 📦 Dependencies Status

### ✅ Already Defined in package.json:

- `express` - API framework
- `pg` - PostgreSQL integration
- `jsonwebtoken` - JWT authentication
- `bcryptjs` - Password hashing
- `cors`, `helmet`, `morgan` - Middleware
- `nodemailer` - Email notifications
- `jest`, `supertest` - Testing framework

### ❌ Installation Required:

**Must run `npm install` before development begins**

## 🎯 API Endpoints Priority

### **Tier 1: Foundation (Week 1)**

1. **Environment Setup** - npm install, directory structure
2. **Database Connection** - Health check and connection verification
3. **Authentication** - Login/logout/profile management
4. **Properties API** - Core CRUD with ownership support

### **Tier 2: Core Operations (Week 2)**

5. **Tenants API** - Tenant management and contracts
6. **Owner-Property APIs** - Ownership percentage queries
7. **Basic Reporting** - Dashboard overview endpoint
8. **Error Handling** - Comprehensive error management

### **Tier 3: Advanced Features (Week 3-4)**

9. **Financial APIs** - Invoices, receipts, transactions
10. **Maintenance APIs** - Work orders and vendor management
11. **Advanced Reporting** - Analytics and trend data

## 🏢 Special Focus: Owner-Property Relationships

### Database Tables Utilized:

- `rems.properties` - Property master data
- `rems.property_ownership` - Current ownership records
- `rems.ownership_periods` - Historical ownership periods
- `rems.owners` - Owner information

### Frontend Support Features:

1. **Properties by Owner:** Filter properties belonging to specific owner
2. **Ownership Percentages:** Display shared ownership percentages
3. **Ownership History:** Track ownership changes over time
4. **Multi-Owner Properties:** Handle properties with multiple owners

### Key API Enhancements:

```javascript
// Example API Response Structure
{
  "property_id": 1,
  "property_name": "Richardson Tower One",
  "owners": [
    {
      "owner_id": 2,
      "owner_name": "Sarah Johnson",
      "ownership_percentage": 60.00,
      "valid_from": "2023-01-01",
      "valid_to": null
    },
    {
      "owner_id": 5,
      "owner_name": "Hassan Al-Rashid",
      "ownership_percentage": 40.00,
      "valid_from": "2023-01-01",
      "valid_to": null
    }
  ]
}
```

## 🔧 Implementation Sequence

**Step 1:** Environment setup and package installation  
**Step 2:** Database connection and health endpoints  
**Step 3:** Authentication system with JWT  
**Step 4:** Properties API with ownership functionality  
**Step 5:** Tenants API with contract management  
**Step 6:** Integration testing and documentation

## ⚠️ Critical Notes

1. **Dependencies Installation Required** - `npm install` must be run before development
2. **Owner-Property Relationships** - APIs must support shared ownership percentages
3. **Database Schema Utilization** - Leverage existing 23-table structure
4. **API Documentation Alignment** - Follow `docs/development_enviroment/API_ENDPOINTS.md`
5. **Multi-Portal Support** - Consider different user roles (Admin, Owner, Tenant, Vendor)

---

_This implementation plan addresses the complete backend API development with special attention to
owner-property relationship functionality and dependency installation requirements._
