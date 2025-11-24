
import React, { useMemo, useState } from 'react';
import { Client, ClientStatus, CreditPack, CreditTransaction, Discount } from '../../types';
import { subscriptionPlans, features as allFeatures, creditPacks, addOns as allAddOns } from '../../data/mockData';
import Card from '../ui/Card';
import { formatCurrency, formatNumber, exportToCsv } from '../../utils/formatters';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Accordion from '../ui/Accordion';
import Dropdown from '../ui/Dropdown';
import {
  ArrowLeftIcon,
  CalendarIcon,
  CreditsIcon,
  PlusCircleIcon,
  ExportIcon,
  ChartLineIcon,
  PrintIcon,
  DollarIcon,
  GridIcon,
  ListIcon,
  AlertTriangleIcon
} from '../ui/Icons';


interface ClientDetailProps {
  client: Client;
  onBack: () => void;
}

const StatusBadge = ({ status }: { status: ClientStatus }) => {
  const statusClasses: Record<ClientStatus, string> = {
      Active: 'bg-green-100 text-green-800',
      Trial: 'bg-yellow-100 text-yellow-800',
      'Past Due': 'bg-red-100 text-red-800',
      Canceled: 'bg-gray-100 text-gray-600',
  };
  return (
      <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[status]}`}>
          {status}
      </span>
  );
};

const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });


const ClientDetail: React.FC<ClientDetailProps> = ({ client, onBack }) => {
  const [clientData, setClientData] = useState<Client>(client);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [isPackModalOpen, setIsPackModalOpen] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [isFreeCreditsModalOpen, setIsFreeCreditsModalOpen] = useState(false);
  const [viewPeriod, setViewPeriod] = useState<string>('current');
  const [activeTab, setActiveTab] = useState<'overview' | 'credits' | 'credit-usage' | 'insights' | 'transactions'>('overview');


  const billingPeriods = useMemo(() => {
    const periods = [{ value: 'current', label: 'Current Month' }];
    const d = new Date();
    // Go back to the beginning of the current month to avoid timezone issues
    d.setDate(1); 
    for (let i = 0; i < 6; i++) {
        d.setMonth(d.getMonth() - 1);
        periods.push({
            value: d.toISOString().slice(0, 7), // YYYY-MM
            label: d.toLocaleString('default', { month: 'long', year: 'numeric' })
        });
    }
    return periods;
  }, []);

  const plan = useMemo(() => subscriptionPlans.find(p => p.name === clientData.subscriptionTier), [clientData.subscriptionTier]);
  
  // For prototype purposes, any historical view will show "last month's" data
  const usageData = viewPeriod === 'current' ? clientData.currentMonthUsage : clientData.lastMonthUsage;

  const billingData = useMemo(() => {
    let usageByCat: { [key: string]: { items: any[], totalFromPlan: number, totalOverage: number, totalOverageCost: number } } = {};
    let totalCreditsUsed = 0;
    let forecastingData = null;
    
    if (viewPeriod === 'current' && plan) {
        let remainingBaseline = plan.baselineCredits;
        const overageRate = plan.overageCreditRate || 0;
        const featureUsageBreakdown: { [key: string]: { name: string; category: string; fromPlan: number; overage: number; totalCredits: number; overageCost: number; creditCost: number; units: number; } } = {};

        const sortedTransactions = [...clientData.transactions]
            .filter(t => t.type === 'Feature Usage')
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        for (const transaction of sortedTransactions) {
            const feature = allFeatures.find(f => transaction.description.startsWith(f.name));
            if (feature) {
                const creditsUsed = Math.abs(transaction.amount);
                const units = feature.creditCost > 0 ? creditsUsed / feature.creditCost : 0;
                totalCreditsUsed += creditsUsed;
                
                if (!featureUsageBreakdown[feature.id]) {
                    featureUsageBreakdown[feature.id] = { name: feature.name, category: feature.category, fromPlan: 0, overage: 0, totalCredits: 0, overageCost: 0, creditCost: feature.creditCost, units: 0 };
                }

                const fromPlan = Math.min(remainingBaseline, creditsUsed);
                const overage = creditsUsed - fromPlan;

                featureUsageBreakdown[feature.id].fromPlan += fromPlan;
                featureUsageBreakdown[feature.id].overage += overage;
                featureUsageBreakdown[feature.id].units += units;
                featureUsageBreakdown[feature.id].totalCredits += creditsUsed;
                featureUsageBreakdown[feature.id].overageCost += overage * overageRate;
                
                remainingBaseline -= fromPlan;
            }
        }

        Object.values(featureUsageBreakdown).forEach(usage => {
            if (!usageByCat[usage.category]) {
                usageByCat[usage.category] = { items: [], totalFromPlan: 0, totalOverage: 0, totalOverageCost: 0 };
            }
            usageByCat[usage.category].items.push(usage);
            usageByCat[usage.category].totalFromPlan += usage.fromPlan;
            usageByCat[usage.category].totalOverage += usage.overage;
            usageByCat[usage.category].totalOverageCost += usage.overageCost;
        });
        
        const today = new Date();
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        const dayOfMonth = today.getDate();
        
        const burnRate = dayOfMonth > 0 ? totalCreditsUsed / dayOfMonth : 0;
        const projectedTotalUsage = burnRate * daysInMonth;
        const projectedOverage = Math.max(0, projectedTotalUsage - plan.baselineCredits);
        const projectedOverageCost = projectedOverage * plan.overageCreditRate;
        const projectedTotalBill = plan.monthlyPrice + projectedOverageCost;

        let recommendation = { text: "Usage is on track with the current plan.", savings: 0, type: 'on-track' as 'on-track' | 'upgrade' | 'pack' };
        
        const currentPlanIndex = subscriptionPlans.findIndex(p => p.id === plan.id);
        const nextPlan = subscriptionPlans[currentPlanIndex + 1];

        if (nextPlan && projectedOverage > 0) {
            const nextPlanProjectedOverage = Math.max(0, projectedTotalUsage - nextPlan.baselineCredits);
            const nextPlanProjectedCost = nextPlan.monthlyPrice + (nextPlanProjectedOverage * nextPlan.overageCreditRate);
            const potentialSavings = projectedTotalBill - nextPlanProjectedCost;

            if (potentialSavings > 10) { 
                recommendation = { text: `Upgrade to the ${nextPlan.name} plan to save an estimated ${formatCurrency(potentialSavings)} this month.`, savings: potentialSavings, type: 'upgrade' };
            }
        }
        
        if (projectedOverage > 0) {
            const bestPack = creditPacks
                .filter(pack => pack.credits >= projectedOverage)
                .sort((a,b) => a.price - b.price)[0];
            
            if (bestPack) {
                const potentialSavings = projectedOverageCost - bestPack.price;
                 if (potentialSavings > recommendation.savings) {
                    recommendation = { text: `Purchase the ${bestPack.name} (${formatNumber(bestPack.credits)} credits) to save an estimated ${formatCurrency(potentialSavings)} on overages.`, savings: potentialSavings, type: 'pack' };
                }
            }
        }
        forecastingData = { burnRate, projectedTotalUsage, projectedOverage, projectedOverageCost, recommendation };

    } else { 
        totalCreditsUsed = usageData.totalCreditsUsed;
        usageData.featureUsage.forEach(usage => {
            const feature = allFeatures.find(f => f.id === usage.featureId);
            if(feature) {
                const totalCredits = usage.units * feature.creditCost;
                if (!usageByCat[feature.category]) {
                    usageByCat[feature.category] = { items: [], totalFromPlan: 0, totalOverage: 0, totalOverageCost: 0 };
                }
                usageByCat[feature.category].items.push({ 
                    name: feature.name, 
                    totalCredits, 
                    units: usage.units, 
                    creditCost: feature.creditCost 
                });
                usageByCat[feature.category].totalFromPlan += totalCredits; // Simplified for past months
            }
        });
    }

    const totalBalance = clientData.creditBalance.monthly + clientData.creditBalance.rollover + clientData.creditBalance.addOn;
    const baselineCredits = plan?.baselineCredits || 0;
    
    const creditsFromPlan = Math.min(totalCreditsUsed, baselineCredits);
    const overageCredits = Math.max(0, totalCreditsUsed - baselineCredits);
    const overageCost = overageCredits * (plan?.overageCreditRate || 0);
    const baseFee = plan?.monthlyPrice || 0;

    return { 
      usageByCat, 
      totalBalance, 
      totalBill: usageData.totalBill, 
      creditsFromPlan,
      overageCredits,
      overageCost,
      baseFee,
      plan,
      totalCreditsUsed,
      forecastingData,
    };
  }, [clientData, plan, viewPeriod]);

  const handleSubscriptionChange = (newPlanId: string) => {
    const newPlan = subscriptionPlans.find(p => p.id === newPlanId);
    if (newPlan && plan) {
      setClientData(prev => ({
        ...prev,
        subscriptionTier: newPlan.name,
        transactions: [...prev.transactions, {
          id: `t-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          type: 'Subscription Change',
          description: `Changed from ${plan.name} to ${newPlan.name}`,
          amount: 0,
          balance: billingData.totalBalance
        }]
      }));
    }
    setIsSubModalOpen(false);
  }

  const handlePurchasePack = (pack: CreditPack) => {
      setClientData(prev => ({
          ...prev,
          creditBalance: {
              ...prev.creditBalance,
              addOn: prev.creditBalance.addOn + pack.credits
          },
          currentMonthUsage: {
              ...prev.currentMonthUsage,
              totalBill: prev.currentMonthUsage.totalBill + pack.price
          },
          transactions: [...prev.transactions, {
              id: `t-${Date.now()}`,
              date: new Date().toISOString().split('T')[0],
              type: 'Add-On Purchase',
              description: `Purchased ${pack.name}`,
              amount: pack.credits,
              balance: billingData.totalBalance + pack.credits
          }]
      }));
      setIsPackModalOpen(false);
  }
  
  const handleAddDiscount = (discount: Omit<Discount, 'id'>) => {
      const newDiscount: Discount = { ...discount, id: `d-${Date.now()}` };
      setClientData(prev => ({
          ...prev,
          currentMonthUsage: {
              ...prev.currentMonthUsage,
              discounts: [...prev.currentMonthUsage.discounts, newDiscount]
          }
      }));
      setIsDiscountModalOpen(false);
  }

  const handleAddFreeCredits = (credits: number, expirationDate: string) => {
      setClientData(prev => ({
          ...prev,
          creditBalance: {
              ...prev.creditBalance,
              addOn: prev.creditBalance.addOn + credits
          },
          transactions: [...prev.transactions, {
              id: `t-${Date.now()}`,
              date: new Date().toISOString().split('T')[0],
              type: 'Credit Adjustment',
              description: `Free credits added (expires: ${expirationDate})`,
              amount: credits,
              balance: billingData.totalBalance + credits
          }]
      }));
      setIsFreeCreditsModalOpen(false);
  }

  const handlePrint = () => {
    window.print();
  }
  
  const handleExport = () => {
    const isCurrent = viewPeriod === 'current';
    const periodLabel = billingPeriods.find(p => p.value === viewPeriod)?.label || 'Data';

    // Summary Rows
    const summaryRows = [
        ['Client Name', client.clientName],
        ['Database Name', client.dbName],
        ['Billing Period', periodLabel],
        [],
        ['Billing Summary'],
        ['Subscription', `${billingData.plan?.name}`, formatCurrency(billingData.baseFee)],
        ['Overage Cost', isCurrent ? `${formatNumber(billingData.overageCredits)} credits` : 'N/A', formatCurrency(billingData.overageCost)],
        // ...add discounts if any
        [],
        ['Total Bill', '', formatCurrency(billingData.totalBill)],
        [],
        [],
    ];

    // Feature Usage Rows
    const featureHeader = isCurrent 
        ? ['Category', 'Feature', 'Units Used', 'Credits/Unit', 'From Plan', 'Overage', 'Overage Cost', 'Total Credits']
        : ['Category', 'Feature', 'Units Used', 'Credits/Unit', 'Total Credits'];
    
    const featureRows: (string | number)[][] = [featureHeader];
    Object.keys(billingData.usageByCat).forEach(category => {
        const data = billingData.usageByCat[category];
        data.items.forEach(item => {
            const row = [ category, item.name, item.units, item.creditCost ];
            if (isCurrent) {
                row.push(item.fromPlan, item.overage, item.overageCost);
            }
            row.push(item.totalCredits);
            featureRows.push(row);
        });
    });

    // Transaction History Rows
    const transactionHeader = ['Date', 'Type', 'Description', 'Amount', 'Balance'];
    const transactionRows: (string | number)[][] = [transactionHeader];
    [...clientData.transactions].reverse().forEach(t => {
        transactionRows.push([t.date, t.type, t.description, t.amount, t.balance]);
    });
    
    const allRows = [
        ...summaryRows, 
        ['Feature Usage Breakdown'],
        ...featureRows,
        [],
        [],
        ['Transaction History'],
        ...transactionRows,
    ];

    exportToCsv(`${client.dbName}_${viewPeriod}_statement.csv`, allRows);
  }

  const TabButton = ({ label, view, activeView, onClick }: { label: string, view: typeof activeTab, activeView: typeof activeTab, onClick: (view: typeof activeTab) => void }) => {
    const isActive = activeView === view;
    return (
      <button
        onClick={() => onClick(view)}
        className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${
          isActive ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-600 hover:bg-gray-200'
        }`}
      >
        {label}
      </button>
    );
  };
  
  const currentPeriod = useMemo(() => {
    try {
        const startDate = new Date(clientData.billingPeriodStart);
        const endDate = new Date(startDate);
        endDate.setMonth(startDate.getMonth() + 1);
        endDate.setDate(startDate.getDate() - 1);
        return `${formatDate(clientData.billingPeriodStart)} - ${formatDate(endDate.toISOString())}`;
    } catch {
        return 'N/A';
    }
  }, [clientData.billingPeriodStart]);

  return (
    <div className="space-y-6" id="printable-area">
      {/* Header */}
      <header className="flex justify-between items-start">
        <div>
          <button onClick={onBack} className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-2 no-print">
            <ArrowLeftIcon />
            Back to All Clients
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{clientData.clientName}</h1>
          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
            <span>DB: <span className="font-medium text-gray-700">{clientData.dbName}</span></span>
            <span className="text-gray-300">|</span>
            <span>Type: <span className="font-medium text-gray-700">{clientData.clientType}</span></span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total Bill ({billingPeriods.find(p=>p.value === viewPeriod)?.label})</p>
          <p className="text-4xl font-bold text-green-600">{formatCurrency(billingData.totalBill)}</p>
        </div>
      </header>
      
      {/* View Toggle */}
      <div className="flex justify-between items-center no-print">
         <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">Statement:</label>
            <div className="w-64">
                <Dropdown
                    options={billingPeriods}
                    value={viewPeriod}
                    onChange={setViewPeriod}
                    placeholder="Select period"
                />
            </div>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={handlePrint}><PrintIcon/>Print Statement</Button>
            <Button variant="secondary" size="sm" onClick={handleExport}><ExportIcon />Export CSV</Button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-4">
            {/* Tabs */}
            <div className="p-1.5 bg-gray-100 rounded-lg flex space-x-2 no-print">
                <TabButton label="Overview" view="overview" activeView={activeTab} onClick={setActiveTab} />
                <TabButton label="Credits" view="credits" activeView={activeTab} onClick={setActiveTab} />
                <TabButton label="Credit Usage" view="credit-usage" activeView={activeTab} onClick={setActiveTab} />
                <TabButton label="Insights" view="insights" activeView={activeTab} onClick={setActiveTab} />
                <TabButton label="Transactions" view="transactions" activeView={activeTab} onClick={setActiveTab} />
            </div>

            {/* Tab Content */}
            <div className="mt-4">
                {activeTab === 'overview' && (
                    <Card title="Subscription Details" icon={<CalendarIcon />} padding="p-5">
                        <ul className="space-y-4 text-sm">
                            <li className="flex justify-between items-center">
                                <span className="text-gray-500">Status:</span>
                                <StatusBadge status={clientData.status} />
                            </li>
                              <li className="flex justify-between items-center">
                                <span className="text-gray-500">Plan:</span>
                                <span className="font-semibold text-gray-800">{billingData.plan?.name}</span>
                            </li>
                              <li className="flex justify-between items-center">
                                <span className="text-gray-500">Amount:</span>
                                <span className="font-semibold text-gray-800">{formatCurrency(billingData.baseFee)}/month</span>
                            </li>
                              <li className="flex justify-between items-center">
                                <span className="text-gray-500">Current Period:</span>
                                <span className="font-semibold text-gray-800">{currentPeriod}</span>
                            </li>
                              <li className="flex justify-between items-center">
                                <span className="text-gray-500">Created:</span>
                                <span className="font-semibold text-gray-800">{formatDate(clientData.createdDate)}</span>
                            </li>
                        </ul>
                        <div className="mt-4 no-print">
                            <Button variant="secondary" className="w-full" onClick={() => setIsSubModalOpen(true)} disabled={viewPeriod !== 'current'}>Change Plan</Button>
                        </div>
                    </Card>
                )}
                {activeTab === 'credits' && (
                    <Card title="Available Credits" icon={<CreditsIcon />} padding="p-5">
                            {/* Total Available - Prominent Display */}
                            <div className="flex justify-between items-baseline mb-4 pb-4 border-b border-gray-200">
                                <p className="text-sm font-medium text-gray-600">Total Available</p>
                                <p className="text-3xl font-bold text-gray-900">{formatNumber(billingData.totalBalance)}</p>
                            </div>

                            {/* Credit Breakdown */}
                            <div className="space-y-3 mb-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Monthly Credits</span>
                                    <span className="font-semibold text-gray-900">{formatNumber(clientData.creditBalance.monthly)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-600">Rollover Credits</span>
                                        {clientData.creditBalance.rollover > 0 && (
                                            <span className="text-xs text-gray-500">(expires end of next month)</span>
                                        )}
                                    </div>
                                    <span className="font-semibold text-gray-900">{formatNumber(clientData.creditBalance.rollover)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-600">Add-On Credits</span>
                                        {clientData.creditBalance.addOn > 0 && (
                                            <span className="text-xs text-gray-500">(never expire)</span>
                                        )}
                                    </div>
                                    <span className="font-semibold text-gray-900">{formatNumber(clientData.creditBalance.addOn)}</span>
                                </div>
                            </div>

                            {/* Expiring Credits Warning */}
                            {clientData.creditBalance.rollover > 0 && (
                                <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                                    <div className="flex items-start gap-2">
                                        <AlertTriangleIcon className="text-orange-600 flex-shrink-0 mt-0.5" size="small" />
                                        <div className="flex-1">
                                            <p className="text-xs font-semibold text-orange-800">Expiring Credits</p>
                                            <p className="text-xs text-orange-700 mt-1">
                                                {formatNumber(clientData.creditBalance.rollover)} rollover credits will expire at the end of next month
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Rollover Info */}
                            {plan && (
                                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-xs font-semibold text-blue-800 mb-1">Rollover Policy</p>
                                    <p className="text-xs text-blue-700">
                                        Up to {formatNumber(plan.baselineCredits * 0.2)} monthly credits ({plan.name} plan) can roll over to the next month
                                    </p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="grid grid-cols-2 gap-3 no-print">
                                <Button variant="secondary" className="w-full" onClick={() => setIsPackModalOpen(true)} disabled={viewPeriod !== 'current'}>Purchase Credits</Button>
                                <Button variant="primary" className="w-full" onClick={() => setIsFreeCreditsModalOpen(true)} disabled={viewPeriod !== 'current'}>Add Free Credits</Button>
                            </div>
                    </Card>
                )}
                {activeTab === 'credit-usage' && (
                     <Card title="Credits Used Per Feature" icon={<GridIcon />} padding="p-4">
                        <div className="space-y-2">
                        {Object.keys(billingData.usageByCat).length > 0 ? Object.keys(billingData.usageByCat).map((category) => {
                            const catData = billingData.usageByCat[category];
                            return (
                            <Accordion 
                            key={category} 
                            title={category}
                            rightContent={
                                <div className="text-right text-sm font-semibold text-gray-800">
                                {formatNumber(catData.totalFromPlan + catData.totalOverage)} Credits
                                </div>
                            }
                            >
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead>
                                    <tr className="bg-gray-50">
                                        <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Feature</th>
                                        <th className="px-4 py-2 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Units Used</th>
                                        <th className="px-4 py-2 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Credits/Unit</th>
                                        {viewPeriod === 'current' && <th className="px-4 py-2 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">From Plan</th>}
                                        {viewPeriod === 'current' && <th className="px-4 py-2 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Overage</th>}
                                        {viewPeriod === 'current' && <th className="px-4 py-2 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Overage Cost</th>}
                                        <th className="px-4 py-2 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Total Credits</th>
                                    </tr>
                                    </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                {catData.items.map((usage: any) => (
                                    <tr key={usage.name}>
                                    <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">{usage.name}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-gray-500 text-right">{formatNumber(usage.units)}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-gray-500 text-right">{formatNumber(usage.creditCost)}</td>
                                    {viewPeriod === 'current' && <td className="px-4 py-3 whitespace-nowrap text-gray-500 text-right">{formatNumber(usage.fromPlan)}</td>}
                                    {viewPeriod === 'current' && <td className="px-4 py-3 whitespace-nowrap text-red-500 text-right">{formatNumber(usage.overage)}</td>}
                                    {viewPeriod === 'current' && <td className="px-4 py-3 whitespace-nowrap text-red-500 text-right">{formatCurrency(usage.overageCost)}</td>}
                                    <td className="px-4 py-3 whitespace-nowrap text-gray-800 font-medium text-right">{formatNumber(usage.totalCredits)}</td>
                                    </tr>
                                ))}
                                </tbody>
                                {viewPeriod === 'current' && (
                                    <tfoot>
                                        <tr className="font-bold bg-gray-50">
                                            <td className="px-4 py-2 text-left" colSpan={3}>Category Total</td>
                                            <td className="px-4 py-2 text-right">{formatNumber(catData.totalFromPlan)}</td>
                                            <td className="px-4 py-2 text-right text-red-600">{formatNumber(catData.totalOverage)}</td>
                                            <td className="px-4 py-2 text-right text-red-600">{formatCurrency(catData.totalOverageCost)}</td>
                                            <td className="px-4 py-2 text-right">{formatNumber(catData.totalFromPlan + catData.totalOverage)}</td>
                                        </tr>
                                    </tfoot>
                                )}
                                </table>
                            </div>
                            </Accordion>
                        );
                        }) : <p className="text-center text-gray-500 py-4 text-sm">No feature usage recorded for this period.</p>}
                        </div>
                    </Card>
                )}
                {activeTab === 'insights' && billingData.forecastingData && (
                    <Card
                        title="Usage & Forecasting"
                        icon={<ChartLineIcon />}
                        padding="p-5"
                    >
                        <div className="divide-y divide-gray-100">
                            <div className="pb-4">
                                 <h4 className="text-sm font-semibold text-gray-600 mb-3">Pacing</h4>
                                 <ul className="text-sm space-y-3">
                                    <li className="flex justify-between items-center">
                                        <span className="text-gray-500">Current Burn Rate</span>
                                        <span className="font-medium text-gray-800">{formatNumber(Math.round(billingData.forecastingData.burnRate))}/day</span>
                                    </li>
                                    <li className="flex justify-between items-center">
                                        <span className="text-gray-500">Month-End Projection</span>
                                        <span className="font-medium text-gray-800">{formatNumber(Math.round(billingData.forecastingData.projectedTotalUsage))} credits</span>
                                    </li>
                                 </ul>
                            </div>
                            <div className="py-4">
                                <h4 className="text-sm font-semibold text-gray-600 mb-3">Overage Outlook</h4>
                                 <ul className="text-sm space-y-3">
                                    <li className="flex justify-between items-center">
                                        <span className="text-gray-500">Projected Overage</span>
                                        <span className="font-medium text-red-600">{formatNumber(Math.round(billingData.forecastingData.projectedOverage))} credits</span>
                                    </li>
                                    <li className="flex justify-between items-center">
                                        <span className="text-gray-500">Estimated Overage Cost</span>
                                        <span className="font-medium text-red-600">{formatCurrency(billingData.forecastingData.projectedOverageCost)}</span>
                                    </li>
                                 </ul>
                            </div>
                            <div className="pt-4">
                                 <h4 className="text-sm font-semibold text-gray-600 mb-2">Recommendation</h4>
                                 <div className={`p-3 rounded-lg text-sm ${billingData.forecastingData.recommendation.type === 'on-track' ? 'bg-green-50 text-green-800' : 'bg-blue-50 text-blue-800'}`}>
                                    {billingData.forecastingData.recommendation.text}
                                 </div>
                            </div>
                        </div>
                    </Card>
                )}
                {activeTab === 'insights' && !billingData.forecastingData && (
                    <Card title="Usage & Forecasting" icon={<ChartLineIcon />} padding="p-5">
                        <p className="text-center text-gray-500 py-8 text-sm">Forecasting data is only available for the current billing period.</p>
                    </Card>
                )}
                {activeTab === 'transactions' && (
                    <Card title="Transaction History" icon={<ListIcon />} padding="p-0">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200/80 text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                                        <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Description</th>
                                        <th className="px-4 py-2 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-4 py-2 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Balance</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200/80">
                                    {[...clientData.transactions].reverse().map(t => (
                                        <tr key={t.id}>
                                            <td className="px-4 py-3 whitespace-nowrap text-gray-500">{t.date}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-gray-500">{t.type}</td>
                                            <td className="px-4 py-3 text-gray-800">{t.description}</td>
                                            <td className={`px-4 py-3 whitespace-nowrap font-semibold text-right ${t.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>{t.amount >= 0 ? `+${formatNumber(t.amount)}` : formatNumber(t.amount)}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-gray-500 text-right">{formatNumber(t.balance)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                 )}
            </div>
        </div>

        <div className="space-y-8">
            <Card
                title="Billing Summary"
                icon={<DollarIcon />}
                actions={
                    <div className="no-print">
                        <Button variant="secondary" size="sm" onClick={() => setIsDiscountModalOpen(true)} disabled={viewPeriod !== 'current'}>Add Discount</Button>
                    </div>
                }
                padding="p-5"
            >
                <div className="divide-y divide-gray-100">
                    <div className="pb-4">
                        <h4 className="text-sm font-semibold text-gray-600 mb-3">Usage Breakdown</h4>
                        <ul className="text-sm space-y-3">
                            <li className="flex justify-between items-center">
                                <span className="text-gray-500">Total Credits Used</span>
                                <span className="font-medium text-gray-800">{formatNumber(billingData.totalCreditsUsed)}</span>
                            </li>
                            <li className="flex justify-between items-center pl-4 border-l-2 border-gray-200">
                                <span className="text-gray-500">From Plan ({plan?.name})</span>
                                <span className="font-medium text-gray-800">-{formatNumber(billingData.creditsFromPlan)}</span>
                            </li>
                            {billingData.overageCredits > 0 && (
                                <li className="flex justify-between items-center pl-4 border-l-2 border-red-200">
                                    <span className="text-red-600">Overage Credits</span>
                                    <span className="font-medium text-red-600">-{formatNumber(billingData.overageCredits)}</span>
                                </li>
                            )}
                        </ul>
                    </div>

                    <div className="py-4">
                        <h4 className="text-sm font-semibold text-gray-600 mb-3">Cost Breakdown</h4>
                        <ul className="text-sm space-y-3">
                            <li className="flex justify-between items-center">
                                <span className="text-gray-500">{plan?.name} Subscription</span>
                                <span className="font-medium text-gray-800">{formatCurrency(billingData.baseFee)}</span>
                            </li>
                            {billingData.overageCost > 0 && (
                                <li className="flex justify-between items-center">
                                    <span className="text-gray-500">Overage <span className="text-xs">({formatNumber(billingData.overageCredits)} @ {formatCurrency(plan?.overageCreditRate || 0)})</span></span>
                                    <span className="font-medium text-gray-800">{formatCurrency(billingData.overageCost)}</span>
                                </li>
                            )}
                            {usageData.discounts.map(d => (
                               <li key={d.id} className="flex justify-between items-center">
                                   <span className="text-green-600">{d.description}</span>
                                   <span className="font-medium text-green-600">
                                       -{d.type === 'fixed' ? formatCurrency(d.value) : `${d.value}%`}
                                   </span>
                               </li>
                           ))}
                        </ul>
                        <div className="border-t-2 border-gray-300 mt-4 pt-4 flex justify-between items-baseline bg-gradient-to-r from-green-50 to-transparent -mx-5 px-5 py-3 rounded-b-lg">
                            <span className="font-bold text-gray-900 text-lg">Total Bill</span>
                            <span className="font-bold text-2xl text-green-600">{formatCurrency(billingData.totalBill)}</span>
                        </div>
                    </div>
                </div>
            </Card>

            <Card title="Active Add-Ons" icon={<PlusCircleIcon />} padding="p-5">
                {usageData.addOns.length > 0 ? (
                    <ul className="text-sm space-y-2">
                        {usageData.addOns.map(id => {
                            const addOn = allAddOns.find(a => a.id === id);
                            return addOn ? <li key={id} className="flex justify-between items-center"><span className="text-gray-700">{addOn.name}</span><span className="text-gray-500 text-xs">{addOn.pricing}</span></li> : null;
                        })}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-500 text-center">No active add-ons.</p>
                )}
            </Card>
        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={isSubModalOpen} onClose={() => setIsSubModalOpen(false)} title="Change Subscription Plan">
          <div className="space-y-4">
              <p>Select a new plan for {clientData.clientName}. The change will be effective immediately.</p>
              <select defaultValue={plan?.id} onChange={(e) => handleSubscriptionChange(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm">
                  {subscriptionPlans.map(p => <option key={p.id} value={p.id}>{p.name} - {formatCurrency(p.monthlyPrice)}/month</option>)}
              </select>
          </div>
      </Modal>

      <Modal isOpen={isPackModalOpen} onClose={() => setIsPackModalOpen(false)} title="Purchase Credit Pack">
          <div className="space-y-2">
              <p className="text-sm text-gray-600 mb-4">Select a pre-paid credit pack to add to the client's account. The cost will be added to the current bill.</p>
              <div className="space-y-3">
                  {creditPacks.map(pack => (
                      <div key={pack.id} className="p-3 border rounded-md flex justify-between items-center">
                          <div>
                              <p className="font-semibold">{pack.name} ({formatNumber(pack.credits)} credits)</p>
                              <p className="text-sm text-gray-500">{formatCurrency(pack.price)} - <span className="text-green-600">({formatCurrency(pack.price/pack.credits, {minimumFractionDigits: 4})}/credit)</span></p>
                          </div>
                          <Button size="sm" onClick={() => handlePurchasePack(pack)}>Add Pack</Button>
                      </div>
                  ))}
              </div>
          </div>
      </Modal>

      <Modal isOpen={isDiscountModalOpen} onClose={() => setIsDiscountModalOpen(false)} title="Add Discount or Adjustment">
          <form className="space-y-4" onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const data = Object.fromEntries(formData.entries());
              handleAddDiscount({
                  description: data.description as string,
                  type: data.type as 'fixed' | 'percentage',
                  value: Number(data.value),
                  isRecurring: data.isRecurring === 'on'
              });
          }}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <input type="text" name="description" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <select name="type" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm">
                        <option value="fixed">Fixed Amount ($)</option>
                        <option value="percentage">Percentage (%)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Value</label>
                    <input type="number" name="value" step="0.01" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm" />
                  </div>
              </div>
              <div className="flex items-center">
                  <input type="checkbox" name="isRecurring" className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
                  <label className="ml-2 block text-sm text-gray-900">Recurring Discount</label>
              </div>
              <div className="flex justify-end pt-4">
                  <Button type="submit">Add Discount</Button>
              </div>
          </form>
      </Modal>

      <Modal isOpen={isFreeCreditsModalOpen} onClose={() => setIsFreeCreditsModalOpen(false)} title="Add Free Credits">
          <form className="space-y-4" onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const credits = Number(formData.get('credits'));
              const expirationDate = formData.get('expirationDate') as string;

              // Validation
              if (credits <= 0) {
                  alert('Credits must be a positive number');
                  return;
              }

              const expDate = new Date(expirationDate);
              const today = new Date();
              today.setHours(0, 0, 0, 0);

              if (expDate <= today) {
                  alert('Expiration date must be in the future');
                  return;
              }

              handleAddFreeCredits(credits, expirationDate);
          }}>
              <p className="text-sm text-gray-600">Add complimentary credits to the client's account. These credits will be tracked separately and can have an expiration date.</p>

              <div>
                <label htmlFor="credits" className="block text-sm font-medium text-gray-700">Number of Credits</label>
                <input
                    type="number"
                    name="credits"
                    id="credits"
                    min="1"
                    step="1"
                    required
                    placeholder="e.g., 5000"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">Enter the number of free credits to add</p>
              </div>

              <div>
                <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700">Expiration Date</label>
                <div className="relative mt-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="date"
                        name="expirationDate"
                        id="expirationDate"
                        required
                        min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm pl-10"
                    />
                </div>
                <p className="mt-1 text-xs text-gray-500">Credits will expire on this date</p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="secondary" onClick={() => setIsFreeCreditsModalOpen(false)}>Cancel</Button>
                  <Button type="submit">Add Free Credits</Button>
              </div>
          </form>
      </Modal>

    </div>
  );
};

export default ClientDetail;
