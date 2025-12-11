/**
 * Modern Sidebar Navigation with enhanced active states
 * Clear visual hierarchy and improved selection indicators
 * Collapsible sidebar with icon-only mode
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { View } from '../../types';
import { DashboardIcon, SubscriptionIcon, FeaturesIcon, ClientsIcon, ReportsIcon, SettingsIcon } from '../ui/Icons';

interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

// Modern hamburger menu icon that transforms based on state
const MenuIcon: React.FC<{ isCollapsed: boolean }> = ({ isCollapsed }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-5 h-5 transition-transform duration-300"
  >
    {isCollapsed ? (
      // Hamburger icon (three lines) when collapsed
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
      </>
    ) : (
      // Double chevron left when expanded (indicates collapse action)
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
      </>
    )}
  </svg>
);

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  // Load collapsed state from localStorage or default to false
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });

  // Save collapsed state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  const navItems = [
    { view: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
    { view: 'subscriptions', label: 'Subscriptions', icon: SubscriptionIcon },
    { view: 'features', label: 'Features', icon: FeaturesIcon },
    { view: 'clients', label: 'Clients', icon: ClientsIcon },
    { view: 'reports', label: 'Reports', icon: ReportsIcon },
    { view: 'settings', label: 'Settings', icon: SettingsIcon },
  ] as const;

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? '80px' : '256px' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="flex-shrink-0 bg-white border-r border-gray-200 flex flex-col no-print relative"
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between border-b border-gray-100" style={{ paddingLeft: isCollapsed ? '1.25rem' : '1.5rem', paddingRight: isCollapsed ? '1.25rem' : '1.5rem' }}>
        <div className="flex items-center gap-2 overflow-hidden">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0"
            style={{ backgroundImage: 'linear-gradient(to bottom right, #DC2626, #EF4444)' }}
          >
            <span className="text-white font-bold text-sm">CM</span>
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.h1
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="text-lg font-bold text-gray-900 whitespace-nowrap"
              >
                CMDI Admin
              </motion.h1>
            )}
          </AnimatePresence>
        </div>

        {/* Modern hamburger menu toggle button */}
        <motion.button
          onClick={toggleCollapse}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-shrink-0 p-1.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <MenuIcon isCollapsed={isCollapsed} />
        </motion.button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {navItems.map((item) => {
          const isActive = currentView === item.view || (item.view === 'clients' && currentView === 'client-detail');
          return (
            <div key={item.view} className="relative group/nav">
              <motion.a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(item.view);
                }}
                whileHover={{ x: isActive ? 0 : 2 }}
                whileTap={{ scale: 0.98 }}
                style={isActive ? {
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF'
                } : undefined}
                className={`relative flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {/* Icon */}
                <span
                  className="flex-shrink-0 flex items-center justify-center transition-transform group-hover:scale-105"
                  style={isActive ? { color: '#FFFFFF' } : undefined}
                >
                  <item.icon size={20} />
                </span>

                {/* Label */}
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`flex-1 whitespace-nowrap ${isActive ? 'font-semibold' : ''}`}
                      style={isActive ? { color: '#FFFFFF' } : undefined}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Active indicator dot */}
                {isActive && !isCollapsed && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: '#FFFFFF' }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.a>

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover/nav:opacity-100 pointer-events-none transition-opacity duration-200 z-50">
                  {item.label}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </motion.div>
  );
};

export default Sidebar;
