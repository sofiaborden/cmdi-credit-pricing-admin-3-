/**
 * Modern Dashboard with enhanced visual design
 * Reduced gray usage, better contrast, and responsive cards
 */
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';
import KpiCard from '../ui/KpiCard';
import { View } from '../../types';
import { clients, features, subscriptionPlans } from '../../data/mockData';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import Button from '../ui/Button';
import { TotalRevenueIcon, CreditsIcon, StarIcon, ArrowTrendingUpIcon, AlertTriangleIcon } from '../ui/Icons';

interface DashboardProps {
  onNavigate: (view: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {

    const kpiData = useMemo(() => {
        const totalMRR = clients.reduce((acc, client) => {
            const plan = subscriptionPlans.find(p => p.name === client.subscriptionTier);
            return acc + (plan?.monthlyPrice || 0);
        }, 0);

        const totalCreditsUsed = clients.reduce((acc, client) => acc + client.currentMonthUsage.totalCreditsUsed, 0);

        // Calculate total allocated credits across all clients (baseline only)
        const totalCreditsAllocated = clients.reduce((acc, client) => {
            const plan = subscriptionPlans.find(p => p.name === client.subscriptionTier);
            return acc + (plan?.baselineCredits || 0);
        }, 0);

        // Calculate remaining baseline credits (for current month usage tracking)
        const creditsRemaining = totalCreditsAllocated - totalCreditsUsed;

        // CRITICAL FIX: Calculate TOTAL unused credits (liability) including rollover and add-on credits
        const totalUnusedCredits = clients.reduce((acc, client) => {
            const totalAvailable = client.creditBalance.monthly +
                                  client.creditBalance.rollover +
                                  client.creditBalance.addOn;
            return acc + totalAvailable;
        }, 0);

        // Calculate breakdown by credit type
        const totalMonthlyCredits = clients.reduce((acc, client) => acc + client.creditBalance.monthly, 0);
        const totalRolloverCredits = clients.reduce((acc, client) => acc + client.creditBalance.rollover, 0);
        const totalAddOnCredits = clients.reduce((acc, client) => acc + client.creditBalance.addOn, 0);

        // Calculate high liability clients (100k+ unused credits)
        const highLiabilityClients = clients.filter(client => {
            const totalAvailable = client.creditBalance.monthly +
                                  client.creditBalance.rollover +
                                  client.creditBalance.addOn;
            return totalAvailable > 100000;
        }).sort((a, b) => {
            const aTotal = a.creditBalance.monthly + a.creditBalance.rollover + a.creditBalance.addOn;
            const bTotal = b.creditBalance.monthly + b.creditBalance.rollover + b.creditBalance.addOn;
            return bTotal - aTotal;
        });

        const featureUsageMap = new Map<string, number>();
        clients.forEach(client => {
            client.currentMonthUsage.featureUsage.forEach(usage => {
                const feature = features.find(f => f.id === usage.featureId);
                if (feature) {
                    const currentUsage = featureUsageMap.get(feature.name) || 0;
                    featureUsageMap.set(feature.name, currentUsage + (usage.units * feature.creditCost));
                }
            });
        });

        const mostUsedFeature = [...featureUsageMap.entries()].sort((a, b) => b[1] - a[1])[0] || ['N/A', 0];

        return {
            totalMRR,
            totalCreditsUsed,
            creditsRemaining,
            totalCreditsAllocated,
            totalUnusedCredits,
            totalMonthlyCredits,
            totalRolloverCredits,
            totalAddOnCredits,
            highLiabilityClients,
            mostUsedFeature
        };
    }, []);
    
    const alerts = useMemo(() => {
        const upsellOpportunities = clients.filter(client => {
            const plan = subscriptionPlans.find(p => p.name === client.subscriptionTier);
            return plan && client.currentMonthUsage.totalCreditsUsed > plan.baselineCredits * 1.2;
        });
        const lowUsage = clients.filter(client => {
            const plan = subscriptionPlans.find(p => p.name === client.subscriptionTier);
            return plan && client.currentMonthUsage.totalCreditsUsed < plan.baselineCredits * 0.2;
        });

        return { upsellOpportunities, lowUsage };
    }, []);

  const quickLinks = [
    { view: 'subscriptions', label: 'Manage Subscriptions', description: 'Edit plans, pricing, and credit allotments.' },
    { view: 'features', label: 'Manage Features', description: 'Set credit costs for individual features.' },
    { view: 'clients', label: 'View All Clients', description: 'View client usage and monthly billing.' },
  ] as const;

  return (
    <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
                title="Total MRR"
                value={formatCurrency(kpiData.totalMRR)}
                icon={<TotalRevenueIcon className="text-white" size="small" />}
                variant="success"
            />
            <KpiCard
                title="Total Unused Credits"
                value={formatNumber(kpiData.totalUnusedCredits)}
                icon={<AlertTriangleIcon className="text-white" size="small" />}
                subtext={`Liability across all clients`}
                variant="warning"
            />
            <KpiCard
                title="Monthly Credits Left"
                value={formatNumber(kpiData.creditsRemaining)}
                icon={<CreditsIcon className="text-white" size="small" />}
                subtext={`${formatNumber(kpiData.totalCreditsUsed)} of ${formatNumber(kpiData.totalCreditsAllocated)} used`}
                variant="default"
            />
            <KpiCard
                title="Most-Used Feature"
                value={kpiData.mostUsedFeature[0]}
                icon={<StarIcon className="text-white" size="small" />}
                subtext={`${formatNumber(kpiData.mostUsedFeature[1])} credits`}
                variant="success"
            />
        </div>

        {/* Credit Liability Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card title="Credit Liability Breakdown" icon={<CreditsIcon />} padding="p-5">
                <ul className="space-y-3">
                    <li className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Monthly Credits</span>
                        <span className="font-bold text-gray-900">{formatNumber(kpiData.totalMonthlyCredits)}</span>
                    </li>
                    <li className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Rollover Credits</span>
                        <span className="font-bold text-gray-900">{formatNumber(kpiData.totalRolloverCredits)}</span>
                    </li>
                    <li className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Add-On Credits</span>
                        <span className="font-bold text-red-600">{formatNumber(kpiData.totalAddOnCredits)}</span>
                    </li>
                    <li className="flex justify-between items-center pt-3 border-t border-gray-200">
                        <span className="text-sm text-gray-900 font-semibold">Total Liability</span>
                        <span className="font-bold text-lg text-gray-900">{formatNumber(kpiData.totalUnusedCredits)}</span>
                    </li>
                </ul>
            </Card>

            {/* High Liability Clients Alert */}
            <Card title="High Liability Clients" icon={<AlertTriangleIcon />} padding="p-5" className="lg:col-span-2">
                <div className="mb-3">
                    <p className="text-xs text-gray-600">Clients with 100k+ unused credits</p>
                </div>
                {kpiData.highLiabilityClients.length > 0 ? (
                    <ul className="space-y-2">
                        {kpiData.highLiabilityClients.map(client => {
                            const totalCredits = client.creditBalance.monthly +
                                                client.creditBalance.rollover +
                                                client.creditBalance.addOn;
                            return (
                                <li key={client.id} className="flex items-center gap-2.5 p-2.5 bg-white rounded-lg border border-red-200 hover:border-red-300 hover:bg-red-50 transition-colors">
                                    <span className="text-xs font-medium text-gray-900 flex-1 min-w-0 truncate">{client.clientName}</span>
                                    <span className="text-xs font-bold text-red-600">{formatNumber(totalCredits)} credits</span>
                                    <Button size="sm" variant="primary" onClick={() => onNavigate('clients')} className="flex-shrink-0 text-xs">View</Button>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-center">
                        <p className="text-xs text-gray-500">No high liability clients</p>
                    </div>
                )}
            </Card>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Links */}
        <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <span className="w-1 h-5 bg-gradient-to-b from-brand-500 to-brand-600 rounded-full mr-2.5"></span>
              Quick Links
            </h3>
            <div className="space-y-2.5">
            {quickLinks.map((link, index) => (
              <motion.div
                key={link.view}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover={true} className="group">
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); onNavigate(link.view); }}
                    className="block p-4 relative overflow-hidden"
                  >
                    <div className="relative z-10">
                      <h4 className="font-semibold text-sm text-gray-900 group-hover:text-brand-600 transition-colors line-clamp-2">
                        {link.label}
                      </h4>
                      <p className="mt-0.5 text-xs text-gray-600 line-clamp-2">{link.description}</p>
                    </div>
                    {/* Hover gradient effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </Card>
              </motion.div>
            ))}
            </div>
        </div>

        {/* Alerts */}
        <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Client Alerts
            </h3>
            <Card padding="p-5">
                {/* Upsell Opportunities */}
                <div className="mb-6">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-1.5 flex-shrink-0">
                      <ArrowTrendingUpIcon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-gray-900 line-clamp-2">Upsell Opportunities</h4>
                      <p className="text-xs text-gray-600 line-clamp-2">Using over 120% of baseline credits</p>
                    </div>
                  </div>
                  {alerts.upsellOpportunities.length > 0 ? (
                    <ul className="space-y-2">
                       {alerts.upsellOpportunities.map(client => (
                           <li key={client.id} className="flex items-center gap-2.5 p-2.5 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors">
                               <span className="text-xs font-medium text-gray-900 flex-1 min-w-0 truncate">{client.clientName}</span>
                               <Button size="sm" variant="primary" onClick={() => onNavigate('clients')} className="flex-shrink-0 text-xs">View</Button>
                           </li>
                       ))}
                    </ul>
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-center">
                      <p className="text-xs text-gray-500">No upsell opportunities</p>
                    </div>
                  )}
                </div>

                {/* Low Usage */}
                <div>
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-1.5 flex-shrink-0">
                      <ArrowTrendingUpIcon className="w-4 h-4 text-white transform rotate-180" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-gray-900 line-clamp-2">Low Usage</h4>
                      <p className="text-xs text-gray-600 line-clamp-2">Using less than 20% of baseline credits</p>
                    </div>
                  </div>
                  {alerts.lowUsage.length > 0 ? (
                    <ul className="space-y-2">
                       {alerts.lowUsage.map(client => (
                           <li key={client.id} className="flex items-center gap-2.5 p-2.5 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors">
                               <span className="text-xs font-medium text-gray-900 flex-1 min-w-0 truncate">{client.clientName}</span>
                               <Button size="sm" variant="primary" onClick={() => onNavigate('clients')} className="flex-shrink-0 text-xs">View</Button>
                           </li>
                       ))}
                    </ul>
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-center">
                      <p className="text-xs text-gray-500">No clients with low usage</p>
                    </div>
                  )}
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
