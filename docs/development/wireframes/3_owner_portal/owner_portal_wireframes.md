## Account Activation Notification (Step 1.1)

**Description**: Email preview screen sent to the owner, initiating account setup, inspired by clean
email designs like Buildium’s notifications.

```
------------------------------------------------------------
|                        [Header]                          |
| [Logo: REMS]                                             |
------------------------------------------------------------
|                     [Email Preview]                      |
| Subject: [Firm Name] has set up your REMS account        |
|----------------------------------------------------------|
| Welcome to [Firm Name] REMS!                            |
| Monitor your property investments online.               |
| Properties: Richardson Tower One, Tower Two...          |
| [Access Your Properties Button]                         |
| System Benefits:                                        |
| - Real-time portfolio monitoring                        |
| - Expense approvals                                     |
| - Financial reporting                                   |
| [Firm Logo]                                             |
------------------------------------------------------------
|                        [Footer]                          |
| [About] [Contact] [Privacy] [Terms] [Support]            |
------------------------------------------------------------
```

**Components**:

- **Header**: REMS logo (left).
- **Email Preview**:
  - Subject: "[Firm Name] has set up your REMS account" (h2).
  - Welcome Message: Brief intro text.
  - Property List: Summary of properties (e.g., Richardson Tower One).
  - CTA: "Access Your Properties" button (large, centered).
  - Benefits: Bullet list of system features.
  - Firm Logo: Placeholder for branding.
- **Footer**: Links (About, Contact, Privacy, Terms, Support).
- **Notes**:
  - Industry-standard: Clean email layout with prominent CTA.
  - Responsive: Button full-width on mobile (320px+).
  - Accessibility: Button with `aria-label="Access your properties"`, text with sufficient contrast.

## Password Setup & Account Verification (Step 1.2)

**Description**: Form for setting a secure password and activating the account, similar to
DoorLoop’s minimal signup forms.

```
------------------------------------------------------------
|                        [Header]                          |
| [Logo: REMS]                                             |
------------------------------------------------------------
|                [Account Activation Form]                 |
| Welcome Alexander Richardson                             |
|----------------------------------------------------------|
| Portfolio Preview: 8 properties, 4,329,642.86 KWD       |
| Password: [____________________] *                      |
| Confirm Password: [____________________] *              |
| [Activate Account & View Portfolio Button]              |
------------------------------------------------------------
|                        [Footer]                          |
| [About] [Contact] [Privacy] [Terms] [Support]            |
------------------------------------------------------------
```

**Components**:

- **Header**: REMS logo.
- **Main Content**:
  - Welcome Message: "Welcome Alexander Richardson" (h2).
  - Portfolio Preview: Summary text (e.g., 8 properties, value).
  - Form: Password, Confirm Password (required, with show/hide toggle).
  - CTA: "Activate Account & View Portfolio" button.
- **Footer**: Consistent links.
- **Notes**:
  - Industry-standard: Simple form with motivational preview.
  - Responsive: Fields stack on mobile.
  - Accessibility: Labels with `for`, password toggle with `aria-pressed`.

## Welcome Dashboard with Guided Tour (Step 1.3)

**Description**: Initial dashboard with portfolio summary, capabilities, and checklist, using
card-based widgets like Buildium.

```
------------------------------------------------------------
|                        [Header]                          |
| [Logo: REMS]                     [User Profile] [Logout] |
------------------------------------------------------------
| [Sidebar] |                [Main Content]                |
| - Dashboard | Welcome Dashboard                         |
| - Properties|---------------------------------------------|
| - Financials| [Portfolio Summary Card]                   |
| - Expenses  | Properties: 8 | Value: 4,329,642.86 KWD    |
| - Maintenance | Income: 3,670 KWD | Occupancy: 85%       |
| - Notifications |-----------------------------------------|
| - Messages  | [Capabilities Widget]                      |
| - Reports   | [x] Monitor performance                    |
| - Help      | [x] Approve expenses                       |
|           | [x] Create maintenance requests            |
|           | [ ] Contact accountant                     |
|           |---------------------------------------------|
|           | [Getting Started Checklist]                |
|           | [x] Account activated                      |
|           | [ ] Review portfolio                       |
|           | [ ] Set notifications                      |
|           | [Start Exploring Button]                   |
------------------------------------------------------------
|                        [Footer]                          |
| [About] [Contact] [Privacy] [Terms] [Support]            |
------------------------------------------------------------
```

**Components**:

- **Header**: REMS logo, User Profile, Logout.
- **Sidebar**: Navigation (Dashboard, Properties, Financials, Expenses, Maintenance, Notifications,
  Messages, Reports, Help).
- **Main Content**:
  - Portfolio Summary Card: Metrics (Properties, Value, Income, Occupancy).
  - Capabilities Widget: Checklist of owner permissions.
  - Getting Started Checklist: Tasks with checkboxes.
  - CTA: "Start Exploring" button.
- **Notes**:
  - Industry-standard: Card-based dashboard for clarity.
  - Responsive: Cards stack on mobile, sidebar collapses (768px).
  - Accessibility: Cards with `role="region"`, checklist with `aria-checked`.

## Main Portfolio Dashboard (Step 2.1)

**Description**: Comprehensive overview with performance and health widgets, enhanced with
additional metrics like Buildium’s dashboards.

```
------------------------------------------------------------
|                        [Header]                          |
| [Logo: REMS]                     [User Profile] [Logout] |
------------------------------------------------------------
| [Sidebar] |                [Main Content]                |
| - Dashboard | Portfolio Overview                         |
| - Properties|---------------------------------------------|
| - Financials| [Portfolio Performance Widget]             |
| - Expenses  | Income: 3,670 KWD | Collected: 3,120 KWD |
| - Maintenance | Receivables: 550 KWD | ROI: 7.2% [Green] |
| - Notifications |-----------------------------------------|
| - Messages  | [Financial Health Widget]                  |
| - Reports   | On-time Payments: 85% [Yellow]             |
| - Help      | Late Receivables: 220 KWD | Approvals: 2   |
|           |---------------------------------------------|
|           | [Property Grid]                            |
|           | Prop | Occup | Rent | Status               |
|           | Z1   | 100% | 1,680 | Excellent [Green]  |
|           | Z2   | 75%  | 1,190 | Vacancy [Yellow]   |
|           |---------------------------------------------|
|           | [Recent Activity Widget]                   |
|           | - Expense approval needed: Z1 (150 KWD)    |
|           | - Payment received: Z3 (520 KWD)           |
------------------------------------------------------------
|                        [Footer]                          |
| [About] [Contact] [Privacy] [Terms] [Support]            |
------------------------------------------------------------
```

**Components**:

- **Header** and **Sidebar**: Consistent.
- **Main Content**:
  - Title: "Portfolio Overview" (h2).
  - Portfolio Performance Widget: Metrics (Income, Collected, Receivables, ROI).
  - Financial Health Widget: Metrics (Payments, Receivables, Approvals).
  - Property Grid: Table (Property, Occupancy, Rent, Status).
  - Recent Activity Widget: List of actions.
- **Notes**:
  - Industry-standard: Rich dashboard with tables and widgets.
  - Responsive: Grid scrolls horizontally, widgets stack on mobile.
  - Accessibility: Table with `role="grid"`, widgets with `aria-label`.

## Expense Approval Interface (Step 2.2)

**Description**: Form for reviewing and approving expenses, using a card layout like DoorLoop’s
approval flows.

```
------------------------------------------------------------
|                        [Header]                          |
| [Logo: REMS]                     [User Profile] [Logout] |
------------------------------------------------------------
| [Sidebar] |                [Main Content]                |
| - Dashboard | Expense Approval Detail                   |
| - Properties|---------------------------------------------|
| - Financials| [Expense Summary Card]                     |
| - Expenses  | Property: Z1 | Amount: 150 KWD            |
| - Maintenance | Category: Plumbing | Urgency: Normal      |
| - Notifications | Submitted: Sarah Johnson, 2 hours ago    |
| - Messages  |---------------------------------------------|
| - Reports   | [Details Card]                             |
| - Help      | Vendor: ProPlumb (4.3/5)                  |
|           | Desc: Kitchen sink leak, Z1-101           |
|           | Tenant Impact: Water pooling              |
|           | [Approve Button] [Reject Button]          |
|           | [Request Info Button]                     |
|           | Comments: [Textarea]                      |
------------------------------------------------------------
|                        [Footer]                          |
| [About] [Contact] [Privacy] [Terms] [Support]            |
------------------------------------------------------------
```

**Components**:

- **Header** and **Sidebar**: Consistent, Expenses highlighted.
- **Main Content**:
  - Title: "Expense Approval Detail" (h2).
  - Expense Summary Card: Property, Amount, Category, Urgency, Submitter.
  - Details Card: Vendor, Description, Tenant Impact.
  - Buttons: "Approve", "Reject", "Request Info".
  - Comments: Textarea for approval notes.
- **Notes**:
  - Industry-standard: Card-based approval form.
  - Responsive: Cards stack on mobile.
  - Accessibility: Buttons with `aria-label`, textarea with `aria-describedby`.

## Property Deep-Dive Analysis (Step 2.3)

**Description**: Detailed dashboard for a single property, with financial and unit tables, like
Buildium’s property views.

```
------------------------------------------------------------
|                        [Header]                          |
| [Logo: REMS]                     [User Profile] [Logout] |
------------------------------------------------------------
| [Sidebar] |                [Main Content]                |
| - Dashboard | Richardson Tower One (Z1) - Salmiya       |
| - Properties|---------------------------------------------|
| - Financials| [Property Header]                          |
| - Expenses  | Value: 1,571,785.71 KWD | Income: 1,680 KWD |
| - Maintenance | Occupancy: 100% (5/5)                    |
| - Notifications |-----------------------------------------|
| - Messages  | [Financial Performance Widget]             |
| - Reports   | Dec 2024: Collected 1,680 KWD, Net 1,360  |
| - Help      | YTD: Net 15,360 KWD, ROI 9.8% [Green]     |
|           |---------------------------------------------|
|           | [Unit Status Table]                        |
|           | Unit | Tenant | Rent | Status               |
|           | 101  | M. Al-Rasheed | 450 | Current         |
|           | 102  | E. Johnson | 350 | Current            |
|           |---------------------------------------------|
|           | [Maintenance History Widget]               |
|           | - Plumbing repair: In progress             |
------------------------------------------------------------
|                        [Footer]                          |
| [About] [Contact] [Privacy] [Terms] [Support]            |
------------------------------------------------------------
```

**Components**:

- **Header** and **Sidebar**: Consistent, Properties highlighted.
- **Main Content**:
  - Title: Property name and location (h2).
  - Property Header: Metrics (Value, Income, Occupancy).
  - Financial Performance Widget: Monthly and YTD metrics.
  - Unit Status Table: Columns (Unit, Tenant, Rent, Status).
  - Maintenance History Widget: List of actions.
- **Notes**:
  - Industry-standard: Detailed property view with tables.
  - Responsive: Table scrolls, widgets stack on mobile.
  - Accessibility: Table with `role="grid"`, widgets with `aria-label`.

## Portfolio Financial Analytics (Step 3.1)

**Description**: Analytics screen with revenue and expense breakdowns, using charts like Buildium’s
reporting tools.

```
------------------------------------------------------------
|                        [Header]                          |
| [Logo: REMS]                     [User Profile] [Logout] |
------------------------------------------------------------
| [Sidebar] |                [Main Content]                |
| - Dashboard | Portfolio Financial Analytics             |
| - Properties|---------------------------------------------|
| - Financials| [Revenue Chart: Bar]                       |
| - Expenses  | Expected vs Collected: 3,670 vs 3,120 KWD |
| - Maintenance |---------------------------------------------|
| - Notifications | [Expense Breakdown Widget]             |
| - Messages  | Maintenance: 320 KWD | Utilities: 100 KWD |
| - Reports   | [Property Comparison Table]                |
| - Help      | Prop | ROI | Income | Expenses            |
|           | Z1   | 9.8% | 1,680 | 320                 |
|           | Z2   | 6.5% | 1,190 | 450                 |
|           |---------------------------------------------|
|           | [Export Report Button]                     |
------------------------------------------------------------
|                        [Footer]                          |
| [About] [Contact] [Privacy] [Terms] [Support]            |
------------------------------------------------------------
```

**Components**:

- **Header** and **Sidebar**: Consistent, Financials highlighted.
- **Main Content**:
  - Title: "Portfolio Financial Analytics" (h2).
  - Revenue Chart: Bar chart for expected vs collected income.
  - Expense Breakdown Widget: Categories and amounts.
  - Property Comparison Table: Columns (Property, ROI, Income, Expenses).
  - Button: "Export Report".
- **Notes**:
  - Industry-standard: Chart and table-based analytics.
  - Responsive: Chart scales, table scrolls on mobile.
  - Accessibility: Chart with `aria-describedby`, table with `role="grid"`.

## Owner-Initiated Maintenance Request (Step 4.2)

**Description**: Form for creating maintenance requests, with photo upload, like DoorLoop’s request
forms.

```
------------------------------------------------------------
|                        [Header]                          |
| [Logo: REMS]                     [User Profile] [Logout] |
------------------------------------------------------------
| [Sidebar] |                [Main Content]                |
| - Dashboard | Create Maintenance Request                |
| - Properties|---------------------------------------------|
| - Financials| [Form]                                     |
| - Expenses  | Property: [Dropdown: Z3] *                |
| - Maintenance | Area: [Dropdown: Exterior] *            |
| - Notifications | Issue: [Building Exterior Painting] *   |
| - Messages  | Priority: [Dropdown: Low] *               |
| - Reports   | Description: [Textarea]                   |
| - Help      | Photos: [Upload Area]                     |
|           | [Submit Request Button] [Save as Draft]   |
------------------------------------------------------------
|                        [Footer]                          |
| [About] [Contact] [Privacy] [Terms] [Support]            |
------------------------------------------------------------
```

**Components**:

- **Header** and **Sidebar**: Consistent, Maintenance highlighted.
- **Main Content**:
  - Title: "Create Maintenance Request" (h2).
  - Form: Property, Area, Issue, Priority (dropdowns), Description (textarea), Photos
    (drag-and-drop).
  - Buttons: "Submit Request", "Save as Draft".
- **Notes**:
  - Industry-standard: Clean form with upload functionality.
  - Responsive: Fields stack, upload area simplifies on mobile.
  - Accessibility: Labels with `for`, upload with `aria-describedby`.

## Notification Center (Step 5.1)

**Description**: Dashboard for alerts and updates, using a table layout like Buildium’s notification
systems.

```
------------------------------------------------------------
|                        [Header]                          |
| [Logo: REMS]                     [User Profile] [Logout] |
------------------------------------------------------------
| [Sidebar] |                [Main Content]                |
| - Dashboard | Notification Center                       |
| - Properties|---------------------------------------------|
| - Financials| [Today’s Notifications Table]               |
| - Expenses  | Type | Message | Time                     |
| - Maintenance | Expense | Z1 plumbing approved | Now     |
| - Notifications | Payment | Z4-102 rent received | 1h ago |
| - Messages  |---------------------------------------------|
| - Reports   | [Notification Categories Widget]           |
| - Help      | Financial: 15 | Maintenance: 8 | Contracts: 3 |
|           | [Customize Preferences Link]               |
------------------------------------------------------------
|                        [Footer]                          |
| [About] [Contact] [Privacy] [Terms] [Support]            |
------------------------------------------------------------
```

**Components**:

- **Header** and **Sidebar**: Consistent, Notifications highlighted.
- **Main Content**:
  - Title: "Notification Center" (h2).
  - Notifications Table: Columns (Type, Message, Time).
  - Categories Widget: Counts for Financial, Maintenance, Contracts.
  - Link: "Customize Preferences".
- **Notes**:
  - Industry-standard: Table-based notifications.
  - Responsive: Table scrolls horizontally on mobile.
  - Accessibility: Table with `role="grid"`, link with `aria-label`.

## Internal Messaging Interface (Step 6.2)

**Description**: Messaging tool for communicating with accountants, inspired by DoorLoop’s
communication interfaces.

```
------------------------------------------------------------
|                        [Header]                          |
| [Logo: REMS]                     [User Profile] [Logout] |
------------------------------------------------------------
| [Sidebar] |                [Main Content]                |
| - Dashboard | Message Center                            |
| - Properties|---------------------------------------------|
| - Financials| [Conversation List]                        |
| - Expenses  | Sarah Johnson: Expense approved...        |
| - Maintenance |---------------------------------------------|
| - Notifications | [New Message Form]                     |
| - Messages  | To: [Dropdown: Sarah Johnson] *           |
| - Reports   | Subject: [Late Payment Z2-202] *          |
| - Help      | Message: [Textarea]                       |
|           | Priority: [Dropdown: Normal]              |
|           | [Send Message Button]                     |
|           | [Quick Actions: Templates Dropdown]       |
------------------------------------------------------------
|                        [Footer]                          |
| [About] [Contact] [Privacy] [Terms] [Support]            |
------------------------------------------------------------
```

**Components**:

- **Header** and **Sidebar**: Consistent, Messages highlighted.
- **Main Content**:
  - Title: "Message Center" (h2).
  - Conversation List: Recent messages with preview.
  - New Message Form: To, Subject, Message, Priority (dropdown).
  - Buttons: "Send Message", Templates (dropdown).
- **Notes**:
  - Industry-standard: Clean messaging interface.
  - Responsive: List and form stack on mobile.
  - Accessibility: Form labels with `for`, dropdown with `aria-selected`.

## Enhancements for Higher Fidelity

### Color Scheme

- **Primary Color**: Blue (#0055A4) for buttons, headers, consistent with prior wireframes.
- **Secondary Color**: Light Gray (#F5F5F5) for backgrounds, sidebar.
- **Accent Color**: Green (#28A745) for success states, ROI indicators.
- **Text**: Dark Gray (#333333), white (#FFFFFF) for button text.
- **Error/Warning**: Red (#DC3545) for errors, Yellow (#FFC107) for warnings (e.g., vacancies).

### Icons (Font Awesome)

- **Activation**: Envelope (fa-envelope), lock (fa-lock).
- **Welcome Dashboard**: Building (fa-building), checklist (fa-check-square).
- **Portfolio Dashboard**: Chart-line (fa-chart-line), money (fa-money-bill).
- **Expense Approval**: Wrench (fa-wrench), check (fa-check).
- **Property Deep-Dive**: Home (fa-home), table (fa-table).
- **Financial Analytics**: Chart-bar (fa-chart-bar), file-export (fa-file-export).
- **Maintenance Request**: Upload (fa-upload), priority (fa-exclamation).
- **Notifications**: Bell (fa-bell), table (fa-table).
- **Messaging**: Comment (fa-comment), paper-plane (fa-paper-plane).
- **Size**: 24px desktop, 18px mobile, solid style.

### Accessibility Notes

- **WCAG 2.1**: 4.5:1 contrast, visible focus outlines (2px, #0055A4).
- **ARIA**: Widgets (`role="region"`), tables (`role="grid"`), charts (`aria-describedby`).
- **Screen Reader**: Labels linked to inputs, dynamic updates with `aria-live="polite"`.
- **Responsive**: Breakpoints at 768px (tablet, sidebar collapses), 320px (mobile, stacked layouts,
  44x44px touch targets).

**Credit**: Wireframes designed by Grok, created by xAI, based on REMS project specifications.
