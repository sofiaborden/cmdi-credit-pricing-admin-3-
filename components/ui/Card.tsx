/**
 * Modern Card Component with enhanced shadows and animations
 * 2025/2026 Design System - Reduced gray, better contrast
 */
import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  padding?: 'p-0' | 'p-2' | 'p-4' | 'p-5' | 'p-6';
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  icon,
  actions,
  padding = 'p-0',
  hover = false
}) => {
  const hasHeader = title || icon || actions;

  const cardContent = (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 transition-all duration-200 ${hover ? 'hover:shadow-md hover:border-brand-200' : ''} ${className}`}>
      {hasHeader && (
        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-3">
            {icon && (
              <div
                className="rounded-lg p-2 shadow-sm"
                style={{ backgroundImage: 'linear-gradient(to bottom right, #EF4444, #DC2626)' }}
              >
                <span className="text-white w-4 h-4 flex items-center justify-center">{icon}</span>
              </div>
            )}
            {title && <h3 className="text-base font-bold text-gray-900 truncate">{title}</h3>}
          </div>
          {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
        </div>
      )}
      <div className={padding}>
        {children}
      </div>
    </div>
  );

  if (hover) {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {cardContent}
      </motion.div>
    );
  }

  return cardContent;
};

export default Card;
