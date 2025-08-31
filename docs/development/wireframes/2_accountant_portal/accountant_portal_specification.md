# Accountant Portal Specification - Enhanced Version

## User Personas

### Primary: Property Data Manager

- **Role**: Accountant responsible for property portfolio data entry and maintenance
- **Background**: Accounting/bookkeeping professional with property management experience
- **Goals**: Efficiently manage property data, tenant relationships, and financial transactions
- **Pain Points**: Manual data entry, complex relationship management, approval delays
- **Technical Level**: Business user comfortable with forms and basic data validation

### Secondary: Multi-Firm Coordinator

- **Role**: Senior accountant managing multiple property management firms
- **Background**: Experienced property accountant with portfolio management skills
- **Goals**: Switch between firm contexts, maintain data quality across portfolios
- **Pain Points**: Context switching confusion, cross-firm data contamination
- **Technical Level**: Advanced business user, understands multi-tenant complexity

### Tertiary: Financial Operations Specialist

- **Role**: Handles invoicing, expense tracking, and collection management
- **Background**: Finance professional with property revenue cycle expertise
- **Goals**: Optimize rent collection, manage expense approvals, track financial KPIs
- **Pain Points**: Manual invoice generation, expense approval bottlenecks, collection delays
- **Technical Level**: Advanced user with financial workflow understanding

## Core Use Cases

### 1. Data Foundation Creation & Management

**Workflow**: Systematic Entity Setup

- Create owners with complete profile information
- Set up properties with detailed specifications
- Configure units with accurate layouts and amenities
- Establish property ownership relationships with percentage validation
- Assign tenants to units through structured contract processes
- Manage vendor network for maintenance and services

**Key Features**:

- Visual percentage calculator for ownership assignment
- Bulk unit creation for identical layouts
- Real-time validation for data consistency
- Firm-default ownership for properties without assigned owners

### 2. Financial Operations & Invoice Management

**Workflow**: Revenue Cycle Management

- Generate rental invoices (single or bulk creation)
- Configure recurring invoice sequences based on contract dates
- Track payment collection and overdue receivables
- Manage expense approvals through owner/admin workflow
- Monitor property financial performance and history
- Handle security deposits and refund processes

**Key Features**:

- Auto-calculated monthly invoice sequences
- Expense threshold approval routing (owner → admin fallback)
- Property financial history visibility
- Late payment tracking and reminder automation

### 3. Tenant & Contract Lifecycle Management

**Workflow**: Complete Tenant Journey

- Process tenant applications and create profiles
- Draft and execute rental contracts with unit assignment
- Monitor contract status (upcoming, active, expiring)
- Handle contract renewals and terminations
- Manage tenant communications and portal access
- Track tenant payment history and behavior

**Key Features**:

- Unit availability calendar for contract planning
- Contract status dashboard with expiration alerts
- Tenant portal access management
- Maintenance request routing and vendor assignment

### 4. Multi-Firm Operations & Context Switching

**Workflow**: Cross-Firm Portfolio Management

- Switch between assigned firm contexts seamlessly
- Maintain separate data integrity per firm
- Track personal productivity across multiple firms
- Coordinate with different admin teams per firm
- Manage firm-specific settings and preferences

**Key Features**:

- Firm switching interface (logout/login simulation)
- Firm-specific branding and configuration display
- Personal productivity tracking per firm
- Context-aware navigation and permissions

## Key Features

### Feature 1: Intelligent Data Entry System with Dependency Management

**Description**: Smart forms that guide accountants through logical data creation sequences while
allowing flexible order when business needs require it **Business Value**:

- Reduces data entry errors by 75% through guided workflows
- Enables business continuity when ownership information is pending
- Supports complex ownership structures without system limitations
- Allows immediate property operations before owner assignment

### Feature 2: Visual Ownership & Financial Management Tools

**Description**: Interactive percentage calculators, financial history displays, and expense
approval workflow visualization **Business Value**:

- Prevents ownership assignment errors (150% scenarios)
- Provides complete financial transparency for decision-making
- Streamlines expense approval process reducing delays by 60%
- Enables property-level profitability analysis

### Feature 3: Bulk Operations & Efficiency Tools

**Description**: Create multiple similar units, generate batch invoices, and handle mass data
operations with progress tracking **Business Value**:

- Reduces setup time for large properties by 80%
- Eliminates repetitive data entry for identical units
- Automates recurring invoice generation saving 10+ hours monthly
- Provides clear progress tracking for complex operations

### Feature 4: Multi-Tenant Context Management

**Description**: Seamless firm switching with context preservation, firm-specific branding, and
isolated data operations **Business Value**:

- Enables accountants to serve multiple clients efficiently
- Prevents cross-firm data contamination
- Reduces context switching confusion and errors
- Scales accountant capacity without additional hiring

## Data Access Requirements

### Read Access (Comprehensive Visibility)

- **Firm-assigned data**: All entities within assigned firm(s) scope
- **Property portfolio**: Complete property, unit, and ownership information
- **Tenant information**: Full tenant profiles, contracts, and payment histories
- **Financial data**: Invoices, receipts, expenses, and transaction records
- **Vendor network**: Contractor information, ratings, and service history
- **Maintenance orders**: All requests, assignments, and completion status
- **System settings**: Firm-specific configurations set by admin

### Write Access (Operational Management)

- **Entity creation**: Owners, properties, units, tenants, contracts, vendors
- **Financial operations**: Create invoices, record expenses, manage payments
- **Contract management**: Create, modify, and terminate rental agreements
- **Maintenance coordination**: Assign vendors, track progress, record completion
- **User communications**: Send notifications, invitations, and updates
- **Data corrections**: Edit own entries without admin approval requirements

### Restricted Access (Security & Audit Controls)

- **User passwords**: Cannot view or modify user authentication credentials
- **System configurations**: Cannot modify firm-wide settings or thresholds
- **Cross-firm data**: Cannot access other firms' sensitive information
- **Admin functions**: Cannot create/delete admin users or modify permissions
- **Audit logs**: Can view own activity but cannot modify historical records

## UI/UX Requirements

### Dashboard Widgets Required

1. **Today's Priority Tasks**
   - Pending expense approvals requiring attention
   - Contract expiration alerts (30/60/90 day warnings)
   - Overdue payment collection items
   - Maintenance requests awaiting vendor assignment

2. **Financial Performance Overview**
   - Monthly rental revenue collected vs expected
   - Outstanding receivables with aging analysis
   - Expense tracking against property budgets
   - Net rental income by property (current month)

3. **Operational Metrics**
   - Data completion percentage (properties, units, contracts)
   - Maintenance resolution time averages
   - Collection efficiency rates
   - Recent activity log (last 7 days)

4. **Firm Context Display**
   - Current firm name and logo prominently displayed
   - Firm switcher dropdown (if multi-firm access)
   - Firm-specific currency and language settings
   - Quick access to firm communication templates

### Critical Forms and Their Complexity

#### **High Complexity Forms**

1. **Property Creation Wizard** (Multi-step, 4-6 screens)
   - Basic property information and location
   - Financial details (valuation, purchase info)
   - Unit configuration with bulk creation options
   - Ownership assignment with percentage validation
   - Document uploads and compliance information

2. **Rental Contract Management** (Complex, 3-5 screens)
   - Tenant selection from existing or create new
   - Unit assignment with availability calendar
   - Contract terms and conditions configuration
   - Financial terms (rent, deposit, fees) setup
   - Document generation and e-signature workflow

#### **Medium Complexity Forms**

1. **Bulk Invoice Generation** (Multi-step, 2-3 screens)
   - Contract selection and date range configuration
   - Invoice preview with individual amount editing
   - Delivery method selection (email, portal, print)
   - Batch processing with progress tracking

2. **Expense Entry and Approval** (Dynamic, 2-3 screens)
   - Expense categorization and amount entry
   - Property/unit assignment with cost allocation
   - Approval workflow routing (owner vs admin)
   - Supporting documentation upload

#### **Simple Forms**

1. **Owner/Tenant Profile Creation** (Single screen with sections)
2. **Vendor Registration** (Basic information with ratings)
3. **Unit Details Update** (Property specifications)
4. **Maintenance Request Creation** (Priority and description)

### Reporting Needs

- **Portfolio Performance**: Occupancy rates, revenue by property, expense analysis
- **Collection Reports**: Payment history, overdue accounts, collection efficiency
- **Maintenance Analytics**: Response times, vendor performance, cost tracking
- **Data Quality Reports**: Completion rates, validation errors, missing information

### Mobile Considerations

**Accountant Portal Mobile Strategy**: Desktop-primary with mobile support for urgent tasks

- **Mobile-supported**: Maintenance request approval, payment status checking, urgent communications
- **Desktop-optimized**: Data entry forms, bulk operations, detailed reporting
- **Responsive breakpoints**: Tablet (1024px+), Mobile (375px+)

## Integration Requirements

### External APIs Needed

1. **Communication Services**
   - Email delivery for user invitations and notifications
   - SMS integration for urgent maintenance alerts
   - In-app messaging system for tenant/owner communication

2. **Financial Services**
   - Payment gateway status monitoring (KNET, Myfatoorah)
   - Bank integration for payment verification
   - Invoice generation and PDF creation services

3. **Document Management**
   - Contract template management system
   - Digital signature integration
   - Document storage and retrieval services

### Real-time Updates Required

- **Ownership percentage validation**: Immediate feedback on percentage calculations
- **Unit availability status**: Real-time updates when contracts are created/terminated
- **Payment status changes**: Live updates when tenants make payments
- **Maintenance request status**: Real-time updates from vendor portal activities
- **Approval workflow progress**: Live status updates for pending expense approvals

### Notification Preferences

- **Urgent Alerts**: Maintenance emergencies, payment failures (immediate push notification)
- **Daily Summaries**: New maintenance requests, payment receipts (morning email digest)
- **Weekly Reports**: Collection performance, contract expirations (Monday morning email)
- **Approval Required**: Expense approvals needed (immediate email + portal notification)

## Advanced Features & Business Logic

### Ownership Management Logic

- **Firm-Default Ownership**: Unassigned ownership percentages automatically belong to firm
- **Percentage Validation**: Real-time calculation ensuring total never exceeds 100%
- **Visual Calculator**: Interactive pie chart showing ownership distribution
- **Transfer Workflows**: Handle ownership changes over time with effective dates

### Approval Workflow Intelligence

- **Smart Routing**: Expenses automatically route to appropriate approver based on:
  - Property ownership (owner exists → owner approval)
  - Firm ownership (no owner → admin approval)
  - Amount thresholds (configurable approval limits)
- **Escalation Logic**: Auto-escalation if approvals exceed time limits
- **Parallel Approvals**: Multiple owners can approve simultaneously

### Data Integrity & Validation

- **Relationship Validation**: Prevent orphaned records and maintain referential integrity
- **Business Rule Enforcement**: Contract dates, ownership percentages, financial calculations
- **Duplicate Prevention**: Email uniqueness within firm, property code validation
- **Historical Preservation**: Maintain audit trail for all data modifications

## Workflow Sequences & Dependencies

### Optimal Data Entry Sequence

1. **Foundation Setup**: Firm configuration (handled by admin)
2. **Entity Creation**: Owners → Properties → Units (flexible order)
3. **Relationship Building**: Property ownership assignment
4. **Operations Setup**: Tenants → Contracts → Initial invoices
5. **Ongoing Management**: Expenses → Maintenance → Collections

### Alternative Sequences Supported

- **Property-First**: Properties → Units → Future owner assignment
- **Tenant-First**: Tenant profiles → Contract assignment when units available
- **Vendor-First**: Vendor registration → Maintenance assignment

### Error Recovery Workflows

- **Incomplete Data**: Clear indicators of missing required information
- **Validation Failures**: Helpful error messages with correction guidance
- **Approval Delays**: Escalation procedures and alternative approval paths
- **System Failures**: Data preservation and recovery procedures

This specification provides the foundation for creating detailed wireframes and user journey maps.
The complexity is significant but manageable through progressive disclosure and intelligent workflow
design.
