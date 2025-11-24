/**
 * Modern Header Component with enhanced visual design
 * Better contrast and modern styling
 */
import React from 'react';
import { RefreshCw } from 'lucide-react';
import Button from '../ui/Button';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="h-16 bg-gradient-to-r from-white to-gray-50 border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0 shadow-sm">
      <div className="flex items-center">
        <div className="w-1 h-8 bg-gradient-to-b from-brand-500 to-brand-600 rounded-full mr-4"></div>
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      </div>
      <div>
         <Button variant="secondary" size="md" onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4" />
            <span className="ml-2">Refresh</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;