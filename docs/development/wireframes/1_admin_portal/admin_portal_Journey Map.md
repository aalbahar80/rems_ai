# Admin Portal - Client Onboarding User Journey Map

## Journey Overview

**Goal**: First-time admin sets up a new property management firm in REMS **Duration**: 30-45
minutes **Complexity**: High (Multi-step configuration process)

---

## Stage 1: Landing & Registration

### Step 1.1: First Visit to Platform

**Screen**: Landing Page (https://open-rems.ai) **User Sees**:

- Header with REMS logo and navigation
- Hero section: "Welcome to Open REMS"
- Value proposition: "Modern Property Management for Growing Firms"
- Primary CTA: "Start Free Trial" button
- Secondary CTA: "Schedule Demo" link

**User Thinks**: _"This looks professional. Let me try the free trial."_ **User Action**: Clicks
"Start Free Trial"

### Step 1.2: Admin Registration

**Screen**: Registration Form **User Sees**:

- Form fields: Name, Email, Phone, Company Name, Password
- Terms & Conditions checkbox
- "Create Admin Account" button
- Login link for existing users

**User Thinks**: _"Standard signup form. I'll use my business email."_ **User Action**: Fills form
and submits **System Response**: Email verification sent

### Step 1.3: Email Verification

**Screen**: Check Email Prompt **User Sees**:

- "Check your email" message
- Resend link option
- Expected email preview

**User Action**: Checks email, clicks verification link **System Response**: Redirects to onboarding
wizard

---

## Stage 2: First Login & Onboarding Wizard

### Step 2.1: Welcome Dashboard

**Screen**: Onboarding Dashboard **User Sees**:

- Welcome message: "Welcome [Name]! Let's set up your first firm"
- Progress indicator: "Step 1 of 6"
- "Setup Your Firm" card with "Start Setup" button
- Sidebar navigation (dimmed/disabled until setup complete)

**User Thinks**: _"Clear next steps. I like the progress indicator."_ **User Action**: Clicks "Start
Setup"

### Step 2.2: Firm Creation (New Table Needed)

**Screen**: Firm Setup Form **User Sees**:

- Form title: "Create Your Firm Profile"
- Fields:
  - Firm Name (required)
  - Legal Business Name
  - Registration Number
  - Primary Phone
  - Business Address (with map integration)
  - Number of Employees (dropdown)
  - Logo Upload (drag & drop area)
  - Business Description (optional)
- "Save & Continue" button
- Progress: "Step 1 of 6 Complete"

**User Thinks**: _"This is comprehensive but not overwhelming."_ **User Action**: Fills firm
details, uploads logo **System Response**: Creates firm record, advances to step 2

### Step 2.3: Expense Categories Configuration

**Screen**: Expense Categories Setup **User Sees**:

- Pre-populated expense categories from system defaults:
  - Capital Expenditure ✓
  - Operating Expenses ✓
  - Utilities ✓
  - Maintenance & Repairs ✓
  - [etc. from your seed data]
- Checkboxes to enable/disable categories
- "Add Custom Category" button
- Toggle switches for tax-deductible settings
- "Save & Continue" button
- Progress: "Step 2 of 6"

**User Thinks**: _"Great! Most categories are already there. I'll add 'Legal Fees' as custom."_
**User Action**: Enables relevant categories, adds custom category **System Response**: Updates
firm's expense category preferences

### Step 2.4: Language & Regional Settings

**Screen**: Localization Setup **User Sees**:

- Primary Language dropdown (English, Arabic, Both)
- Date format options (DD/MM/YYYY, MM/DD/YYYY)
- Timezone selection (auto-detected: Asia/Kuwait)
- Number format preferences
- "Save & Continue" button
- Progress: "Step 3 of 6"

**User Action**: Selects preferences **System Response**: Updates system settings for firm

### Step 2.5: Currency Configuration

**Screen**: Financial Settings **User Sees**:

- Base Currency dropdown (KWD pre-selected for Kuwait)
- Exchange rate settings toggle (Auto-update vs Manual)
- Additional currencies section with checkboxes:
  - USD (for international clients)
  - EUR (for European investors)
  - SAR (for Saudi tenants)
- Late fee configuration:
  - Percentage field (default: 5%)
  - Grace period (days)
- Security deposit rules:
  - Default months (dropdown: 1-3 months)
- "Save & Continue" button
- Progress: "Step 4 of 6"

**User Thinks**: _"These defaults make sense for Kuwait market."_ **User Action**: Adjusts late fee
to 10%, keeps other defaults

### Step 2.6: System Settings & Thresholds

**Screen**: Business Rules Configuration **User Sees**:

- Approval Thresholds:
  - Maintenance approval limit: [500 KWD] input field
  - Expense approval limit: [1000 KWD] input field
- Automated Settings:
  - Auto-generate invoices toggle ✓
  - Auto-send payment reminders toggle ✓
  - Days before reminder: [7] input field
- Notification Preferences:
  - Email notifications toggle ✓
  - SMS notifications toggle (requires setup)
- "Save & Continue" button
- Progress: "Step 5 of 6"

**User Action**: Adjusts approval limits, keeps automation enabled

### Step 2.7: User Management Setup

**Screen**: Team Setup **User Sees**:

- "Add Your Team Members" section
- Pre-filled admin account (read-only)
- "Add Accountant" button
- "Add Maintenance Staff" button
- User table showing:
  - Name | Email | Role | Status | Actions
- Role permissions preview (expandable)
- "Skip for Now" option
- "Complete Setup" button
- Progress: "Step 6 of 6"

**User Thinks**: _"I'll add my accountant Sarah right now."_ **User Action**: Clicks "Add
Accountant"

### Step 2.8: Add Accountant User

**Screen**: Add User Modal/Form **User Sees**:

- User Details:
  - First Name, Last Name
  - Email address
  - Role: Accountant (pre-selected)
  - Phone number (optional)
- Permissions Matrix (simplified view):
  - ✓ Manage Properties & Units
  - ✓ Manage Tenants & Contracts
  - ✓ Create Invoices & Expenses
  - ✗ Approve High-Value Expenses
  - ✗ Manage System Settings
- "Send Invitation" button
- "Cancel" button

**User Action**: Fills details, sends invitation **System Response**: Creates user account, sends
email invitation

---

## Stage 3: Dashboard & Initial Exploration

### Step 3.1: Setup Complete - Main Dashboard

**Screen**: Admin Dashboard (Full Version) **User Sees**:

- Success message: "Firm setup complete! 🎉"
- Sidebar navigation (now fully enabled):
  - Dashboard (current)
  - Firms (with firm switcher dropdown)
  - Users & Permissions
  - System Settings
  - Integrations
  - Reports & Analytics
- Dashboard widgets:
  - Firm Overview (1 firm, 1 user)
  - System Health (All Green)
  - Recent Activity (Setup activities logged)
  - Quick Actions:
    - "Add Payment Gateway"
    - "Configure Email Templates"
    - "Import Property Data"
- "Getting Started" checklist sidebar

**User Thinks**: _"Great! Now I can see everything is connected. Let me configure email templates
next."_

### Step 3.2: Next Steps Guidance

**Screen**: Getting Started Sidebar (Persistent) **User Sees**:

- Checklist:
  - ✅ Create Firm Profile
  - ✅ Configure Basic Settings
  - ✅ Add Team Member
  - ⏳ Setup Payment Gateway
  - ⏳ Configure Email Templates
  - ⏳ Test System Integration
- "Need Help?" chat widget
- Video tutorial links

**User Action**: Clicks "Setup Payment Gateway"

---

## Stage 4: Integration Configuration

### Step 4.1: Payment Gateway Selection

**Screen**: Integrations Page **User Sees**:

- Available Payment Gateways:
  - KNET (Kuwait) - "Recommended" badge
  - Myfatoorah (International)
  - Bank Transfer (NBK, CBK)
  - UPayments (Mobile)
- Each gateway shows:
  - Logo and description
  - "Setup" button
  - Feature comparison
  - Estimated integration time

**User Thinks**: _"KNET is essential for local tenants. I'll start there."_ **User Action**: Clicks
"Setup" on KNET

### Step 4.2: KNET Integration Setup

**Screen**: KNET Configuration Form **User Sees**:

- Step-by-step instructions
- Required credentials fields:
  - Merchant ID
  - Terminal ID
  - Resource Key
- Test mode toggle
- Connection status indicator
- "Test Connection" button
- "Save Configuration" button
- Help documentation link

**User Thinks**: _"I need to get these credentials from KNET first."_ **User Action**: Bookmarks
page, plans to return with credentials

---

## Journey Completion & Success Metrics

### Final State: Operational Dashboard

**User Sees**:

- Fully configured admin dashboard
- Firm switcher (ready for multiple firms)
- System health indicators
- User activity monitoring
- Integration status panel

**Success Indicators**:

- Firm profile created ✅
- Basic settings configured ✅
- Team member invited ✅
- Payment gateway identified (in progress) ⏳
- Email templates (next step) ⏳

**Time Invested**: ~35 minutes **User Satisfaction**: High (clear progress, logical flow)
**Technical Readiness**: 60% complete, operational basics ready

---

## Key UI/UX Requirements Identified

### Critical Components Needed:

1. **Multi-step wizard with progress indication**
2. **Firm switcher component (dropdown/modal)**
3. **Permission matrix UI component**
4. **Integration status dashboard**
5. **Getting started checklist component**
6. **Success/error state handling**
7. **Modal dialogs for secondary actions**
8. **Form validation with real-time feedback**

### Information Architecture:

```
Admin Portal
├── Landing/Registration
├── Onboarding Wizard (6 steps)
├── Main Dashboard
│   ├── Firm Management
│   ├── User Management
│   ├── System Settings
│   ├── Integrations
│   └── Monitoring
└── Help & Support
```

This journey map provides the foundation for creating detailed wireframes. Would you like me to
proceed with wireframes for specific screens, or shall we work on another portal's user journey
next?
