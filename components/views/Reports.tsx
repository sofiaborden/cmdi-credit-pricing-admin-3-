
import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Dropdown from '../ui/Dropdown';
import {
    ExportIcon,
    RefreshIcon,
    ScheduleIcon,
    GenerateReportIcon,
    FileTextIcon,
    TotalRevenueIcon,
    UsersIcon,
    ChartBarIcon,
    CalendarIcon,
    InfoIcon
} from '../ui/Icons';


const Tab = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${active ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-600 hover:bg-gray-200/50'}`}
    >
        {label}
    </button>
);

const ReportTypeCard = ({ icon, title, description, selected, onClick }: { icon: React.ReactNode, title: string, description: string, selected: boolean, onClick: () => void }) => (
    <div
        onClick={onClick}
        className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${selected ? 'bg-brand-light border-brand-primary shadow-lg' : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'}`}
    >
        <div className="flex items-start space-x-4">
            <div className={`flex-shrink-0 p-2 rounded-lg ${selected ? 'text-brand-primary' : 'text-gray-500'}`}>{icon}</div>
            <div>
                <h4 className="font-bold text-gray-800">{title}</h4>
                <p className="mt-1 text-sm text-gray-500">{description}</p>
            </div>
        </div>
    </div>
);

const FilterCheckbox = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: (checked: boolean) => void }) => (
    <label className="flex items-center space-x-3 cursor-pointer">
        <input type="checkbox" className="sr-only peer" checked={checked} onChange={e => onChange(e.target.checked)} />
        <span className="w-5 h-5 rounded border-2 border-gray-300 peer-checked:bg-brand-primary peer-checked:border-brand-primary flex items-center justify-center transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4} style={{ opacity: checked ? 1 : 0 }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
        </span>
        <span className="text-sm font-medium text-gray-700">{label}</span>
    </label>
);


const Reports: React.FC = () => {
    const [activeMainTab, setActiveMainTab] = useState('Reports');
    const [selectedReport, setSelectedReport] = useState('subscription-summary');
    const [exportFormat, setExportFormat] = useState('csv');
    const [filters, setFilters] = useState({
        active: true,
        trial: true,
        canceled: false,
        pastDue: true,
    });

    const handleFilterChange = (filterName: keyof typeof filters) => {
        setFilters(prev => ({ ...prev, [filterName]: !prev[filterName] }));
    };

    const exportOptions = [
        { value: 'csv', label: 'CSV' },
        { value: 'xlsx', label: 'Excel (XLSX)' },
        { value: 'pdf', label: 'PDF' },
        { value: 'json', label: 'JSON' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Billing Dashboard</h2>
                    <p className="mt-1 text-gray-500">Manage subscriptions and billing across all brands</p>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                    <Button variant="secondary" size="md"><ExportIcon />Export Data</Button>
                    <Button variant="primary" size="md" className="bg-gray-800 hover:bg-gray-900 focus:ring-gray-700"><RefreshIcon />Refresh</Button>
                </div>
            </div>

            <div className="border-b border-gray-200">
                <div className="flex items-center space-x-2">
                    <Tab label="Subscriptions" active={activeMainTab === 'Subscriptions'} onClick={() => setActiveMainTab('Subscriptions')} />
                    <Tab label="Analytics" active={activeMainTab === 'Analytics'} onClick={() => setActiveMainTab('Analytics')} />
                    <Tab label="Reports" active={activeMainTab === 'Reports'} onClick={() => setActiveMainTab('Reports')} />
                </div>
            </div>

            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">Billing Reports & Exports</h3>
                <div className="flex items-center space-x-2">
                    <Button variant="secondary"><ScheduleIcon />Schedule Report</Button>
                    <Button className="bg-gray-800 hover:bg-gray-900 focus:ring-gray-700"><GenerateReportIcon />Generate Report</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-8">
                    <Card title="Report Type" padding="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ReportTypeCard icon={<FileTextIcon size="large" />} title="Subscription Summary" description="Overview of all subscriptions with status, plan, and revenue data" selected={selectedReport === 'subscription-summary'} onClick={() => setSelectedReport('subscription-summary')} />
                            <ReportTypeCard icon={<TotalRevenueIcon size="large" />} title="Revenue Report" description="Detailed revenue breakdown by time period and plan" selected={selectedReport === 'revenue-report'} onClick={() => setSelectedReport('revenue-report')} />
                            <ReportTypeCard icon={<UsersIcon size="large" />} title="User Activity Report" description="User engagement and usage statistics across brands" selected={selectedReport === 'user-activity'} onClick={() => setSelectedReport('user-activity')} />
                            <ReportTypeCard icon={<ChartBarIcon size="large" />} title="Credit Usage Report" description="Credit consumption patterns and trends" selected={selectedReport === 'credit-usage'} onClick={() => setSelectedReport('credit-usage')} />
                        </div>
                    </Card>

                    <Card title="Date Range" padding="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                <div className="relative mt-1">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        id="start-date"
                                        placeholder="Pick a date"
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm pl-10"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                <div className="relative mt-1">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        id="end-date"
                                        placeholder="Pick a date"
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm pl-10"
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card title="Filters" padding="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FilterCheckbox label="Active Subscriptions" checked={filters.active} onChange={() => handleFilterChange('active')} />
                            <FilterCheckbox label="Trial Subscriptions" checked={filters.trial} onChange={() => handleFilterChange('trial')} />
                            <FilterCheckbox label="Canceled Subscriptions" checked={filters.canceled} onChange={() => handleFilterChange('canceled')} />
                            <FilterCheckbox label="Past Due Subscriptions" checked={filters.pastDue} onChange={() => handleFilterChange('pastDue')} />
                        </div>
                    </Card>
                </div>

                <div className="space-y-8">
                    <Card title="Export Format" padding="p-6">
                        <Dropdown options={exportOptions} value={exportFormat} onChange={setExportFormat} placeholder="Select format" />
                    </Card>

                    <Card title="Quick Reports" padding="p-4">
                        <div className="space-y-1">
                            <a href="#" className="flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors">
                                <FileTextIcon className="text-gray-500"/>
                                <span className="ml-3 text-sm font-medium text-gray-700">Last 30 Days Summary</span>
                            </a>
                            <a href="#" className="flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors">
                                <TotalRevenueIcon className="text-gray-500" />
                                <span className="ml-3 text-sm font-medium text-gray-700">Monthly Revenue</span>
                            </a>
                             <a href="#" className="flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors">
                                <ChartBarIcon className="text-gray-500" />
                                <span className="ml-3 text-sm font-medium text-gray-700">Weekly Credit Usage</span>
                            </a>
                        </div>
                    </Card>

                    <Card title="Report Information" icon={<InfoIcon />} padding="p-5" className="bg-gray-50/70">
                        <ul className="space-y-2 text-sm text-gray-600 list-disc list-inside">
                            <li>Reports are generated in real-time</li>
                            <li>Large reports may take a few minutes</li>
                            <li>Scheduled reports are sent via email</li>
                            <li>Data is filtered based on user permissions</li>
                        </ul>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Reports;
