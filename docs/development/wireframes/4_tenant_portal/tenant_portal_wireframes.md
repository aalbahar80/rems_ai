## Welcome Email & Account Invitation (Step 1.1)

**Description**: Email notification preview sent to the tenant, initiating account setup, inspired
by clean email designs like Buildium’s tenant communications.

```
------------------------------------------------------------
|                        [Header]                          |
| [Logo: REMS]                                             |
------------------------------------------------------------
|                     [Email Preview]                      |
| Subject: Welcome to your new home! Access your tenant portal |
|----------------------------------------------------------|
| Welcome from [Property Management Firm]                 |
| Property: Richardson Tower One, Unit 101                |
| Lease: 12-month starting March 1, 2024                  |
| [Set Up Your Account Button]                            |
| What you can do:                                        |
| - Pay rent                                              |
| - Request maintenance                                   |
| - Access lease documents                                |
| Support: [Contact Info]                                 |
| [Firm Logo]                                             |
------------------------------------------------------------
|                        [Footer]                          |
| [About] [Contact] [Privacy] [Terms] [Support]            |
------------------------------------------------------------
```

**Components**:

- **Header**: REMS logo (left).
- **Email Preview**:
  - Subject: "Welcome to your new home! Access your tenant portal" (h2).
  - Welcome Message: Greeting and property/lease summary.
  - CTA: "Set Up Your Account" button (large, centered).
  - Features List: Bullet points (Pay rent, Request maintenance, Access documents).
  - Support: Contact information.
  - Firm Logo: Placeholder for branding.
- **Footer**: Links (About, Contact, Privacy, Terms, Support).
- **Notes**:
  - Industry-standard: Simple email with clear CTA and summary.
  - Responsive: Button full-width on mobile (320px+).
  - Accessibility: Button with `aria-label="Set up your account"`, text with sufficient contrast.

## Account Activation & Password Setup (Step 1.2)

**Description**: Form for activating the account and setting a password, mobile-optimized like
DoorLoop’s tenant signup.

```
------------------------------------------------------------
|                        [Header]                          |
| [Logo: REMS]                                             |
------------------------------------------------------------
|                [Tenant Account Activation]               |
| Welcome Mohammed Ahmed Al-Rasheed                       |
|----------------------------------------------------------|
| [Lease Summary Card]                                    |
| Property: Richardson Tower One, Unit 101                |
| Term: March 1, 2024 - February 28, 2025                |
| Rent: 450 KWD | Deposit: 450 KWD                      |
| Password: [____________________] *                      |
| Confirm Password: [____________________] *              |
| [Activate Account & Continue Button]                    |
------------------------------------------------------------
|                        [Footer]                          |
| [About] [Contact] [Privacy] [Terms] [Support]            |
------------------------------------------------------------
```

**Components**:

- **Header**: REMS logo.
- **Main Content**:
  - Welcome Message: "Welcome Mohammed Ahmed Al-Rasheed" (h2).
  - Lease Summary Card: Property, Term, Rent, Deposit details.
  - Form: Password, Confirm Password (required, with show/hide toggle).
  - CTA: "Activate Account & Continue" button.
- **Footer**: Consistent links.
- **Notes**:
  - Industry-standard: Minimal form with contextual summary.
  - Responsive: Card and fields stack on mobile.
  - Accessibility: Labels with `for`, card with `role="region"`.

## First Login Dashboard & Orientation (Step 1.3)

**Description**: Tenant dashboard with welcome tour overlay, payment status, and quick actions,
using widgets like Buildium’s tenant portals.

```
------------------------------------------------------------
|                        [Header]                          |
| [Logo: REMS]                     [User Profile] [Logout] |
------------------------------------------------------------
| [Sidebar] |                [Main Content]                |
| - Dashboard | Tenant Dashboard                          |
| - Payments  |---------------------------------------------|
| - Maintenance | [Welcome Tour Overlay]                 |
| - Lease     | Let's show you around your tenant portal   |
| - Messages  |---------------------------------------------|
| - Property  | [Payment Status Widget]                    |
| Info        | Next Due: March 31, 2024 (450 KWD)         |
| - Help      | Status: On time [Green Check]              |
|           | [Pay Rent Button]                          |
|           |---------------------------------------------|
|           | [Lease Information Card]                   |
|           | Expires: Feb 28, 2025 | Deposit: Paid      |
|           | [View Lease Button]                        |
|           |---------------------------------------------|
|           | [Quick Actions]                            |
|           | [Request Maintenance] [Contact Manager]    |
|           |---------------------------------------------|
|           | [Getting Started Checklist]                |
|           | [x] Account activated                      |
|           | [ ] Set up payment method                  |
------------------------------------------------------------
|                        [Footer]                          |
| [About] [Contact] [Privacy] [Terms] [Support]            |
------------------------------------------------------------
```

**Components**:

- **Header**: REMS logo, User Profile, Logout.
- **Sidebar**: Navigation (Dashboard, Payments, Maintenance, Lease, Messages, Property Info, Help).
- **Main Content**:
  - Welcome Tour Overlay: Modal-like text with tour guide.
  - Payment Status Widget: Due date, status, "Pay Rent" button.
  - Lease Information Card: Expiry, Deposit, "View Lease" button.
  - Quick Actions: Buttons for maintenance and contact.
  - Getting Started Checklist: Tasks with checkboxes.
- **Notes**:
  - Industry-standard: Mobile-first dashboard with widgets.
  - Responsive: Overlay centers, widgets stack on mobile.
  - Accessibility: Overlay with `aria-modal`, checklist with `aria-checked`.

## Payment Method Configuration (Step 1.4)

**Description**: Wizard for setting up payment methods, with options like KNET and cards, inspired
by DoorLoop’s payment setups.

```
------------------------------------------------------------
|                        [Header]                          |
| [Logo: REMS]                     [User Profile] [Logout] |
------------------------------------------------------------
| [Sidebar] |                [Main Content]                |
| - Dashboard | Payment Setup Wizard                      |
| - Payments  |---------------------------------------------|
| - Maintenance | [Payment Method Options]                 |
| - Lease     | [Card: KNET - Most popular] [Select Button] |
| - Messages  | [Card: Credit/Debit - International]      |
| - Property  | [Card: Bank Transfer]                     |
| Info        | [Card: Mobile Wallet - UPayments]         |
| - Help      |---------------------------------------------|
|           | [Selected: KNET]                           |
|           | Card Type: [Dropdown: Debit Card]          |
|           | Save for Future: [Checkbox: Selected]      |
|           | Reminders: [7 days before due]             |
|           | [Test Payment Method Button]               |
|           | [Save Preferences Button]                  |
------------------------------------------------------------
|                        [Footer]                          |
| [About] [Contact] [Privacy] [Terms] [Support]            |
------------------------------------------------------------
```

**Components**:

- **Header** and **Sidebar**: Consistent, Payments highlighted.
- **Main Content**:
  - Title: "Payment Setup Wizard" (h2).
  - Payment Method Options: Cards with descriptions and "Select" buttons.
  - Selected Method Form: Card Type (dropdown), Save Checkbox, Reminders (number input).
  - Buttons: "Test Payment Method", "Save Preferences".
- **Notes**:
  - Industry-standard: Card-based options for mobile ease.
  - Responsive: Cards stack vertically on mobile.
  - Accessibility: Cards with `role="button"`, checkboxes with `aria-checked`.

## Rent Payment Processing (Step 2.2)

**Description**: Interface for processing rent payments, mobile-optimized with saved methods, like
Buildium’s payment flows.

```
------------------------------------------------------------
|                        [Header]                          |
| [Logo: REMS]                     [User Profile] [Logout] |
------------------------------------------------------------
| [Sidebar] |                [Main Content]                |
| - Dashboard | Payment Processing                        |
| - Payments  |---------------------------------------------|
| - Maintenance | [Payment Summary Card]                   |
| - Lease     | Due: 450 KWD | Date: March 31, 2024       |
| - Messages  | Property: Richardson Tower One, 101       |
| - Property  | Invoice: INV-2024-03-00001                |
| Info        |---------------------------------------------|
| - Help      | [Payment Method: KNET ****1234]           |
|           | [Change Method Link]                      |
|           | Pay Full: [450 KWD Radio]                 |
|           | Partial: [Custom Amount Field]            |
|           | [Receipt Options: Email, SMS]             |
|           | [Pay 450 KWD Button]                      |
------------------------------------------------------------
|                        [Footer]                          |
| [About] [Contact] [Privacy] [Terms] [Support]            |
------------------------------------------------------------
```

**Components**:

- **Header** and **Sidebar**: Consistent.
- **Main Content**:
  - Title: "Payment Processing" (h2).
  - Payment Summary Card: Amount, Date, Property, Invoice.
  - Payment Method: Display with "Change" link.
  - Options: Radio for Full/Partial, Custom Field, Receipt Checkboxes.
  - CTA: "Pay 450 KWD" button.
- **Notes**:
  - Industry-standard: Mobile-optimized payment form.
  - Responsive: Full-width button, fields stack.
  - Accessibility: Radio with `aria-checked`, button with `aria-label`.

## Maintenance Request Creation (Step 3.1)

**Description**: Form for submitting maintenance requests with photo upload, using a card layout
like DoorLoop’s tenant requests.

```
------------------------------------------------------------
|                        [Header]                          |
| [Logo: REMS]                     [User Profile] [Logout] |
------------------------------------------------------------
| [Sidebar] |                [Main Content]                |
| - Dashboard | Request Maintenance                       |
| - Payments  |---------------------------------------------|
| - Maintenance | [Form]                                   |
| - Lease     | Issue Category: [Dropdown: Plumbing] *    |
| - Messages  | Description: [Textarea] *                 |
| - Property  | Priority: [Dropdown: Urgent] *            |
| Info        | Preferred Time: [Date/Time Picker]        |
| - Help      | Photos: [Upload Area]                     |
|           | [Submit Request Button]                   |
|           | [Status Tracking Link]                    |
------------------------------------------------------------
|                        [Footer]                          |
| [About] [Contact] [Privacy] [Terms] [Support]            |
------------------------------------------------------------
```

**Components**:

- **Header** and **Sidebar**: Consistent, Maintenance highlighted.
- **Main Content**:
  - Title: "Request Maintenance" (h2).
  - Form: Category (dropdown), Description, Priority (dropdown), Preferred Time (picker), Photos
    (drag-and-drop).
  - CTA: "Submit Request" button.
  - Link: "Status Tracking" to view requests.
- **Notes**:
  - Industry-standard: Photo-enabled form.
  - Responsive: Upload area simplifies on mobile.
  - Accessibility: Labels with `for`, picker with `aria-label`.

## Lease Information Summary (Step 4.1)

**Description**: Card-based view of lease details, with document access, like Buildium’s lease
summaries.

```
------------------------------------------------------------
|                        [Header]                          |
| [Logo: REMS]                     [User Profile] [Logout] |
------------------------------------------------------------
| [Sidebar] |                [Main Content]                |
| - Dashboard | Lease Information                         |
| - Payments  |---------------------------------------------|
| - Maintenance | [Lease Summary Card]                     |
| - Lease     | Term: Mar 1, 2024 - Feb 28, 2025          |
| - Messages  | Rent: 450 KWD | Deposit: 450 KWD Paid    |
| - Property  | Expires: 11 months remaining              |
| Info        | [View Full Lease Button]                  |
| - Help      | [Download PDF Button]                     |
|           |---------------------------------------------|
|           | [Emergency Contacts Widget]                |
|           | Management Office: +965-1234-5678         |
------------------------------------------------------------
|                        [Footer]                          |
| [About] [Contact] [Privacy] [Terms] [Support]            |
------------------------------------------------------------
```

**Components**:

- **Header** and **Sidebar**: Consistent, Lease highlighted.
- **Main Content**:
  - Title: "Lease Information" (h2).
  - Lease Summary Card: Term, Rent, Deposit, Expiry.
  - Buttons: "View Full Lease", "Download PDF".
  - Emergency Contacts Widget: List of contacts.
- **Notes**:
  - Industry-standard: Simple summary with actions.
  - Responsive: Cards stack on mobile.
  - Accessibility: Buttons with `aria-label`, card with `role="region"`.

## Communication Center (Step 5.1)

**Description**: Messaging interface for non-maintenance issues, with history, like DoorLoop’s
tenant communications.

```
------------------------------------------------------------
|                        [Header]                          |
| [Logo: REMS]                     [User Profile] [Logout] |
------------------------------------------------------------
| [Sidebar] |                [Main Content]                |
| - Dashboard | Communication Center                      |
| - Payments  |---------------------------------------------|
| - Maintenance | [Recent Messages Table]                  |
| - Lease     | From | Message | Date                       |
| - Messages  | Manager | Parking request approved | Today  |
| - Property  |---------------------------------------------|
| Info        | [New Message Form]                         |
| - Help      | To: [Property Manager] *                  |
|           | Subject: [Guest Parking Inquiry] *        |
|           | Message: [Textarea]                       |
|           | [Send Message Button]                     |
|           | [Property Announcements Widget]            |
|           | - Scheduled maintenance on Dec 20         |
------------------------------------------------------------
|                        [Footer]                          |
| [About] [Contact] [Privacy] [Terms] [Support]            |
------------------------------------------------------------
```

**Components**:

- **Header** and **Sidebar**: Consistent, Messages highlighted.
- **Main Content**:
  - Title: "Communication Center" (h2).
  - Recent Messages Table: Columns (From, Message, Date).
  - New Message Form: To, Subject, Message.
  - CTA: "Send Message" button.
  - Property Announcements Widget: List of updates.
- **Notes**:
  - Industry-standard: Table-based history with form.
  - Responsive: Table scrolls, form stacks on mobile.
  - Accessibility: Table with `role="grid"`, form labels with `for`.

## Monthly Portal Check Routine (Step 6.1)

**Description**: Quick dashboard check for routine usage, with status widgets, similar to Buildium’s
tenant overviews.

```
------------------------------------------------------------
|                        [Header]                          |
| [Logo: REMS]                     [User Profile] [Logout] |
------------------------------------------------------------
| [Sidebar] |                [Main Content]                |
| - Dashboard | Dashboard Quick Check                     |
| - Payments  |---------------------------------------------|
| - Maintenance | [Payment Status: Paid [Green Check]]     |
| - Lease     | Next Due: In 28 days                      |
| - Messages  | [Maintenance: No Active, 1 Completed]     |
| - Property  | [Messages: 1 New]                         |
| Info        | [Lease: 9 months remaining]               |
| - Help      | [Routine Actions]                         |
|           | [Check Balances] [Update Info]            |
------------------------------------------------------------
|                        [Footer]                          |
| [About] [Contact] [Privacy] [Terms] [Support]            |
------------------------------------------------------------
```

**Components**:

- **Header** and **Sidebar**: Consistent.
- **Main Content**:
  - Title: "Dashboard Quick Check" (h2).
  - Status Widgets: Payment, Maintenance, Messages, Lease.
  - Routine Actions: Buttons for balances and updates.
- **Notes**:
  - Industry-standard: Quick-view dashboard.
  - Responsive: Widgets stack on mobile.
  - Accessibility: Widgets with `role="region"`, color-coded with text alternatives.

## Payment History Review (Step 6.2)

**Description**: Table-based payment history with statistics, like DoorLoop’s history views.

```
------------------------------------------------------------
|                        [Header]                          |
| [Logo: REMS]                     [User Profile] [Logout] |
------------------------------------------------------------
| [Sidebar] |                [Main Content]                |
| - Dashboard | Payment History                           |
| - Payments  |---------------------------------------------|
| - Maintenance | [Payment Table]                          |
| - Lease     | Month | Due | Paid | Amount | Status        |
| - Messages  | Mar 24 | Mar 31 | Mar 24 | 450 | On time  |
| - Property  | Apr 24 | Apr 30 | Apr 29 | 450 | On time  |
| Info        |---------------------------------------------|
| - Help      | [Statistics Widget]                        |
|           | Total Paid: 2,745 KWD | On-time: 83%      |
|           | Late Fees: 45 KWD                         |
|           | [Download Receipts Button]                |
------------------------------------------------------------
|                        [Footer]                          |
| [About] [Contact] [Privacy] [Terms] [Support]            |
------------------------------------------------------------
```

**Components**:

- **Header** and **Sidebar**: Consistent, Payments highlighted.
- **Main Content**:
  - Title: "Payment History" (h2).
  - Payment Table: Columns (Month, Due, Paid, Amount, Status).
  - Statistics Widget: Total Paid, On-time, Late Fees.
  - Button: "Download Receipts".
- **Notes**:
  - Industry-standard: Table with summary.
  - Responsive: Table scrolls on mobile.
  - Accessibility: Table with `role="grid"`, widget with `aria-label`.

## Auto-Payment Setup (Step 6.3)

**Description**: Configuration form for auto-pay, with safety controls, inspired by Buildium’s
payment automation.

```
------------------------------------------------------------
|                        [Header]                          |
| [Logo: REMS]                     [User Profile] [Logout] |
------------------------------------------------------------
| [Sidebar] |                [Main Content]                |
| - Dashboard | Auto-Payment Configuration                |
| - Payments  |---------------------------------------------|
| - Maintenance | [Form]                                   |
| - Lease     | Enable Auto-Pay: [Toggle: Off/On]         |
| - Messages  | Timing: [3 days before due]               |
| - Property  | Method: [KNET ****1234]                   |
| Info        | Backup Method: [Dropdown: Optional]       |
| - Help      |---------------------------------------------|
|           | [Safety Controls]                          |
|           | Verification: Email 5 days before         |
|           | Failed Handling: Retry + Alert             |
|           | [Save Setup Button]                       |
------------------------------------------------------------
|                        [Footer]                          |
| [About] [Contact] [Privacy] [Terms] [Support]            |
------------------------------------------------------------
```

**Components**:

- **Header** and **Sidebar**: Consistent.
- **Main Content**:
  - Title: "Auto-Payment Configuration" (h2).
  - Form: Toggle for Enable, Timing (number), Method (display), Backup (dropdown).
  - Safety Controls: Verification, Failed Handling (text summaries).
  - CTA: "Save Setup" button.
- **Notes**:
  - Industry-standard: Toggle-based setup.
  - Responsive: Form stacks on mobile.
  - Accessibility: Toggle with `aria-checked`, labels with `for`.

## Enhancements for Higher Fidelity

### Color Scheme

- **Primary Color**: Blue (#0055A4) for buttons, headers.
- **Secondary Color**: Light Gray (#F5F5F5) for backgrounds, sidebar.
- **Accent Color**: Green (#28A745) for success states, on-time payments.
- **Text**: Dark Gray (#333333), white (#FFFFFF) for button text.
- **Error/Warning**: Red (#DC3545) for errors, Yellow (#FFC107) for warnings (e.g., overdue).

### Icons (Font Awesome)

- **Welcome Email**: Envelope (fa-envelope), home (fa-home).
- **Activation**: Lock (fa-lock), check (fa-check).
- **Dashboard**: Credit-card (fa-credit-card) for payments, wrench (fa-wrench) for maintenance.
- **Payment Setup**: Wallet (fa-wallet), mobile (fa-mobile).
- **Rent Payment**: Dollar-sign (fa-dollar-sign), receipt (fa-receipt).
- **Maintenance Request**: Upload (fa-upload), exclamation (fa-exclamation).
- **Lease Summary**: File-contract (fa-file-contract), download (fa-download).
- **Communication**: Comment (fa-comment), bell (fa-bell).
- **Monthly Check**: Calendar-check (fa-calendar-check), list (fa-list).
- **Payment History**: History (fa-history), download (fa-download).
- **Auto-Payment**: Sync (fa-sync), shield (fa-shield-alt).
- **Size**: 24px desktop, 18px mobile, solid style.

### Accessibility Notes

- **WCAG 2.1**: 4.5:1 contrast, visible focus outlines (2px, #0055A4).
- **ARIA**: Widgets (`role="region"`), tables (`role="grid"`), overlays (`aria-modal`).
- **Screen Reader**: Labels linked to inputs, dynamic updates with `aria-live="polite"`.
- **Responsive**: Mobile-first: Breakpoints at 768px (tablet), 320px (mobile, stacked layouts,
  44x44px touch targets).

**Credit**: Wireframes designed by Grok, created by xAI, based on REMS project specifications.
