# Accountant Portal - Detailed User Journey Map

## Journey Overview

**Goal**: Accountant sets up complete property portfolio for a property management firm
**Duration**: Initial setup 2-3 hours, ongoing operations daily **Complexity**: High (Complex data
relationships and workflows) **Entry Method**: Email invitation from Admin

---

## Stage 1: Account Activation & First Login

### Step 1.1: Email Invitation Received

**Trigger**: Admin creates accountant user account **User Sees**: Email notification

- **Subject**: "Adam has created a REMS account for you at [Firm Name]"
- **Content**:
  - Welcome message from admin
  - Firm name and logo
  - "Complete Your Setup" button
  - Login credentials if needed
  - System overview link

**User Thinks**: _"Great, the new system is ready. Let me set this up."_ **User Action**: Clicks
"Complete Your Setup"

### Step 1.2: Password Setup & Verification

**Screen**: Account Activation Page **User Sees**:

- Firm branding (logo, colors)
- Welcome message: "Welcome to [Firm Name] REMS"
- Password creation form
- Security requirements checklist
- "Activate Account" button

**User Action**: Sets secure password, activates account **System Response**: Redirects to
onboarding dashboard

### Step 1.3: Role Confirmation & Permissions Overview

**Screen**: Welcome Dashboard **User Sees**:

- Role confirmation: "You're logged in as: Accountant for [Firm Name]"
- Permissions summary:
  - ✅ Manage Properties & Units
  - ✅ Create Tenants & Contracts
  - ✅ Generate Invoices & Expenses
  - ⚠️ Expenses over 1,000 KWD require approval
- "Start Setting Up Data" button
- Quick tutorial video link

**User Thinks**: _"Clear what I can do. Let me start with the data setup."_ **User Action**: Clicks
"Start Setting Up Data"

---

## Stage 2: Data Foundation Setup

### Step 2.1: Data Setup Guidance Dashboard

**Screen**: Setup Wizard Landing **User Sees**:

- Progress tracking: "Portfolio Setup Progress: 0%"
- Recommended sequence cards:
  1. **Create Owners** (Optional - can be done later)
  2. **Add Properties** (Required foundation)
  3. **Configure Units** (Required for rentals)
  4. **Establish Ownership** (Links owners to properties)
  5. **Register Tenants** (Can be independent)
  6. **Create Contracts** (Links tenants to units)
- Flexible workflow note: "You can complete these in any order based on your needs"
- "I have property data ready" vs "I need to collect information" options

**User Thinks**: _"I have the property information, let me start with properties first."_ **User
Action**: Clicks on "Add Properties" card

### Step 2.2: Property Creation Wizard - Step 1

**Screen**: Property Basic Information **User Sees**:

- Form title: "Add New Property (Step 1 of 4)"
- Required fields:
  - Property Code (unique identifier): [Z1]
  - Property Name: [Richardson Tower One]
  - Location: [Dropdown with Kuwait areas]
  - Address: [Text area with map integration]
  - Property Type: [Dropdown: Residential/Commercial/Mixed-use/Land/Other]
- Optional fields:
  - Total Area (sqm): [1032.00]
  - Construction Year: [2012]
  - Planning Permit: [PM/19821]
- "Save & Continue" button
- "Save as Draft" option

**User Action**: Fills property details, continues **System Response**: Saves data, advances to
financial information

### Step 2.3: Property Creation Wizard - Step 2

**Screen**: Financial Information (Optional) **User Sees**:

- Form title: "Property Financial Details (Step 2 of 4)"
- Optional fields:
  - Purchase/Construction Cost: [KWD input]
  - Current Valuation: [1,571,785.71 KWD]
  - Valuation Date: [Date picker]
  - Valuation Method: [Dropdown: Income approach/Market comparison/Cost approach]
- Financing information (if applicable)
- "Skip This Step" option
- "Save & Continue" button

**User Thinks**: _"I'll add the valuation we just received."_ **User Action**: Enters valuation
details, continues

### Step 2.4: Property Creation Wizard - Step 3

**Screen**: Unit Configuration **User Sees**:

- Form title: "Configure Units (Step 3 of 4)"
- Two options:
  1. **Manual Entry**: "Add units one by one"
  2. **Bulk Creation**: "Create multiple similar units"
- Bulk creation interface:
  - Unit type: [Dropdown: Apartment/Studio/Storage/etc.]
  - Number to create: [5] slider
  - Starting unit number: [101]
  - Naming pattern: [101, 102, 103, 104, 105] (auto-preview)
- Unit details template:
  - Bedrooms: [2], Bathrooms: [2], Living rooms: [1]
  - Area (sqm): [85.5], Base rent: [450 KWD]
  - Parking spaces: [1]
- "Create Units" button
- Progress indicator: "Creating 5 units..."

**User Thinks**: _"Perfect! This will save me tons of time."_ **User Action**: Configures bulk unit
creation for 5 similar apartments **System Response**: Creates units with progress bar, shows
success confirmation

### Step 2.5: Property Creation Wizard - Step 4

**Screen**: Ownership Assignment (Optional) **User Sees**:

- Form title: "Property Ownership (Step 4 of 4)"
- Current ownership status: "🏢 Owned by Firm (100%)"
- Option to assign to owners:
  - "Assign to Owner" button (disabled if no owners exist)
  - "Skip - Assign Later" option
  - Information box: "Properties without assigned owners are automatically owned by your firm. You
    can assign ownership later when owner information is available."
- Visual ownership chart (pie chart showing 100% firm ownership)
- "Complete Property Setup" button

**User Thinks**: _"I'll create the owners first, then come back to assign ownership."_ **User
Action**: Clicks "Skip - Assign Later" **System Response**: Completes property creation, shows
success summary

### Step 2.6: Property Creation Success & Next Steps

**Screen**: Success Confirmation **User Sees**:

- Success message: "✅ Richardson Tower One created successfully!"
- Summary card:
  - Property: Richardson Tower One (Z1)
  - Location: Salmiya
  - Units created: 5 apartments
  - Ownership: Firm (100%)
  - Status: Ready for contracts
- Next steps suggestions:
  - "Create More Properties"
  - "Create Owners" (highlighted)
  - "Add Tenants"
  - "Go to Dashboard"
- Quick actions:
  - "View Property Details"
  - "Edit Property"

**User Action**: Clicks "Create Owners" to establish ownership relationships

---

## Stage 3: Owner Management & Ownership Assignment

### Step 3.1: Owner Creation Form

**Screen**: Add Owner Profile **User Sees**:

- Form title: "Add Property Owner"
- Required fields:
  - First Name: [Alexander]
  - Last Name: [Richardson]
  - Full Name: [Auto-populated, editable]
  - Nationality: [Dropdown with countries]
- Contact information:
  - Email: [alexander@richardson-properties.com]
  - Primary Phone: [+44-xxx-xxxx]
  - Preferred Language: [English/Arabic/Both]
- Optional fields:
  - Middle Name, Secondary Phone
  - National ID (Type & Number)
  - Address, Notes
- "Save Owner" button
- "Save & Add Another" option

**User Action**: Creates owner profile, saves **System Response**: Creates owner, shows success,
offers to create more or assign ownership

### Step 3.2: Ownership Assignment Interface

**Screen**: Property Ownership Assignment **User Sees**:

- Property selector: Richardson Tower One (Z1) [selected]
- Current ownership display:
  - "🏢 Firm: 100%" (red indicator - incomplete)
- Owner assignment section:
  - Available owners: Alexander Richardson [dropdown]
  - Ownership percentage: [____]% input field
  - Start date: [Date picker - defaults to today]
  - Primary contact: [Checkbox]
- **Visual Percentage Calculator**:
  - Pie chart showing current distribution
  - Real-time updates as percentage is entered
  - Color coding: Green (valid), Red (exceeds 100%), Yellow (incomplete)
- Assignment summary:
  - Alexander Richardson: 100%
  - Total: 100% ✅
- "Assign Ownership" button (enabled when total = 100%)

**User Thinks**: _"Perfect! The visual calculator makes this foolproof."_ **User Action**: Assigns
100% ownership to Alexander Richardson **System Response**: Updates ownership, confirms assignment
with visual feedback

---

## Stage 4: Tenant & Contract Management

### Step 4.1: Tenant Registration

**Screen**: Add Tenant Profile **User Sees**:

- Form title: "Register New Tenant"
- Personal information:
  - Full Name: [Mohammed Ahmed Al-Rasheed]
  - Nationality: [Kuwait]
  - Contact details: Email, Mobile, Work Phone
- Identification:
  - ID Type: [Civil ID/Passport/Other]
  - ID Number: [287010012345]
- Work information (optional):
  - Employer: [Ministry of Finance]
  - Work Address: [Kuwait City]
- "Save Tenant" button
- "Save & Create Contract" option

**User Action**: Registers tenant, chooses to create contract immediately **System Response**: Saves
tenant, redirects to contract creation

### Step 4.2: Contract Creation - Unit Selection

**Screen**: Contract Setup - Unit Assignment **User Sees**:

- Contract wizard: "Step 1 of 3: Unit Selection"
- Tenant: Mohammed Ahmed Al-Rasheed (confirmed)
- **Unit Availability Calendar**:
  - Month view showing available/occupied units
  - Color coding: Green (available), Red (occupied), Yellow (ending soon)
  - Unit cards showing:
    - Unit number, type, rent amount
    - Availability date
    - "Select Unit" button
- Alternative: "Show Available Units List" toggle
- Selected unit summary:
  - Z1-101: 2BR/2BA Apartment
  - Base rent: 450 KWD/month
  - Available: Immediately
- "Continue to Contract Terms" button

**User Thinks**: _"The calendar view makes it easy to see availability patterns."_ **User Action**:
Selects unit Z1-101, continues to terms

### Step 4.3: Contract Creation - Terms & Financial Details

**Screen**: Contract Terms Configuration **User Sees**:

- Contract wizard: "Step 2 of 3: Contract Terms"
- Contract period:
  - Start Date: [Date picker]
  - End Date: [Auto-calculated based on term length]
  - Contract Term: [12 months] dropdown
- Financial terms:
  - Monthly Rent: [450 KWD] (from unit, editable)
  - Security Deposit: [450 KWD] (auto-calculated, editable)
  - Late Fee: [10%] (from firm settings)
- Contract clauses (checkboxes for standard clauses)
- Special terms: [Text area for custom conditions]
- "Review Contract" button

**User Action**: Confirms terms, proceeds to review **System Response**: Generates contract preview

### Step 4.4: Contract Creation - Review & Finalization

**Screen**: Contract Review & Confirmation **User Sees**:

- Contract wizard: "Step 3 of 3: Review & Finalize"
- Contract summary card:
  - Tenant: Mohammed Ahmed Al-Rasheed
  - Unit: Z1-101 (2BR/2BA Apartment)
  - Term: March 1, 2024 - February 28, 2025
  - Monthly Rent: 450 KWD
  - Deposit: 450 KWD
  - Status: Draft
- Document generation options:
  - "Generate PDF Contract"
  - "Send to Tenant for E-Signature"
- Contract status options:
  - Active (starts immediately)
  - Upcoming (scheduled start)
- "Create Contract" button
- Email notification checkbox: "Send welcome email to tenant"

**User Action**: Creates contract with email notification **System Response**: Creates contract,
sends tenant invitation email, shows success

---

## Stage 5: Financial Operations & Invoice Management

### Step 5.1: Invoice Generation Dashboard

**Screen**: Financial Management Overview **User Sees**:

- Active contracts summary: 1 contract ready for invoicing
- Invoice generation options:
  - "Generate Single Invoice" (for specific contract)
  - "Bulk Invoice Generation" (multiple contracts)
- Recent financial activity:
  - Contracts created: 1 today
  - Invoices pending: 0
  - Payments received: 0 KWD
- Quick actions:
  - "Create Rental Invoice"
  - "Record Expense"
  - "View Overdue Payments"

**User Thinks**: _"Let me generate the rental invoices for this new contract."_ **User Action**:
Clicks "Create Rental Invoice"

### Step 5.2: Bulk Invoice Generation Wizard

**Screen**: Invoice Generation Setup **User Sees**:

- Invoice wizard: "Step 1 of 3: Select Contracts"
- Contract selection:
  - Mohammed Ahmed Al-Rasheed - Z1-101 [Selected ✓]
  - Contract period: Mar 2024 - Feb 2025
  - Monthly rent: 450 KWD
- Invoice sequence configuration:
  - Number of invoices: [12] slider (full contract term)
  - Starting date: [March 1, 2024]
  - Invoice frequency: [Monthly] dropdown
  - Due date offset: [30 days] after invoice date
- Preview: "Will create 12 monthly invoices from Mar 2024 to Feb 2025"
- "Continue to Review" button

**User Action**: Configures 12-month invoice sequence **System Response**: Calculates dates, shows
preview

### Step 5.3: Invoice Batch Review & Customization

**Screen**: Invoice Batch Preview **User Sees**:

- Invoice wizard: "Step 2 of 3: Review & Customize"
- Invoice list table:
  - Month | Due Date | Amount | Status | Actions
  - Mar 2024 | Mar 31 | 450 KWD | Draft | [Edit]
  - Apr 2024 | Apr 30 | 450 KWD | Draft | [Edit]
  - [... continues for 12 months]
- Bulk edit options:
  - "Adjust first month" (for partial month scenarios)
  - "Apply discount" (percentage or fixed amount)
  - "Change due dates" (bulk adjustment)
- Individual edit capability:
  - Click on amount to modify specific invoice
  - Special conditions (half-month rent, etc.)
- Summary: 12 invoices totaling 5,400 KWD
- "Generate Invoices" button

**User Thinks**: _"I'll reduce the first month to half-rent since they're moving mid-month."_ **User
Action**: Edits March invoice to 225 KWD, generates batch **System Response**: Creates 12 invoices
with progress indicator

### Step 5.4: Invoice Delivery & Tenant Notification

**Screen**: Invoice Generation Complete **User Sees**:

- Success message: "✅ 12 invoices created successfully!"
- Delivery options:
  - Email to tenant: [Checkbox selected]
  - Portal notification: [Checkbox selected]
  - Print PDF package: [Checkbox]
- Email preview:
  - Subject: "Your rental invoices for Z1-101 are ready"
  - Content preview with firm branding
  - Attached: 12 PDF invoices
- Tenant access information:
  - Portal login link
  - First-time setup instructions
- "Send Notifications" button
- "Skip - Send Later" option

**User Action**: Sends email notifications to tenant **System Response**: Delivers emails, creates
tenant portal access, shows confirmation

---

## Stage 6: Ongoing Operations Dashboard

### Step 6.1: Accountant Daily Dashboard

**Screen**: Operational Dashboard **User Sees**:

- **Header**: Firm logo, name, and context (prominently displayed)
- **Today's Priority Tasks** widget:
  - Maintenance requests: 2 pending vendor assignment
  - Expense approvals: 1 awaiting owner approval (500 KWD)
  - Contract expirations: 0 in next 30 days
  - Overdue payments: 0 items
- **Financial Overview** widget:
  - Monthly revenue target: 5,400 KWD (from contracts)
  - Collected this month: 450 KWD (8%)
  - Outstanding receivables: 4,950 KWD
  - Recent expenses: 150 KWD (plumbing repair)
- **Data Completion Progress** widget:
  - Properties: 1 of 10 planned (10%) ⚠️
  - Owners: 1 complete ✅
  - Tenants: 1 complete ✅
  - Contracts: 1 active ✅
- **Quick Actions** section:
  - "Add Property" | "Add Tenant" | "Create Expense" | "Record Payment"

**User Thinks**: _"Good overview! I can see I need to add more properties and there's a maintenance
request waiting."_ **User Action**: Clicks on maintenance request to handle vendor assignment

### Step 6.2: Maintenance Request Handling

**Screen**: Maintenance Request Details **User Sees**:

- Request details:
  - Title: "Kitchen Sink Leak"
  - Property: Z1-101 (Mohammed Ahmed Al-Rasheed)
  - Priority: High ⚠️
  - Submitted: 2 hours ago
  - Description: "Kitchen sink has been leaking under the cabinet. Water pooling detected."
- Vendor assignment section:
  - Available vendors: [Dropdown with plumbing specialists]
  - ProPlumb Kuwait (Rating: 4.3/5, Emergency available) [Recommended]
  - Estimated cost: 100-500 KWD range
- Action buttons:
  - "Assign Vendor" (primary)
  - "Request Owner Approval First" (if over threshold)
  - "Mark as Emergency" (escalation)
- Communication log (tenant notifications sent)

**User Action**: Assigns ProPlumb Kuwait to handle the repair **System Response**: Sends
notification to vendor, updates request status, notifies tenant

---

## Stage 7: Multi-Firm Context Management (Advanced Feature)

### Step 7.1: Firm Switching Interface

**Screen**: Multi-Firm Access (If applicable) **Trigger**: Admin assigns accountant to second firm
**User Sees**:

- Current firm indicator in header: "ABC Properties" with dropdown arrow
- Firm switcher dropdown:
  - ABC Properties (Current) ✓
  - XYZ Real Estate (New assignment)
  - "Switch Firm Context" options
- Context switch warning:
  - "Switching to XYZ Real Estate will change your view to their data only"
  - "Your current work will be saved automatically"
- "Switch Context" confirmation button

**User Thinks**: _"I need to check the new firm's setup. This switching looks safe."_ **User
Action**: Switches to XYZ Real Estate context **System Response**: Changes entire interface context,
shows new firm's dashboard

### Step 7.2: New Firm Context Dashboard

**Screen**: XYZ Real Estate Dashboard **User Sees**:

- Updated header with XYZ branding and logo
- Fresh dashboard reflecting XYZ's data:
  - Properties: 0 (needs setup)
  - Tenants: 0
  - Contracts: 0
  - Revenue: 0 KWD
- Getting started guidance for new firm
- Context reminder: "You are now working with XYZ Real Estate data"
- Firm switcher still available in header

**User Action**: Begins property setup process for new firm **System Response**: Guides through
familiar setup workflow with XYZ context

---

## Journey Success Metrics & Completion

### Operational Readiness Achieved:

- ✅ Property portfolio foundation established
- ✅ Ownership relationships configured
- ✅ Tenant onboarding and contracts active
- ✅ Invoice generation and delivery operational
- ✅ Maintenance workflow integrated
- ✅ Financial tracking and approval systems functional

### Time Investment & Efficiency:

- **Initial setup**: 2-3 hours for first property and tenant
- **Ongoing operations**: 15-20 minutes daily monitoring
- **Bulk operations**: 80% time savings vs manual processes
- **Error reduction**: 75% fewer data entry mistakes

### User Satisfaction Indicators:

- Clear progress tracking throughout setup
- Logical workflow sequence with flexible execution
- Visual tools for complex operations (ownership calculator)
- Immediate feedback and validation
- Comprehensive help and guidance system

This journey map provides the detailed foundation needed for wireframe creation and frontend
implementation. The complexity is significant but well-structured through progressive disclosure and
intelligent workflow design.
