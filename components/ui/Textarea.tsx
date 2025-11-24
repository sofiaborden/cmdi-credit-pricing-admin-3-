/**
 * Modern Textarea Component with better contrast and styling
 * 2025/2026 Design System
 */
import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Textarea: React.FC<TextareaProps> = ({ 
  label, 
  error, 
  helperText, 
  className = '', 
  id,
  ...props 
}) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={textareaId} 
          className="block text-sm font-semibold text-gray-900 mb-2"
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={`
          block w-full px-4 py-2.5 
          text-gray-900 placeholder-gray-400
          bg-white border-2 border-gray-200
          rounded-lg shadow-sm
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500
          hover:border-gray-300
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          resize-vertical
          ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm text-red-600 font-medium">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-gray-600">{helperText}</p>
      )}
    </div>
  );
};

export default Textarea;

