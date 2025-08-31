# Owner Portal - Detailed User Journey Map

## Journey Overview

**Goal**: Property owner monitors portfolio performance and approves operational expenses
**Duration**: Daily monitoring (5-10 minutes), Weekly analysis (20-30 minutes) **Complexity**:
Medium (Oversight and approval focused) **Entry Method**: Email invitation from Accountant or direct
account creation

---

## Stage 1: Owner Account Activation & First Login

### Step 1.1: Account Creation Notification

**Trigger**: Accountant creates owner profile and sends invitation **User Sees**: Email notification

- **Subject**: "[Firm Name] has set up your REMS property management account"
- **Content**:
  - Welcome message from property management firm
  - Overview: "Monitor your property investments online"
  - Properties included: "Your properties: Richardson Tower One, Tower Two..."
  - "Access Your Properties" button
  - System benefits overview

**User Thinks**: _"Finally! I can monitor my properties without calling the office constantly."_
**User Action**: Clicks "Access Your Properties"

### Step 1.2: Password Setup & Account Verification

**Screen**: Owner Account Activation **User Sees**:

- Firm branding with professional property management theme
- Welcome message: "Welcome Alexander Richardson"
- Property portfolio preview: "Managing 8 properties with total value of X KWD"
- Password creation form with security requirements
- "Activate Account & View Portfolio" button

**User Action**: Sets secure password, activates account **System Response**: Redirects to portfolio
dashboard

### Step 1.3: Portfolio Overview & Permissions Introduction

**Screen**: Welcome Dashboard with Guided Tour **User Sees**:

- **Portfolio Summary Card**:
  - 8 properties owned (Z1, Z2, Z3, Z4, Z6, Z7, Z8, Z10)
  - Total portfolio value: 4,329,642.86 KWD
  - Monthly rental income: 3,670 KWD expected
  - Current occupancy: 85% (11/13 units occupied)
- **Your Capabilities** overview:
  - ✅ Monitor all property performance and financials
  - ✅ Approve maintenance and expense requests
  - ✅ Create maintenance requests for your properties
  - ✅ Export financial reports for taxes and accounting
  - ℹ️ Questions? Contact your accountant through the system
- **Getting Started** checklist:
  - ✅ Account activated
  - ⏳ Review portfolio performance
  - ⏳ Set notification preferences
  - ⏳ Explore financial reports
- "Start Exploring" button

**User Thinks**: _"Great overview! I can see everything at a glance. Let me explore the detailed
performance."_ **User Action**: Clicks "Start Exploring"

---

## Stage 2: Portfolio Dashboard & Performance Analysis

### Step 2.1: Main Portfolio Dashboard

**Screen**: Comprehensive Portfolio Overview **User Sees**:

- **Header**: Owner name with properties count and total value
- **Portfolio Performance Overview Widget**:
  - Total monthly income expected: 3,670 KWD
  - Actual collected this month: 3,120 KWD (85%)
  - Outstanding receivables: 550 KWD
  - Net income after expenses: 2,890 KWD
  - Portfolio ROI: 7.2% (excellent indicator - green)

- **Financial Health Indicators Widget**:
  - On-time payments: 85% (good - yellow)
  - Late receivables (>30 days): 220 KWD
  - Pending expense approvals: 2 items (⚠️ attention needed)
  - Emergency maintenance alerts: 0 items

- **Property Performance Grid**:

  ```
  Property | Occupancy | Monthly Rent | Collected | Status
  Z1       | 100% (5/5) | 1,680 KWD   | 100%      | ✅ Excellent
  Z2       | 75% (3/4)  | 1,190 KWD   | 90%       | ⚠️ 1 Vacancy
  Z3       | 100% (3/3) | 800 KWD     | 100%      | ✅ Excellent
  [... continues for all 8 properties]
  ```

- **Recent Activity Feed**:
  - "New expense approval needed: Z1 plumbing repair (150 KWD)"
  - "Payment received: Z3-301 rent for December (520 KWD)"
  - "Maintenance completed: Z2 AC repair"

**User Thinks**: _"Good overall performance, but I need to approve that plumbing expense and check
why Z2 has a vacancy."_ **User Action**: Clicks on pending expense approval notification

### Step 2.2: Expense Approval Interface

**Screen**: Expense Approval Detail **User Sees**:

- **Expense Summary Card**:
  - Property: Z1 - Richardson Tower One
  - Category: Maintenance & Repairs → Plumbing Repairs
  - Amount: 150.00 KWD
  - Submitted by: Accountant (Sarah Johnson)
  - Submitted date: 2 hours ago
  - Urgency: Normal (72 hours to approve)

- **Expense Details**:
  - Vendor: ProPlumb Kuwait (Rating: 4.3/5)
  - Description: "Kitchen sink leak repair - Unit Z1-101"
  - Tenant impact: "Tenant reported water pooling under cabinet"
  - Estimated completion: 1 day
  - Budget impact: "Within monthly maintenance budget (450 KWD remaining)"

- **Property Context**:
  - Unit: Z1-101 (Mohammed Ahmed Al-Rasheed)
  - Rent: 450 KWD/month (on-time payment history)
  - Last maintenance: 6 months ago (general cleaning)

- **Approval Actions**:
  - "Approve Expense" button (primary - green)
  - "Request More Information" button (secondary)
  - "Reject Expense" button (warning - red)
  - Comments field: "Add approval comments (optional)"

**User Thinks**: _"This looks legitimate and urgent. The tenant has good payment history and 150 KWD
is reasonable for plumbing."_ **User Action**: Adds comment "Approved - please prioritize repair for
good tenant" and clicks "Approve Expense" **System Response**: Shows approval confirmation, sends
notification to accountant and vendor

### Step 2.3: Property Deep-Dive Analysis

**Screen**: Individual Property Dashboard (Z1 Selected) **User Sees**:

- **Property Header**:
  - Richardson Tower One (Z1) - Salmiya
  - Property value: 1,571,785.71 KWD
  - Monthly income potential: 1,680 KWD
  - Current occupancy: 100% (5/5 units)

- **Financial Performance Panel**:
  - **December 2024 Summary**:
    - Expected income: 1,680 KWD
    - Collected: 1,680 KWD (100%)
    - Expenses: 320 KWD (utilities, maintenance)
    - Net income: 1,360 KWD
  - **Year-to-Date Performance**:
    - Total collected: 19,560 KWD
    - Total expenses: 4,200 KWD
    - Net annual income: 15,360 KWD
    - ROI: 9.8% (excellent)

- **Unit Status Table**:

  ```
  Unit | Type      | Tenant              | Rent   | Status    | Last Payment
  101  | 2BR Apt   | Mohammed Al-Rasheed | 450    | Current   | Dec 1, 2024
  102  | 1BR Apt   | Emma Johnson        | 350    | Current   | Dec 1, 2024
  103  | Studio    | [Vacant]            | 280    | Available | -
  201  | 2BR Apt   | [Contract Pending]  | 450    | Upcoming  | Jan 1, 2025
  G01  | Storage   | Global Trading LLC  | 50     | Current   | Dec 1, 2024
  ```

- **Maintenance History**:
  - "Just approved: Plumbing repair Unit 101 (150 KWD) - In progress"
  - "Nov 15: General cleaning (80 KWD) - Completed"
  - "Oct 3: Electrical repair Unit 102 (120 KWD) - Completed"

**User Thinks**: _"Excellent performance on this property. The new tenant for 201 starting January
is great news."_ **User Action**: Navigates back to portfolio overview to check other properties

---

## Stage 3: Financial Analysis & Reporting

### Step 3.1: Portfolio Financial Analytics

**Screen**: Advanced Financial Dashboard **User Sees**:

- **Performance Comparison Chart** (Bar chart):
  - Properties ranked by ROI: Z1 (9.8%), Z3 (8.5%), Z4 (7.9%), etc.
  - Color coding: Green (>8%), Yellow (6-8%), Red (<6%)
  - Click-to-drill-down functionality

- **Revenue Trends** (Line chart - 12 months):
  - Expected vs Collected income trends
  - Seasonal patterns visible
  - Collection efficiency trending upward

- **Expense Analysis** (Pie chart):
  - Maintenance & Repairs: 35%
  - Utilities: 25%
  - Management Fees: 20%
  - Insurance & Taxes: 15%
  - Other: 5%

- **Predictive Revenue Forecast**:
  - "Based on active and upcoming contracts"
  - Next 6 months projected income: 22,020 KWD
  - Confidence level: High (95%)
  - Assumptions: Current occupancy maintained

**User Thinks**: _"Very helpful analytics! I should focus on improving properties with ROI below 7%.
The forecast looks promising."_ **User Action**: Clicks "Generate Monthly Report" for detailed PDF

### Step 3.2: Monthly Report Generation

**Screen**: Report Export Interface **User Sees**:

- **Report Configuration**:
  - Report type: "Monthly Financial Summary" (selected)
  - Month: "December 2024" (dropdown)
  - Properties: "All Properties" or individual selection
  - Include sections:
    - ✅ Portfolio overview and performance
    - ✅ Property-by-property breakdown
    - ✅ Tenant payment status
    - ✅ Expense summary by category
    - ✅ Maintenance activity report
    - ✅ Comparative analytics

- **Export Options**:
  - Format: PDF (selected) / Excel
  - Delivery: Download / Email
  - Template: "Executive Summary" / "Detailed Analysis" / "Tax Preparation"

- **Preview Available**: "Preview Report" button
- **Generate Report**: "Create PDF Report" button

**User Action**: Selects "Executive Summary" template, generates PDF **System Response**: Creates
comprehensive 8-page PDF report, shows download link

### Step 3.3: Report Review & Download

**Screen**: Generated Report Preview **User Sees**:

- **PDF Preview Window** showing:
  - Cover page: "Richardson Property Portfolio - December 2024"
  - Executive summary with key metrics
  - Property performance charts
  - Financial statements by property
  - Expense categorization
  - Recommendations section

- **Report Quality**: Professional formatting with firm branding
- **Download Options**:
  - "Download PDF" (primary button)
  - "Email to My Accountant" (secondary)
  - "Save to Account" (for future reference)
- **Report Sharing**: "Share Report" with security options

**User Thinks**: _"Perfect! This is exactly what I need for my accountant and tax preparation."_
**User Action**: Downloads PDF and emails copy to personal accountant

---

## Stage 4: Maintenance Management & Owner-Initiated Requests

### Step 4.1: Maintenance Overview Dashboard

**Screen**: Property Maintenance Status **User Sees**:

- **Active Maintenance Requests**:
  - Z1-101: Plumbing repair (Just approved) - ✅ Vendor assigned
  - Z2-201: AC service request (Pending approval) - ⏳ Awaiting review
  - Z4-303: Painting touch-up (Scheduled) - 📅 Dec 15, 2024

- **Maintenance Analytics**:
  - Average response time: 2.3 days (good)
  - Average completion time: 4.1 days (acceptable)
  - Monthly maintenance cost: 380 KWD average
  - Emergency requests: 1 this month

- **Vendor Performance Summary**:
  - ProPlumb Kuwait: 4.3/5 (8 jobs completed)
  - Kumar Technical: 4.8/5 (12 jobs completed)
  - Richardson Contracting: 4.5/5 (15 jobs completed)

- **Property Maintenance Calendar**: Visual timeline showing scheduled and completed work

**User Thinks**: _"Good maintenance activity. I should create a request for the exterior painting
I've been thinking about for Z3."_ **User Action**: Clicks "Create Maintenance Request"

### Step 4.2: Owner-Initiated Maintenance Request Creation

**Screen**: Maintenance Request Form **User Sees**:

- **Property Selection**:
  - Dropdown: "Richardson Plaza (Z3)" selected
  - Property image and basic info displayed
  - Current maintenance status: "No active requests"

- **Request Details Form**:
  - Issue title: [Text field] "Building Exterior Painting"
  - Issue description: [Text area] "Annual exterior maintenance - building needs fresh coat"
  - Priority level: [Dropdown] Low/Medium/High/Emergency → "Low" selected
  - Affected area: [Dropdown] Exterior/Interior/Common Area/Specific Unit → "Exterior"
  - Estimated urgency: "Can be scheduled within next month"

- **Additional Information**:
  - Photo upload: [Drag & drop area] "Add photos of the issue"
  - Preferred timing: "Avoid weekends if possible for tenant comfort"
  - Budget expectation: "Please get quotes from 2-3 contractors"

- **Submit Options**:
  - "Submit Request" (primary button)
  - "Save as Draft" (secondary)
  - "Cancel" (tertiary)

**User Action**: Fills form with exterior painting details, uploads photos, submits request **System
Response**: Creates maintenance order, assigns to accountant, sends confirmation

### Step 4.3: Maintenance Request Confirmation

**Screen**: Request Submitted Successfully **User Sees**:

- **Success Confirmation**: "✅ Maintenance request submitted successfully!"
- **Request Summary**:
  - Request #: MO-2024-12-008
  - Property: Richardson Plaza (Z3)
  - Issue: Building Exterior Painting
  - Priority: Low
  - Status: Submitted → Awaiting accountant review
  - Expected timeline: "Accountant will review within 24 hours"

- **Next Steps Information**:
  - "Your accountant will obtain quotes from contractors"
  - "You'll receive approval request if cost exceeds threshold"
  - "Work will be scheduled based on priority and weather conditions"
  - "You'll receive updates via email and portal notifications"

- **Tracking Options**:
  - "Track This Request" (bookmark for easy access)
  - "View All Maintenance History"
  - "Return to Dashboard"

**User Thinks**: _"Great! The process is clear and I'll get updates automatically. No need to follow
up constantly."_ **User Action**: Returns to dashboard to continue monitoring

---

## Stage 5: Notification Management & Communication

### Step 5.1: Notification Center

**Screen**: Alerts and Updates Dashboard **User Sees**:

- **Today's Notifications** (5 new):
  - 🔔 "Expense approved: Z1 plumbing repair completed (150 KWD)"
  - 💰 "Payment received: Z4-102 rent for December (380 KWD)"
  - 📅 "Contract expires in 60 days: Z6-201 (Emma Johnson)"
  - 🔧 "Maintenance scheduled: Z3 exterior painting (Dec 20)"
  - 📊 "Weekly summary available: Portfolio performance"

- **Notification Categories**:
  - Financial (payments, expenses): 15 this week
  - Maintenance (requests, completions): 8 this week
  - Contracts (renewals, expirations): 3 this week
  - System updates: 2 this week

- **Notification Preferences**:
  - Email frequency: Weekly summary + urgent alerts
  - SMS alerts: Emergency maintenance only
  - Mobile push: Expense approvals + late payments
  - "Customize Preferences" link

**User Action**: Clicks "Customize Preferences" to adjust settings

### Step 5.2: Notification Preferences Configuration

**Screen**: Communication Settings **User Sees**:

- **Property-Specific Settings** (Your request for per-property preferences):

  ```
  Richardson Tower One (Z1):
  ├── Email: Daily summaries ✓
  ├── SMS: Emergency only ✓
  ├── Mobile: All maintenance ✓

  Richardson Tower Two (Z2):
  ├── Email: Weekly summaries ✓
  ├── SMS: Large expenses >500 KWD ✓
  ├── Mobile: Payment delays ✓

  [Similar settings for each property]
  ```

- **Global Settings**:
  - Weekly portfolio summary: Mondays at 8:00 AM
  - Monthly financial report: 1st of month
  - Urgent alerts: Always immediate (all channels)
  - Expense approval reminders: 24 hours before deadline

- **Contact Methods**:
  - Primary email: alexander@richardson-properties.com ✓
  - SMS number: +44-xxxx-xxxx ✓
  - Mobile app: Installed and active ✓

**User Thinks**: _"Perfect! I can fine-tune notifications per property. More alerts for my premium
properties."_ **User Action**: Adjusts settings, saves preferences

---

## Stage 6: Weekly Monitoring Routine

### Step 6.1: Weekly Portfolio Review

**Screen**: Monday Morning Dashboard Check **User Sees**:

- **Weekly Summary Email** (received at 8:00 AM):
  - "Richardson Portfolio Weekly Summary - Week of Dec 9-15, 2024"
  - Total collected: 3,450 KWD (94% of expected)
  - New expenses approved: 2 items (270 KWD total)
  - Maintenance completed: 1 item (plumbing repair)
  - Upcoming: 1 contract expiration in 45 days

- **Dashboard Quick Check** (5 minutes):
  - Portfolio performance: Stable (no red indicators)
  - Pending approvals: 0 items
  - Late payments: 1 item (Z2-202, 3 days overdue)
  - Maintenance: All on schedule

- **Action Items Identified**:
  - Follow up on Z2-202 late payment (via accountant)
  - Review contract renewal for expiring lease
  - Check progress on Z3 exterior painting project

**User Thinks**: _"Great week overall. Just one minor late payment to address. I'll message the
accountant."_ **User Action**: Navigates to communication section

### Step 6.2: Communication with Property Management Team

**Screen**: Internal Messaging Interface **User Sees**:

- **Message Center**:
  - Conversation with: Sarah Johnson (Accountant)
  - Recent messages about approved expenses and maintenance
  - "Compose New Message" button

- **New Message Composition**:
  - To: Sarah Johnson (Accountant) [selected]
  - Subject: "Late Payment Follow-up - Z2-202"
  - Message: "Hi Sarah, I noticed Unit Z2-202 is 3 days overdue on December rent. Could you please
    follow up with the tenant? This is unusual for them. Thanks!"
  - Priority: Normal
  - "Send Message" button

- **Message History**: Previous conversations well-organized
- **Quick Actions**: Templates for common messages

**User Action**: Sends message to accountant about late payment **System Response**: Delivers
message, sends notification to accountant

---

## Journey Success Metrics & Routine Establishment

### Daily Monitoring Routine (5-7 minutes):

- ✅ Quick dashboard check for alerts and performance
- ✅ Review and approve pending expense requests
- ✅ Check payment collection status
- ✅ Monitor urgent maintenance requests

### Weekly Analysis Routine (20-30 minutes):

- ✅ Portfolio performance review and comparison
- ✅ Financial trends analysis and forecasting
- ✅ Maintenance cost evaluation and vendor performance
- ✅ Communication with property management team

### Monthly Reporting Routine (45 minutes):

- ✅ Generate comprehensive financial reports
- ✅ Export data for tax preparation and accounting
- ✅ Property performance benchmarking
- ✅ Strategic planning for portfolio optimization

### Quarterly Planning (2-3 hours):

- ✅ Contract renewal and rent adjustment analysis
- ✅ Capital improvement planning and budgeting
- ✅ Vendor performance evaluation and contract renewals
- ✅ Portfolio expansion opportunity assessment

## User Satisfaction Indicators:

- **Transparency**: Complete visibility into property performance without constant phone calls
- **Control**: Efficient expense approval process with clear information and mobile capability
- **Intelligence**: Predictive analytics and comparative performance data for informed decisions
- **Efficiency**: Automated reporting and notification systems reducing manual tracking
- **Professional Integration**: Seamless communication with property management team and external
  accountants

This journey map demonstrates how the Owner portal transforms property investment management from
reactive phone-call-based oversight to proactive, data-driven investment optimization with
streamlined approval workflows and comprehensive performance analytics.
