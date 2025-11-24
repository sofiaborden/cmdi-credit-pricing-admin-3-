# Credit Liability Tracking - Implementation Plan

## Overview
This document provides a detailed implementation plan for **Phase 3 (Reporting & Analysis)** and **Phase 4 (Advanced Features)** of the Credit Liability Tracking enhancement project.

**Status**: Phase 1 (Critical Fixes) and Phase 2 (Enhanced Visibility) are **COMPLETE** ✅

---

## ✅ COMPLETED PHASES

### Phase 1: Critical Fixes (COMPLETE)
- ✅ Fixed Dashboard "Credits Remaining" KPI calculation to include all credit types
- ✅ Fixed Clients table "Credits Remaining" column to show total available credits
- ✅ Added "Total Unused Credits (Liability)" KPI to Dashboard

### Phase 2: Enhanced Visibility (COMPLETE)
- ✅ Added "High Liability Clients" alert section to Dashboard
- ✅ Added color coding to Clients table for high-liability clients (red/orange/gray)
- ✅ Added "Credit Liability Breakdown" card to Dashboard

---

## 📋 PHASE 3: REPORTING & ANALYSIS

**Priority**: Medium  
**Estimated Effort**: 4-5 hours  
**Business Value**: Better financial analysis and reporting capabilities

### Task 3.1: Add "Export Liability Report" Functionality

**Location**: `components/views/Clients.tsx`

**Description**: Add a button to export comprehensive credit liability data to CSV format for analysis in Excel/Google Sheets.

**Implementation**:

```typescript
// Add to Clients.tsx - after the filter controls, before the table

const exportLiabilityReport = () => {
    const reportData = filteredAndSortedClients.map(client => {
        const plan = subscriptionPlans.find(p => p.name === client.subscriptionTier);
        const totalCredits = client.creditBalance.monthly + 
                            client.creditBalance.rollover + 
                            client.creditBalance.addOn;
        
        // Assuming credit purchase price is $0.01 per credit (adjust as needed)
        const estimatedValue = totalCredits * 0.01;
        
        return {
            'Client Name': client.clientName,
            'Database Name': client.dbName,
            'Status': client.status,
            'Client Type': client.clientType,
            'Subscription Plan': client.subscriptionTier,
            'Monthly Price': plan?.monthlyPrice || 0,
            'Monthly Credits (Unused)': client.creditBalance.monthly,
            'Rollover Credits': client.creditBalance.rollover,
            'Add-On Credits': client.creditBalance.addOn,
            'Total Unused Credits': totalCredits,
            'Estimated Liability Value ($)': estimatedValue.toFixed(2),
            'Credits Used (Current Month)': client.currentMonthUsage.totalCreditsUsed,
            'Current Month Bill': client.currentMonthUsage.totalBill,
            'Billing Period Start': client.billingPeriodStart,
            'Created Date': client.createdDate
        };
    });
    
    const timestamp = new Date().toISOString().slice(0, 10);
    exportToCsv(reportData, `credit-liability-report-${timestamp}.csv`);
};

// Add button to the header section (near the "Add Client" button)
<div className="flex items-center gap-3">
    <Button variant="secondary" onClick={exportLiabilityReport}>
        <ExportIcon className="mr-2" size="small" />
        Export Liability Report
    </Button>
    <Button variant="primary" onClick={() => setIsAddClientModalOpen(true)}>
        <PlusCircleIcon className="mr-2" size="small" />
        Add Client
    </Button>
</div>
```

**Benefits**:
- Export all client liability data with one click
- Includes financial value estimates
- Timestamped filenames for version control
- Can be analyzed in Excel/Google Sheets for deeper insights

---

### Task 3.2: Add Liability Summary Card to Dashboard

**Location**: `components/views/Dashboard.tsx`

**Description**: Add a comprehensive summary card showing total liability with financial context.

**Implementation**:

```typescript
// Add after the Credit Liability Breakdown card (around line 165)

<Card title="Liability Financial Summary" icon={<DollarIcon />} padding="p-5">
    <div className="space-y-3">
        <div className="flex justify-between items-baseline">
            <span className="text-sm text-gray-600">Total Unused Credits</span>
            <span className="text-xl font-bold text-gray-900">
                {formatNumber(kpiData.totalUnusedCredits)}
            </span>
        </div>
        <div className="flex justify-between items-baseline">
            <span className="text-sm text-gray-600">Estimated Value</span>
            <span className="text-xl font-bold text-red-600">
                {formatCurrency(kpiData.totalUnusedCredits * 0.01)}
            </span>
        </div>
        <div className="flex justify-between items-baseline pt-3 border-t border-gray-200">
            <span className="text-sm text-gray-600">Clients with Unused Credits</span>
            <span className="text-lg font-semibold text-gray-900">
                {clients.filter(c => (c.creditBalance.monthly + c.creditBalance.rollover + c.creditBalance.addOn) > 0).length}
            </span>
        </div>
        <div className="flex justify-between items-baseline">
            <span className="text-sm text-gray-600">Avg Credits per Client</span>
            <span className="text-lg font-semibold text-gray-900">
                {formatNumber(Math.round(kpiData.totalUnusedCredits / clients.length))}
            </span>
        </div>
        <div className="flex justify-between items-baseline pt-3 border-t border-gray-200">
            <span className="text-sm text-gray-600">High Liability Clients (100k+)</span>
            <span className="text-lg font-bold text-red-600">
                {kpiData.highLiabilityClients.length}
            </span>
        </div>
    </div>
</Card>
```

**Benefits**:
- Financial value prominently displayed
- Quick overview of liability distribution
- Easy to screenshot for presentations/reports

---

### Task 3.3: Add Historical Liability Tracking

**Location**: New file `data/liabilityHistory.ts` + `components/views/Dashboard.tsx`

**Description**: Track liability over time to identify trends (growing vs. shrinking).

**Implementation**:

**Step 1**: Create data structure for historical tracking

```typescript
// data/liabilityHistory.ts
export interface LiabilitySnapshot {
    date: string; // YYYY-MM-DD
    totalUnusedCredits: number;
    totalMonthlyCredits: number;
    totalRolloverCredits: number;
    totalAddOnCredits: number;
    highLiabilityClientCount: number;
}

// Mock historical data (last 6 months)
export const liabilityHistory: LiabilitySnapshot[] = [
    {
        date: '2024-06-01',
        totalUnusedCredits: 850000,
        totalMonthlyCredits: 120000,
        totalRolloverCredits: 180000,
        totalAddOnCredits: 550000,
        highLiabilityClientCount: 2
    },
    {
        date: '2024-07-01',
        totalUnusedCredits: 920000,
        totalMonthlyCredits: 125000,
        totalRolloverCredits: 195000,
        totalAddOnCredits: 600000,
        highLiabilityClientCount: 3
    },
    {
        date: '2024-08-01',
        totalUnusedCredits: 1050000,
        totalMonthlyCredits: 130000,
        totalRolloverCredits: 220000,
        totalAddOnCredits: 700000,
        highLiabilityClientCount: 3
    },
    {
        date: '2024-09-01',
        totalUnusedCredits: 1180000,
        totalMonthlyCredits: 135000,
        totalRolloverCredits: 245000,
        totalAddOnCredits: 800000,
        highLiabilityClientCount: 4
    },
    {
        date: '2024-10-01',
        totalUnusedCredits: 1250000,
        totalMonthlyCredits: 140000,
        totalRolloverCredits: 260000,
        totalAddOnCredits: 850000,
        highLiabilityClientCount: 4
    },
    {
        date: '2024-11-01',
        totalUnusedCredits: 1320000,
        totalMonthlyCredits: 145000,
        totalRolloverCredits: 275000,
        totalAddOnCredits: 900000,
        highLiabilityClientCount: 5
    }
];
```

**Step 2**: Add trend indicator to Dashboard

```typescript
// In Dashboard.tsx kpiData calculation
import { liabilityHistory } from '../../data/liabilityHistory';

// Calculate trend
const previousMonth = liabilityHistory[liabilityHistory.length - 1];
const liabilityTrend = totalUnusedCredits - previousMonth.totalUnusedCredits;
const liabilityTrendPercent = ((liabilityTrend / previousMonth.totalUnusedCredits) * 100).toFixed(1);

// Update "Total Unused Credits" KPI card to show trend
<KpiCard
    title="Total Unused Credits"
    value={formatNumber(kpiData.totalUnusedCredits)}
    icon={<AlertTriangleIcon className="text-white" size="small" />}
    subtext={`${liabilityTrend > 0 ? '↑' : '↓'} ${Math.abs(liabilityTrendPercent)}% vs last month`}
    variant="warning"
/>
```

**Benefits**:
- See if liability is growing or shrinking month-over-month
- Identify concerning trends early
- Data-driven decision making

---

## 📊 PHASE 4: ADVANCED FEATURES

**Priority**: Nice to Have
**Estimated Effort**: 8-10 hours
**Business Value**: Advanced analytics and proactive management

### Task 4.1: Add Liability Trend Chart

**Location**: `components/views/Dashboard.tsx`

**Description**: Visual line chart showing liability trends over the last 6 months.

**Dependencies**: Install charting library (e.g., Recharts)

```bash
npm install recharts
```

**Implementation**:

```typescript
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { liabilityHistory } from '../../data/liabilityHistory';

// Add to Dashboard after the KPI cards
<Card title="Liability Trend (Last 6 Months)" icon={<ChartLineIcon />} padding="p-5">
    <ResponsiveContainer width="100%" height={300}>
        <LineChart data={liabilityHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
                dataKey="date"
                tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short' })}
                stroke="#6b7280"
            />
            <YAxis
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                stroke="#6b7280"
            />
            <Tooltip
                formatter={(value: number) => formatNumber(value)}
                labelFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            />
            <Legend />
            <Line
                type="monotone"
                dataKey="totalUnusedCredits"
                stroke="#dc2626"
                strokeWidth={2}
                name="Total Unused Credits"
                dot={{ fill: '#dc2626', r: 4 }}
            />
            <Line
                type="monotone"
                dataKey="totalAddOnCredits"
                stroke="#f59e0b"
                strokeWidth={2}
                name="Add-On Credits"
                dot={{ fill: '#f59e0b', r: 4 }}
            />
        </LineChart>
    </ResponsiveContainer>
</Card>
```

**Benefits**:
- Visual representation of liability trends
- Easy to spot concerning patterns
- Can identify seasonal variations

---

### Task 4.2: Add Credit Type Distribution Pie Chart

**Location**: `components/views/Dashboard.tsx`

**Description**: Pie chart showing breakdown of liability by credit type (Monthly, Rollover, Add-On).

**Implementation**:

```typescript
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

// Prepare data
const creditTypeData = [
    { name: 'Monthly Credits', value: kpiData.totalMonthlyCredits, color: '#3b82f6' },
    { name: 'Rollover Credits', value: kpiData.totalRolloverCredits, color: '#f59e0b' },
    { name: 'Add-On Credits', value: kpiData.totalAddOnCredits, color: '#dc2626' }
];

// Add to Dashboard
<Card title="Credit Type Distribution" icon={<GridIcon />} padding="p-5">
    <ResponsiveContainer width="100%" height={300}>
        <PieChart>
            <Pie
                data={creditTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
            >
                {creditTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
            </Pie>
            <Tooltip formatter={(value: number) => formatNumber(value)} />
            <Legend />
        </PieChart>
    </ResponsiveContainer>
</Card>
```

**Benefits**:
- Visual breakdown of liability composition
- Highlights if add-on credits (purchased) are underutilized
- Easy to communicate to stakeholders

---

### Task 4.3: Add Automated Liability Threshold Alerts

**Location**: New file `utils/liabilityAlerts.ts` + Backend integration

**Description**: Automated email/notification system when liability exceeds thresholds.

**Implementation**:

**Step 1**: Define alert thresholds

```typescript
// utils/liabilityAlerts.ts
export interface LiabilityThreshold {
    id: string;
    name: string;
    threshold: number;
    severity: 'info' | 'warning' | 'critical';
    enabled: boolean;
    recipients: string[]; // Email addresses
}

export const defaultThresholds: LiabilityThreshold[] = [
    {
        id: 'threshold-1',
        name: 'Total Liability Warning',
        threshold: 1000000, // 1M credits
        severity: 'warning',
        enabled: true,
        recipients: ['finance@company.com', 'admin@company.com']
    },
    {
        id: 'threshold-2',
        name: 'Total Liability Critical',
        threshold: 2000000, // 2M credits
        severity: 'critical',
        enabled: true,
        recipients: ['finance@company.com', 'admin@company.com', 'ceo@company.com']
    },
    {
        id: 'threshold-3',
        name: 'Single Client High Liability',
        threshold: 100000, // 100k credits per client
        severity: 'warning',
        enabled: true,
        recipients: ['account-managers@company.com']
    }
];

export const checkLiabilityThresholds = (
    totalUnusedCredits: number,
    highLiabilityClients: any[]
): { triggered: boolean; alerts: any[] } => {
    const alerts = [];

    // Check total liability thresholds
    const totalThresholds = defaultThresholds.filter(t =>
        t.name.includes('Total Liability') && t.enabled
    );

    for (const threshold of totalThresholds) {
        if (totalUnusedCredits >= threshold.threshold) {
            alerts.push({
                thresholdId: threshold.id,
                thresholdName: threshold.name,
                severity: threshold.severity,
                message: `Total unused credits (${totalUnusedCredits.toLocaleString()}) has exceeded the ${threshold.name} threshold of ${threshold.threshold.toLocaleString()} credits.`,
                recipients: threshold.recipients,
                timestamp: new Date().toISOString()
            });
        }
    }

    // Check per-client thresholds
    const clientThreshold = defaultThresholds.find(t =>
        t.name.includes('Single Client') && t.enabled
    );

    if (clientThreshold && highLiabilityClients.length > 0) {
        alerts.push({
            thresholdId: clientThreshold.id,
            thresholdName: clientThreshold.name,
            severity: clientThreshold.severity,
            message: `${highLiabilityClients.length} client(s) have unused credits exceeding ${clientThreshold.threshold.toLocaleString()}.`,
            recipients: clientThreshold.recipients,
            timestamp: new Date().toISOString(),
            affectedClients: highLiabilityClients.map(c => c.clientName)
        });
    }

    return {
        triggered: alerts.length > 0,
        alerts
    };
};
```

**Step 2**: Add alert indicator to Dashboard

```typescript
// In Dashboard.tsx
import { checkLiabilityThresholds } from '../../utils/liabilityAlerts';

const liabilityAlerts = useMemo(() => {
    return checkLiabilityThresholds(
        kpiData.totalUnusedCredits,
        kpiData.highLiabilityClients
    );
}, [kpiData.totalUnusedCredits, kpiData.highLiabilityClients]);

// Add alert banner at top of Dashboard if alerts are triggered
{liabilityAlerts.triggered && (
    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
        <div className="flex items-start">
            <AlertTriangleIcon className="text-red-500 mr-3 flex-shrink-0" />
            <div className="flex-1">
                <h3 className="text-sm font-semibold text-red-800 mb-2">
                    Liability Threshold Alerts ({liabilityAlerts.alerts.length})
                </h3>
                <ul className="space-y-1">
                    {liabilityAlerts.alerts.map((alert, idx) => (
                        <li key={idx} className="text-sm text-red-700">
                            • {alert.message}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
)}
```

**Step 3**: Backend integration (requires .NET 8.0 API)

```csharp
// .NET 8.0 API endpoint example
// Controllers/LiabilityAlertsController.cs

[ApiController]
[Route("api/[controller]")]
public class LiabilityAlertsController : ControllerBase
{
    private readonly IEmailService _emailService;
    private readonly ILiabilityService _liabilityService;

    [HttpPost("check-and-notify")]
    public async Task<IActionResult> CheckAndNotify()
    {
        var liabilityData = await _liabilityService.GetCurrentLiability();
        var alerts = CheckThresholds(liabilityData);

        if (alerts.Any())
        {
            foreach (var alert in alerts)
            {
                await _emailService.SendAlertEmail(
                    recipients: alert.Recipients,
                    subject: $"[{alert.Severity.ToUpper()}] {alert.ThresholdName}",
                    body: GenerateAlertEmailBody(alert)
                );
            }
        }

        return Ok(new { alertsTriggered = alerts.Count, alerts });
    }
}
```

**Benefits**:
- Proactive notification when liability exceeds thresholds
- Configurable alert levels (warning, critical)
- Automated email notifications to stakeholders
- Early warning system for financial risk

---

### Task 4.4: Add Client Detail Liability Insights

**Location**: `components/views/ClientDetail.tsx`

**Description**: Enhanced liability insights on individual client detail pages.

**Implementation**:

```typescript
// Add to ClientDetail.tsx after the "Available Credits" card

<Card title="Credit Liability Insights" icon={<ChartLineIcon />} padding="p-5">
    <div className="space-y-4">
        {/* Liability Risk Level */}
        <div>
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Liability Risk Level</span>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    billingData.totalBalance > 100000 ? 'bg-red-100 text-red-800' :
                    billingData.totalBalance > 50000 ? 'bg-orange-100 text-orange-800' :
                    'bg-green-100 text-green-800'
                }`}>
                    {billingData.totalBalance > 100000 ? 'HIGH' :
                     billingData.totalBalance > 50000 ? 'MEDIUM' : 'LOW'}
                </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className={`h-2 rounded-full ${
                        billingData.totalBalance > 100000 ? 'bg-red-500' :
                        billingData.totalBalance > 50000 ? 'bg-orange-500' :
                        'bg-green-500'
                    }`}
                    style={{ width: `${Math.min((billingData.totalBalance / 150000) * 100, 100)}%` }}
                />
            </div>
        </div>

        {/* Credit Utilization Rate */}
        <div>
            <div className="flex justify-between items-baseline mb-1">
                <span className="text-sm text-gray-600">Credit Utilization (Current Month)</span>
                <span className="text-sm font-bold text-gray-900">
                    {plan ? ((clientData.currentMonthUsage.totalCreditsUsed / plan.baselineCredits) * 100).toFixed(1) : 0}%
                </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className="h-2 rounded-full bg-blue-500"
                    style={{
                        width: `${plan ? Math.min((clientData.currentMonthUsage.totalCreditsUsed / plan.baselineCredits) * 100, 100) : 0}%`
                    }}
                />
            </div>
        </div>

        {/* Recommendations */}
        <div className="pt-3 border-t border-gray-200">
            <h5 className="text-xs font-semibold text-gray-700 mb-2">Recommendations</h5>
            <ul className="space-y-1 text-xs text-gray-600">
                {billingData.totalBalance > 100000 && (
                    <li className="flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        <span>High unused credit balance. Consider engagement campaign to increase usage.</span>
                    </li>
                )}
                {clientData.creditBalance.addOn > 50000 && (
                    <li className="flex items-start">
                        <span className="text-orange-500 mr-2">•</span>
                        <span>Large add-on credit balance. Client may have over-purchased.</span>
                    </li>
                )}
                {plan && clientData.currentMonthUsage.totalCreditsUsed < plan.baselineCredits * 0.2 && (
                    <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Low utilization. Consider downgrade or usage training.</span>
                    </li>
                )}
            </ul>
        </div>
    </div>
</Card>
```

**Benefits**:
- Per-client liability risk assessment
- Visual indicators for quick assessment
- Actionable recommendations for account managers
- Better client engagement strategies

---

## 📊 IMPLEMENTATION TIMELINE

### Immediate (Phase 1 & 2) - ✅ COMPLETE
- **Week 1**: Critical fixes and enhanced visibility
- **Status**: All tasks complete

### Short-term (Phase 3) - 1-2 Weeks
- **Week 2**: Export functionality and liability summary
- **Week 3**: Historical tracking implementation

### Medium-term (Phase 4) - 3-4 Weeks
- **Week 4-5**: Chart implementations (Recharts integration)
- **Week 6**: Automated alerts system
- **Week 7**: Client detail enhancements

---

## 🎯 SUCCESS METRICS

### Phase 1 & 2 (Achieved)
- ✅ Accurate liability calculations across all views
- ✅ Visual indicators for high-liability clients
- ✅ Comprehensive breakdown of credit types
- ✅ Proactive alerts for high-liability situations

### Phase 3 (Target)
- 📊 Export reports generated weekly for financial review
- 📈 Historical data tracked for trend analysis
- 💰 Financial value of liability clearly communicated

### Phase 4 (Target)
- 📉 Visual charts for executive presentations
- 🔔 Automated alerts reduce manual monitoring by 80%
- 🎯 Client-specific insights improve engagement by 30%

---

## 💡 ADDITIONAL RECOMMENDATIONS

### Data Model Enhancements
Consider adding these fields to the `Client` type for better tracking:

```typescript
export interface Client {
    // ... existing fields

    // New fields for enhanced liability tracking
    creditPurchaseHistory: {
        date: string;
        packId: string;
        creditsAdded: number;
        amountPaid: number;
    }[];

    creditExpirationDates: {
        creditType: 'rollover' | 'addOn';
        amount: number;
        expirationDate: string;
    }[];

    liabilityNotes: string; // Admin notes about liability management
}
```

### Backend API Endpoints Needed (.NET 8.0)
```
GET  /api/liability/summary - Get current liability summary
GET  /api/liability/history - Get historical liability data
GET  /api/liability/client/{id} - Get client-specific liability
POST /api/liability/alerts/check - Check and trigger alerts
GET  /api/liability/export - Export liability report
```

---

## 📝 NOTES

- All monetary calculations assume $0.01 per credit (adjust as needed)
- Email notification system requires SMTP configuration
- Charts require `recharts` npm package installation
- Historical data currently uses mock data - replace with real API calls
- Consider adding role-based access control for sensitive liability data

---

## ✅ COMPLETION CHECKLIST

### Phase 1: Critical Fixes
- [x] Dashboard KPI calculation fixed
- [x] Clients table calculation fixed
- [x] Total Unused Credits KPI added

### Phase 2: Enhanced Visibility
- [x] High Liability Clients alert added
- [x] Color coding in Clients table
- [x] Credit Liability Breakdown card

### Phase 3: Reporting & Analysis
- [ ] Export Liability Report functionality
- [ ] Liability Summary Card
- [ ] Historical liability tracking

### Phase 4: Advanced Features
- [ ] Liability trend chart
- [ ] Credit type distribution chart
- [ ] Automated threshold alerts
- [ ] Client detail liability insights

---

**Document Version**: 1.0
**Last Updated**: 2024-11-24
**Author**: CMDI Credit Pricing Admin Development Team

