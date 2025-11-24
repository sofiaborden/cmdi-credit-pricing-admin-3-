/**
 * Modern Toggle Component with enhanced visibility
 * Clear active/inactive states with strong visual contrast
 */
import React from 'react';
import { motion } from 'framer-motion';

interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label?: string;
}

const Toggle: React.FC<ToggleProps> = ({ enabled, onChange, label }) => {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        style={enabled ? { backgroundColor: '#DC2626' } : undefined}
        className={`${
          enabled
            ? 'shadow-md'
            : 'bg-gray-300 hover:bg-gray-400'
        } relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2`}
        role="switch"
        aria-checked={enabled}
        aria-label={label}
        onClick={() => onChange(!enabled)}
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          aria-hidden="true"
          className={`${
            enabled ? 'translate-x-5' : 'translate-x-0'
          } pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
        />
      </button>
      {label && (
        <span className={`text-sm font-medium ${enabled ? 'text-gray-900' : 'text-gray-500'}`}>
          {label}
        </span>
      )}
    </div>
  );
};

export default Toggle;
