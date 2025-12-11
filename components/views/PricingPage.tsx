import React from 'react';
import { subscriptionPlans as mockSubscriptionPlans, creditPacks as mockCreditPacks } from '../../data/mockData';
import { SubscriptionPlan, CreditPack } from '../../types';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import { CheckIcon, SparklesIcon } from '../ui/Icons';

interface PricingPageProps {
    isPreview?: boolean; // If true, show admin preview mode
    plans?: SubscriptionPlan[]; // Optional: pass current plans state
    creditPacks?: CreditPack[]; // Optional: pass current credit packs state
}

const PricingPage: React.FC<PricingPageProps> = ({ isPreview = false, plans, creditPacks }) => {
    // Use provided plans or fall back to mock data
    const allPlans = plans || mockSubscriptionPlans;
    const allCreditPacks = creditPacks || mockCreditPacks;

    // Only show active plans, sorted by tier level
    const activePlans = allPlans
        .filter(plan => plan.status === 'active')
        .sort((a, b) => a.tierLevel - b.tierLevel);

    // Only show active credit packs
    const activeCreditPacks = allCreditPacks
        .filter(pack => pack.status === 'active')
        .sort((a, b) => (b.isMostPopular ? 1 : 0) - (a.isMostPopular ? 1 : 0));

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            {isPreview && (
                <div className="max-w-7xl mx-auto mb-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                            <strong>👁 Preview Mode:</strong> This is how clients will see the pricing page. 
                            The actual page will be available at <code className="bg-blue-100 px-1 rounded">/pricing</code>
                        </p>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Choose Your Plan
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Flexible pricing based on your database size. All plans include our full feature set with varying credit allowances.
                    </p>
                </div>

                {/* Pricing Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {activePlans.map((plan) => (
                        <PricingCard key={plan.id} plan={plan} />
                    ))}
                </div>

                {/* Add-On Credit Packs Section */}
                {activeCreditPacks.length > 0 && (
                    <>
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-3">
                                Add-On Credit Packs
                            </h2>
                            <p className="text-md text-gray-600 max-w-2xl mx-auto">
                                Need extra credits? Purchase add-on packs anytime to supplement your monthly allowance.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
                            {activeCreditPacks.map((pack) => (
                                <CreditPackCard key={pack.id} pack={pack} />
                            ))}
                        </div>
                    </>
                )}

                {/* Footer Note */}
                <div className="text-center text-sm text-gray-500">
                    <p>All plans include access to our full feature set. Credits refresh monthly and do not roll over.</p>
                    <p className="mt-2">Need a custom plan? <a href="mailto:sales@cmdi.com" className="text-brand-primary hover:underline">Contact our sales team</a></p>
                </div>
            </div>
        </div>
    );
};

interface PricingCardProps {
    plan: SubscriptionPlan;
}

const PricingCard: React.FC<PricingCardProps> = ({ plan }) => {
    const pricePerRecord = plan.pricePerRecordPerMonth || 0;
    const monthlyCredits = plan.monthlyCreditsIncluded || 0;
    const overageRate = plan.overageCreditRate || 0;

    return (
        <div className={`relative rounded-lg border-2 p-8 bg-white shadow-lg transition-transform hover:scale-105 ${
            plan.isMostPopular ? 'border-green-500' : 'border-gray-200'
        }`}>
            {/* Most Popular Badge */}
            {plan.isMostPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-semibold bg-green-500 text-white shadow-md">
                        <SparklesIcon size={14} /> Most Popular
                    </span>
                </div>
            )}

            {/* Plan Name */}
            <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
            </div>

            {/* Description */}
            <p className="text-center text-sm text-gray-600 mb-6 min-h-[40px]">
                {plan.description}
            </p>

            {/* Pricing */}
            <div className="text-center mb-6">
                {pricePerRecord > 0 ? (
                    <div className="p-4 border-2 border-brand-primary rounded-lg bg-brand-50">
                        <div className="text-xs font-semibold text-gray-600 uppercase mb-1">Pricing</div>
                        <div className="flex items-baseline justify-center gap-1">
                            <span className="text-4xl font-bold text-gray-900">
                                {formatCurrency(pricePerRecord, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                            </span>
                            <span className="text-gray-600 text-sm">/record/month</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Based on your database size</div>
                    </div>
                ) : (
                    <div className="p-4 border-2 border-brand-primary rounded-lg bg-brand-50">
                        <div className="text-xs font-semibold text-gray-600 uppercase mb-1">Free Tier</div>
                        <div className="flex items-baseline justify-center gap-1">
                            <span className="text-5xl font-bold text-brand-primary">
                                $0
                            </span>
                            <span className="text-gray-600">/month</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">No monthly fees</div>
                    </div>
                )}
            </div>

            {/* Credits & Overage Info */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-left space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Credits Included:</span>
                    <span className="font-semibold text-gray-900">{formatNumber(monthlyCredits)}/month</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Overage Rate:</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(overageRate)}/credit</span>
                </div>
                <div className="pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-500 italic">
                        Credits refresh monthly (no rollover)
                    </p>
                </div>
            </div>

            {/* Highlights */}
            {plan.highlights && plan.highlights.length > 0 && (
                <ul className="space-y-3 mb-8">
                    {plan.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start gap-2">
                            <CheckIcon className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
                            <span className="text-sm text-gray-700">{highlight}</span>
                        </li>
                    ))}
                </ul>
            )}

            {/* CTA Button */}
            <button
                type="button"
                className="w-full py-3 px-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-lg transition-colors shadow-sm"
            >
                Choose Plan
            </button>
        </div>
    );
};

interface CreditPackCardProps {
    pack: CreditPack;
}

const CreditPackCard: React.FC<CreditPackCardProps> = ({ pack }) => {
    return (
        <div className={`relative rounded-lg border-2 p-6 bg-white shadow-md transition-transform hover:scale-105 ${
            pack.isMostPopular ? 'border-brand-500' : 'border-gray-200'
        }`}>
            {/* Most Popular Badge */}
            {pack.isMostPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-brand-500 text-white shadow-sm">
                        <SparklesIcon size={12} className="mr-1" /> Most Popular
                    </span>
                </div>
            )}

            {/* Pack Name */}
            <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
                {pack.name}
            </h3>

            {/* Price */}
            <div className="text-center mb-4">
                <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-bold text-gray-900">{formatCurrency(pack.price)}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                    {formatNumber(pack.credits)} credits
                </p>
                <p className="text-xs text-gray-500 mt-1">
                    {formatCurrency(pack.price / pack.credits)}/credit
                </p>
            </div>

            {/* Description */}
            {pack.description && (
                <p className="text-sm text-gray-600 text-center mb-4">
                    {pack.description}
                </p>
            )}

            {/* Highlights */}
            {pack.highlights && pack.highlights.length > 0 && (
                <ul className="space-y-2 mb-6">
                    {pack.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start gap-2">
                            <CheckIcon className="text-green-600 flex-shrink-0 mt-0.5" size={16} />
                            <span className="text-xs text-gray-700">{highlight}</span>
                        </li>
                    ))}
                </ul>
            )}

            {/* CTA Button */}
            <button
                type="button"
                className="w-full py-2 px-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-lg transition-colors shadow-sm text-sm"
            >
                Purchase Pack
            </button>
        </div>
    );
};

export default PricingPage;

