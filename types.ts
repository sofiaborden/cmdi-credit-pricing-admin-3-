export type View = 'dashboard' | 'subscriptions' | 'features' | 'clients' | 'client-detail' | 'reports' | 'settings';

export type ClientStatus = 'Active' | 'Trial' | 'Past Due' | 'Canceled';

export interface SystemPricing {
  creditPurchasePrice: number;
  minPurchase: number;
}

export type PlanStatus = 'active' | 'archived' | 'legacy' | 'internal' | 'beta';

export interface SubscriptionPlan {
  id: string;
  name: string;
  monthlyPrice: number; // Base subscription price (before record-based pricing)
  pricePerRecordPerMonth?: number; // NEW: Price per Crimson People database record per month
  description: string;
  monthlyCreditsIncluded: number; // NEW NAME (formerly baselineCredits): Credits included per month
  maxUsers?: 'Unlimited' | number;
  overageCreditRate: number; // Cost per credit when monthly credits are exceeded
  status: PlanStatus;
  tierLevel: number; // 1, 2, 3, etc. for sorting
  isMostPopular?: boolean;
  clientsUsing: number;
  lastUpdated?: string; // ISO date string
  highlights?: string[]; // Marketing bullet points for client-facing pricing pages
  assignedClientTypes?: string[]; // NEW: Client types assigned to this tier (e.g., ['Fed Senate', 'Fed PAC'])
  assignedClientIds?: string[]; // NEW: Individual client IDs assigned to this tier
}

export interface AddOn {
  id:string;
  name: string;
  description: string;
  status: 'Active' | 'Under Consideration' | 'Concept';
  pricing: string;
}

// New: For purchasable credit packs
export interface CreditPack {
    id: string;
    name: string;
    credits: number;
    price: number;
    description: string;
    creditExpirationDays?: number; // Days until add-on credits expire after purchase (0 or undefined = never expires)
    status: PlanStatus;
    purchasedCount: number; // Number of times this pack has been purchased
    isMostPopular?: boolean;
    lastUpdated?: string; // ISO date string
    highlights?: string[]; // Marketing bullet points for client-facing pricing pages
}

export interface Integration {
  id: string;
  name: string;
}

export interface Feature {
  id: string;
  name: string;
  description: string;
  creditCost: number;
  costPerUnit: number; // New: CMDI's internal cost
  enabled: boolean;
  category: string;
  usage: {
    currentMonthCredits: number;
    clientsUsing: number;
  };
}

export interface CreditTransaction {
  id: string;
  date: string;
  type: 'Monthly Allotment' | 'Feature Usage' | 'Overage Purchase' | 'Credit Adjustment' | 'Add-On Purchase' | 'Subscription Change' | 'Free Credits';
  description: string;
  amount: number; // positive for additions, negative for deductions
  balance: number;
  memo?: string; // NEW: Optional memo/reason for transaction (especially for free credits)
}

export interface Client {
  id: string;
  clientName: string;
  dbName: string;
  clientType: string;
  subscriptionTier: string;
  status: ClientStatus;
  createdDate: string;
  billingPeriodStart: string;
  // New: Detailed credit balance
  creditBalance: {
    monthly: number;
    rollover: number;
    addOn: number;
  };
  currentCreditCount?: number; // NEW: Current credit usage from Crimson API (live count)
  creditCountLastUpdated?: string; // NEW: ISO date string of last credit count sync
  recordCount?: number; // NEW: Number of records in Crimson People database (for pricing calculation)
  recordCountLastUpdated?: string; // NEW: ISO date string of last record count sync
  currentMonthUsage: ClientUsage;
  lastMonthUsage: ClientUsage;
  transactions: CreditTransaction[];
}

export interface Discount {
    id: string;
    description: string;
    type: 'fixed' | 'percentage';
    value: number;
    isRecurring: boolean;
}

export interface ClientUsage {
  totalCreditsUsed: number;
  totalBill: number;
  featureUsage: FeatureUsage[];
  addOns: string[];
  discounts: Discount[];
}

export interface FeatureUsage {
  featureId: string;
  units: number;
}

// NEW: Terms and Conditions settings
export interface TermsAndConditions {
  id: string;
  content: string; // The T&C text content
  lastUpdated: string; // ISO date string
  lastUpdatedBy: string; // Admin name or ID
}