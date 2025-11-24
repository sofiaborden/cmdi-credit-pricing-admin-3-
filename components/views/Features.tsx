
import React, { useState, ChangeEvent, useMemo } from 'react';
import { features as mockFeatures, systemPricing } from '../../data/mockData';
import { Feature } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Toggle from '../ui/Toggle';
import Modal from '../ui/Modal';
import KpiCard from '../ui/KpiCard';
import { formatNumber, formatCurrency } from '../../utils/formatters';
import { SaveIcon, CreditsIcon, TotalRevenueIcon, CheckCircleIcon, UsersIcon, ArrowTrendingUpIcon } from '../ui/Icons';

const emptyFeature: Omit<Feature, 'id' | 'enabled' | 'usage'> = {
    name: '',
    description: '',
    creditCost: 0,
    costPerUnit: 0,
    category: 'Data Services',
};

interface FeatureFormProps {
    feature: Omit<Feature, 'id' | 'enabled' | 'usage'> | Feature;
    onSave: (feature: Omit<Feature, 'id' | 'enabled' | 'usage'> | Feature) => void;
    onCancel: () => void;
    categories: string[];
}

const FeatureForm: React.FC<FeatureFormProps> = ({ feature, onSave, onCancel, categories }) => {
    const [formData, setFormData] = useState(feature);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const numValue = Number(value);
        setFormData(prev => ({ ...prev, [name]: ['creditCost', 'costPerUnit'].includes(name) ? numValue : value }));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Display Name</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="creditCost" className="block text-sm font-medium text-gray-700">Credits / Unit</label>
                    <input type="number" name="creditCost" id="creditCost" value={formData.creditCost} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm" />
                </div>
                 <div>
                    <label htmlFor="costPerUnit" className="block text-sm font-medium text-gray-700">CMDI Cost / Unit ($)</label>
                    <input type="number" step="0.001" name="costPerUnit" id="costPerUnit" value={formData.costPerUnit} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                    <select name="category" id="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm">
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={3} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm" />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
                <Button type="submit"><SaveIcon /> Save Changes</Button>
            </div>
        </form>
    )
}


const Features: React.FC = () => {
    const [features, setFeatures] = useState<Feature[]>(mockFeatures);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    const summaryData = useMemo(() => {
        const totalCreditsUsed = features.reduce((acc, f) => acc + f.usage.currentMonthCredits, 0);
        const totalRevenue = totalCreditsUsed * systemPricing.creditPurchasePrice;
        
        const mostPopularFeature = features.length > 0 ? features.reduce((prev, current) => (prev.usage.clientsUsing > current.usage.clientsUsing) ? prev : current) : null;

        const highestRevenueFeature = features.length > 0 ? features.reduce((prev, current) => {
            const prevRevenue = prev.usage.currentMonthCredits * systemPricing.creditPurchasePrice;
            const currentRevenue = current.usage.currentMonthCredits * systemPricing.creditPurchasePrice;
            return prevRevenue > currentRevenue ? prev : current;
        }) : null;
        
        const emailVerificationFeature = features.find(f => f.id === 'ev');

        return { totalCreditsUsed, totalRevenue, mostPopularFeature, highestRevenueFeature, emailVerificationFeature };
    }, [features]);

    const uniqueCategories = useMemo(() => ['All', ...new Set(features.map(f => f.category))], [features]);

    const filteredFeatures = useMemo(() => {
        return features.filter(feature => {
            const matchesCategory = activeCategory === 'All' || feature.category === activeCategory;
            const matchesSearch = feature.name.toLowerCase().includes(searchTerm.toLowerCase()) || feature.description.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [features, searchTerm, activeCategory]);


    const handleToggle = (featureId: string) => {
        setFeatures(prevFeatures =>
            prevFeatures.map(f =>
                f.id === featureId ? { ...f, enabled: !f.enabled } : f
            )
        );
    };

    const handleOpenModal = (feature: Feature | null) => {
        setEditingFeature(feature);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingFeature(null);
    };

    const handleSaveFeature = (featureData: Omit<Feature, 'id' | 'enabled' | 'usage'> | Feature) => {
        if ('id' in featureData) { // Editing existing feature
            setFeatures(features.map(f => f.id === (featureData as Feature).id ? (featureData as Feature) : f));
        } else { // Adding new feature
            const newFeature: Feature = {
                ...(featureData as Omit<Feature, 'id' | 'enabled' | 'usage'>),
                id: `feat-${Date.now()}`,
                enabled: true,
                usage: { currentMonthCredits: 0, clientsUsing: 0 } // Default usage stats
            };
            setFeatures(prev => [...prev, newFeature]);
        }
        handleCloseModal();
    };

    const handleArchive = (featureId: string) => {
        if (window.confirm('Are you sure you want to archive this feature? This action cannot be undone.')) {
            setFeatures(features.filter(f => f.id !== featureId));
        }
    };
    
    return (
        <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <KpiCard
                    title="Total Feature Revenue"
                    value={formatCurrency(summaryData.totalRevenue)}
                    icon={<TotalRevenueIcon />}
                    subtext="Current Month"
                    variant="success"
                />
                <KpiCard
                    title="Most Popular Feature"
                    value={summaryData.mostPopularFeature?.name || 'N/A'}
                    icon={<UsersIcon />}
                    subtext={`${formatNumber(summaryData.mostPopularFeature?.usage.clientsUsing || 0)} clients`}
                    variant="warning"
                />
                <KpiCard
                    title="Highest Revenue Feature"
                    value={summaryData.highestRevenueFeature?.name || 'N/A'}
                    icon={<ArrowTrendingUpIcon />}
                    subtext={formatCurrency((summaryData.highestRevenueFeature?.usage.currentMonthCredits || 0) * systemPricing.creditPurchasePrice)}
                    variant="success"
                />
            </div>
            <Card padding="p-0">
                <div className="p-4 border-b border-gray-200/80">
                     <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                         <input
                            type="text"
                            placeholder="Search features..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full sm:w-72 rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm"
                        />
                         <Button onClick={() => handleOpenModal(null)}>Add New Feature</Button>
                    </div>
                </div>
                {/* Category Pills */}
                <div className="p-4 border-b border-gray-200/80">
                    <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                        {uniqueCategories.map(category => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                style={activeCategory === category ? { backgroundColor: '#DC2626', color: '#FFFFFF' } : undefined}
                                className={`px-4 py-1.5 text-sm font-semibold rounded-full flex-shrink-0 transition-colors duration-200 ${
                                    activeCategory === category
                                        ? 'shadow-md'
                                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gradient-to-r from-gray-50 to-white">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider w-1/3">Display Name</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Credit / Unit</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">CMDI Cost / Unit</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Est. Margin (Current Mth)</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Status</th>
                                <th scope="col" className="relative px-6 py-4">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                             {filteredFeatures.map((feature) => {
                                const revenue = feature.usage.currentMonthCredits * systemPricing.creditPurchasePrice;
                                const cost = (feature.creditCost > 0 ? (feature.usage.currentMonthCredits / feature.creditCost) : 0) * feature.costPerUnit;
                                const margin = revenue - cost;
                                return (
                                <tr key={feature.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-normal">
                                        <div className="text-sm font-semibold text-gray-900">{feature.name}</div>
                                        <div className="text-sm text-gray-600 mt-1">{feature.description}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-brand-50 text-brand-700">
                                            {feature.creditCost}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">{formatCurrency(feature.costPerUnit)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                                            margin >= 0
                                                ? 'bg-green-50 text-green-700'
                                                : 'bg-red-50 text-red-700'
                                        }`}>
                                            {formatCurrency(margin)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Toggle enabled={feature.enabled} onChange={() => handleToggle(feature.id)} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <Button variant="ghost" size="sm" onClick={() => handleOpenModal(feature)}>Edit</Button>
                                        <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => handleArchive(feature.id)}>Archive</Button>
                                    </td>
                                </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingFeature ? 'Edit Feature' : 'Add New Feature'}
            >
                <FeatureForm
                    feature={editingFeature || emptyFeature}
                    onSave={handleSaveFeature}
                    onCancel={handleCloseModal}
                    categories={uniqueCategories.filter(c => c !== 'All')}
                />
            </Modal>
        </div>
    );
};

export default Features;
