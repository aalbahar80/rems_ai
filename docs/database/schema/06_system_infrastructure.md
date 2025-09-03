# ⚙️ System Infrastructure Module - REMS Database

**Module Purpose**: Comprehensive system configuration, notification management, email templates,
multi-currency support, and complete audit trail infrastructure for enterprise operations.

**Last Updated**: September 2, 2025  
**Database Schema**: `rems`  
**Tables**: 7 infrastructure tables  
**Related Views**: 8+ system monitoring views

---

## 📊 Module Overview

The System Infrastructure module provides the foundational backbone for enterprise REMS operations,
including centralized configuration management, sophisticated notification systems, multi-currency
support, email template management, and comprehensive audit logging. This module ensures system
reliability, compliance, and operational excellence.

```
SYSTEM INFRASTRUCTURE ARCHITECTURE
├── ⚙️ System Settings (Centralized Configuration)
│   ├── Global system parameters → Tax rates, late fees, approval thresholds
│   ├── Feature toggles → Enable/disable system functionality
│   ├── Business rules → Configurable operational policies
│   └── Multi-tenant settings → Firm-specific configuration overrides
│
├── 💱 Currency Management (Multi-Currency Operations)
│   ├── Base currency configuration → Primary accounting currency
│   ├── Exchange rate management → Real-time rate updates
│   ├── International support → Global property management
│   └── Rate history tracking → Financial analysis and reporting
│
├── 📧 Email Templates (Communication Management)
│   ├── Multi-language templates → Internationalization support
│   ├── Variable substitution → Dynamic content generation
│   ├── Template categorization → Invoice, notification, marketing types
│   └── Brand customization → Firm-specific email branding
│
├── 🔔 Notification Systems (User Engagement)
│   ├── Real-time notifications → In-app user alerts
│   ├── System notifications → Admin and maintenance alerts
│   ├── Priority classification → Normal, urgent, critical levels
│   └── Read tracking → Notification engagement analytics
│
├── 📊 Audit Infrastructure (Compliance & Security)
│   ├── Entity audit log → Complete change tracking across all tables
│   ├── System logs → Application events and error monitoring
│   ├── Transaction correlation → Related changes grouped together
│   └── Immutable records → Tamper-proof audit trail
│
└── 🔍 System Monitoring (Operational Intelligence)
    ├── Performance metrics → Query execution and resource usage
    ├── Error tracking → Exception monitoring and analysis
    ├── User activity → System usage patterns and trends
    └── Health monitoring → System status and availability
```

---

## 🗃️ Table Definitions

### 1. **system_settings** - Centralized Configuration Management

Global system configuration with support for different data types and validation rules.

```sql
CREATE TABLE rems.system_settings (
    setting_id       SERIAL PRIMARY KEY,
    setting_key      VARCHAR NOT NULL UNIQUE,
    setting_value    TEXT NOT NULL,
    setting_type     VARCHAR NOT NULL DEFAULT 'string',
    category         VARCHAR,
    description      TEXT,
    is_public        BOOLEAN DEFAULT false,
    requires_restart BOOLEAN DEFAULT false,
    validation_rule  TEXT,
    default_value    TEXT,
    updated_by       INTEGER,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Business logic constraints
    CHECK (setting_type IN ('string', 'integer', 'decimal', 'boolean', 'json', 'array')),
    CHECK (category IN ('financial', 'security', 'notification', 'system', 'feature', 'business_rule'))
);
```

**Key Features:**

- **Type Safety**: Support for string, integer, decimal, boolean, JSON, and array values
- **Validation Rules**: Custom validation expressions for setting values
- **Categorization**: Organized settings by functional area
- **Public/Private**: Control which settings are accessible to client applications
- **Change Tracking**: Complete audit trail of configuration changes
- **Restart Requirements**: Flag settings that require system restart

---

### 2. **currencies** - Multi-Currency Support System

Comprehensive currency management with exchange rate tracking and base currency configuration.

```sql
CREATE TABLE rems.currencies (
    currency_id       SERIAL PRIMARY KEY,
    currency_code     VARCHAR NOT NULL UNIQUE,
    currency_name     VARCHAR NOT NULL,
    currency_symbol   VARCHAR,
    exchange_rate_to_base NUMERIC NOT NULL DEFAULT 1.000000,
    is_base_currency  BOOLEAN DEFAULT false,
    decimal_places    INTEGER DEFAULT 2,
    is_active         BOOLEAN DEFAULT true,
    last_rate_update  TIMESTAMP,
    rate_source       VARCHAR,
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Business logic constraints
    CHECK (exchange_rate_to_base > 0),
    CHECK (decimal_places >= 0 AND decimal_places <= 6),
    CHECK (currency_code ~ '^[A-Z]{3}$')
);
```

**Key Features:**

- **ISO Currency Codes**: Standard 3-letter currency code validation
- **Exchange Rate Management**: Real-time rate updates with source tracking
- **Base Currency**: Single base currency for accounting and reporting
- **Decimal Precision**: Configurable decimal places per currency
- **Rate History**: Track exchange rate changes over time
- **International Support**: Global property management operations

---

### 3. **email_templates** - Communication Template Management

Flexible email template system with multi-language support and variable substitution.

```sql
CREATE TABLE rems.email_templates (
    template_id       SERIAL PRIMARY KEY,
    template_name     VARCHAR NOT NULL,
    template_type     VARCHAR NOT NULL,
    subject           VARCHAR NOT NULL,
    body_html         TEXT,
    body_text         TEXT,
    variables         JSONB,
    language          VARCHAR DEFAULT 'en',
    is_active         BOOLEAN DEFAULT true,
    is_system_template BOOLEAN DEFAULT false,
    category          VARCHAR,
    description       TEXT,
    created_by        INTEGER,
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Business logic constraints
    CHECK (template_type IN ('invoice', 'receipt', 'notification', 'reminder', 'welcome', 'password_reset', 'maintenance')),
    CHECK (language IN ('en', 'ar', 'fr', 'es', 'de')),
    CHECK (body_html IS NOT NULL OR body_text IS NOT NULL),

    -- Unique constraint for template name per language
    UNIQUE(template_name, language)
);
```

**Key Features:**

- **Multi-Language Support**: Templates in multiple languages for internationalization
- **Variable Substitution**: JSON-defined variables for dynamic content generation
- **HTML and Text**: Support for both HTML and plain text email formats
- **Template Categories**: Organized by business function and purpose
- **System Templates**: Protected system templates vs customizable user templates
- **Version Control**: Track template changes and updates

---

### 4. **notifications** - User Notification Management

Real-time user notification system with priority classification and engagement tracking.

```sql
CREATE TABLE rems.notifications (
    notification_id   SERIAL PRIMARY KEY,
    user_id           INTEGER NOT NULL REFERENCES users(user_id),
    type              VARCHAR NOT NULL,
    title             VARCHAR NOT NULL,
    message           TEXT NOT NULL,
    data              JSONB,
    is_read           BOOLEAN DEFAULT false,
    read_at           TIMESTAMP,
    expires_at        TIMESTAMP,
    priority          VARCHAR DEFAULT 'normal',
    action_url        VARCHAR,
    action_text       VARCHAR,
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Business logic constraints
    CHECK (type IN ('info', 'warning', 'error', 'success', 'payment', 'maintenance', 'approval', 'reminder')),
    CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    CHECK (expires_at IS NULL OR expires_at > created_at)
);
```

**Key Features:**

- **Rich Notifications**: Title, message, and structured data payload
- **Type Classification**: Info, warning, error, success, payment, maintenance types
- **Priority System**: Low, normal, high, urgent priority levels
- **Action Integration**: Optional action URLs and button text
- **Read Tracking**: Engagement monitoring with read timestamps
- **Expiration Management**: Time-limited notifications with automatic cleanup

---

### 5. **system_notifications** - Administrative Alert System

System-wide notifications for administrative alerts, maintenance, and operational updates.

```sql
CREATE TABLE rems.system_notifications (
    notification_id   SERIAL PRIMARY KEY,
    type              VARCHAR NOT NULL,
    severity          VARCHAR NOT NULL DEFAULT 'info',
    title             VARCHAR NOT NULL,
    message           TEXT NOT NULL,
    affected_systems  ARRAY,
    is_active         BOOLEAN DEFAULT true,
    start_time        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time          TIMESTAMP,
    created_by        INTEGER,
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Business logic constraints
    CHECK (type IN ('maintenance', 'outage', 'update', 'security', 'performance', 'announcement')),
    CHECK (severity IN ('info', 'warning', 'error', 'critical')),
    CHECK (end_time IS NULL OR end_time > start_time)
);
```

**Key Features:**

- **System-Wide Alerts**: Administrative notifications visible to all users
- **Severity Classification**: Info, warning, error, critical severity levels
- **Affected Systems**: Array of system components impacted
- **Time-Based Display**: Start and end times for notification visibility
- **Maintenance Windows**: Planned outage and maintenance communication

---

### 6. **entity_audit_log** - Comprehensive Change Tracking

Complete audit trail for all database changes with transaction correlation and change analysis.

```sql
CREATE TABLE rems.entity_audit_log (
    audit_id         BIGSERIAL PRIMARY KEY,
    table_name       VARCHAR NOT NULL,
    entity_id        INTEGER NOT NULL,
    operation_type   VARCHAR NOT NULL,
    old_values       JSONB,
    new_values       JSONB,
    changed_fields   TEXT[],
    changed_by       INTEGER,
    change_reason    TEXT,
    ip_address       INET,
    user_agent       TEXT,
    session_id       VARCHAR,
    transaction_id   BIGINT,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Business logic constraints
    CHECK (operation_type IN ('INSERT', 'UPDATE', 'DELETE')),

    -- Index for performance
    INDEX idx_audit_table_entity (table_name, entity_id),
    INDEX idx_audit_changed_by (changed_by),
    INDEX idx_audit_created_at (created_at)
);
```

**Key Features:**

- **Universal Change Tracking**: Monitors all table changes across the entire system
- **Field-Level Changes**: Detailed tracking of which fields were modified
- **User Attribution**: Complete user and session tracking for changes
- **Transaction Correlation**: Related changes grouped by transaction ID
- **Immutable Records**: Audit entries cannot be modified or deleted
- **Performance Optimized**: Indexed for efficient querying and reporting

---

### 7. **system_logs** - Application Event Monitoring

Comprehensive application logging for error tracking, performance monitoring, and operational
analysis.

```sql
CREATE TABLE rems.system_logs (
    log_id            BIGSERIAL PRIMARY KEY,
    log_level         VARCHAR NOT NULL,
    category          VARCHAR NOT NULL,
    message           TEXT NOT NULL,
    context           JSONB,
    stack_trace       TEXT,
    user_id           INTEGER,
    ip_address        INET,
    request_id        VARCHAR,
    correlation_id    VARCHAR,
    execution_time_ms INTEGER,
    memory_usage_mb   INTEGER,
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Business logic constraints
    CHECK (log_level IN ('DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL')),
    CHECK (category IN ('authentication', 'authorization', 'database', 'api', 'business_logic', 'integration', 'performance')),

    -- Index for performance
    INDEX idx_logs_level_category (log_level, category),
    INDEX idx_logs_created_at (created_at),
    INDEX idx_logs_user_id (user_id)
);
```

**Key Features:**

- **Structured Logging**: Level-based logging with categorization
- **Rich Context**: JSON context data and stack traces for debugging
- **Performance Metrics**: Execution time and memory usage tracking
- **Request Correlation**: Link related log entries across system components
- **User Attribution**: Associate log entries with specific users when applicable
- **Operational Intelligence**: Support for monitoring and alerting systems

---

## 🔗 Relationship Diagram

```
                    SYSTEM INFRASTRUCTURE (Foundation Layer)
                                    |
                        ┌───────────┼───────────┐
                        |           |           |
                SYSTEM_SETTINGS  CURRENCIES  EMAIL_TEMPLATES
                        |           |           |
                        |           |           |
                NOTIFICATIONS ──────┼──── SYSTEM_NOTIFICATIONS
                        |           |           |
                        |           |           |
                ENTITY_AUDIT_LOG ───┴─── SYSTEM_LOGS
                                    |
                            (Monitors All Tables)

Relationship Details:
- System Settings → Central configuration for all system operations
- Currencies → Multi-currency support across financial operations
- Email Templates → Communication templates for all notifications
- Notifications → User-specific alerts and messages
- System Notifications → System-wide administrative alerts
- Entity Audit Log → Monitors changes across ALL database tables
- System Logs → Application-level event and error tracking
```

---

## 📈 System Infrastructure Business Intelligence Views

The system includes 8+ specialized views for comprehensive system monitoring:

### **Configuration Management Views**

1. **system_configuration_overview** - Settings distribution and health status
2. **active_currencies_summary** - Currency status and exchange rate analysis
3. **email_templates_summary** - Template coverage and usage statistics

### **Notification Analytics Views**

4. **user_notifications_summary** - User engagement and notification patterns
5. **notification_engagement_metrics** - Read rates and action conversion
6. **system_alert_dashboard** - Administrative notification overview

### **Audit and Monitoring Views**

7. **entity_changes_summary** - Change frequency and user activity analysis
8. **system_health_summary** - Error rates and performance metrics
9. **audit_trail_analytics** - Compliance reporting and change patterns

---

## 🔧 System Infrastructure Workflows

### **Configuration Management**

1. **Setting Updates**

   ```
   Change Request → Validate Value → Check Dependencies → Update Setting → Notify Affected Systems → Log Change
   ```

2. **Currency Management**
   ```
   Rate Update → Validate Rate → Update Exchange Rate → Recalculate Affected Transactions → Generate Reports
   ```

### **Notification Processing**

1. **User Notifications**

   ```
   Trigger Event → Select Template → Substitute Variables → Create Notification → Deliver to User → Track Engagement
   ```

2. **System Alerts**
   ```
   System Event → Assess Severity → Create Alert → Notify Administrators → Track Resolution → Close Alert
   ```

### **Audit and Monitoring**

1. **Change Tracking**

   ```
   Database Change → Capture Old/New Values → Identify Changed Fields → Record User Context → Store Audit Entry
   ```

2. **System Monitoring**
   ```
   Application Event → Classify Severity → Extract Context → Log Event → Trigger Alerts (if needed) → Analyze Patterns
   ```

---

## 🎯 Advanced Infrastructure Features

### **Dynamic Configuration System**

Settings support multiple data types with validation:

```json
// Example system settings:
{
  "late_fee_percentage": { "value": 5.0, "type": "decimal", "category": "financial" },
  "max_login_attempts": { "value": 5, "type": "integer", "category": "security" },
  "enable_2fa": { "value": true, "type": "boolean", "category": "security" },
  "approval_thresholds": {
    "value": { "owner": 1000, "admin": 5000 },
    "type": "json",
    "category": "business_rule"
  }
}
```

### **Multi-Currency Operations**

Comprehensive currency support:

- **Real-Time Rates**: Integration ready for currency rate APIs
- **Historical Tracking**: Exchange rate change history
- **Base Currency Conversion**: Automatic conversion for reporting
- **Regional Support**: Support for different decimal precision requirements

### **Template Variable System**

Dynamic email templates with variable substitution:

```json
// Template variables example:
{
  "tenant_name": "{{tenant.full_name}}",
  "property_address": "{{property.address}}",
  "rent_amount": "{{contract.monthly_rent}}",
  "due_date": "{{invoice.due_date}}",
  "firm_name": "{{firm.firm_name}}"
}
```

### **Audit Trail Intelligence**

Advanced change tracking features:

- **Transaction Correlation**: Related changes grouped together
- **Field-Level Tracking**: Precise change identification
- **User Context**: Complete user session and device information
- **Immutable Records**: Tamper-proof audit entries
- **Performance Optimized**: Efficient querying for large datasets

---

## ⚡ Integration Points

### **With All Other Modules**

- System settings → Configuration for all business rules and thresholds
- Currency support → Multi-currency financial operations across all modules
- Notifications → User alerts for all business events and processes
- Audit logging → Change tracking for all database tables and operations

### **External System Integration**

- Email providers → Template-based email sending
- Currency APIs → Real-time exchange rate updates
- Monitoring systems → System log integration and alerting
- Backup systems → Audit log preservation and compliance

---

## 🏁 Summary

The System Infrastructure module provides:

- **7 foundational tables** supporting enterprise system operations
- **Centralized configuration** with dynamic settings and validation
- **Multi-currency support** for international property management
- **Comprehensive notification system** with user and system alerts
- **Complete audit trail** with immutable change tracking across all tables
- **Application monitoring** with structured logging and performance metrics
- **Email template management** with multi-language and variable support

This module serves as the operational backbone ensuring system reliability, compliance, and
maintainability for enterprise property management operations with comprehensive monitoring,
configuration, and audit capabilities.

---

**Next Module**: [Business Intelligence Views](07_business_intelligence_views.md) - Comprehensive
analytical views and reporting infrastructure
