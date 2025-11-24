export type View = 'dashboard' | 'subscriptions' | 'features' | 'clients' | 'client-detail' | 'reports';

export type ClientStatus = 'Active' | 'Trial' | 'Past Due' | 'Canceled';

export interface SystemPricing {
  creditPurchasePrice: number;
  minPurchase: number;
}

export type PlanStatus = 'active' | 'archived' | 'legacy' | 'internal' | 'beta';

export interface SubscriptionPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  annualPrice: number; // Total annual price (typically 10-20% discount from 12 × monthlyPrice)
  description: string;
  baselineCredits: number; // Credits allocated per month (annual plans get this amount each month for 12 months)
  maxUsers?: 'Unlimited' | number;
  overageCreditRate: number; // Cost per credit when baseline is exceeded
  creditExpirationDays?: number; // Days until monthly baseline credits expire (0 or undefined = never expires)
  status: PlanStatus;
  tierLevel: number; // 1, 2, 3, etc. for sorting
  isMostPopular?: boolean;
  clientsUsing: number;
  lastUpdated?: string; // ISO date string
  highlights?: string[]; // Marketing bullet points for client-facing pricing pages
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
  type: 'Monthly Allotment' | 'Feature Usage' | 'Overage Purchase' | 'Credit Adjustment' | 'Add-On Purchase' | 'Subscription Change';
  description: string;
  amount: number; // positive for additions, negative for deductions
  balance: number;
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