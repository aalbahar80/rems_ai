# 🔐 User Authentication Module - REMS Database

**Module Purpose**: Comprehensive user authentication, session management, security controls, and
multi-portal access with polymorphic user-entity relationships.

**Last Updated**: September 2, 2025  
**Database Schema**: `rems`  
**Tables**: 4 authentication tables  
**Related Views**: 6 security analytics views

---

## 📊 Module Overview

The User Authentication module provides enterprise-grade security and user management supporting
multiple user types (admin, accountant, owner, tenant, vendor, maintenance staff) with sophisticated
session management, security controls, and multi-portal access. The system features polymorphic
user-entity relationships, enabling flexible user associations across different business entities.

```
USER AUTHENTICATION ARCHITECTURE
├── 👥 Users (Multi-Type User Management)
│   ├── Polymorphic relationships → Links to owners, tenants, vendors dynamically
│   ├── Multiple user types → Admin, accountant, owner, tenant, vendor, staff
│   ├── Security features → Password hashing, 2FA ready, account lockout
│   └── Customization → Permissions, settings, preferences per user
│
├── 🖥️ User Sessions (Advanced Session Management)
│   ├── Device fingerprinting → Browser, OS, device identification
│   ├── Geographic tracking → IP address and location monitoring
│   ├── Remember me functionality → Extended session support
│   └── Activity tracking → Last activity and automatic timeout
│
├── 🔑 Password Management (Security & Recovery)
│   ├── Secure password resets → Token-based with expiration
│   ├── IP and device tracking → Reset request security monitoring
│   ├── One-time use tokens → Prevents token replay attacks
│   └── Audit trail → Complete password change history
│
├── 📊 Login Analytics (Security Monitoring)
│   ├── Success/failure tracking → Login attempt monitoring
│   ├── Device and browser analysis → Security pattern detection
│   ├── Geographic patterns → Location-based security analysis
│   └── Session duration tracking → User behavior analytics
│
└── 🔒 Security Features (Advanced Protection)
    ├── Account lockout → Configurable attempts and duration
    ├── Two-factor authentication → TOTP ready infrastructure
    ├── Email verification → Account activation and security
    └── Permission system → JSON-based flexible authorization
```

---

## 🗃️ Table Definitions

### 1. **users** - Multi-Type User Management

Central user table supporting multiple user types with polymorphic entity relationships.

```sql
CREATE TABLE rems.users (
    user_id             SERIAL PRIMARY KEY,
    username            VARCHAR NOT NULL UNIQUE,
    email               VARCHAR NOT NULL UNIQUE,
    password_hash       VARCHAR NOT NULL,
    -- User classification
    user_type           VARCHAR NOT NULL DEFAULT 'tenant',
    related_entity_id   INTEGER,
    related_entity_type VARCHAR,
    -- Localization
    preferred_language  VARCHAR DEFAULT 'en',
    timezone            VARCHAR DEFAULT 'Asia/Kuwait',
    -- Account status
    is_active           BOOLEAN DEFAULT true,
    email_verified      BOOLEAN DEFAULT false,
    email_verified_at   TIMESTAMP,
    -- Security tracking
    last_login          TIMESTAMP,
    login_attempts      INTEGER DEFAULT 0,
    locked_until        TIMESTAMP,
    -- Flexible data
    permissions         JSONB DEFAULT '{}',
    settings            JSONB DEFAULT '{}',
    -- Profile information
    profile_image       VARCHAR,
    phone               VARCHAR,
    -- Two-factor authentication
    two_factor_enabled  BOOLEAN DEFAULT false,
    two_factor_secret   VARCHAR,
    -- Audit
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Business logic constraints
    CHECK (user_type IN ('admin', 'accountant', 'owner', 'tenant', 'vendor', 'maintenance_staff')),
    CHECK (related_entity_type IS NULL OR related_entity_type IN ('owner', 'tenant', 'vendor')),
    CHECK (preferred_language IN ('en', 'ar', 'fr', 'es', 'de')),
    CHECK (login_attempts >= 0),
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);
```

**Key Features:**

- **Multi-Type Support**: Admin, accountant, owner, tenant, vendor, maintenance staff
- **Polymorphic Relationships**: Flexible linking to owners, tenants, vendors via related*entity*\*
  fields
- **Security Controls**: Password hashing, account lockout, two-factor authentication ready
- **Internationalization**: Multi-language and timezone support
- **Flexible Permissions**: JSON-based permission system for granular access control
- **Account Verification**: Email verification with timestamp tracking
- **Profile Management**: Custom settings and profile image support

---

### 2. **user_sessions** - Advanced Session Management

Comprehensive session management with device fingerprinting and security monitoring.

```sql
CREATE TABLE rems.user_sessions (
    session_id      VARCHAR PRIMARY KEY,
    user_id         INTEGER NOT NULL REFERENCES users(user_id),
    -- Network and device information
    ip_address      INET,
    user_agent      TEXT,
    device_info     JSONB,
    -- Session lifecycle
    login_time      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    logout_time     TIMESTAMP,
    last_activity   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active       BOOLEAN DEFAULT true,
    expires_at      TIMESTAMP NOT NULL,
    -- Extended session support
    remember_token  VARCHAR,
    -- Geographic tracking
    location_info   JSONB,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Key Features:**

- **Device Fingerprinting**: Browser, OS, and device identification stored as JSON
- **Geographic Tracking**: IP address and location information for security monitoring
- **Session Lifecycle**: Complete tracking from login to logout with activity updates
- **Remember Me Functionality**: Extended session support with remember tokens
- **Security Monitoring**: IP address tracking and device analysis for anomaly detection
- **Automatic Cleanup**: Expired session identification for maintenance

---

### 3. **password_resets** - Secure Password Recovery

Token-based password reset system with security tracking and one-time use enforcement.

```sql
CREATE TABLE rems.password_resets (
    reset_id    SERIAL PRIMARY KEY,
    user_id     INTEGER NOT NULL REFERENCES users(user_id),
    token       VARCHAR NOT NULL UNIQUE,
    -- Security tracking
    ip_address  INET,
    user_agent  TEXT,
    -- Token lifecycle
    expires_at  TIMESTAMP NOT NULL,
    used_at     TIMESTAMP,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Business logic constraints
    CHECK (expires_at > created_at)
);
```

**Key Features:**

- **Secure Token System**: Unique, time-limited tokens for password reset
- **One-Time Use**: Tokens marked as used to prevent replay attacks
- **Security Tracking**: IP address and user agent for reset request monitoring
- **Expiration Management**: Time-limited tokens with automatic expiration
- **Audit Trail**: Complete history of password reset requests and usage

---

### 4. **login_history** - Security Analytics & Monitoring

Comprehensive login tracking for security analysis and user behavior monitoring.

```sql
CREATE TABLE rems.login_history (
    login_id         SERIAL PRIMARY KEY,
    user_id          INTEGER REFERENCES users(user_id),
    username         VARCHAR,
    -- Login classification
    login_type       VARCHAR DEFAULT 'web',
    -- Device and network information
    ip_address       INET,
    device_info      TEXT,
    browser_info     TEXT,
    location         VARCHAR,
    -- Login result
    success          BOOLEAN NOT NULL,
    failure_reason   VARCHAR,
    session_duration INTERVAL,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Business logic constraints
    CHECK (login_type IN ('web', 'mobile', 'api', 'system')),
    CHECK (success = true OR failure_reason IS NOT NULL)
);
```

**Key Features:**

- **Comprehensive Tracking**: Both successful and failed login attempts
- **Multi-Platform Support**: Web, mobile, API, and system login tracking
- **Security Analysis**: Failure reasons and pattern detection for threat analysis
- **Device Intelligence**: Browser and device information for security profiling
- **Session Analytics**: Duration tracking for user behavior analysis
- **Geographic Monitoring**: Location tracking for anomaly detection

---

## 🔗 Relationship Diagram

```
                           USERS (Central Authentication)
                               |
                   ┌───────────┼───────────┐
                   |           |           |
            USER_SESSIONS  PASSWORD_RESETS  LOGIN_HISTORY
                   |           |           |
            (Active Sessions) (Security)  (Analytics)


            POLYMORPHIC RELATIONSHIPS
                   |
        ┌──────────┼──────────┐
        |          |          |
     OWNERS    TENANTS    VENDORS

Relationship Details:
- Users → Central authentication for all user types
- User Sessions → Active session tracking with device fingerprinting
- Password Resets → Secure recovery with one-time tokens
- Login History → Complete audit trail for security analysis
- Polymorphic Links → Users dynamically linked to business entities
```

---

## 🎯 Polymorphic User-Entity Relationships

### **Dynamic Entity Linking**

The system supports flexible user associations through polymorphic relationships:

```sql
-- User-Entity Relationship Examples:
-- Owner user linked to owner entity
user_type = 'owner', related_entity_type = 'owner', related_entity_id = owner_id

-- Tenant user linked to tenant entity
user_type = 'tenant', related_entity_type = 'tenant', related_entity_id = tenant_id

-- Vendor user linked to vendor entity
user_type = 'vendor', related_entity_type = 'vendor', related_entity_id = vendor_id

-- Admin/staff users (no entity relationship)
user_type = 'admin', related_entity_type = NULL, related_entity_id = NULL
```

### **Multi-Portal Access Control**

Users access different portals based on their type and entity relationships:

```sql
-- Portal Access Matrix:
user_type = 'admin' → Admin Portal (full system access)
user_type = 'accountant' → Accountant Portal (financial operations)
user_type = 'owner' → Owner Portal (portfolio management)
user_type = 'tenant' → Tenant Portal (rent, maintenance, communications)
user_type = 'vendor' → Vendor Portal (work orders, invoicing)
user_type = 'maintenance_staff' → Staff Portal (order management)
```

---

## 📈 Authentication Business Intelligence Views

The system includes 6 specialized views for security analytics and user management:

### **User Management Views**

1. **active_users_summary** - Active user overview with type distribution and status
2. **user_permissions_summary** - Permission analysis and role distribution
3. **firm_users_overview** - Multi-tenant user assignment and access analysis

### **Security Analytics Views**

4. **login_analytics** - Login success rates, failure patterns, and security metrics
5. **user_session_analytics** - Session duration, device usage, and activity patterns
6. **user_notifications_summary** - User engagement and notification preferences

---

## 🔧 Authentication Workflows Supported

### **User Registration & Onboarding**

1. **Account Creation**

   ```
   Create User → Set User Type → Link to Entity (if applicable) → Send Verification Email → Activate Account
   ```

2. **Multi-Portal Onboarding**
   ```
   Determine User Type → Assign Portal Access → Configure Permissions → Set Preferences → Complete Profile
   ```

### **Authentication & Session Management**

1. **Login Process**

   ```
   Username/Password → Validate Credentials → Check Account Status → Create Session → Track Login → Redirect to Portal
   ```

2. **Security Monitoring**
   ```
   Monitor Login Attempts → Detect Patterns → Apply Account Lockout → Send Security Alerts → Update Analytics
   ```

### **Password Management**

1. **Password Reset**

   ```
   Request Reset → Validate User → Generate Token → Send Email → Verify Token → Update Password → Invalidate Token
   ```

2. **Security Verification**
   ```
   Track Reset Requests → Monitor IP Patterns → Detect Anomalies → Apply Security Controls → Update Audit Log
   ```

---

## 🛡️ Advanced Security Features

### **Account Lockout System**

Configurable account protection against brute force attacks:

```sql
-- Lockout logic based on failed attempts:
- 3 failed attempts → 5 minute lockout
- 5 failed attempts → 15 minute lockout
- 10 failed attempts → 1 hour lockout
- Pattern-based lockout → IP-based blocking
```

### **Two-Factor Authentication Ready**

Infrastructure prepared for 2FA implementation:

- **TOTP Support**: Time-based one-time password secret storage
- **Backup Codes**: Ready for recovery code implementation
- **Device Trust**: Framework for trusted device management
- **Enforcement Rules**: Configurable 2FA requirement by user type

### **Session Security**

Advanced session management features:

- **Device Fingerprinting**: Browser and OS identification
- **Concurrent Session Limits**: Maximum active sessions per user
- **Geographic Validation**: Location-based access control
- **Automatic Timeout**: Configurable inactivity timeouts

### **Permission System**

Flexible JSON-based permission management:

```json
// Example permission structure:
{
  "properties": { "read": true, "write": true, "delete": false },
  "tenants": { "read": true, "write": false, "delete": false },
  "financial": { "read": true, "write": false, "delete": false },
  "maintenance": { "read": true, "write": true, "delete": false }
}
```

---

## ⚡ Integration Points

### **With Multi-Tenant System Module**

- User-firm assignments → Multi-tenant access control and role management
- Approval workflows → User-based approval routing and delegation authority
- Portal switching → Context switching between firms for multi-tenant users

### **With Core Entities Module**

- Owner users → Direct linkage to owner entities for portfolio access
- Tenant users → Portal access to rental contracts and payment history
- Property management → User-based access control to property information

### **With Financial System Module**

- Invoice access → User permissions for financial data visibility
- Payment processing → User authentication for payment operations
- Financial reporting → Role-based access to financial analytics

### **With Maintenance Workflow Module**

- Maintenance requests → User authentication for service request submission
- Vendor coordination → Vendor user access to work orders and invoicing
- Approval routing → User-based maintenance approval workflows

---

## 🏁 Summary

The User Authentication module provides:

- **4 comprehensive tables** supporting enterprise-grade authentication
- **Multi-type user management** supporting 6 different user types with portal access
- **Polymorphic entity relationships** enabling flexible user-business entity associations
- **Advanced session management** with device fingerprinting and geographic tracking
- **Comprehensive security controls** including account lockout, 2FA ready, email verification
- **Complete audit trail** with login analytics and security monitoring
- **6 analytical views** for user management and security intelligence

**🎯 Key Security Features:**

- **Account Protection**: Configurable lockout policies and brute force protection
- **Session Security**: Device fingerprinting and geographic validation
- **Password Security**: Secure token-based reset with one-time use enforcement
- **Multi-Portal Integration**: Type-based portal access with permission management
- **Audit Compliance**: Complete authentication and access audit trails

This module enables professional property management systems to securely manage multiple user types
across different portals while maintaining comprehensive security monitoring and flexible permission
management suitable for enterprise multi-tenant environments.

---

**Next Module**: [System Infrastructure Module](06_system_infrastructure.md) - Settings,
notifications, templates, and audit logs
