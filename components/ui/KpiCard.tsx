/**
 * Consistent KPI Card Component
 * Used across all views for metric display
 * 2025/2026 Design System
 */
import React from 'react';
import { motion } from 'framer-motion';

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  subtext?: string;
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'info';
  className?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  icon,
  subtext,
  variant = 'default',
  className = ''
}) => {
  // Use inline styles for gradient backgrounds to ensure visibility
  const variantGradients = {
    default: { backgroundImage: 'linear-gradient(to bottom right, #EF4444, #DC2626)' },
    success: { backgroundImage: 'linear-gradient(to bottom right, #10B981, #059669)' },
    danger: { backgroundImage: 'linear-gradient(to bottom right, #EF4444, #DC2626)' },
    warning: { backgroundImage: 'linear-gradient(to bottom right, #F59E0B, #EA580C)' },
    info: { backgroundImage: 'linear-gradient(to bottom right, #3B82F6, #2563EB)' }
  };

  const gradientStyle = variantGradients[variant];

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all ${className}`}
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2.5 sm:gap-3">
          {/* Left side - Text content */}
          <div className="flex-1 min-w-0">
            {/* Title - Allow wrapping to 2 lines */}
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 line-clamp-2 leading-tight">
              {title}
            </p>
            {/* Value - Responsive sizing, allow wrapping to 2 lines */}
            <p
              className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-0.5 line-clamp-2 leading-tight break-words"
              title={String(value)}
            >
              {value}
            </p>
            {/* Subtext - Single line truncate (less critical) */}
            {subtext && (
              <p className="text-xs text-gray-600 truncate" title={subtext}>
                {subtext}
              </p>
            )}
          </div>

          {/* Right side - Icon */}
          <div className="flex-shrink-0">
            <div
              style={gradientStyle}
              className="rounded-lg p-2 sm:p-2.5 shadow-sm"
            >
              <div className="text-white w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                {icon}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default KpiCard;

