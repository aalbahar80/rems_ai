What This Migration Delivers: ✅ Smart Approval Routing (Owner Portal Requirement): Intelligent
Decision Logic: sql-- Expense routing logic: -- IF property has owner → Route to owner -- IF
property is firm-owned → Route to admin  
-- IF amount > threshold → Require approval -- IF amount < threshold → Auto-approve 72-Hour
Escalation System:

Automatic deadlines set on expense creation Auto-escalation to admin after 72 hours Priority
adjustment based on overdue time Hourly cron job for automated processing

✅ Approval Delegation (Owner Portal Feature): Temporary Authority Transfer: sql-- Owner can
delegate approval to business partner INSERT INTO approval_delegations ( delegator_user_id,
delegate_user_id, firm_id, delegation_scope, max_amount_limit, end_date ); Smart Delegation Logic:

Amount limits (delegate can approve up to X KWD) Time limits (delegation expires after date) Scope
limits (maintenance only, all expenses, emergency only) Audit trail (tracks who delegated to whom)

✅ Priority-Based Workflow: Automatic Priority Assignment: sql-- Priority rules: -- Amount > 3x
threshold = HIGH priority -- Emergency expense types = URGENT priority  
-- Standard expenses = NORMAL priority -- Auto-approved = LOW priority ✅ Enhanced Approval
Dashboard (Frontend Ready): Real-time Status Tracking: sqlSELECT \* FROM pending_approvals_dashboard
WHERE firm_id = current_firm_id ORDER BY urgency_status, approval_deadline;

-- Returns: OVERDUE, DUE_SOON, UPCOMING, NORMAL -- Perfect for owner portal dashboard alerts Key
Functions for Portal Integration: For Owner Portal: sql-- Process approval with delegation support
SELECT approve_expense_with_delegation(expense_id, owner_user_id, 'Approved for urgent repair');

-- Check delegation status  
SELECT \* FROM get_effective_approver(owner_id, firm_id, expense_amount); For Admin Portal: sql--
Run escalation process (hourly cron job) SELECT process_approval_escalations();

-- Get approval performance stats SELECT _ FROM approval_performance_stats WHERE firm_id =
admin_firm_id; For Accountant Portal: sql-- View pending approvals by priority SELECT _ FROM
pending_approvals_dashboard WHERE firm_id = accountant_firm_id ORDER BY approval_priority,
hours_remaining; Business Logic Examples: Scenario 1: Owner Approval Required sql-- Property has
owner, expense = 1,500 KWD (> 1,000 threshold) -- Result: approval_required_by = 'owner', deadline =
NOW() + 72 hours Scenario 2: Admin Approval (Firm-Owned Property) sql-- Property is firm-owned,
expense = 800 KWD -- Result: approval_required_by = 'admin', deadline = NOW() + 72 hours Scenario 3:
Auto-Approval sql-- Any property, expense = 150 KWD (< 1,000 threshold)  
-- Result: approval_required_by = 'auto', payment_status = 'approved' Scenario 4: Escalation After
72 Hours sql-- Overdue approval automatically escalates to admin -- Gets additional 24 hours,
priority increased Advanced Features: ✅ Delegation System:

Owner traveling? → Delegate to business partner temporarily Amount limits → Partner can approve up
to 5,000 KWD only Scope limits → Only maintenance expenses, not capital expenditure Automatic expiry
→ Delegation ends on specified date

✅ Performance Analytics:

Approval rates by firm (% approved vs rejected) Average approval time (hours from submission to
approval) Escalation rates (% that required admin escalation) Delegation usage (how often owners
delegate authority)

✅ Automated Monitoring: sql-- Cron job setup (runs every hour): SELECT cron.schedule(
'approval-escalations', '0 \* \* \* _', 'SELECT process_approval_escalations();' ); Frontend
Integration Ready: Owner Portal Dashboard Widgets: sql-- Pending approvals widget SELECT COUNT(_)
FROM pending_approvals_dashboard WHERE approval_required_by = 'owner' AND
owner_matches_current_user;

-- Urgency indicators  
SELECT urgency_status, COUNT(_) FROM pending_approvals_dashboard GROUP BY urgency_status; Mobile
Notifications Support: sql-- Find urgent/overdue approvals for push notifications SELECT _ FROM
pending_approvals_dashboard WHERE urgency_status IN ('OVERDUE', 'DUE_SOON') AND approval_priority IN
('urgent', 'high');
