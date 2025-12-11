import React, { useState, useCallback } from 'react';
import { View, Client } from './types';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './components/views/Dashboard';
import Subscriptions from './components/views/Subscriptions';
import Features from './components/views/Features';
import Clients from './components/views/Clients';
import ClientDetail from './components/views/ClientDetail';
import Reports from './components/views/Reports';
import Settings from './components/views/Settings';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const handleNavigate = useCallback((view: View) => {
    setCurrentView(view);
    setSelectedClient(null);
  }, []);

  const handleViewClient = useCallback((client: Client) => {
    setSelectedClient(client);
    setCurrentView('client-detail');
  }, []);
  
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'subscriptions':
        return <Subscriptions />;
      case 'features':
        return <Features />;
      case 'clients':
        return <Clients onViewClient={handleViewClient} />;
      case 'client-detail':
        return selectedClient ? <ClientDetail client={selectedClient} onBack={() => handleNavigate('clients')} /> : <Clients onViewClient={handleViewClient} />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  const getTitleForView = (view: View): string => {
    if (view === 'client-detail' && selectedClient) {
      return `Client Details: ${selectedClient.clientName}`;
    }
    const titles: { [key in View]: string } = {
      'dashboard': 'Dashboard',
      'subscriptions': 'Subscription Tiers & Add-Ons',
      'features': 'Feature Credit Pricing',
      'clients': 'Client Billing Management',
      'client-detail': 'Client Details',
      'reports': 'Billing Dashboard',
      'settings': 'Settings',
    };
    return titles[view];
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 text-gray-900">
      <Sidebar currentView={currentView} onNavigate={handleNavigate} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {currentView !== 'client-detail' && currentView !== 'reports' && <Header title={getTitleForView(currentView)} />}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-br from-gray-50/50 via-white to-gray-50/50">
          <div className="container mx-auto px-8 py-8">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;