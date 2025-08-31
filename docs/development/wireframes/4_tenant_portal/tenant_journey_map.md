# Tenant Portal - Detailed User Journey Map

## Journey Overview

**Goal**: Tenant manages rental obligations and property services through convenient digital portal
**Duration**: Monthly engagement (rent payment), As-needed (maintenance, information access)
**Complexity**: Low (Service-focused, consumer-friendly interface) **Entry Method**: Email
invitation after lease contract creation by accountant

---

## Stage 1: New Tenant Account Setup & First Login

### Step 1.1: Welcome Email & Account Invitation

**Trigger**: Accountant creates rental contract and sends tenant invitation **User Sees**: Email
notification

- **Subject**: "Welcome to your new home! Access your tenant portal"
- **Content**:
  - Welcome message from property management firm
  - Property details: "Your new home at Richardson Tower One, Unit 101"
  - Lease summary: "12-month lease starting March 1, 2024"
  - "Set Up Your Account" button
  - What you can do: "Pay rent, request maintenance, access lease documents"
  - Support contact information

**User Thinks**: _"Great! I can manage everything online. No more checks or phone calls for
maintenance."_ **User Action**: Clicks "Set Up Your Account"

### Step 1.2: Account Activation & Password Setup

**Screen**: Tenant Account Activation **User Sees**:

- Property branding with welcoming residential theme
- Personal welcome: "Welcome Mohammed Ahmed Al-Rasheed"
- Lease summary card:
  - Property: Richardson Tower One, Unit 101
  - Lease term: March 1, 2024 - February 28, 2025
  - Monthly rent: 450 KWD
  - Security deposit: 450 KWD (on file)
- Password creation form with security guidelines
- "Activate Account & Continue" button

**User Action**: Creates secure password, activates account **System Response**: Redirects to tenant
dashboard with welcome tour

### Step 1.3: First Login Dashboard & Orientation

**Screen**: Tenant Dashboard with Welcome Tour **User Sees**:

- **Welcome Tour Overlay**: "Let's show you around your tenant portal"
- **Payment Status Widget** (highlighted in tour):
  - Next payment due: March 31, 2024 (450 KWD)
  - Payment status: On time ✅
  - "Pay Rent" button prominently displayed
  - Payment history: No previous payments (new tenant)

- **Lease Information Card**:
  - Lease expires: February 28, 2025 (11 months remaining)
  - Security deposit: 450 KWD (fully paid)
  - "View Full Lease" button
  - Emergency contact: Property Management Office

- **Quick Actions Section**:
  - "Pay Rent" (primary button)
  - "Request Maintenance"
  - "Contact Property Manager"
  - "Download Lease"

- **Getting Started Checklist**:
  - ✅ Account activated
  - ⏳ Set up payment method (recommended)
  - ⏳ Review lease agreement
  - ⏳ Save emergency contact information

**User Thinks**: _"Very clean and simple. Let me set up my payment method first so rent payments are
easy."_ **User Action**: Clicks "Set up payment method" from checklist

### Step 1.4: Payment Method Configuration

**Screen**: Payment Setup Wizard **User Sees**:

- **Payment Method Options**:
  - 💳 **KNET** (Kuwait local network) - "Most popular for local residents"
  - 💳 **Credit/Debit Card** (Visa, Mastercard) - "International cards accepted"
  - 🏦 **Bank Transfer** - "Direct from your bank account"
  - 📱 **Mobile Wallet** (UPayments) - "Quick mobile payments"

- **Payment Method Setup** (KNET selected):
  - Card type: [KNET Debit Card]
  - Save for future payments: [Checkbox selected]
  - Set as default method: [Checkbox selected]
  - "Test Payment Method" button (optional)

- **Payment Preferences**:
  - Payment reminders: 7 days before due date
  - Auto-pay setup: "Available after first successful payment"
  - Receipt delivery: Email + portal notification

**User Action**: Sets up KNET payment method, enables reminders **System Response**: Validates
payment method, saves preferences, completes setup

---

## Stage 2: Monthly Rent Payment Routine

### Step 2.1: Payment Reminder Notification

**Trigger**: Automated reminder 7 days before rent due date **User Sees**: Multiple notification
channels

- **Email**: "Rent payment reminder - Due March 31, 2024"
- **SMS**: "REMS: Your rent payment (450 KWD) is due in 7 days. Pay easily at [portal link]"
- **Mobile Push**: "💰 Rent due in 7 days - Tap to pay now"

**User Thinks**: _"Perfect timing! I just got paid. Let me pay now so I don't forget."_ **User
Action**: Clicks portal link from email

### Step 2.2: Rent Payment Processing

**Screen**: Payment Processing Interface (Mobile-Optimized) **User Sees**:

- **Payment Summary Card**:
  - Amount due: 450.00 KWD
  - Due date: March 31, 2024 (7 days)
  - Property: Richardson Tower One, Unit 101
  - Invoice #: INV-2024-03-00001

- **Payment Method** (pre-selected from saved):
  - KNET Debit Card ending in \*\*\*\*1234
  - "Change payment method" link

- **Payment Options**:
  - Pay full amount: 450.00 KWD (selected)
  - Pay partial amount: [Custom amount field]

- **Processing Options**:
  - Email receipt to: mohammed.rasheed@email.com ✓
  - SMS confirmation: +965-9999-1001 ✓
  - Save payment confirmation in portal ✓

- **"Pay 450 KWD"** button (large, prominent)

**User Action**: Confirms payment details, clicks "Pay 450 KWD" **System Response**: Redirects to
KNET secure payment gateway

### Step 2.3: KNET Payment Gateway Processing

**Screen**: KNET Secure Payment Interface **User Sees**:

- KNET branding and security indicators
- Transaction details:
  - Merchant: REMS Property Management
  - Amount: 450.00 KWD
  - Reference: Unit 101 - March 2024 Rent
- PIN entry and confirmation interface
- "Complete Payment" button

**User Action**: Enters PIN, completes payment **KNET Response**: Processes payment, returns success
confirmation

### Step 2.4: Payment Confirmation & Receipt

**Screen**: Payment Success Confirmation **User Sees**:

- **Success Message**: "✅ Payment successful! Thank you for your payment."
- **Payment Details**:
  - Amount paid: 450.00 KWD
  - Payment date: March 24, 2024, 2:45 PM
  - Reference #: KNET-2024-03-789456
  - Next payment due: April 30, 2024

- **Receipt Options**:
  - "Download PDF Receipt" button
  - "Email Receipt" button
  - "View Payment History" link

- **What's Next**:
  - "Your payment has been recorded"
  - "Receipt emailed to mohammed.rasheed@email.com"
  - "Next month's invoice will be available April 1st"

**User Thinks**: _"Excellent! So easy and quick. Much better than bank visits or checks."_ **User
Action**: Downloads PDF receipt for personal records

---

## Stage 3: Maintenance Request Creation & Tracking

### Step 3.1: Maintenance Issue Discovery

**Scenario**: Tenant discovers kitchen sink leak (2 weeks after move-in) **User Thinks**: _"There's
water pooling under the kitchen sink. I need to report this quickly before it gets worse."_ **User
Action**: Opens tenant portal on mobile device

### Step 3.2: Maintenance Request Creation

**Screen**: Create Maintenance Request (Mobile-First) **User Sees**:

- **Request Type Selection**:
  - 🚨 **Emergency** (water, electrical, security)
  - ⚡ **Urgent** (heating, major appliances)
  - 🔧 **Normal** (general repairs, maintenance)
  - 🎨 **Cosmetic** (painting, minor improvements)

- **Issue Category** (after selecting "Normal"):
  - Plumbing ✓ (selected)
  - Electrical
  - HVAC/Air Conditioning
  - Appliances
  - General Maintenance
  - Other

- **Issue Description**:
  - Title: [Text field] "Kitchen sink leak"
  - Description: [Text area] "Water is pooling under the kitchen sink cabinet. Appears to be coming
    from the pipe connection. Not an emergency but needs attention soon."
  - Location: Kitchen (auto-filled from category)

- **Photo Documentation**:
  - "Add photos" button (camera or gallery)
  - Up to 5 photos allowed
  - Photo preview area

**User Action**: Takes 2 photos of leak, fills description, submits request **System Response**:
Creates maintenance order, sends confirmation

### Step 3.3: Maintenance Request Confirmation

**Screen**: Request Submitted Successfully **User Sees**:

- **Confirmation Message**: "✅ Maintenance request submitted successfully!"
- **Request Details**:
  - Request #: MR-2024-03-015
  - Issue: Kitchen sink leak
  - Priority: Normal
  - Status: Submitted → Under review
  - Submitted: March 10, 2024, 3:20 PM

- **What Happens Next**:
  - "Property management will review within 24 hours"
  - "You'll receive updates via email and portal notifications"
  - "Estimated response time: 2-3 business days"
  - "For emergencies, call: +965-2222-0001"

- **Tracking Options**:
  - "Track This Request" (bookmark)
  - "View All My Requests"
  - "Create Another Request"

**User Thinks**: _"Great! Clear timeline and I can track progress. Much better than waiting for
callbacks."_ **User Action**: Bookmarks request for easy tracking

### Step 3.4: Maintenance Progress Tracking

**Screen**: Maintenance Request Status (3 days later) **User Sees**:

- **Request Status Updates**:

  ```
  March 10, 3:20 PM - Request submitted ✅
  March 10, 4:45 PM - Reviewed and approved ✅
  March 11, 9:15 AM - Vendor assigned: ProPlumb Kuwait ✅
  March 12, 2:30 PM - Vendor scheduled visit: March 13, 10:00 AM ✅
  March 13, 10:00 AM - Work in progress 🔄
  March 13, 11:30 AM - Work completed ✅
  ```

- **Work Completion Details**:
  - Vendor: ProPlumb Kuwait
  - Work performed: "Replaced faulty pipe connection under sink"
  - Parts used: Pipe connector, sealing compound
  - Completion time: 1.5 hours
  - Warranty: 6 months on parts and labor

- **Action Required**: "Please rate the service quality"
- **Rating Interface**:
  - Service quality: ⭐⭐⭐⭐⭐ (5 stars)
  - Timeliness: ⭐⭐⭐⭐⭐ (5 stars)
  - Cleanliness: ⭐⭐⭐⭐⭐ (5 stars)
  - Comments: [Optional text area]

**User Action**: Provides 5-star rating with positive comments **System Response**: Records rating,
closes maintenance request

---

## Stage 4: Lease Information Access & Management

### Step 4.1: Lease Document Access

**Scenario**: Tenant needs lease terms for car registration documentation **User Action**: Navigates
to "Lease Information" section

**Screen**: Lease Information Dashboard **User Sees**:

- **Lease Overview Card**:
  - Contract #: CONT-2024-001
  - Property: Richardson Tower One, Unit 101
  - Lease term: March 1, 2024 - February 28, 2025
  - Monthly rent: 450 KWD
  - Security deposit: 450 KWD (refundable)

- **Important Dates**:
  - Lease start: March 1, 2024 ✅
  - Mid-lease review: September 1, 2024
  - Renewal notice due: December 1, 2024
  - Lease expiration: February 28, 2025

- **Document Access**:
  - "Download Full Lease Agreement" (PDF)
  - "Download Arabic Translation" (if available)
  - "Email Lease to Me" button
  - "Print-Friendly Version" link

- **Security Deposit Status**:
  - Amount: 450 KWD (paid in full)
  - Conditions: "Refunded upon satisfactory unit condition"
  - Expected refund date: "Within 30 days of lease termination"

**User Action**: Downloads PDF lease agreement **System Response**: Generates current lease PDF with
digital signatures

### Step 4.2: Lease Terms Quick Reference

**Screen**: Key Lease Terms Summary **User Sees**:

- **Rental Terms**:
  - Monthly rent: 450 KWD (due by 31st of each month)
  - Late fee: 45 KWD (10% after 3-day grace period)
  - Payment methods: Online portal, bank transfer
- **Property Rules**:
  - No pets allowed
  - No smoking in unit or common areas
  - Quiet hours: 10:00 PM - 7:00 AM
  - Guest policy: Maximum 7 consecutive days

- **Maintenance Responsibilities**:
  - Tenant: Minor repairs under 50 KWD, cleanliness
  - Landlord: Major repairs, appliances, structural issues
  - Emergency contact: Available 24/7

- **Renewal Information**:
  - Renewal notice required: 60 days before expiration
  - Rent adjustment: Based on market rates (maximum 5% increase)
  - Automatic renewal: Not applicable

**User Thinks**: _"Perfect! I have all the key information in one place. Very helpful reference."_
**User Action**: Bookmarks page for future reference

---

## Stage 5: Communication & Property Information

### Step 5.1: Non-Maintenance Communication

**Scenario**: Tenant has question about guest parking policy **Screen**: Contact Property Management
**User Sees**:

- **Communication Options**:
  - 📧 **Send Message** (non-urgent inquiries)
  - 📞 **Call Office** (+965-2222-0001, 8:00 AM - 5:00 PM)
  - 🚨 **Emergency Contact** (+965-9999-0001, 24/7)
  - ❓ **FAQ** (common questions and answers)

- **Message Composition**:
  - To: Property Management Team
  - Subject: [Dropdown with common topics] "Guest Parking Policy"
  - Message: [Text area] "Hi, I have a question about guest parking. Can visitors park in the
    building parking area overnight? What's the process for guest parking permits?"
  - Priority: Normal / Urgent
  - Response expected: 1-2 business days

**User Action**: Sends message about guest parking **System Response**: Delivers message, sends
confirmation with ticket number

### Step 5.2: Property Information Access

**Screen**: Property Information Hub **User Sees**:

- **Building Information**:
  - Building amenities: Elevator, parking, 24/7 security
  - Common area rules and usage guidelines
  - Garbage collection: Tuesday and Friday, 7:00 AM
  - Mail delivery: Ground floor mailboxes

- **Emergency Procedures**:
  - Fire evacuation plan with exit routes
  - Utility shutoff locations (water, electricity)
  - Emergency contact numbers with 24/7 availability
  - Building security procedures and access codes

- **Neighborhood Information**:
  - Nearby services: Grocery stores, pharmacies, hospitals
  - Public transportation: Bus routes and schedules
  - Parking regulations and permit requirements
  - Local emergency services contact information

**User Thinks**: _"Very comprehensive! Everything I need to know about living here."_

---

## Stage 6: Routine Portal Usage & Monitoring

### Step 6.1: Monthly Portal Check Routine

**Frequency**: Monthly around payment time **Screen**: Dashboard Quick Check **User Sees**:

- **Payment Status**: Current month paid ✅, next payment due in 28 days
- **Maintenance**: No active requests, 1 completed this month (rated ⭐⭐⭐⭐⭐)
- **Messages**: 1 new response from property management
- **Lease Status**: 9 months remaining, renewal notice due in 6 months

**Routine Actions**:

- Check payment due dates and outstanding balances
- Review any new property notifications or messages
- Verify maintenance request status if any active
- Update payment method or contact information if needed

### Step 6.2: Payment History Review

**Screen**: Payment History Dashboard **User Sees**:

- **Payment Summary** (6 months into lease):

  ```
  Month     | Due Date   | Paid Date  | Amount | Status | Method
  March 24  | Mar 31     | Mar 24     | 450 KWD | ✅ On time | KNET
  April 24  | Apr 30     | Apr 29     | 450 KWD | ✅ On time | KNET
  May 24    | May 31     | May 31     | 450 KWD | ✅ On time | KNET
  June 24   | Jun 30     | Jul 2      | 495 KWD | ⚠️ 2 days late | KNET
  July 24   | Jul 31     | Jul 28     | 450 KWD | ✅ On time | KNET
  August 24 | Aug 31     | Aug 30     | 450 KWD | ✅ On time | KNET
  ```

- **Payment Statistics**:
  - Total paid: 2,745 KWD (6 months)
  - On-time payments: 5/6 (83%)
  - Late fees: 45 KWD (1 occurrence)
  - Average payment time: 2 days before due date

**User Thinks**: _"Good payment history overall. I should set up auto-pay to avoid that late fee
situation."_ **User Action**: Navigates to payment preferences

### Step 6.3: Auto-Payment Setup

**Screen**: Payment Automation Configuration **User Sees**:

- **Auto-Pay Options**:
  - Enable automatic payments: [Toggle switch]
  - Payment timing: 3 days before due date (customizable)
  - Payment method: KNET ending in \*\*\*\*1234
  - Backup payment method: [Optional secondary method]

- **Safety Controls**:
  - Payment amount verification: Email notification 5 days before
  - Failed payment handling: Automatic retry + email alert
  - Cancellation: "Cancel auto-pay anytime before payment date"

- **Confirmation Requirements**:
  - Monthly email notifications: Payment processed successfully
  - Receipt delivery: Automatic email + portal storage
  - Annual summary: Tax-ready payment summary

**User Action**: Enables auto-pay with email notifications **System Response**: Confirms setup,
schedules next automatic payment

---

## Journey Success Metrics & Tenant Satisfaction

### Monthly Routine Established (After 3-6 months):

- ✅ **Automated payment processing** with reliable on-time payments
- ✅ **Streamlined maintenance requests** with clear tracking and satisfaction
- ✅ **Easy access to lease information** without property management calls
- ✅ **Effective communication channel** for questions and property updates

### Tenant Satisfaction Indicators:

- **Payment Convenience**: 95%+ on-time payment rates through automated processing
- **Maintenance Transparency**: Clear status tracking reducing follow-up calls by 80%
- **Information Accessibility**: 24/7 access to lease documents and property information
- **Communication Efficiency**: Faster response times and organized message history

### System Usage Patterns:

- **High engagement**: Monthly for payments and quarterly for maintenance
- **Mobile preference**: 80%+ of interactions via mobile device
- **Self-service success**: 90% of information needs met without property management contact
- **Feature adoption**: Auto-pay setup within first 3 months, maintenance request comfort by month 2

### Long-term Relationship Benefits:

- **Lease renewal likelihood**: Increased tenant satisfaction improves renewal rates
- **Reduced administrative overhead**: Self-service capabilities reduce property management workload
- **Improved maintenance outcomes**: Better documentation and tracking leads to higher quality
  repairs
- **Enhanced communication**: Organized digital communication improves tenant-landlord relationships

This tenant portal journey demonstrates how digital convenience transforms the rental experience
from traditional phone-call and check-based interactions to modern, efficient, self-service property
management that benefits both tenants and property management teams through improved efficiency,
transparency, and satisfaction.
