# 1- Landing Page Wireframe.md

```
------------------------------------------------------------
|                        [Header]                          |
| [Logo: REMS]                     [Login] [Schedule Demo] |
------------------------------------------------------------
|                        [Hero Section]                    |
|       Welcome to Open REMS                               |
|       Modern Property Management for Growing Firms       |
|       [Start Free Trial Button]                          |
|       [Secondary CTA: Schedule Demo Link]                |
------------------------------------------------------------
|                     [Value Proposition]                  |
| [Icon] Manage Properties   [Icon] Streamline Finances    |
| [Icon] Tenant Workflow     [Icon] Maintenance Tracking   |
|                                                          |
------------------------------------------------------------
|                        [Footer]                          |
| [About] [Contact] [Privacy] [Terms] [Support]            |
------------------------------------------------------------
```

**Components**:

- **Header**:
  - Left: REMS logo (text or placeholder for image).
  - Right: "Login" link (for existing users), "Schedule Demo" link (secondary action).
- **Hero Section**:
  - Headline: "Welcome to Open REMS" (h1, bold, centered).
  - Subheadline: "Modern Property Management for Growing Firms" (h2, lighter font).
  - Primary CTA: "Start Free Trial" button (large, high contrast, centered).
  - Secondary CTA: "Schedule Demo" link (smaller, below button).
- **Value Proposition Section**:
  - 4 tiles with icons (e.g., house, dollar, user, wrench) summarizing key features: Property
    Management, Finances, Tenants, Maintenance.
  - Short text descriptions under each icon.
- **Footer**:
  - Links: About, Contact, Privacy, Terms, Support.
  - Centered, minimal design.

**Notes**:

- Inspired by Buildium’s clean header and prominent "Get Started" button.
- Responsive: Stack vertically on mobile (320px+), with hero text scaling down.
- Accessibility: High-contrast button, keyboard-navigable links.\*\*\*\*

# 2- Registration Form Wireframe.md

```
------------------------------------------------------------
|                        [Header]                          |
| [Logo: REMS]                     [Login] [Schedule Demo] |
------------------------------------------------------------
|                     [Registration Form]                   |
|            Create Your Admin Account                     |
| [Name Field]                                             |
| [Email Field]                                            |
| [Phone Field]                                            |
| [Company Name Field]                                     |
| [Password Field]                                         |
| [ ] I agree to the Terms & Conditions                   |
| [Create Admin Account Button]                            |
| Already have an account? [Login Link]                    |
------------------------------------------------------------
|                        [Footer]                          |
| [About] [Contact] [Privacy] [Terms] [Support]            |
------------------------------------------------------------
```

**Components**:

- **Header**: Same as Landing Page for consistency.
- **Registration Form**:
  - Title: "Create Your Admin Account" (h2, centered).
  - Form Fields (stacked vertically):
    - Name (text input, required).
    - Email (email input, required).
    - Phone (tel input, optional).
    - Company Name (text input, required).
    - Password (password input, required, with show/hide toggle).
    - Terms Checkbox (required, linked to Terms page).
  - Primary CTA: "Create Admin Account" button (large, below form).
  - Login Link: "Already have an account? Login" (below button, centered).
- **Footer**: Same as Landing Page.
- **Error Handling**:
  - Inline validation (e.g., "Invalid email" in red below field).
  - Highlight missing required fields on submit.

**Notes**:

- Inspired by DoorLoop’s minimal signup form with clear fields and bold CTA.
- Responsive: Form fields stack on mobile, button full-width at 320px.
- Accessibility: Labels associated with inputs, focus states for keyboard navigation, ARIA
  attributes for errors.

# 3- Welcome Dashboard Wireframe

```
------------------------------------------------------------
|                        [Header]                          |
| [Logo: REMS]                     [User Profile] [Logout] |
------------------------------------------------------------
| [Sidebar] |                [Main Content]                |
|           | Welcome [Name]! Let's set up your first firm  |
| [Dimmed]  |---------------------------------------------|
| - Firms   | Progress: Step 1 of 6                        |
| - Users   | [Setup Your Firm Card]                      |
| - Settings|   [Icon: Building]                          |
| - Reports |   Start setting up your property management  |
| - Help    |   [Start Setup Button]                      |
|           |---------------------------------------------|
|           | [Getting Started Checklist]                 |
|           | [ ] Create Firm Profile                     |
|           | [ ] Configure Basic Settings                |
|           | [ ] Add Team Member                         |
------------------------------------------------------------
|                        [Footer]                          |
| [About] [Contact] [Privacy] [Terms] [Support]            |
------------------------------------------------------------

```

**Components**:

- **Header**:
  - Left: REMS logo (consistent with Landing Page).
  - Right: User Profile dropdown (e.g., name, settings), Logout link.
- **Sidebar**:
  - Navigation links: Firms, Users, Settings, Reports, Help (dimmed/disabled until setup complete).
  - Collapsible on mobile (hamburger menu at 768px).
- **Main Content**:
  - Welcome Message: "Welcome [Name]! Let's set up your first firm" (h1, centered).
  - Progress Indicator: "Step 1 of 6" (visual bar or text, below message).
  - Setup Card: Contains an icon (building), short description, and "Start Setup" button (large,
    high-contrast).
  - Checklist: Sidebar or bottom section with tasks (e.g., Create Firm Profile), unchecked by
    default.
- **Footer**: Same as Landing Page (About, Contact, Privacy, Terms, Support).
- **Notes**:
  - Inspired by Buildium’s dashboard with a single, clear CTA and DoorLoop’s onboarding focus.
  - Responsive: Sidebar collapses on mobile (320px+), main content stacks vertically.
  - Accessibility: ARIA labels for progress indicator (`aria-label="Onboarding step 1 of 6"`),
    keyboard-navigable buttons.

# 4- Firm Creation Wireframe

```
------------------------------------------------------------
|                        [Header]                          |
| [Logo: REMS]                     [User Profile] [Logout] |
------------------------------------------------------------
| [Sidebar] |                [Main Content]                |
| [Dimmed]  | Create Your Firm Profile                    |
| - Firms   |---------------------------------------------|
| - Users   | Progress: Step 1 of 6 [Progress Bar]         |
| - Settings| [Form]                                      |
| - Reports | Firm Name: [____________________] *         |
| - Help    | Legal Business Name: [_____________]    |
|           | Registration Number: [_____________]         |
|           | Primary Phone: [_____________]              |
|           | Business Address: [_____________]           |
|           | [Map Preview]                              |
|           | Number of Employees: [Dropdown: 1-100]     |
|           | Logo Upload: [Drag & Drop Area]            |
|           | Business Description: [Textarea]            |
|           | [Save & Continue Button]                   |
------------------------------------------------------------
|                        [Footer]                          |
| [About] [Contact] [Privacy] [Terms] [Support]            |
------------------------------------------------------------

```

**Components**:

- **Header** and **Sidebar**: Same as Welcome Dashboard for consistency.
- **Main Content**:
  - Title: "Create Your Firm Profile" (h2, centered).
  - Progress Indicator: "Step 1 of 6" with a visual progress bar.
  - Form Fields (stacked vertically):
    - Firm Name (text, required, marked with \*).
    - Legal Business Name (text, optional).
    - Registration Number (text, optional).
    - Primary Phone (tel, optional).
    - Business Address (text with map integration, e.g., Google Maps preview).
    - Number of Employees (dropdown: 1-10, 11-50, 51-100).
    - Logo Upload (drag-and-drop area, accepts PNG/JPG).
    - Business Description (textarea, optional).
  - CTA: "Save & Continue" button (large, below form).
- **Notes**:
  - Inspired by DoorLoop’s clean, multi-field onboarding forms.
  - Responsive: Form fields stack on mobile, map preview collapses to text input.
  - Accessibility: Labels linked to inputs (`for` attribute), drag-and-drop area with text fallback
    (`aria-describedby`).

# 5- Expense Categories Wireframe

```
------------------------------------------------------------
|                        [Header]                          |
| [Logo: REMS]                     [User Profile] [Logout] |
------------------------------------------------------------
| [Sidebar] |                [Main Content]                |
| [Dimmed]  | Expense Categories Setup                    |
| - Firms   |---------------------------------------------|
| - Users   | Progress: Step 2 of 6 [Progress Bar]         |
| - Settings| [Form]                                      |
| - Reports | [ ] Capital Expenditure ✓                   |
| - Help    | [ ] Operating Expenses ✓                   |
|           | [ ] Utilities ✓                            |
|           | [ ] Maintenance & Repairs ✓                |
|           | [Add Custom Category Button]                |
|           | Custom: [____________________]             |
|           | Tax-Deductible: [Toggle: On/Off]           |
|           | [Save & Continue Button]                   |
------------------------------------------------------------
|                        [Footer]                          |
| [About] [Contact] [Privacy] [Terms] [Support]            |
------------------------------------------------------------

```

**Components**:

- **Header** and **Sidebar**: Consistent with previous screens.
- **Main Content**:
  - Title: "Expense Categories Setup" (h2, centered).
  - Progress Indicator: "Step 2 of 6" with progress bar.
  - Form Fields:
    - Checkboxes for defaults: Capital Expenditure, Operating Expenses, Utilities, Maintenance &
      Repairs (pre-checked).
    - "Add Custom Category" button (adds new text input dynamically).
    - Custom Category Field (text, appears on button click, e.g., "Legal Fees").
    - Tax-Deductible Toggle (per category, default Off).
  - CTA: "Save & Continue" button.
- **Notes**:
  - Inspired by Buildium’s financial setup with toggles and defaults.
  - Responsive: Checkboxes stack vertically on mobile, button full-width.
  - Accessibility: Checkboxes with `aria-checked`, dynamic fields announced to screen readers.

# 6- Currency Configuration Wireframe

```
------------------------------------------------------------
|                        [Header]                          |
| [Logo: REMS]                     [User Profile] [Logout] |
------------------------------------------------------------
| [Sidebar] |                [Main Content]                |
| [Dimmed]  | Financial Settings                          |
| - Firms   |---------------------------------------------|
| - Users   | Progress: Step 4 of 6 [Progress Bar]         |
| - Settings| [Form]                                      |
| - Reports | Base Currency: [Dropdown: KWD] *            |
| - Help    | Exchange Rates: [ ] Auto-update [ ] Manual  |
|           | Additional Currencies:                      |
|           | [ ] USD [ ] EUR [ ] SAR                    |
|           | Late Fee: [5%] [Grace Period: 7 days]      |
|           | Security Deposit: [Dropdown: 1 month]       |
|           | [Save & Continue Button]                   |
------------------------------------------------------------
|                        [Footer]                          |
| [About] [Contact] [Privacy] [Terms] [Support]            |
------------------------------------------------------------

```

**Components**:

- **Header** and **Sidebar**: Consistent with previous screens.
- **Main Content**:
  - Title: "Financial Settings" (h2, centered).
  - Progress Indicator: "Step 4 of 6" (skips Step 3 for brevity, as per journey map).
  - Form Fields:
    - Base Currency (dropdown, KWD pre-selected, required).
    - Exchange Rates (radio buttons: Auto-update, Manual).
    - Additional Currencies (checkboxes: USD, EUR, SAR).
    - Late Fee (number input, default 5%), Grace Period (number input, default 7 days).
    - Security Deposit (dropdown: 1-3 months, default 1 month).
  - CTA: "Save & Continue" button.
- **Notes**:
  - Inspired by DoorLoop’s financial configuration with clear defaults.
  - Responsive: Fields stack on mobile, dropdowns adapt to touch input.
  - Accessibility: Dropdowns with `aria-selected`, number inputs with min/max constraints.

# 7- Onboarding Wizard Wireframes

## Language & Regional Settings (Step 2.4)

**Description**: Configures localization settings like language, date format, and timezone, inspired
by DoorLoop’s straightforward regional setup forms.

```
------------------------------------------------------------
|                        [Header]                          |
| [Logo: REMS]                     [User Profile] [Logout] |
------------------------------------------------------------
| [Sidebar] |                [Main Content]                |
| [Dimmed]  | Language & Regional Settings                |
| - Firms   |---------------------------------------------|
| - Users   | Progress: Step 3 of 6 [Progress Bar]         |
| - Settings| [Form]                                      |
| - Reports | Primary Language: [Dropdown: English] *     |
| - Help    | Date Format: [Dropdown: DD/MM/YYYY] *      |
|           | Timezone: [Dropdown: Asia/Kuwait] *        |
|           | Number Format: [Dropdown: 1,234.56] *      |
|           | [Save & Continue Button]                   |
------------------------------------------------------------
|                        [Footer]                          |
| [About] [Contact] [Privacy] [Terms] [Support]            |
------------------------------------------------------------
```

**Components**:

- **Header**: REMS logo (left), User Profile dropdown, Logout link (right).
- **Sidebar**: Navigation (Firms, Users, Settings, Reports, Help), dimmed until setup complete,
  collapsible on mobile.
- **Main Content**:
  - Title: "Language & Regional Settings" (h2, centered).
  - Progress Indicator: "Step 3 of 6" with visual progress bar.
  - Form Fields (stacked vertically):
    - Primary Language (dropdown: English, Arabic, Both, required).
    - Date Format (dropdown: DD/MM/YYYY, MM/DD/YYYY, required).
    - Timezone (dropdown, auto-detected Asia/Kuwait, required).
    - Number Format (dropdown: 1,234.56, 1.234,56, required).
  - CTA: "Save & Continue" button (large, below form).
- **Notes**:
  - Inspired by DoorLoop’s minimal, dropdown-heavy setup forms.
  - Responsive: Fields stack on mobile (320px+), dropdowns adapt for touch.
  - Accessibility: Dropdowns with `aria-selected`, labels linked via `for`, keyboard-navigable.

## Currency Configuration (Step 2.5)

**Description**: Configures financial settings like base currency, exchange rates, and late fees,
mirroring Buildium’s clear financial setup.

```
------------------------------------------------------------
|                        [Header]                          |
| [Logo: REMS]                     [User Profile] [Logout] |
------------------------------------------------------------
| [Sidebar] |                [Main Content]                |
| [Dimmed]  | Financial Settings                          |
| - Firms   |---------------------------------------------|
| - Users   | Progress: Step 4 of 6 [Progress Bar]         |
| - Settings| [Form]                                      |
| - Reports | Base Currency: [Dropdown: KWD] *            |
| - Help    | Exchange Rates: [ ] Auto-update [ ] Manual  |
|           | Additional Currencies:                      |
|           | [ ] USD [ ] EUR [ ] SAR                    |
|           | Late Fee: [5%] [Grace Period: 7 days]      |
|           | Security Deposit: [Dropdown: 1 month] *     |
|           | [Save & Continue Button]                   |
------------------------------------------------------------
|                        [Footer]                          |
| [About] [Contact] [Privacy] [Terms] [Support]            |
------------------------------------------------------------
```

**Components**:

- **Header** and **Sidebar**: Consistent with previous screens.
- **Main Content**:
  - Title: "Financial Settings" (h2, centered).
  - Progress Indicator: "Step 4 of 6" with progress bar.
  - Form Fields:
    - Base Currency (dropdown: KWD pre-selected, required).
    - Exchange Rates (radio buttons: Auto-update, Manual).
    - Additional Currencies (checkboxes: USD, EUR, SAR).
    - Late Fee (number input: 5%, min 0, max 100), Grace Period (number input: 7 days).
    - Security Deposit (dropdown: 1-3 months, required).
  - CTA: "Save & Continue" button.
- **Notes**:
  - Inspired by Buildium’s financial setup with sensible defaults.
  - Responsive: Fields stack vertically, radio buttons align horizontally on desktop, stack on
    mobile.
  - Accessibility: Radio buttons with `aria-checked`, number inputs with `aria-describedby` for
    constraints.

## System Settings & Thresholds (Step 2.6)

**Description**: Configures business rules like approval thresholds and automation settings, similar
to DoorLoop’s structured configuration.

```
------------------------------------------------------------
|                        [Header]                          |
| [Logo: REMS]                     [User Profile] [Logout] |
------------------------------------------------------------
| [Sidebar] |                [Main Content]                |
| [Dimmed]  | Business Rules Configuration                |
| - Firms   |---------------------------------------------|
| - Users   | Progress: Step 5 of 6 [Progress Bar]         |
| - Settings| [Form]                                      |
| - Reports | Approval Thresholds:                        |
| - Help    | Maintenance Limit: [500 KWD]               |
|           | Expense Limit: [1000 KWD]                  |
|           | Automated Settings:                        |
|           | [ ] Auto-generate invoices ✓               |
|           | [ ] Auto-send payment reminders ✓          |
|           | Reminder Days: [7]                         |
|           | Notifications:                             |
|           | [ ] Email ✓ [ ] SMS (Setup Required)       |
|           | [Save & Continue Button]                   |
------------------------------------------------------------
|                        [Footer]                          |
| [About] [Contact] [Privacy] [Terms] [Support]            |
------------------------------------------------------------
```

**Components**:

- **Header** and **Sidebar**: Consistent with previous screens.
- **Main Content**:
  - Title: "Business Rules Configuration" (h2, centered).
  - Progress Indicator: "Step 5 of 6" with progress bar.
  - Form Fields:
    - Approval Thresholds: Maintenance Limit (number input, 500 KWD), Expense Limit (number input,
      1000 KWD).
    - Automated Settings: Checkboxes for Auto-generate invoices, Auto-send payment reminders
      (pre-checked).
    - Reminder Days (number input, default 7).
    - Notifications: Checkboxes for Email (pre-checked), SMS (disabled with “Setup Required” note).
  - CTA: "Save & Continue" button.
- **Notes**:
  - Inspired by DoorLoop’s toggle-heavy settings forms.
  - Responsive: Checkboxes and inputs stack on mobile, touch-friendly toggles.
  - Accessibility: Checkboxes with `aria-checked`, disabled SMS option with `aria-disabled`.

## User Management Setup (Step 2.7)

**Description**: Allows admins to add team members, with a pre-filled admin account and options to
add others, similar to Buildium’s user management dashboard.

```
------------------------------------------------------------
|                        [Header]                          |
| [Logo: REMS]                     [User Profile] [Logout] |
------------------------------------------------------------
| [Sidebar] |                [Main Content]                |
| [Dimmed]  | Add Your Team Members                      |
| - Firms   |---------------------------------------------|
| - Users   | Progress: Step 6 of 6 [Progress Bar]         |
| - Settings| [User Table]                                |
| - Reports | Name | Email | Role | Status | Actions      |
| - Help    | [Admin Name] | [Email] | Admin | Active |    |
|           | [Add Accountant Button] [Add Maintenance]   |
|           | [Permissions Preview Link]                 |
|           | [Skip for Now Link]                        |
|           | [Complete Setup Button]                    |
------------------------------------------------------------
|                        [Footer]                          |
| [About] [Contact] [Privacy] [Terms] [Support]            |
------------------------------------------------------------
```

**Components**:

- **Header** and **Sidebar**: Consistent with previous screens.
- **Main Content**:
  - Title: "Add Your Team Members" (h2, centered).
  - Progress Indicator: "Step 6 of 6" with progress bar.
  - User Table: Columns for Name, Email, Role, Status, Actions (empty for now).
    - Row: Pre-filled admin account (read-only).
  - Buttons: "Add Accountant", "Add Maintenance Staff" (trigger modals).
  - Permissions Preview: Expandable link to show role permissions.
  - Skip Option: "Skip for Now" link.
  - CTA: "Complete Setup" button.
- **Notes**:
  - Inspired by Buildium’s user management with simple tables and actions.
  - Responsive: Table collapses to cards on mobile, buttons stack.
  - Accessibility: Table with `role="grid"`, actionable buttons with `aria-label`.

## Add Accountant User (Step 2.8)

**Description**: A modal form to add an accountant, with simplified permissions, mirroring
DoorLoop’s clean user creation interface.

```
------------------------------------------------------------
|                        [Modal Overlay]                   |
|                                                          |
|                [Add User Modal]                          |
| Add Accountant                                           |
|----------------------------------------------------------|
| First Name: [____________________] *                     |
| Last Name: [____________________] *                      |
| Email: [____________________] *                         |
| Phone: [____________________]                           |
| Role: [Accountant (Read-only)]                         |
| Permissions:                                           |
| [ ] Manage Properties & Units ✓                        |
| [ ] Manage Tenants & Contracts ✓                       |
| [ ] Create Invoices & Expenses ✓                       |
| [ ] Approve High-Value Expenses                        |
| [ ] Manage System Settings                             |
| [Send Invitation Button] [Cancel Button]                |
|----------------------------------------------------------|
```

**Components**:

- **Modal Overlay**: Darkened background, centered modal.
- **Modal Content**:
  - Title: "Add Accountant" (h2).
  - Form Fields:
    - First Name, Last Name, Email (text, required).
    - Phone (tel, optional).
    - Role (read-only: Accountant).
    - Permissions Checkboxes: Pre-checked for Properties, Tenants, Invoices; unchecked for
      High-Value Expenses, System Settings.
  - Buttons: "Send Invitation" (primary), "Cancel" (secondary).
- **Notes**:
  - Inspired by DoorLoop’s minimal modal forms.
  - Responsive: Modal scales to 90% width on mobile (320px+).
  - Accessibility: Modal with `aria-modal="true"`, focus trapped, checkboxes with `aria-checked`.

# 8 - Admin Portal Stage 3 and 4 Wireframes

## Stage 3: Dashboard & Initial Exploration

### Step 3.1: Setup Complete - Main Dashboard

**Description**: The fully enabled admin dashboard displayed after onboarding completion, showing
firm overview, system health, and quick actions. Inspired by Buildium’s metrics-focused dashboard
and DoorLoop’s guided next steps.

```
------------------------------------------------------------
|                        [Header]                          |
| [Logo: REMS]                     [User Profile] [Logout] |
------------------------------------------------------------
| [Sidebar] |                [Main Content]                |
| - Firms   | Firm setup complete! 🎉                     |
| - Users   |---------------------------------------------|
| - Settings| [Firm Switcher Dropdown: Firm Name]         |
| - Integra-| [Dashboard Widgets]                         |
|   tions   | [Firm Overview]                            |
| - Reports | Firms: 1 | Users: 1                        |
| - Help    | [System Health]                            |
|           | Database: Green | API: Green                |
|           | [Recent Activity]                          |
|           | - Firm created | - User added              |
|           | [Quick Actions]                            |
|           | [Add Payment Gateway] [Configure Email]    |
|           | [Import Property Data]                     |
|           |---------------------------------------------|
|           | [Getting Started Checklist: Collapsible]   |
|           | [x] Create Firm Profile                    |
|           | [x] Configure Basic Settings               |
|           | [x] Add Team Member                        |
|           | [ ] Setup Payment Gateway                  |
------------------------------------------------------------
|                        [Footer]                          |
| [About] [Contact] [Privacy] [Terms] [Support]            |
------------------------------------------------------------
```

**Components**:

- **Header**: REMS logo (left), User Profile dropdown, Logout link (right).
- **Sidebar**: Fully enabled navigation: Firms, Users, Settings, Integrations, Reports, Help.
  Collapsible on mobile (hamburger menu at 768px).
- **Main Content**:
  - Success Message: "Firm setup complete! 🎉" (h2, centered).
  - Firm Switcher: Dropdown for selecting firms (single firm initially).
  - Dashboard Widgets:
    - Firm Overview: Metrics (Firms: 1, Users: 1).
    - System Health: Status indicators (Database: Green, API: Green).
    - Recent Activity: List of actions (e.g., Firm created, User added).
    - Quick Actions: Buttons for "Add Payment Gateway", "Configure Email Templates", "Import
      Property Data".
  - Getting Started Checklist: Collapsible section with tasks (checked: Create Firm, Configure
    Settings, Add Team Member; unchecked: Payment Gateway).
- **Footer**: Links (About, Contact, Privacy, Terms, Support).
- **Notes**:
  - Inspired by Buildium’s dashboard with clear metrics and DoorLoop’s action-oriented layout.
  - Responsive: Widgets stack vertically on mobile (320px+), sidebar collapses.
  - Accessibility: Widgets with `aria-label` (e.g., “System Health Status”), checklist with
    `aria-checked`, keyboard-navigable buttons.

### Step 3.2: Getting Started Sidebar

**Description**: A persistent sidebar (or bottom section on mobile) guiding admins through next
steps, similar to DoorLoop’s onboarding checklist.

```
------------------------------------------------------------
|                        [Header]                          |
| [Logo: REMS]                     [User Profile] [Logout] |
------------------------------------------------------------
| [Sidebar] |                [Main Content]                |
| - Firms   | [Previous Dashboard Content]                |
| - Users   | ...                                        |
| - Settings|                                            |
| - Integra-|                                            |
|   tions   |                                            |
| - Reports |                                            |
| - Help    |---------------------------------------------|
| [Getting  | Getting Started Checklist                   |
|  Started] | [x] Create Firm Profile                    |
|           | [x] Configure Basic Settings               |
|           | [x] Add Team Member                        |
|           | [ ] Setup Payment Gateway                  |
|           | [ ] Configure Email Templates              |
|           | [ ] Test System Integration                |
|           | [Need Help? Chat Widget]                   |
|           | [Video Tutorial Links]                     |
------------------------------------------------------------
|                        [Footer]                          |
| [About] [Contact] [Privacy] [Terms] [Support]            |
------------------------------------------------------------
```

**Components**:

- **Header** and **Sidebar**: Consistent with Main Dashboard, with “Getting Started” section
  highlighted or expanded.
- **Getting Started Sidebar** (or bottom section on mobile):
  - Title: "Getting Started Checklist" (h3).
  - Checklist: Tasks with checkboxes (checked: Create Firm, Configure Settings, Add Team Member;
    unchecked: Payment Gateway, Email Templates, Test Integration).
  - Chat Widget: "Need Help?" button/link to open support chat.
  - Video Tutorial Links: Links to tutorials (e.g., “Watch: Setup Guide”).
- **Main Content**: Retains dashboard content (dimmed or less prominent).
- **Notes**:
  - Inspired by DoorLoop’s persistent onboarding prompts.
  - Responsive: Checklist moves to bottom on mobile, buttons full-width.
  - Accessibility: Checklist with `aria-checked`, chat widget with `aria-label="Open support chat"`.

## Stage 4: Integration Configuration

### Step 4.1: Payment Gateway Selection

**Description**: A page for selecting and setting up payment gateways, inspired by Buildium’s
integration setup with clear options and descriptions.

```
------------------------------------------------------------
|                        [Header]                          |
| [Logo: REMS]                     [User Profile] [Logout] |
------------------------------------------------------------
| [Sidebar] |                [Main Content]                |
| - Firms   | Integrations                               |
| - Users   |---------------------------------------------|
| - Settings| Available Payment Gateways                 |
| - Integra-| [KNET Card]                                |
|   tions   | [Logo] KNET (Kuwait) - Recommended         |
| - Reports | Fast local payments                        |
| - Help    | [Setup Button] [5 min estimate]            |
|           | [Myfatoorah Card]                          |
|           | [Logo] Myfatoorah (International)          |
|           | Multi-currency support                     |
|           | [Setup Button] [10 min estimate]           |
|           | [Bank Transfer Card]                       |
|           | [Logo] Bank Transfer (NBK, CBK)            |
|           | Manual processing                          |
|           | [Setup Button] [15 min estimate]           |
|           | [Feature Comparison Table]                 |
|           | [KNET] | [Myfatoorah] | [Bank Transfer]   |
------------------------------------------------------------
|                        [Footer]                          |
| [About] [Contact] [Privacy] [Terms] [Support]            |
------------------------------------------------------------
```

**Components**:

- **Header** and **Sidebar**: Consistent, with Integrations highlighted.
- **Main Content**:
  - Title: "Integrations" (h2, centered).
  - Payment Gateway Cards:
    - KNET: Logo, description (“Fast local payments”), “Recommended” badge, Setup button, time
      estimate (5 min).
    - Myfatoorah: Logo, description (“Multi-currency support”), Setup button, time estimate (10
      min).
    - Bank Transfer: Logo, description (“Manual processing”), Setup button, time estimate (15 min).
  - Feature Comparison Table: Columns for KNET, Myfatoorah, Bank Transfer; rows for features (e.g.,
    Speed, Currency Support).
- **Notes**:
  - Inspired by Buildium’s clear integration options with badges.
  - Responsive: Cards stack vertically on mobile, table scrolls horizontally.
  - Accessibility: Cards with `role="region"`, table with `role="grid"`, buttons with `aria-label`.

### Step 4.2: KNET Integration Setup

**Description**: A form for configuring KNET payment gateway, mirroring DoorLoop’s step-by-step
integration setup.

```
------------------------------------------------------------
|                        [Header]                          |
| [Logo: REMS]                     [User Profile] [Logout] |
------------------------------------------------------------
| [Sidebar] |                [Main Content]                |
| - Firms   | KNET Configuration                         |
| - Users   |---------------------------------------------|
| - Settings| [Instructions: Step-by-step guide]          |
| - Integra-| Merchant ID: [____________________] *       |
|   tions   | Terminal ID: [____________________] *       |
| - Reports | Resource Key: [____________________] *      |
| - Help    | Test Mode: [Toggle: On/Off]                |
|           | [Connection Status: Not Connected]         |
|           | [Test Connection Button]                   |
|           | [Save Configuration Button]                |
|           | [Help Documentation Link]                  |
------------------------------------------------------------
|                        [Footer]                          |
| [About] [Contact] [Privacy] [Terms] [Support]            |
------------------------------------------------------------
```

**Components**:

- **Header** and **Sidebar**: Consistent, Integrations highlighted.
- **Main Content**:
  - Title: "KNET Configuration" (h2, centered).
  - Instructions: Collapsible or static step-by-step guide.
  - Form Fields:
    - Merchant ID, Terminal ID, Resource Key (text, required).
    - Test Mode (toggle, default On).
  - Connection Status: Indicator (e.g., “Not Connected”, updates to Green on success).
  - Buttons: "Test Connection", "Save Configuration".
  - Help Link: Links to documentation.
- **Notes**:
  - Inspired by DoorLoop’s guided integration forms.
  - Responsive: Fields stack on mobile, buttons full-width.
  - Accessibility: Toggle with `aria-checked`, status with `aria-live="polite"`, form labels linked.
