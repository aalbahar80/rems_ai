## Welcome Dashboard (Step 1.3)

**Description**: Displays role confirmation and permissions overview post-login, with widgets for
quick actions and setup guidance. Inspired by industry-standard dashboards (e.g., Buildium’s metrics
focus).

```
------------------------------------------------------------
|                        [Header]                          |
| [Logo: REMS]                     [User Profile] [Logout] |
------------------------------------------------------------
| [Sidebar] |                [Main Content]                |
| - Dashboard | You're logged in as: Accountant for [Firm] |
| - Properties|---------------------------------------------|
| - Tenants   | [Permissions Summary Widget]               |
| - Contracts | [x] Manage Properties & Units              |
| - Invoices  | [x] Create Tenants & Contracts             |
| - Expenses  | [x] Generate Invoices & Expenses           |
| - Maintenance | [ ] Expenses > 1,000 KWD (Approval Req.) |
| - Reports   | [Start Setting Up Data Button]             |
| - Help      |---------------------------------------------|
|           | [Quick Actions Widget]                     |
|           | [Add Property] [Add Tenant] [View Tutorial]|
|           |---------------------------------------------|
|           | [Setup Progress Widget]                    |
|           | Progress: 0% [Progress Bar]                |
------------------------------------------------------------
|                        [Footer]                          |
| [About] [Contact] [Privacy] [Terms] [Support]            |
------------------------------------------------------------
```

**Components**:

- **Header**: REMS logo (left), User Profile dropdown, Logout link (right).
- **Sidebar**: Navigation (Dashboard, Properties, Tenants, Contracts, Invoices, Expenses,
  Maintenance, Reports, Help).
- **Main Content**:
  - Role Confirmation: "You're logged in as: Accountant for [Firm Name]" (h2).
  - Permissions Summary Widget: Checklist of permissions (checked for allowed actions, unchecked for
    restricted).
  - Quick Actions Widget: Buttons for "Add Property", "Add Tenant", "View Tutorial" (video link).
  - Setup Progress Widget: "Progress: 0%" with progress bar.
- **Notes**:
  - Industry-standard: Clean layout with widgets for quick access, similar to Buildium.
  - Responsive: Widgets stack vertically on mobile (320px+), sidebar collapses to hamburger menu
    (768px).
  - Accessibility: Widgets with `role="region"`, checklist with `aria-checked`, keyboard-navigable
    buttons.

## Data Setup Guidance Dashboard (Step 2.1)

**Description**: Wizard landing with card-based sequence for data setup, allowing flexible order.
Uses card layouts like DoorLoop’s guided workflows.

```
------------------------------------------------------------
|                        [Header]                          |
| [Logo: REMS]                     [User Profile] [Logout] |
------------------------------------------------------------
| [Sidebar] |                [Main Content]                |
| - Dashboard | Setup Wizard Landing                      |
| - Properties|---------------------------------------------|
| - Tenants   | Portfolio Setup Progress: 0% [Progress Bar]|
| - Contracts | [Setup Sequence Cards]                     |
| - Invoices  | [Create Owners] [Add Properties]           |
| - Expenses  | [Configure Units] [Establish Ownership]    |
| - Maintenance | [Register Tenants] [Create Contracts]    |
| - Reports   |---------------------------------------------|
| - Help      | [Options]                                  |
|           | [I have property data ready]               |
|           | [I need to collect information]            |
|           | [Note: Complete in any order]              |
------------------------------------------------------------
|                        [Footer]                          |
| [About] [Contact] [Privacy] [Terms] [Support]            |
------------------------------------------------------------
```

**Components**:

- **Header** and **Sidebar**: Consistent with Welcome Dashboard.
- **Main Content**:
  - Title: "Setup Wizard Landing" (h2).
  - Progress: "Portfolio Setup Progress: 0%" with progress bar.
  - Setup Sequence Cards: Six cards (Create Owners, Add Properties, Configure Units, Establish
    Ownership, Register Tenants, Create Contracts), each with title and clickable area.
  - Options: Radio buttons for "I have property data ready" or "I need to collect information".
  - Note: "You can complete these in any order based on your needs".
- **Notes**:
  - Industry-standard: Card-based layout for intuitive navigation, like DoorLoop.
  - Responsive: Cards stack in a single column on mobile.
  - Accessibility: Cards with `role="button"`, radio buttons with `aria-checked`.

## Property Creation Wizard - Step 1 (Step 2.2)

**Description**: First step of property creation, capturing basic information with map integration.
Form-based, inspired by Buildium’s structured data entry.

```
------------------------------------------------------------
|                        [Header]                          |
| [Logo: REMS]                     [User Profile] [Logout] |
------------------------------------------------------------
| [Sidebar] |                [Main Content]                |
| - Dashboard | Add New Property (Step 1 of 4)            |
| - Properties|---------------------------------------------|
| - Tenants   | [Form]                                     |
| - Contracts | Property Code: [Z1] *                     |
| - Invoices  | Property Name: [Richardson Tower One] *   |
| - Expenses  | Location: [Dropdown: Kuwait Areas] *      |
| - Maintenance | Address: [Textarea]                     |
| - Reports   | [Map Preview]                             |
| - Help      | Property Type: [Dropdown: Residential] *  |
|           | Total Area (sqm): [1032.00]               |
|           | Construction Year: [2012]                  |
|           | Planning Permit: [PM/19821]               |
|           | [Save & Continue Button] [Save as Draft]  |
------------------------------------------------------------
|                        [Footer]                          |
| [About] [Contact] [Privacy] [Terms] [Support]            |
------------------------------------------------------------
```

**Components**:

- **Header** and **Sidebar**: Consistent with previous screens.
- **Main Content**:
  - Title: "Add New Property (Step 1 of 4)" (h2).
  - Form Fields: Property Code, Name, Location (dropdown), Address (textarea with map preview),
    Property Type (dropdown), Total Area, Construction Year, Planning Permit (text, optional).
  - Buttons: "Save & Continue", "Save as Draft".
- **Notes**:
  - Industry-standard: Multi-step form with clear fields, like Buildium.
  - Responsive: Map preview collapses to text on mobile.
  - Accessibility: Labels with `for`, map with `aria-describedby`.

## Ownership Assignment (Step 2.5)

**Description**: Assigns ownership percentages with a visual pie chart, inspired by
industry-standard visual tools for complex data.

```
------------------------------------------------------------
|                        [Header]                          |
| [Logo: REMS]                     [User Profile] [Logout] |
------------------------------------------------------------
| [Sidebar] |                [Main Content]                |
| - Dashboard | Property Ownership (Step 4 of 4)          |
| - Properties|---------------------------------------------|
| - Tenants   | Property: Richardson Tower One (Z1)        |
| - Contracts | Current: Firm 100% [Red Indicator]         |
| - Invoices  |---------------------------------------------|
| - Expenses  | [Ownership Assignment Form]                |
| - Maintenance | Owner: [Dropdown: Alexander Richardson]  |
| - Reports   | Percentage: [____]%                        |
| - Help      | Start Date: [Date Picker: Today]           |
|           | [ ] Primary Contact                       |
|           | [Pie Chart: Firm 100%]                    |
|           | [Assign Ownership Button]                 |
|           | [Skip - Assign Later Link]                |
|           | [Note: Properties default to firm]        |
------------------------------------------------------------
|                        [Footer]                          |
| [About] [Contact] [Privacy] [Terms] [Support]            |
------------------------------------------------------------
```

**Components**:

- **Header** and **Sidebar**: Consistent.
- **Main Content**:
  - Title: "Property Ownership (Step 4 of 4)" (h2).
  - Property Info: "Richardson Tower One (Z1)", "Current: Firm 100%" with red indicator.
  - Form: Owner (dropdown), Percentage (number), Start Date (date picker), Primary Contact
    (checkbox).
  - Pie Chart: Visualizes ownership distribution (updates dynamically).
  - Buttons: "Assign Ownership", "Skip - Assign Later".
  - Note: "Properties without assigned owners are owned by firm".
- **Notes**:
  - Industry-standard: Pie chart for ownership, like financial visualization tools.
  - Responsive: Chart scales down, form stacks on mobile.
  - Accessibility: Chart with `aria-describedby`, percentage input with validation.

## Tenant Registration (Step 4.1)

**Description**: Form for creating tenant profiles, similar to DoorLoop’s clean data entry forms.

```
------------------------------------------------------------
|                        [Header]                          |
| [Logo: REMS]                     [User Profile] [Logout] |
------------------------------------------------------------
| [Sidebar] |                [Main Content]                |
| - Dashboard | Register New Tenant                      |
| - Properties|---------------------------------------------|
| - Tenants   | [Form]                                     |
| - Contracts | Full Name: [Mohammed Ahmed Al-Rasheed] *  |
| - Invoices  | Nationality: [Dropdown: Kuwait] *          |
| - Expenses  | Email: [____________________] *           |
| - Maintenance | Mobile: [____________________] *        |
| - Reports   | ID Type: [Dropdown: Civil ID] *           |
| - Help      | ID Number: [287010012345] *               |
|           | Employer: [Ministry of Finance]           |
|           | Work Address: [Kuwait City]               |
|           | [Save Tenant Button]                      |
|           | [Save & Create Contract Button]           |
------------------------------------------------------------
|                        [Footer]                          |
| [About] [Contact] [Privacy] [Terms] [Support]            |
------------------------------------------------------------
```

**Components**:

- **Header** and **Sidebar**: Consistent.
- **Main Content**:
  - Title: "Register New Tenant" (h2).
  - Form Fields: Full Name, Nationality (dropdown), Email, Mobile, ID Type (dropdown), ID Number,
    Employer, Work Address (optional).
  - Buttons: "Save Tenant", "Save & Create Contract".
- **Notes**:
  - Industry-standard: Simple form with clear fields, like DoorLoop.
  - Responsive: Fields stack on mobile.
  - Accessibility: Labels with `for`, dropdowns with `aria-selected`.

## Contract Creation - Unit Selection (Step 4.2)

**Description**: Selects units for contracts with a calendar view, inspired by industry-standard
scheduling tools.

```
------------------------------------------------------------
|                        [Header]                          |
| [Logo: REMS]                     [User Profile] [Logout] |
------------------------------------------------------------
| [Sidebar] |                [Main Content]                |
| - Dashboard | Contract Setup - Unit Selection (Step 1/3)|
| - Properties|---------------------------------------------|
| - Tenants   | Tenant: Mohammed Ahmed Al-Rasheed         |
| - Contracts | [Unit Availability Calendar]               |
| - Invoices  | [Month View: Green=Available, Red=Occupied]|
| - Expenses  | [Unit Cards]                              |
| - Maintenance | Z1-101: 2BR/2BA | 450 KWD | Available   |
| - Reports   | [Select Unit Button]                      |
| - Help      | [Show Available Units List Link]          |
|           | [Selected Unit: Z1-101, 450 KWD]          |
|           | [Continue to Contract Terms Button]       |
------------------------------------------------------------
|                        [Footer]                          |
| [About] [Contact] [Privacy] [Terms] [Support]            |
------------------------------------------------------------
```

**Components**:

- **Header** and **Sidebar**: Consistent.
- **Main Content**:
  - Title: "Contract Setup - Unit Selection (Step 1 of 3)" (h2).
  - Tenant Info: "Mohammed Ahmed Al-Rasheed".
  - Unit Availability Calendar: Month view with color-coded status (Green=Available, Red=Occupied,
    Yellow=Ending Soon).
  - Unit Cards: Details (e.g., Z1-101, 2BR/2BA, 450 KWD) with "Select Unit" button.
  - Link: "Show Available Units List".
  - Selected Unit Summary: Displays selected unit details.
  - Button: "Continue to Contract Terms".
- **Notes**:
  - Industry-standard: Calendar-based selection, like property management tools.
  - Responsive: Calendar scrolls, cards stack on mobile.
  - Accessibility: Calendar with `aria-label`, cards with `role="region"`.

## Bulk Invoice Generation Wizard - Step 1 (Step 5.2)

**Description**: Selects contracts for bulk invoice generation, using a table layout like Buildium’s
financial tools.

```
------------------------------------------------------------
|                        [Header]                          |
| [Logo: REMS]                     [User Profile] [Logout] |
------------------------------------------------------------
| [Sidebar] |                [Main Content]                |
| - Dashboard | Invoice Generation (Step 1 of 3)          |
| - Properties|---------------------------------------------|
| - Tenants   | [Contract Selection Table]                 |
| - Contracts | Name | Unit | Period | Rent | Select       |
| - Invoices  | M. Al-Rasheed | Z1-101 | Mar 24-Feb 25 | 450 KWD | [x] |
| - Expenses  | [Invoice Config]                           |
| - Maintenance | Invoices: [12] [Slider]                  |
| - Reports   | Start Date: [Mar 1, 2024]                 |
| - Help      | Frequency: [Dropdown: Monthly] *           |
|           | Due Date Offset: [30 days]                |
|           | [Preview: 12 invoices, Mar 24-Feb 25]     |
|           | [Continue to Review Button]               |
------------------------------------------------------------
|                        [Footer]                          |
| [About] [Contact] [Privacy] [Terms] [Support]            |
------------------------------------------------------------
```

**Components**:

- **Header** and **Sidebar**: Consistent.
- **Main Content**:
  - Title: "Invoice Generation (Step 1 of 3)" (h2).
  - Contract Selection Table: Columns for Name, Unit, Period, Rent, Select (checkbox).
  - Invoice Config: Invoices (slider), Start Date (date picker), Frequency (dropdown), Due Date
    Offset (number).
  - Preview: Text summary of invoice sequence.
  - Button: "Continue to Review".
- **Notes**:
  - Industry-standard: Table-based selection, like Buildium.
  - Responsive: Table scrolls horizontally on mobile.
  - Accessibility: Table with `role="grid"`, slider with `aria-valuenow`.

## Daily Dashboard (Step 6.1)

**Description**: Operational overview with priority tasks, financial metrics, and data completion
widgets, enhanced with additional widgets for complexity.

```
------------------------------------------------------------
|                        [Header]                          |
| [Logo: REMS] [Firm: ABC Properties] [User Profile] [Logout] |
------------------------------------------------------------
| [Sidebar] |                [Main Content]                |
| - Dashboard | Operational Dashboard                     |
| - Properties|---------------------------------------------|
| - Tenants   | [Priority Tasks Widget]                    |
| - Contracts | Maintenance: 2 pending | Expenses: 1 approval |
| - Invoices  | Contracts Expiring: 0 | Overdue: 0         |
| - Expenses  |---------------------------------------------|
| - Maintenance | [Financial Overview Widget]              |
| - Reports   | Revenue Target: 5,400 KWD | Collected: 450 KWD |
| - Help      | Receivables: 4,950 KWD | Expenses: 150 KWD |
|           |---------------------------------------------|
|           | [Data Completion Widget]                   |
|           | Properties: 10% | Owners: 100% | Tenants: 100% |
|           |---------------------------------------------|
|           | [Recent Activity Widget]                   |
|           | - Contract created | - Invoice generated   |
|           |---------------------------------------------|
|           | [Quick Actions]                            |
|           | [Add Property] [Create Expense] [Record Payment] |
------------------------------------------------------------
|                        [Footer]                          |
| [About] [Contact] [Privacy] [Terms] [Support]            |
------------------------------------------------------------
```

**Components**:

- **Header**: Adds Firm Name (e.g., ABC Properties) for context.
- **Sidebar**: Consistent, Dashboard highlighted.
- **Main Content**:
  - Title: "Operational Dashboard" (h2).
  - Priority Tasks Widget: Metrics (Maintenance, Expenses, Contracts, Overdue).
  - Financial Overview Widget: Revenue, Collected, Receivables, Expenses.
  - Data Completion Widget: Progress bars for Properties, Owners, Tenants.
  - Recent Activity Widget: List of recent actions.
  - Quick Actions: Buttons for key tasks.
- **Notes**:
  - Industry-standard: Rich dashboard with widgets, like Buildium.
  - Responsive: Widgets stack on mobile, full-width buttons.
  - Accessibility: Widgets with `role="region"`, progress bars with `aria-valuenow`.

## Maintenance Request Handling (Step 6.2)

**Description**: Detailed view for managing maintenance requests, with vendor assignment, using a
card-based layout.

```
------------------------------------------------------------
|                        [Header]                          |
| [Logo: REMS] [Firm: ABC Properties] [User Profile] [Logout] |
------------------------------------------------------------
| [Sidebar] |                [Main Content]                |
| - Dashboard | Maintenance Request Details               |
| - Properties|---------------------------------------------|
| - Tenants   | [Request Card]                             |
| - Contracts | Title: Kitchen Sink Leak                   |
| - Invoices  | Property: Z1-101 (M. Al-Rasheed)          |
| - Expenses  | Priority: High [Red Indicator]             |
| - Maintenance | Submitted: 2 hours ago                   |
| - Reports   | Desc: Leak under cabinet, water pooling   |
| - Help      |---------------------------------------------|
|           | [Vendor Assignment]                        |
|           | Vendor: [Dropdown: ProPlumb Kuwait] *     |
|           | Est. Cost: [100-500 KWD]                  |
|           | [Assign Vendor Button]                    |
|           | [Request Owner Approval] [Mark Emergency] |
|           | [Communication Log: Tenant Notified]       |
------------------------------------------------------------
|                        [Footer]                          |
| [About] [Contact] [Privacy] [Terms] [Support]            |
------------------------------------------------------------
```

**Components**:

- **Header** and **Sidebar**: Consistent, Maintenance highlighted.
- **Main Content**:
  - Title: "Maintenance Request Details" (h2).
  - Request Card: Title, Property, Priority (color-coded), Submitted, Description.
  - Vendor Assignment: Vendor (dropdown), Estimated Cost (text).
  - Buttons: "Assign Vendor", "Request Owner Approval", "Mark Emergency".
  - Communication Log: List of notifications.
- **Notes**:
  - Industry-standard: Card-based details, like DoorLoop.
  - Responsive: Card fields stack on mobile.
  - Accessibility: Priority with `aria-label`, dropdown with `aria-selected`.

## Firm Switching Interface (Step 7.1)

**Description**: Modal for switching between firm contexts, ensuring data isolation, inspired by
multi-tenant UIs.

```
------------------------------------------------------------
|                        [Modal Overlay]                   |
|                                                          |
|                [Firm Switching Modal]                    |
| Switch Firm Context                                      |
|----------------------------------------------------------|
| Current Firm: ABC Properties [Dropdown]                 |
| Available Firms:                                        |
| [ ] ABC Properties (Current)                            |
| [ ] XYZ Real Estate                                     |
| [Warning: Switching changes data view]                  |
| [Switch Context Button] [Cancel Button]                 |
|----------------------------------------------------------|
```

**Components**:

- **Modal Overlay**: Darkened background, centered modal.
- **Modal Content**:
  - Title: "Switch Firm Context" (h2).
  - Current Firm: Dropdown with current firm (ABC Properties).
  - Available Firms: List or dropdown (ABC Properties, XYZ Real Estate).
  - Warning: "Switching to XYZ Real Estate will change your view to their data only".
  - Buttons: "Switch Context", "Cancel".
- **Notes**:
  - Industry-standard: Modal-based context switching, like multi-tenant platforms.
  - Responsive: Modal scales to 90% width on mobile.
  - Accessibility: Modal with `aria-modal="true"`, focus trapped.

## Enhancements for Higher Fidelity

### Color Scheme

- **Primary Color**: Blue (#0055A4) for buttons, headers, progress bars.
- **Secondary Color**: Light Gray (#F5F5F5) for backgrounds, sidebar, modals.
- **Accent Color**: Green (#28A745) for success states, checked checkboxes.
- **Text**: Dark Gray (#333333), white (#FFFFFF) for button text.
- **Error/Warning**: Red (#DC3545) for errors, Yellow (#FFC107) for warnings.

### Icons (Font Awesome)

- **Welcome Dashboard**: Checklist (fa-check-square), play (fa-play-circle) for tutorial.
- **Data Setup**: Cards (fa-th-large), progress (fa-tasks).
- **Property Creation**: Building (fa-building), map (fa-map-marker-alt).
- **Ownership**: Pie chart (fa-chart-pie), user (fa-user).
- **Tenant**: User-plus (fa-user-plus), flag (fa-flag) for nationality.
- **Contract**: Calendar (fa-calendar), home (fa-home).
- **Invoices**: File-invoice (fa-file-invoice), table (fa-table).
- **Daily Dashboard**: Chart-bar (fa-chart-bar), bell (fa-bell).
- **Maintenance**: Wrench (fa-wrench), alert (fa-exclamation-triangle).
- **Firm Switching**: Arrows-alt (fa-arrows-alt), building (fa-building).
- **Size**: 24px desktop, 18px mobile, solid style.

### Accessibility Notes

- **WCAG 2.1**: 4.5:1 contrast for text/buttons, visible focus outlines (2px, #0055A4).
- **ARIA**: Widgets (`role="region"`), tables (`role="grid"`), modals (`aria-modal="true"`),
  progress bars (`aria-valuenow`).
- **Screen Reader**: Labels linked to inputs, dynamic updates (e.g., chart changes) with
  `aria-live="polite"`.
- **Responsive**: Breakpoints at 768px (tablet, sidebar collapses), 320px (mobile, stacked layouts,
  44x44px touch targets).

**Credit**: Wireframes designed by Grok, created by xAI, based on REMS project specifications.
