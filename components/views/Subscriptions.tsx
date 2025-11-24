
import React, { useState, ChangeEvent } from 'react';
import { systemPricing as mockSystemPricing, subscriptionPlans as mockSubscriptionPlans, addOns, integrations, creditPacks as mockCreditPacks } from '../../data/mockData';
import { SystemPricing, SubscriptionPlan, CreditPack, PlanStatus } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Dropdown from '../ui/Dropdown';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import { DollarIcon, EditIcon, SaveIcon, PackageIcon, PuzzleIcon, PlusCircleIcon, SubscriptionIcon, CheckIcon, XIcon, EyeIcon, SparklesIcon } from '../ui/Icons';

// Highlights Editor Component
interface HighlightsEditorProps {
    highlights: string[];
    onChange: (highlights: string[]) => void;
}

const HighlightsEditor: React.FC<HighlightsEditorProps> = ({ highlights, onChange }) => {
    const [newHighlight, setNewHighlight] = useState('');

    const handleAddHighlight = () => {
        if (newHighlight.trim()) {
            onChange([...highlights, newHighlight.trim()]);
            setNewHighlight('');
        }
    };

    const handleRemoveHighlight = (index: number) => {
        onChange(highlights.filter((_, i) => i !== index));
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddHighlight();
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex gap-2">
                <input
                    type="text"
                    value={newHighlight}
                    onChange={(e) => setNewHighlight(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="e.g., 24/7 priority support"
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm"
                />
                <Button
                    type="button"
                    variant="secondary"
                    onClick={handleAddHighlight}
                    disabled={!newHighlight.trim()}
                >
                    <PlusCircleIcon /> Add
                </Button>
            </div>

            {highlights.length > 0 && (
                <ul className="space-y-2">
                    {highlights.map((highlight, index) => (
                        <li
                            key={index}
                            className="flex items-center justify-between gap-2 p-2 bg-gray-50 rounded-md border border-gray-200"
                        >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                <CheckIcon className="text-green-600 flex-shrink-0" size={16} />
                                <span className="text-sm text-gray-700 truncate">{highlight}</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleRemoveHighlight(index)}
                                className="flex-shrink-0 p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Remove highlight"
                            >
                                <XIcon size={16} />
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {highlights.length === 0 && (
                <p className="text-sm text-gray-500 italic text-center py-4">
                    No highlights added yet. Add marketing bullet points to showcase this plan's features.
                </p>
            )}
        </div>
    );
};

// Client-Facing Preview Component
interface ClientFacingPreviewProps {
    item: SubscriptionPlan | CreditPack;
    type: 'plan' | 'pack';
}

const ClientFacingPreview: React.FC<ClientFacingPreviewProps> = ({ item, type }) => {
    const isPlan = type === 'plan';
    const plan = isPlan ? (item as SubscriptionPlan) : null;
    const pack = !isPlan ? (item as CreditPack) : null;

    // Calculate pricing display
    const monthlyPrice = plan?.monthlyPrice || 0;
    const annualPrice = plan?.annualPrice || 0;
    const packPrice = pack?.price || 0;
    const effectiveAnnualMonthly = annualPrice > 0 ? annualPrice / 12 : 0;
    const savings = monthlyPrice * 12 - annualPrice;
    const savingsPercent = monthlyPrice > 0 && annualPrice > 0 ? Math.round((savings / (monthlyPrice * 12)) * 100) : 0;

    return (
        <div className="max-w-sm mx-auto">
            {/* Preview Card - Similar to the reference image */}
            <div className={`relative rounded-lg border-2 p-6 bg-white shadow-lg ${item.isMostPopular ? 'border-green-500' : 'border-gray-200'}`}>
                {/* Most Popular Badge */}
                {item.isMostPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-500 text-white shadow-md">
                            <SparklesIcon size={12} /> Most Popular
                        </span>
                    </div>
                )}

                {/* Plan/Pack Name */}
                <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                </div>

                {/* Pricing */}
                <div className="text-center mb-6">
                    {isPlan ? (
                        <>
                            {/* Monthly and Annual Pricing Options */}
                            <div className="space-y-4">
                                {/* Monthly Option */}
                                {monthlyPrice > 0 && (
                                    <div className="p-3 border-2 border-gray-200 rounded-lg bg-gray-50">
                                        <div className="text-xs font-semibold text-gray-600 uppercase mb-1">Monthly</div>
                                        <div className="flex items-baseline justify-center gap-1">
                                            <span className="text-3xl font-bold text-gray-900">
                                                {formatCurrency(monthlyPrice)}
                                            </span>
                                            <span className="text-gray-600">/month</span>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">Billed monthly</div>
                                    </div>
                                )}

                                {/* Annual Option */}
                                {annualPrice > 0 && (
                                    <div className={`p-3 border-2 rounded-lg ${savingsPercent > 0 ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                                        <div className="text-xs font-semibold text-gray-600 uppercase mb-1">Annual</div>
                                        <div className="flex items-baseline justify-center gap-1">
                                            <span className="text-3xl font-bold text-gray-900">
                                                {formatCurrency(effectiveAnnualMonthly)}
                                            </span>
                                            <span className="text-gray-600">/month</span>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {formatCurrency(annualPrice)}/year, billed annually
                                        </div>
                                        {savingsPercent > 0 && (
                                            <div className="mt-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-600 text-white">
                                                Save {savingsPercent}% ({formatCurrency(savings)})
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="text-4xl font-bold text-gray-900">
                            {formatCurrency(packPrice)}
                        </div>
                    )}
                </div>

                {/* Description */}
                <p className="text-center text-sm text-gray-600 mb-6">
                    {item.description}
                </p>

                {/* Highlights */}
                {item.highlights && item.highlights.length > 0 && (
                    <ul className="space-y-3 mb-6">
                        {item.highlights.map((highlight, index) => (
                            <li key={index} className="flex items-start gap-2">
                                <CheckIcon className="text-green-600 flex-shrink-0 mt-0.5" size={16} />
                                <span className="text-sm text-gray-700">{highlight}</span>
                            </li>
                        ))}
                    </ul>
                )}

                {/* CTA Button - Fixed styling with explicit brand-600 color */}
                <button
                    type="button"
                    className="w-full py-3 px-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-lg transition-colors shadow-sm"
                >
                    {isPlan ? 'Choose Plan' : 'Purchase Pack'}
                </button>
            </div>

            {/* Preview Note */}
            <p className="mt-4 text-xs text-center text-gray-500 italic">
                This is how clients will see this {type} in the pricing page
                <br />
                <span className="text-gray-400">(Button is for preview only - not functional in admin view)</span>
            </p>
        </div>
    );
};

interface PlanFormProps {
    plan: SubscriptionPlan;
    onSave: (plan: SubscriptionPlan) => void;
    onCancel: () => void;
}

const PlanForm: React.FC<PlanFormProps> = ({ plan, onSave, onCancel }) => {
    const [formData, setFormData] = useState(plan);
    const [activeTab, setActiveTab] = useState<'details' | 'highlights' | 'preview'>('details');

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const numValue = Number(value);
        setFormData(prev => ({ ...prev, [name]: ['monthlyPrice', 'annualPrice', 'baselineCredits', 'overageCreditRate', 'creditExpirationDays'].includes(name) ? numValue : value }));
    }

    const handleHighlightsChange = (highlights: string[]) => {
        setFormData(prev => ({ ...prev, highlights }));
    };

    // Calculate savings for display
    const calculateSavings = () => {
        const monthlyTotal = formData.monthlyPrice * 12;
        const savings = monthlyTotal - formData.annualPrice;
        const savingsPercent = monthlyTotal > 0 ? Math.round((savings / monthlyTotal) * 100) : 0;
        return { savings, savingsPercent };
    }

    const { savings, savingsPercent } = calculateSavings();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        type="button"
                        onClick={() => setActiveTab('details')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === 'details'
                                ? 'border-brand-primary text-brand-primary'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Plan Details
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('highlights')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === 'highlights'
                                ? 'border-brand-primary text-brand-primary'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        <span className="flex items-center gap-1">
                            Highlights
                            {formData.highlights && formData.highlights.length > 0 && (
                                <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-brand-primary rounded-full">
                                    {formData.highlights.length}
                                </span>
                            )}
                        </span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('preview')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === 'preview'
                                ? 'border-brand-primary text-brand-primary'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        <span className="flex items-center gap-1">
                            <EyeIcon size={16} /> Preview
                        </span>
                    </button>
                </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'details' && (
                <div className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Plan Name</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm" />
            </div>

            {/* Pricing Section */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Pricing</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="monthlyPrice" className="block text-sm font-medium text-gray-700">Monthly Price (USD)</label>
                        <input type="number" step="0.01" name="monthlyPrice" id="monthlyPrice" value={formData.monthlyPrice} onChange={handleChange} min="0" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="annualPrice" className="block text-sm font-medium text-gray-700">Annual Price (USD)</label>
                        <input type="number" step="0.01" name="annualPrice" id="annualPrice" value={formData.annualPrice} onChange={handleChange} min="0" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm" />
                    </div>
                </div>
                {formData.annualPrice > 0 && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                        <div className="text-sm space-y-1">
                            <div className="flex justify-between">
                                <span className="text-gray-700">Effective monthly rate (annual):</span>
                                <span className="font-semibold text-gray-900">{formatCurrency(formData.annualPrice / 12)}/mo</span>
                            </div>
                            {savings > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-gray-700">Annual savings:</span>
                                    <span className="text-green-600 font-semibold">{formatCurrency(savings)}/year ({savingsPercent}% off)</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="baselineCredits" className="block text-sm font-medium text-gray-700">Baseline Credits (per month)</label>
                    <input type="number" name="baselineCredits" id="baselineCredits" value={formData.baselineCredits} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm" />
                    <p className="mt-1 text-xs text-gray-500">Credits allocated each month for both monthly and annual plans</p>
                </div>
                <div>
                    <label htmlFor="overageCreditRate" className="block text-sm font-medium text-gray-700">Overage Rate ($)</label>
                    <input type="number" step="0.001" name="overageCreditRate" id="overageCreditRate" value={formData.overageCreditRate} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm" />
                </div>
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm" />
            </div>
            <div>
                <label htmlFor="creditExpirationDays" className="block text-sm font-medium text-gray-700">Credit Expiration Period</label>
                <select
                    name="creditExpirationDays"
                    id="creditExpirationDays"
                    value={formData.creditExpirationDays || 0}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm"
                >
                    <option value={0}>Never expires</option>
                    <option value={30}>30 days</option>
                    <option value={60}>60 days</option>
                    <option value={90}>90 days</option>
                    <option value={180}>180 days</option>
                    <option value={365}>365 days</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">Monthly baseline credits will expire this many days after being allocated to the client</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                        name="status"
                        id="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm"
                    >
                        <option value="active">Active</option>
                        <option value="archived">Archived</option>
                        <option value="legacy">Legacy</option>
                        <option value="internal">Internal</option>
                        <option value="beta">Beta</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="tierLevel" className="block text-sm font-medium text-gray-700">Tier Level</label>
                    <input type="number" name="tierLevel" id="tierLevel" value={formData.tierLevel} onChange={handleChange} min="1" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm" />
                    <p className="mt-1 text-xs text-gray-500">Used for sorting (1 = lowest tier)</p>
                </div>
            </div>

            <div className="flex items-center">
                <input
                    type="checkbox"
                    name="isMostPopular"
                    id="isMostPopular"
                    checked={formData.isMostPopular || false}
                    onChange={(e) => setFormData(prev => ({ ...prev, isMostPopular: e.target.checked }))}
                    className="h-4 w-4 text-brand-primary focus:ring-brand-primary border-gray-300 rounded"
                />
                <label htmlFor="isMostPopular" className="ml-2 block text-sm text-gray-700">
                    Mark as "Most Popular"
                </label>
            </div>
                </div>
            )}

            {/* Highlights Tab */}
            {activeTab === 'highlights' && (
                <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Marketing Highlights</h4>
                        <p className="text-sm text-gray-600">
                            Add bullet points that will be displayed to clients on the pricing page.
                            These help showcase the key features and benefits of this plan.
                        </p>
                    </div>

                    <HighlightsEditor
                        highlights={formData.highlights || []}
                        onChange={handleHighlightsChange}
                    />
                </div>
            )}

            {/* Preview Tab */}
            {activeTab === 'preview' && (
                <div className="py-4">
                    <ClientFacingPreview item={formData} type="plan" />
                </div>
            )}

            {/* Form Actions - Always visible */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
                <Button type="submit"><SaveIcon /> Save Changes</Button>
            </div>
        </form>
    );
}

interface CreditPackFormProps {
    pack: CreditPack;
    onSave: (pack: CreditPack) => void;
    onCancel: () => void;
}

const CreditPackForm: React.FC<CreditPackFormProps> = ({ pack, onSave, onCancel }) => {
    const [formData, setFormData] = useState(pack);
    const [activeTab, setActiveTab] = useState<'details' | 'highlights' | 'preview'>('details');

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const numValue = Number(value);
        setFormData(prev => ({ ...prev, [name]: ['credits', 'price', 'creditExpirationDays'].includes(name) ? numValue : value }));
    }

    const handleHighlightsChange = (highlights: string[]) => {
        setFormData(prev => ({ ...prev, highlights }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        type="button"
                        onClick={() => setActiveTab('details')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === 'details'
                                ? 'border-brand-primary text-brand-primary'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Pack Details
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('highlights')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === 'highlights'
                                ? 'border-brand-primary text-brand-primary'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        <span className="flex items-center gap-1">
                            Highlights
                            {formData.highlights && formData.highlights.length > 0 && (
                                <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-brand-primary rounded-full">
                                    {formData.highlights.length}
                                </span>
                            )}
                        </span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('preview')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === 'preview'
                                ? 'border-brand-primary text-brand-primary'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        <span className="flex items-center gap-1">
                            <EyeIcon size={16} /> Preview
                        </span>
                    </button>
                </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'details' && (
                <div className="space-y-4">
            <div>
                <label htmlFor="pack-name" className="block text-sm font-medium text-gray-700">Pack Name</label>
                <input type="text" name="name" id="pack-name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="pack-credits" className="block text-sm font-medium text-gray-700">Credits</label>
                    <input type="number" name="credits" id="pack-credits" value={formData.credits} onChange={handleChange} min="1" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="pack-price" className="block text-sm font-medium text-gray-700">Price (USD)</label>
                    <input type="number" step="0.01" name="price" id="pack-price" value={formData.price} onChange={handleChange} min="0" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm" />
                </div>
            </div>
            <div>
                <label htmlFor="pack-description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea name="description" id="pack-description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm" />
            </div>
            <div>
                <label htmlFor="pack-creditExpirationDays" className="block text-sm font-medium text-gray-700">Credit Expiration Period</label>
                <select
                    name="creditExpirationDays"
                    id="pack-creditExpirationDays"
                    value={formData.creditExpirationDays || 0}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm"
                >
                    <option value={0}>Never expires</option>
                    <option value={30}>30 days</option>
                    <option value={60}>60 days</option>
                    <option value={90}>90 days</option>
                    <option value={180}>180 days</option>
                    <option value={365}>365 days</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">Add-on credits will expire this many days after purchase</p>
            </div>

            <div>
                <label htmlFor="pack-status" className="block text-sm font-medium text-gray-700">Status</label>
                <select
                    name="status"
                    id="pack-status"
                    value={formData.status}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm"
                >
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                    <option value="legacy">Legacy</option>
                    <option value="internal">Internal</option>
                    <option value="beta">Beta</option>
                </select>
            </div>

            <div className="flex items-center">
                <input
                    type="checkbox"
                    name="isMostPopular"
                    id="pack-isMostPopular"
                    checked={formData.isMostPopular || false}
                    onChange={(e) => setFormData(prev => ({ ...prev, isMostPopular: e.target.checked }))}
                    className="h-4 w-4 text-brand-primary focus:ring-brand-primary border-gray-300 rounded"
                />
                <label htmlFor="pack-isMostPopular" className="ml-2 block text-sm text-gray-700">
                    Mark as "Most Popular"
                </label>
            </div>
                </div>
            )}

            {/* Highlights Tab */}
            {activeTab === 'highlights' && (
                <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Marketing Highlights</h4>
                        <p className="text-sm text-gray-600">
                            Add bullet points that will be displayed to clients on the pricing page.
                            These help showcase the key features and benefits of this credit pack.
                        </p>
                    </div>

                    <HighlightsEditor
                        highlights={formData.highlights || []}
                        onChange={handleHighlightsChange}
                    />
                </div>
            )}

            {/* Preview Tab */}
            {activeTab === 'preview' && (
                <div className="py-4">
                    <ClientFacingPreview item={formData} type="pack" />
                </div>
            )}

            {/* Form Actions - Always visible */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
                <Button type="submit"><SaveIcon /> Save Changes</Button>
            </div>
        </form>
    );
}

type SortOption = 'tier' | 'name' | 'clients' | 'updated';

const Subscriptions: React.FC = () => {
    const [systemPricing, setSystemPricing] = useState<SystemPricing>(mockSystemPricing);
    const [isEditingSystemPricing, setIsEditingSystemPricing] = useState(false);
    const [editedSystemPricing, setEditedSystemPricing] = useState<SystemPricing>(mockSystemPricing);

    const [plans, setPlans] = useState<SubscriptionPlan[]>(mockSubscriptionPlans);
    const [creditPacks, setCreditPacks] = useState<CreditPack[]>(mockCreditPacks);
    const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
    const [isPackModalOpen, setIsPackModalOpen] = useState(false);
    const [editingPack, setEditingPack] = useState<CreditPack | null>(null);

    // Filtering and sorting state
    const [planStatusFilter, setPlanStatusFilter] = useState<PlanStatus | 'all'>('all');
    const [planSortBy, setPlanSortBy] = useState<SortOption>('tier');
    const [packStatusFilter, setPackStatusFilter] = useState<PlanStatus | 'all'>('all');
    const [packSortBy, setPackSortBy] = useState<SortOption>('name');

    const handleEditSystemPricing = () => {
        setEditedSystemPricing(systemPricing);
        setIsEditingSystemPricing(true);
    };

    const handleCancelSystemPricing = () => {
        setIsEditingSystemPricing(false);
    };

    const handleSaveSystemPricing = (e: React.FormEvent) => {
        e.preventDefault();
        setSystemPricing(editedSystemPricing);
        setIsEditingSystemPricing(false);
    };

    const handleSystemPricingChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedSystemPricing(prev => ({...prev, [name]: Number(value)}));
    }

    const handleOpenPlanModal = (plan: SubscriptionPlan) => {
        setEditingPlan({ ...plan });
        setIsPlanModalOpen(true);
    };
    
    const handleClosePlanModal = () => {
        setIsPlanModalOpen(false);
        setEditingPlan(null);
    };

    const handleSavePlan = (updatedPlan: SubscriptionPlan) => {
        // Check if this is a new plan (id starts with 'new-')
        if (updatedPlan.id.startsWith('new-')) {
            setPlans([...plans, { ...updatedPlan, lastUpdated: new Date().toISOString() }]);
        } else {
            setPlans(plans.map(p => p.id === updatedPlan.id ? { ...updatedPlan, lastUpdated: new Date().toISOString() } : p));
        }
        handleClosePlanModal();
    };

    const handleOpenPackModal = (pack: CreditPack) => {
        setEditingPack({ ...pack });
        setIsPackModalOpen(true);
    };

    const handleClosePackModal = () => {
        setIsPackModalOpen(false);
        setEditingPack(null);
    };

    const handleSavePack = (updatedPack: CreditPack) => {
        // Check if this is a new pack (id starts with 'new-pack-')
        if (updatedPack.id.startsWith('new-pack-')) {
            setCreditPacks([...creditPacks, { ...updatedPack, lastUpdated: new Date().toISOString() }]);
        } else {
            setCreditPacks(creditPacks.map(p => p.id === updatedPack.id ? { ...updatedPack, lastUpdated: new Date().toISOString() } : p));
        }
        handleClosePackModal();
    };

    // Filter and sort plans
    const getFilteredAndSortedPlans = () => {
        let filtered = plans;

        // Apply status filter
        if (planStatusFilter !== 'all') {
            filtered = filtered.filter(p => p.status === planStatusFilter);
        } else {
            // When showing "all", exclude archived plans by default
            filtered = filtered.filter(p => p.status !== 'archived');
        }

        // Apply sorting
        const sorted = [...filtered].sort((a, b) => {
            switch (planSortBy) {
                case 'tier':
                    return a.tierLevel - b.tierLevel;
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'clients':
                    return b.clientsUsing - a.clientsUsing;
                case 'updated':
                    return new Date(b.lastUpdated || 0).getTime() - new Date(a.lastUpdated || 0).getTime();
                default:
                    return 0;
            }
        });

        return sorted;
    };

    // Filter and sort credit packs
    const getFilteredAndSortedPacks = () => {
        let filtered = creditPacks;

        // Apply status filter
        if (packStatusFilter !== 'all') {
            filtered = filtered.filter(p => p.status === packStatusFilter);
        } else {
            // When showing "all", exclude archived packs by default
            filtered = filtered.filter(p => p.status !== 'archived');
        }

        // Apply sorting
        const sorted = [...filtered].sort((a, b) => {
            switch (packSortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'clients':
                    return b.purchasedCount - a.purchasedCount;
                case 'updated':
                    return new Date(b.lastUpdated || 0).getTime() - new Date(a.lastUpdated || 0).getTime();
                default:
                    return 0;
            }
        });

        return sorted;
    };

    const handleArchivePlan = (planId: string) => {
        setPlans(plans.map(p =>
            p.id === planId ? { ...p, status: p.status === 'archived' ? 'active' : 'archived' as PlanStatus } : p
        ));
    };

    const handleDuplicatePlan = (plan: SubscriptionPlan) => {
        const newPlan: SubscriptionPlan = {
            ...plan,
            id: `${plan.id}-copy-${Date.now()}`,
            name: `${plan.name} (Copy)`,
            clientsUsing: 0,
            lastUpdated: new Date().toISOString(),
        };
        setPlans([...plans, newPlan]);
    };

    const handleArchivePack = (packId: string) => {
        setCreditPacks(creditPacks.map(p =>
            p.id === packId ? { ...p, status: p.status === 'archived' ? 'active' : 'archived' as PlanStatus } : p
        ));
    };

    const handleDuplicatePack = (pack: CreditPack) => {
        const newPack: CreditPack = {
            ...pack,
            id: `${pack.id}-copy-${Date.now()}`,
            name: `${pack.name} (Copy)`,
            purchasedCount: 0,
            lastUpdated: new Date().toISOString(),
        };
        setCreditPacks([...creditPacks, newPack]);
    };

    const filteredPlans = getFilteredAndSortedPlans();
    const filteredPacks = getFilteredAndSortedPacks();

    // Helper to render status badge
    const renderStatusBadge = (status: PlanStatus) => {
        const styles = {
            active: 'bg-green-100 text-green-700',
            archived: 'bg-gray-100 text-gray-600',
            legacy: 'bg-gray-100 text-gray-600',
            internal: 'bg-orange-100 text-orange-700',
            beta: 'bg-blue-100 text-blue-700',
        };

        const labels = {
            active: 'Active',
            archived: 'Archived',
            legacy: 'Legacy',
            internal: 'Internal',
            beta: 'Beta',
        };

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[status]}`}>
                {labels[status]}
            </span>
        );
    };


  return (
    <div className="space-y-10">
      
      <Card
        title="System Pricing Configuration"
        icon={<DollarIcon />}
        actions={!isEditingSystemPricing && <Button onClick={handleEditSystemPricing} size="sm"><EditIcon /> Edit</Button>}
        padding={isEditingSystemPricing ? "p-6" : "p-0"}
      >
        {!isEditingSystemPricing ? (
            <div className="p-6">
                <div className="flex space-x-12">
                    <div>
                        <p className="text-sm text-gray-500">Default Credit Price</p>
                        <p className="text-2xl font-bold text-gray-800">{formatCurrency(systemPricing.creditPurchasePrice)}</p>
                        <p className="text-sm text-gray-500">per credit (for margin calc)</p>
                    </div>
                        <div>
                        <p className="text-sm text-gray-500">Minimum Purchase</p>
                        <p className="text-2xl font-bold text-gray-800">{formatNumber(systemPricing.minPurchase)}</p>
                        <p className="text-sm text-gray-500">credits</p>
                    </div>
                </div>
            </div>
        ) : (
            <form onSubmit={handleSaveSystemPricing}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="creditPurchasePrice" className="block text-sm font-medium text-gray-700">Default Credit Price (USD)</label>
                        <input type="number" step="0.01" name="creditPurchasePrice" id="creditPurchasePrice" value={editedSystemPricing.creditPurchasePrice} onChange={handleSystemPricingChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="minPurchase" className="block text-sm font-medium text-gray-700">Minimum Purchase (Credits)</label>
                        <input type="number" name="minPurchase" id="minPurchase" value={editedSystemPricing.minPurchase} onChange={handleSystemPricingChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm" />
                    </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                    <Button type="button" variant="secondary" onClick={handleCancelSystemPricing}>Cancel</Button>
                    <Button type="submit"><SaveIcon /> Save Changes</Button>
                </div>
            </form>
        )}
      </Card>

      {/* Subscription Plans Section */}
      <Card
        title="Subscription Plan Pricing"
        icon={<SubscriptionIcon />}
        actions={
            <Button onClick={() => {
                const newPlan: SubscriptionPlan = {
                    id: `new-${Date.now()}`,
                    name: 'New Plan',
                    monthlyPrice: 0,
                    annualPrice: 0,
                    description: '',
                    baselineCredits: 0,
                    overageCreditRate: 0,
                    status: 'active',
                    tierLevel: 1,
                    clientsUsing: 0,
                    lastUpdated: new Date().toISOString(),
                };
                setEditingPlan(newPlan);
                setIsPlanModalOpen(true);
            }}>
                <PlusCircleIcon /> New Subscription Tier
            </Button>
        }
        padding="p-6"
      >
          {/* Filters and Sort */}
          <div className="flex gap-4 mb-6">
              <Dropdown
                  options={[
                      { value: 'all', label: 'All Statuses' },
                      { value: 'active', label: 'Active' },
                      { value: 'archived', label: 'Archived' },
                      { value: 'legacy', label: 'Legacy' },
                      { value: 'internal', label: 'Internal' },
                      { value: 'beta', label: 'Beta' },
                  ]}
                  value={planStatusFilter}
                  onChange={(value) => setPlanStatusFilter(value as PlanStatus | 'all')}
                  placeholder="All Statuses"
              />
              <Dropdown
                  options={[
                      { value: 'tier', label: 'Tier Level' },
                      { value: 'name', label: 'A–Z' },
                      { value: 'clients', label: 'Most Clients' },
                      { value: 'updated', label: 'Recently Updated' },
                  ]}
                  value={planSortBy}
                  onChange={(value) => setPlanSortBy(value as SortOption)}
                  placeholder="Sort By"
              />
          </div>

          {/* Plan Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {filteredPlans.map((plan) => {
                  const [menuOpen, setMenuOpen] = React.useState(false);
                  return (
                      <div key={plan.id} className={`relative bg-white rounded-lg p-4 hover:shadow-md transition-shadow ${plan.isMostPopular ? 'border-2 border-red-500' : 'border border-gray-200'}`}>
                          {/* Most Popular Badge */}
                          {plan.isMostPopular && (
                              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500 text-white">
                                      Most Popular
                                  </span>
                              </div>
                          )}

                          {/* Header */}
                          <div className="flex justify-between items-start mb-1">
                              <div className="flex-1 flex items-center gap-2 min-w-0">
                                  <h3 className="text-base font-bold text-gray-900 truncate">{plan.name}</h3>
                                  {renderStatusBadge(plan.status)}
                              </div>

                              {/* Kebab Menu */}
                              <div className="relative flex-shrink-0 ml-2">
                                  <button
                                      onClick={(e) => {
                                          e.stopPropagation();
                                          setMenuOpen(!menuOpen);
                                      }}
                                      className="p-1 hover:bg-gray-100 rounded"
                                  >
                                      <span className="text-gray-500 text-lg leading-none">⋮</span>
                                  </button>
                                  {menuOpen && (
                                      <>
                                          <div
                                              className="fixed inset-0 z-10"
                                              onClick={() => setMenuOpen(false)}
                                          />
                                          <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg border border-gray-200 z-20">
                                              <button
                                                  onClick={(e) => {
                                                      e.stopPropagation();
                                                      handleOpenPlanModal(plan);
                                                      setMenuOpen(false);
                                                  }}
                                                  className="block w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-100"
                                              >
                                                  Edit
                                              </button>
                                              <button
                                                  onClick={(e) => {
                                                      e.stopPropagation();
                                                      handleArchivePlan(plan.id);
                                                      setMenuOpen(false);
                                                  }}
                                                  className="block w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-100"
                                              >
                                                  {plan.status === 'archived' ? 'Unarchive' : 'Archive'}
                                              </button>
                                              <button
                                                  onClick={(e) => {
                                                      e.stopPropagation();
                                                      handleDuplicatePlan(plan);
                                                      setMenuOpen(false);
                                                  }}
                                                  className="block w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-100"
                                              >
                                                  Duplicate
                                              </button>
                                              <button
                                                  onClick={(e) => {
                                                      e.stopPropagation();
                                                      setMenuOpen(false);
                                                      /* TODO: Navigate to clients page with filter */
                                                  }}
                                                  className="block w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-100"
                                              >
                                                  View Clients
                                              </button>
                                          </div>
                                      </>
                                  )}
                              </div>
                          </div>

                          {/* Pricing */}
                          <div className="mb-3">
                              <div className="flex items-baseline gap-1">
                                  <span className="text-2xl font-bold text-gray-900">{formatCurrency(plan.monthlyPrice)}</span>
                                  <span className="text-sm text-gray-600">/mo</span>
                              </div>
                              {plan.annualPrice > 0 && (
                                  <div className="text-xs text-gray-600 mt-1">
                                      {formatCurrency(plan.annualPrice)}/yr ({formatCurrency(plan.annualPrice / 12)}/mo)
                                      <span className="text-green-600 font-medium ml-1">
                                          Save {formatCurrency(plan.monthlyPrice * 12 - plan.annualPrice)}
                                      </span>
                                  </div>
                              )}
                          </div>

                          {/* Details - Compact 2-column layout */}
                          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
                              <div>
                                  <div className="text-gray-600">Credits/month:</div>
                                  <div className="font-semibold text-gray-900">{formatNumber(plan.baselineCredits)}</div>
                              </div>
                              <div>
                                  <div className="text-gray-600">Expiration:</div>
                                  <div className="font-semibold text-gray-900">
                                      {plan.creditExpirationDays && plan.creditExpirationDays > 0
                                          ? `${plan.creditExpirationDays} days`
                                          : 'Never'}
                                  </div>
                              </div>
                              <div>
                                  <div className="text-gray-600">Overage rate:</div>
                                  <div className="font-semibold text-gray-900">{formatCurrency(plan.overageCreditRate)}/credit</div>
                              </div>
                              <div>
                                  <div className="text-gray-600">Clients:</div>
                                  <div className="font-semibold text-gray-900">{plan.clientsUsing}</div>
                              </div>
                          </div>
                      </div>
                  );
              })}
          </div>
      </Card>

      {/* Add-On Credit Packs Section */}
      <Card
        title="Add-On Credit Packs"
        icon={<PackageIcon />}
        actions={
            <Button onClick={() => {
                const newPack: CreditPack = {
                    id: `new-pack-${Date.now()}`,
                    name: 'New Pack',
                    credits: 0,
                    price: 0,
                    description: '',
                    status: 'active',
                    purchasedCount: 0,
                    lastUpdated: new Date().toISOString(),
                };
                setEditingPack(newPack);
                setIsPackModalOpen(true);
            }}>
                <PlusCircleIcon /> Add New Pack
            </Button>
        }
        padding="p-6"
      >
          {/* Filters and Sort */}
          <div className="flex gap-4 mb-6">
              <Dropdown
                  options={[
                      { value: 'all', label: 'All Statuses' },
                      { value: 'active', label: 'Active' },
                      { value: 'archived', label: 'Archived' },
                      { value: 'legacy', label: 'Legacy' },
                      { value: 'internal', label: 'Internal' },
                      { value: 'beta', label: 'Beta' },
                  ]}
                  value={packStatusFilter}
                  onChange={(value) => setPackStatusFilter(value as PlanStatus | 'all')}
                  placeholder="All Statuses"
              />
              <Dropdown
                  options={[
                      { value: 'name', label: 'A–Z' },
                      { value: 'clients', label: 'Most Purchased' },
                      { value: 'updated', label: 'Recently Updated' },
                  ]}
                  value={packSortBy}
                  onChange={(value) => setPackSortBy(value as SortOption)}
                  placeholder="Sort By"
              />
          </div>

          {/* Pack Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {filteredPacks.map((pack) => {
                  const [menuOpen, setMenuOpen] = React.useState(false);
                  return (
                      <div key={pack.id} className={`relative bg-white rounded-lg p-4 hover:shadow-md transition-shadow ${pack.isMostPopular ? 'border-2 border-red-500' : 'border border-gray-200'}`}>
                          {/* Most Popular Badge */}
                          {pack.isMostPopular && (
                              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500 text-white">
                                      Most Popular
                                  </span>
                              </div>
                          )}

                          {/* Header */}
                          <div className="flex justify-between items-start mb-1">
                              <div className="flex-1 flex items-center gap-2 min-w-0">
                                  <h3 className="text-base font-bold text-gray-900 truncate">{pack.name}</h3>
                                  {renderStatusBadge(pack.status)}
                              </div>

                              {/* Kebab Menu */}
                              <div className="relative flex-shrink-0 ml-2">
                                  <button
                                      onClick={(e) => {
                                          e.stopPropagation();
                                          setMenuOpen(!menuOpen);
                                      }}
                                      className="p-1 hover:bg-gray-100 rounded"
                                  >
                                      <span className="text-gray-500 text-lg leading-none">⋮</span>
                                  </button>
                                  {menuOpen && (
                                      <>
                                          <div
                                              className="fixed inset-0 z-10"
                                              onClick={() => setMenuOpen(false)}
                                          />
                                          <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg border border-gray-200 z-20">
                                              <button
                                                  onClick={(e) => {
                                                      e.stopPropagation();
                                                      handleOpenPackModal(pack);
                                                      setMenuOpen(false);
                                                  }}
                                                  className="block w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-100"
                                              >
                                                  Edit Pack
                                              </button>
                                              <button
                                                  onClick={(e) => {
                                                      e.stopPropagation();
                                                      handleArchivePack(pack.id);
                                                      setMenuOpen(false);
                                                  }}
                                                  className="block w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-100"
                                              >
                                                  {pack.status === 'archived' ? 'Unarchive' : 'Archive'}
                                              </button>
                                              <button
                                                  onClick={(e) => {
                                                      e.stopPropagation();
                                                      handleDuplicatePack(pack);
                                                      setMenuOpen(false);
                                                  }}
                                                  className="block w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-100"
                                              >
                                                  Duplicate
                                              </button>
                                          </div>
                                      </>
                                  )}
                              </div>
                          </div>

                          {/* Pricing */}
                          <div className="mb-3">
                              <div className="flex items-baseline gap-1">
                                  <span className="text-2xl font-bold text-gray-900">{formatCurrency(pack.price)}</span>
                                  <span className="text-xs text-gray-600">one-time</span>
                              </div>
                          </div>

                          {/* Details */}
                          <div className="space-y-1.5 text-xs mb-3">
                              <div>
                                  <div className="text-gray-600">Credits:</div>
                                  <div className="font-semibold text-gray-900">{formatNumber(pack.credits)}</div>
                              </div>
                              <div>
                                  <div className="text-gray-600">Expiration:</div>
                                  <div className="font-semibold text-gray-900">
                                      {pack.creditExpirationDays && pack.creditExpirationDays > 0
                                          ? `${pack.creditExpirationDays} days`
                                          : 'Never'}
                                  </div>
                              </div>
                              <div>
                                  <div className="text-gray-600">Purchased:</div>
                                  <div className="font-semibold text-gray-900">{pack.purchasedCount} times</div>
                              </div>
                          </div>
                      </div>
                  );
              })}
          </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <Card title="Service Add-Ons" icon={<PlusCircleIcon />} padding="p-0">
          <ul className="divide-y divide-gray-200/80">
            {addOns.map((addOn) => (
              <li key={addOn.id} className="px-6 py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-800">{addOn.name}</p>
                    <p className="text-sm text-gray-500">{addOn.pricing}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    addOn.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {addOn.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Integrations" icon={<PuzzleIcon />} padding="p-0">
          <ul className="divide-y divide-gray-200/80">
            {integrations.map((integration) => (
              <li key={integration.id} className="px-6 py-4 flex justify-between items-center">
                <p className="font-semibold text-gray-800">{integration.name}</p>
                <span className="text-sm text-green-600 font-medium">Active</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
      
      <Modal
          isOpen={isPlanModalOpen}
          onClose={handleClosePlanModal}
          title={editingPlan ? (editingPlan.id.startsWith('new-') ? 'Create New Subscription Tier' : `Edit ${editingPlan.name} Plan`) : ''}
      >
          {editingPlan && <PlanForm plan={editingPlan} onSave={handleSavePlan} onCancel={handleClosePlanModal} />}
      </Modal>

      <Modal
          isOpen={isPackModalOpen}
          onClose={handleClosePackModal}
          title={editingPack ? (editingPack.id.startsWith('new-pack-') ? 'Create New Credit Pack' : `Edit ${editingPack.name}`) : ''}
      >
          {editingPack && <CreditPackForm pack={editingPack} onSave={handleSavePack} onCancel={handleClosePackModal} />}
      </Modal>

    </div>
  );
};

export default Subscriptions;
