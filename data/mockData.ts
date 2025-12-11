import { SubscriptionPlan, AddOn, Integration, Feature, Client, SystemPricing, CreditPack } from '../types';

export const systemPricing: SystemPricing = {
    creditPurchasePrice: 0.02, // Lowered for more realistic overage calculations
    minPurchase: 100
};

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    monthlyPrice: 0, // Base subscription (no base fee for Starter)
    pricePerRecordPerMonth: 0.00, // Free tier - no per-record charge
    description: 'Perfect for small organizations getting started with calling and basic features.',
    monthlyCreditsIncluded: 5000,
    maxUsers: 5,
    overageCreditRate: 0.020,
    status: 'active',
    tierLevel: 1,
    isMostPopular: false,
    clientsUsing: 245,
    lastUpdated: '2025-12-03T10:00:00Z',
    highlights: [
      '5,000 credits per month',
      'Up to 5 users',
      'Basic calling features',
      'Email support',
      'Credits refresh monthly'
    ],
    assignedClientTypes: [],
    assignedClientIds: [],
  },
  {
    id: 'professional',
    name: 'Professional',
    monthlyPrice: 0, // Base subscription (pricing is per-record based)
    pricePerRecordPerMonth: 0.005, // $0.005 per record per month
    description: 'Ideal for growing organizations that need more credits and advanced features.',
    monthlyCreditsIncluded: 15000,
    maxUsers: 20,
    overageCreditRate: 0.020,
    status: 'active',
    tierLevel: 2,
    isMostPopular: true,
    clientsUsing: 612,
    lastUpdated: '2025-12-03T14:30:00Z',
    highlights: [
      '15,000 credits per month',
      'Up to 20 users',
      'Advanced calling features',
      'Priority email support',
      'Credits refresh monthly',
      'Custom integrations'
    ],
    assignedClientTypes: ['Fed Congressional', 'Fed PAC'],
    assignedClientIds: [],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    monthlyPrice: 0, // Base subscription (pricing is per-record based)
    pricePerRecordPerMonth: 0.0075, // $0.0075 per record per month
    description: 'For large organizations requiring unlimited access and premium support.',
    monthlyCreditsIncluded: 50000,
    maxUsers: 'Unlimited',
    overageCreditRate: 0.020,
    status: 'active',
    tierLevel: 3,
    isMostPopular: false,
    clientsUsing: 85,
    lastUpdated: '2025-12-03T09:15:00Z',
    highlights: [
      '50,000 credits per month',
      'Unlimited users',
      'All advanced features',
      '24/7 priority support',
      'Credits refresh monthly',
      'Dedicated account manager',
      'Custom SLA agreements'
    ],
    assignedClientTypes: ['Fed Senate', 'Statewide'],
    assignedClientIds: [],
  },
  {
    id: 'legacy-standard',
    name: 'Legacy Standard',
    monthlyPrice: 79,
    pricePerRecordPerMonth: 0,
    description: 'Legacy plan for existing customers.',
    monthlyCreditsIncluded: 7500,
    maxUsers: 10,
    overageCreditRate: 0.020,
    status: 'archived',
    tierLevel: 1,
    isMostPopular: false,
    clientsUsing: 12,
    lastUpdated: '2024-06-10T08:00:00Z',
    assignedClientTypes: [],
    assignedClientIds: [],
  },
  {
    id: 'internal-test',
    name: 'Internal Test',
    monthlyPrice: 0,
    pricePerRecordPerMonth: 0,
    description: 'Internal testing plan for CMDI staff.',
    monthlyCreditsIncluded: 999999,
    maxUsers: 'Unlimited',
    overageCreditRate: 0,
    status: 'internal',
    tierLevel: 99,
    isMostPopular: false,
    clientsUsing: 5,
    lastUpdated: '2025-11-01T12:00:00Z',
    assignedClientTypes: [],
    assignedClientIds: [],
  },
  {
    id: 'beta-growth',
    name: 'Beta Growth',
    monthlyPrice: 99,
    pricePerRecordPerMonth: 0,
    description: 'Beta plan for testing new features with select customers.',
    monthlyCreditsIncluded: 15000,
    maxUsers: 10,
    overageCreditRate: 0.018,
    status: 'beta',
    tierLevel: 2,
    isMostPopular: false,
    clientsUsing: 38,
    lastUpdated: '2025-11-22T16:45:00Z',
    assignedClientTypes: [],
    assignedClientIds: [],
  },
];

export const addOns: AddOn[] = [
    { id: 'dmc', name: 'Direct Mail Caging', description: 'Process and manage direct mail responses.', status: 'Active', pricing: 'Usage-based' },
    { id: 'dialr', name: 'DialR License', description: 'License for using the DialR calling platform.', status: 'Active', pricing: 'Per seat' },
    { id: 'scc', name: 'Supplemental Crimson Credits', description: 'Purchase additional credits in bulk.', status: 'Active', pricing: '$0.001-$0.002/Credit' },
    { id: 'pmr', name: 'Prospect Model Runs', description: 'Run advanced donor prospecting models.', status: 'Under Consideration', pricing: 'TBD' }
];

export const creditPacks: CreditPack[] = [
    {
        id: 'pack1',
        name: 'Small Boost',
        credits: 2500,
        price: 25,
        description: 'Perfect for occasional extra usage.',
        status: 'active',
        purchasedCount: 312,
        isMostPopular: false,
        lastUpdated: '2025-11-10T10:00:00Z',
        highlights: [
            '2,500 credits',
            'Never expires',
            'Instant activation',
            'Great for campaigns'
        ],
    },
    {
        id: 'pack2',
        name: 'Medium Boost',
        credits: 6000,
        price: 50,
        description: 'Most popular add-on for growing teams.',
        status: 'active',
        purchasedCount: 589,
        isMostPopular: true,
        lastUpdated: '2025-11-15T14:30:00Z',
        highlights: [
            '6,000 credits',
            'Never expires',
            'Instant activation',
            'Best value per credit',
            'Most popular choice'
        ],
    },
    {
        id: 'pack3',
        name: 'Large Boost',
        credits: 13000,
        price: 100,
        description: 'Best value for high-volume campaigns.',
        status: 'active',
        purchasedCount: 214,
        isMostPopular: false,
        lastUpdated: '2025-11-12T09:00:00Z',
        highlights: [
            '13,000 credits',
            'Never expires',
            'Instant activation',
            'Maximum savings',
            'Perfect for large campaigns'
        ],
    },
    {
        id: 'pack4',
        name: 'Legacy Boost',
        credits: 1000,
        price: 15,
        description: 'Archived legacy pack.',
        status: 'archived',
        purchasedCount: 45,
        isMostPopular: false,
        lastUpdated: '2024-08-20T12:00:00Z',
    },
];

export const integrations: Integration[] = [
    { id: 'cc', name: 'Constant Contact' },
    { id: 'mc', name: 'MailChimp' },
    { id: 'it', name: 'Iterable' }
];

export const features: Feature[] = [
  { 
    id: 'de', 
    name: 'Data Enhancement', 
    description: 'Enrich records with additional data points.', 
    creditCost: 10, 
    costPerUnit: 0.05,
    enabled: true,
    category: 'Data Services',
    usage: {
      currentMonthCredits: 150000,
      clientsUsing: 25,
    } 
  },
  { 
    id: 'ev', 
    name: 'Email Verification', 
    description: 'Verify the deliverability of an email address.', 
    creditCost: 1, 
    costPerUnit: 0.002,
    enabled: true,
    category: 'Data Services',
    usage: {
      currentMonthCredits: 95000,
      clientsUsing: 32,
    } 
  },
  { 
    id: 'appends', 
    name: 'Appends', 
    description: 'Append missing contact information to records.', 
    creditCost: 10,
    costPerUnit: 0.08,
    enabled: true,
    category: 'Data Services',
    usage: {
      currentMonthCredits: 3000,
      clientsUsing: 5,
    } 
  },
  { 
    id: 'eappend', 
    name: 'Email Append', 
    description: 'Find and append email addresses to records.', 
    creditCost: 2, 
    costPerUnit: 0.01,
    enabled: true,
    category: 'Data Services',
    usage: {
      currentMonthCredits: 12000,
      clientsUsing: 8,
    } 
  },
  { 
    id: 'gaif', 
    name: 'General AI Features', 
    description: 'Utilize AI for summaries and suggestions.', 
    creditCost: 1, 
    costPerUnit: 0.005,
    enabled: true,
    category: 'AI & Modeling',
    usage: {
      currentMonthCredits: 25000,
      clientsUsing: 15,
    } 
  },
  { 
    id: 'ahm', 
    name: 'Ad Hoc Model Run', 
    description: 'On-demand execution of predictive models.', 
    creditCost: 30, 
    costPerUnit: 0.15,
    enabled: true,
    category: 'AI & Modeling',
    usage: {
      currentMonthCredits: 45000,
      clientsUsing: 3,
    } 
  },
  { 
    id: 'dmp', 
    name: 'Donor Marketplace (Future)', 
    description: 'Access a marketplace of potential donors.', 
    creditCost: 75, 
    costPerUnit: 0,
    enabled: false,
    category: 'AI & Modeling',
    usage: {
      currentMonthCredits: 0,
      clientsUsing: 0,
    } 
  },
  { 
    id: 'dtpc', 
    name: 'DialR - Twilio Phone Call', 
    description: 'Make outbound calls via DialR.', 
    creditCost: 5,
    costPerUnit: 0.04,
    enabled: true,
    category: 'DialR Communications',
    usage: {
      currentMonthCredits: 100500,
      clientsUsing: 7,
    } 
  },
  { 
    id: 'dtsms', 
    name: 'DialR - Twilio SMS', 
    description: 'Send SMS messages via DialR.', 
    creditCost: 10, 
    costPerUnit: 0.07,
    enabled: true,
    category: 'DialR Communications',
    usage: {
      currentMonthCredits: 8500,
      clientsUsing: 4,
    } 
  },
];

export const clients: Client[] = [
  {
    id: 'cli1',
    clientName: 'Washington for Congress',
    dbName: 'dxWashington',
    clientType: 'Fed Senate',
    subscriptionTier: 'Enterprise',
    status: 'Active',
    createdDate: '2022-01-15',
    billingPeriodStart: '2024-07-15',
    creditBalance: {
        monthly: 0, // Used all 50k
        rollover: 12000,
        addOn: 250000,
    },
    currentCreditCount: 125500, // Current usage from Crimson API
    creditCountLastUpdated: '2025-12-03T08:30:00Z',
    recordCount: 45000, // Number of records in Crimson People database
    recordCountLastUpdated: '2025-12-03T08:30:00Z',
    currentMonthUsage: {
      totalCreditsUsed: 125500,
      totalBill: 12749.00,
      featureUsage: [
        { featureId: 'de', units: 1000 },
        { featureId: 'ev', units: 15000 },
        { featureId: 'dtpc', units: 20100 },
      ],
      addOns: ['dmc', 'dialr', 'scc'],
      discounts: []
    },
    lastMonthUsage: {
      totalCreditsUsed: 114300,
      totalBill: 1885.00,
      featureUsage: [
        { featureId: 'ev', units: 10000 },
        { featureId: 'de', units: 300 },
        { featureId: 'dtpc', units: 20000 },
      ],
      addOns: ['dialr'],
      discounts: []
    },
    transactions: [
        { id: 't1', date: '2024-07-15', type: 'Feature Usage', description: 'Email Verification (15,000 units)', amount: -15000, balance: 3000 },
        { id: 't2', date: '2024-07-10', type: 'Feature Usage', description: 'Data Enhancement (1,000 units)', amount: -10000, balance: 18000 },
        { id: 't3', date: '2024-07-05', type: 'Feature Usage', description: 'DialR - Twilio Phone Call (20,100 units)', amount: -100500, balance: 28000 },
        { id: 't4', date: '2024-07-01', type: 'Monthly Allotment', description: 'Enterprise Plan', amount: 50000, balance: 128500 },
    ]
  },
  {
    id: 'cli2',
    clientName: 'Joe for Senate',
    dbName: 'dxJoeSenate',
    clientType: 'Fed Senate',
    subscriptionTier: 'Enterprise',
    status: 'Active',
    createdDate: '2021-11-20',
    billingPeriodStart: '2024-07-20',
    creditBalance: {
        monthly: 5000,
        rollover: 0,
        addOn: 0,
    },
    currentCreditCount: 45000,
    creditCountLastUpdated: '2025-12-03T08:30:00Z',
    recordCount: 32000,
    recordCountLastUpdated: '2025-12-03T08:30:00Z',
    currentMonthUsage: {
      totalCreditsUsed: 45000,
      totalBill: 599,
      featureUsage: [
        { featureId: 'ev', units: 25000 },
        { featureId: 'de', units: 1000 },
        { featureId: 'gaif', units: 10000 },
      ],
      addOns: ['dialr', 'scc'],
      discounts: []
    },
    lastMonthUsage: {
      totalCreditsUsed: 52000,
      totalBill: 639,
      featureUsage: [
        { featureId: 'ev', units: 30000 },
        { featureId: 'de', units: 1200 },
        { featureId: 'gaif', units: 10000 },
      ],
      addOns: ['dialr', 'scc'],
      discounts: []
    },
    transactions: [
        { id: 't5', date: '2024-07-20', type: 'Feature Usage', description: 'Email Verification (25,000 units)', amount: -25000, balance: 25000 },
        { id: 't6', date: '2024-07-18', type: 'Feature Usage', description: 'Data Enhancement (1,000 units)', amount: -10000, balance: 50000 },
        { id: 't7', date: '2024-07-01', type: 'Monthly Allotment', description: 'Enterprise Plan', amount: 50000, balance: 60000 },
    ]
  },
  {
    id: 'cli3',
    clientName: 'GREAT PAC',
    dbName: 'dxGreatPAC',
    clientType: 'Political Action Committee',
    subscriptionTier: 'Starter',
    status: 'Trial',
    createdDate: '2024-06-01',
    billingPeriodStart: '2024-07-01',
    creditBalance: {
        monthly: 3800,
        rollover: 500,
        addOn: 0,
    },
    currentMonthUsage: {
      totalCreditsUsed: 1200, // low usage
      totalBill: 99,
      featureUsage: [
        { featureId: 'ev', units: 400 },
        { featureId: 'gaif', units: 800 },
      ],
      addOns: [],
      discounts: []
    },
    lastMonthUsage: {
      totalCreditsUsed: 5100,
      totalBill: 102, // 99 + (100 * 0.03)
      featureUsage: [
        { featureId: 'ev', units: 4500 },
        { featureId: 'gaif', units: 600 },
      ],
      addOns: [],
      discounts: []
    },
     transactions: [
        { id: 't8', date: '2024-07-12', type: 'Feature Usage', description: 'General AI Features (800 units)', amount: -800, balance: 4200 },
        { id: 't9', date: '2024-07-01', type: 'Monthly Allotment', description: 'Starter Plan', amount: 5000, balance: 5000 },
    ]
  },
  {
    id: 'cli4',
    clientName: 'State Victory Fund',
    dbName: 'dxStateVictory',
    clientType: 'State Party',
    subscriptionTier: 'Professional',
    status: 'Past Due',
    createdDate: '2023-02-10',
    billingPeriodStart: '2024-07-10',
    creditBalance: {
        monthly: 0,
        rollover: 0,
        addOn: 10000, // They bought a starter pack
    },
    currentMonthUsage: {
      totalCreditsUsed: 22000, // overage
      totalBill: 424, // 249 + (7000 * 0.025)
      featureUsage: [
        { featureId: 'ev', units: 19000 },
        { featureId: 'appends', units: 300 },
      ],
      addOns: ['dmc'],
      discounts: []
    },
    lastMonthUsage: {
      totalCreditsUsed: 11500,
      totalBill: 249,
      featureUsage: [
        { featureId: 'ev', units: 8000 },
        { featureId: 'appends', units: 350 },
      ],
      addOns: ['dmc'],
      discounts: []
    },
    transactions: [
        { id: 't10', date: '2024-07-25', type: 'Feature Usage', description: 'Email Verification (19,000 units)', amount: -19000, balance: -4000 },
        { id: 't11', date: '2024-07-15', type: 'Feature Usage', description: 'Appends (300 units)', amount: -3000, balance: 15000 },
        { id: 't12', date: '2024-07-01', type: 'Monthly Allotment', description: 'Professional Plan', amount: 15000, balance: 18000 },
    ]
  },
  {
    id: 'cli5',
    clientName: 'Smith Consulting',
    dbName: 'dxSmith',
    clientType: 'Consultant',
    subscriptionTier: 'Starter',
    status: 'Canceled',
    createdDate: '2023-05-01',
    billingPeriodStart: '2024-06-01',
    creditBalance: {
        monthly: 0,
        rollover: 0,
        addOn: 0,
    },
    currentMonthUsage: {
      totalCreditsUsed: 0,
      totalBill: 0,
      featureUsage: [],
      addOns: [],
      discounts: []
    },
    lastMonthUsage: {
      totalCreditsUsed: 4800,
      totalBill: 99,
      featureUsage: [
        { featureId: 'ev', units: 4800 },
      ],
      addOns: [],
      discounts: []
    },
    transactions: [
        { id: 't13', date: '2024-06-15', type: 'Feature Usage', description: 'Email Verification (4,800 units)', amount: -4800, balance: 200 },
        { id: 't14', date: '2024-06-01', type: 'Monthly Allotment', description: 'Starter Plan', amount: 5000, balance: 5000 },
    ]
  },
];

// Client Types for assignment dropdowns
export const clientTypes = [
  'Fed Senate',
  'Fed Congressional',
  'Fed PAC',
  'Statewide',
  'State Legislative',
  'Local',
  'Non-Profit',
  'Other'
];

// Terms and Conditions
import { TermsAndConditions } from '../types';

export const termsAndConditions: TermsAndConditions = {
  id: 'tc-1',
  content: `# CMDI Credit Pricing - Terms and Conditions

## 1. Service Agreement
By using CMDI Credit Pricing services, you agree to these terms and conditions. These terms govern your use of our credit-based calling and data services.

## 2. Pricing and Billing
- Subscription pricing is based on the number of records in your Crimson People database
- Monthly credits are included with your subscription tier
- Credits refresh monthly and do not roll over to the next billing period
- Overage charges apply when monthly credits are exceeded at the rate specified in your subscription tier

## 3. Credit Usage
- Credits are consumed when using features such as data enhancement, email verification, and calling services
- Credit costs vary by feature and are displayed in the admin interface
- Monthly credit allocations refresh on your billing period start date
- Unused credits expire at the end of each billing period

## 4. Payment Terms
- Subscription fees are billed monthly in advance
- Overage charges are billed monthly in arrears
- Payment is due within 30 days of invoice date
- Late payments may result in service suspension

## 5. Service Level
- We strive to maintain 99.9% uptime for all services
- Support response times vary by subscription tier
- Enterprise customers receive priority support

## 6. Data Privacy
- Your data is stored securely and never shared with third parties
- We comply with all applicable data protection regulations
- You retain ownership of all your data

## 7. Termination
- Either party may terminate this agreement with 30 days written notice
- Upon termination, you will be billed for any outstanding usage
- Your data will be available for export for 30 days after termination

## 8. Changes to Terms
- We reserve the right to modify these terms with 30 days notice
- Continued use of services after changes constitutes acceptance

Last Updated: December 3, 2025`,
  lastUpdated: '2025-12-03T10:00:00Z',
  lastUpdatedBy: 'Admin User'
};