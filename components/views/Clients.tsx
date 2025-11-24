
import React, { useMemo, useState } from 'react';
import { clients, subscriptionPlans } from '../../data/mockData';
import { Client, ClientStatus } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Dropdown from '../ui/Dropdown';
import { formatNumber, formatCurrency } from '../../utils/formatters';
import { ChevronUp, ChevronDown } from 'lucide-react';

type SortField = 'clientName' | 'status' | 'plan' | 'creditsUsed' | 'creditsRemaining' | 'currentBill' | 'lastBill';
type SortDirection = 'asc' | 'desc' | null;

interface ClientsProps {
  onViewClient: (client: Client) => void;
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


const Clients: React.FC<ClientsProps> = ({ onViewClient }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedClientType, setSelectedClientType] = useState('All');
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const planOptions = useMemo(() => [
    { value: 'All', label: 'All Plans' },
    ...subscriptionPlans.map(p => ({ value: p.name, label: p.name }))
  ], []);

  const statusOptions = useMemo(() => [
    { value: 'All', label: 'All Statuses' },
    { value: 'Active', label: 'Active' },
    { value: 'Trial', label: 'Trial' },
    { value: 'Past Due', label: 'Past Due' },
    { value: 'Canceled', label: 'Canceled' },
  ], []);
  
  const clientTypeOptions = useMemo(() => [
    { value: 'All', label: 'All Client Types' },
    ...[...new Set(clients.map(c => c.clientType))].map(type => ({ value: type, label: type }))
  ], []);


  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Cycle through: asc -> desc -> null
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortField(null);
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedClients = useMemo(() => {
    // First filter
    let result = clients.filter(client => {
      const matchesSearch = client.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            client.dbName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedClientType === 'All' || client.clientType === selectedClientType;
      const matchesPlan = selectedPlan === 'All' || client.subscriptionTier === selectedPlan;
      const matchesStatus = selectedStatus === 'All' || client.status === selectedStatus;

      return matchesSearch && matchesType && matchesPlan && matchesStatus;
    });

    // Then sort
    if (sortField && sortDirection) {
      result = [...result].sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sortField) {
          case 'clientName':
            aValue = a.clientName.toLowerCase();
            bValue = b.clientName.toLowerCase();
            break;
          case 'status':
            aValue = a.status;
            bValue = b.status;
            break;
          case 'plan':
            aValue = a.subscriptionTier;
            bValue = b.subscriptionTier;
            break;
          case 'creditsUsed':
            aValue = a.currentMonthUsage.totalCreditsUsed;
            bValue = b.currentMonthUsage.totalCreditsUsed;
            break;
          case 'creditsRemaining':
            // CRITICAL FIX: Calculate total available credits (monthly + rollover + add-on)
            aValue = a.creditBalance.monthly + a.creditBalance.rollover + a.creditBalance.addOn;
            bValue = b.creditBalance.monthly + b.creditBalance.rollover + b.creditBalance.addOn;
            break;
          case 'currentBill':
            aValue = a.currentMonthUsage.totalBill;
            bValue = b.lastMonthUsage.totalBill;
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [searchTerm, selectedClientType, selectedPlan, selectedStatus, sortField, sortDirection]);

  const totalBill = useMemo(() => {
    return filteredAndSortedClients.reduce((acc, client) => {
        return acc + (client.currentMonthUsage?.totalBill || 0);
    }, 0);
  }, [filteredAndSortedClients]);

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <th
      scope="col"
      className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1.5">
        <span>{children}</span>
        <div className="flex flex-col">
          {sortField === field && sortDirection === 'asc' && (
            <ChevronUp className="w-4 h-4 text-brand-600" />
          )}
          {sortField === field && sortDirection === 'desc' && (
            <ChevronDown className="w-4 h-4 text-brand-600" />
          )}
          {sortField !== field && (
            <div className="w-4 h-4 opacity-30">
              <ChevronUp className="w-4 h-4 text-gray-400" />
            </div>
          )}
        </div>
      </div>
    </th>
  );

  return (
    <div className="space-y-6">
        {/* KPI Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card padding="p-5">
                 <h4 className="text-sm font-medium text-gray-500 line-clamp-2">Total Bill (Current Month)</h4>
                 <p className="mt-1 text-2xl sm:text-3xl font-bold text-green-600 break-words">{formatCurrency(totalBill)}</p>
                 <p className="text-sm text-gray-500 truncate">Based on active filters</p>
            </Card>
             <Card padding="p-5">
                 <h4 className="text-sm font-medium text-gray-500 line-clamp-2">Clients Shown</h4>
                 <p className="mt-1 text-2xl sm:text-3xl font-bold text-gray-800 break-words">{formatNumber(filteredAndSortedClients.length)}</p>
                 <p className="text-sm text-gray-500 truncate">of {formatNumber(clients.length)} total clients</p>
            </Card>
        </div>

        <Card padding="p-0">
          <div className="p-4 border-b border-gray-200/80">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
                <div className="sm:col-span-2 lg:col-span-1">
                     <input
                        type="text"
                        placeholder="Search by client or DB name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm"
                    />
                </div>
                <Dropdown options={planOptions} value={selectedPlan} onChange={setSelectedPlan} placeholder="All Plans" />
                <Dropdown options={statusOptions} value={selectedStatus} onChange={setSelectedStatus} placeholder="All Statuses" />
                <Dropdown options={clientTypeOptions} value={selectedClientType} onChange={setSelectedClientType} placeholder="All Client Types" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-white">
                <tr>
                  <SortableHeader field="clientName">Client Name</SortableHeader>
                  <SortableHeader field="status">Status</SortableHeader>
                  <SortableHeader field="plan">Plan</SortableHeader>
                  <SortableHeader field="creditsUsed">Credits Used</SortableHeader>
                  <SortableHeader field="creditsRemaining">Credits Remaining</SortableHeader>
                  <SortableHeader field="currentBill">Current Bill</SortableHeader>
                  <th scope="col" className="relative px-6 py-4">
                    <span className="sr-only">View</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredAndSortedClients.map((client) => {
                  const plan = subscriptionPlans.find(p => p.name === client.subscriptionTier);
                  // CRITICAL FIX: Calculate total available credits (monthly + rollover + add-on)
                  const creditsRemaining = client.creditBalance.monthly +
                                          client.creditBalance.rollover +
                                          client.creditBalance.addOn;

                  // Color coding based on liability thresholds
                  const colorClass = creditsRemaining > 100000 ? 'text-red-600 font-bold' :
                                    creditsRemaining > 50000 ? 'text-orange-600 font-semibold' :
                                    'text-gray-700 font-medium';

                  return (
                    <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">{client.clientName}</div>
                          <div className="text-sm text-gray-600">{client.dbName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <StatusBadge status={client.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-brand-50 text-brand-700">
                          {client.subscriptionTier}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">{formatNumber(client.currentMonthUsage.totalCreditsUsed)}</td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${colorClass}`}>{formatNumber(creditsRemaining)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{formatCurrency(client.currentMonthUsage.totalBill)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button variant="primary" size="sm" onClick={() => onViewClient(client)}>View Details</Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredAndSortedClients.length === 0 && (
                <div className="text-center py-12">
                    <h3 className="text-lg font-medium text-gray-800">No Clients Found</h3>
                    <p className="text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
                </div>
            )}
          </div>
        </Card>
    </div>
  );
};

export default Clients;
