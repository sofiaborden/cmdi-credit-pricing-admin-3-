/**
 * Modern Input Component with better contrast and styling
 * 2025/2026 Design System
 */
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  helperText, 
  className = '', 
  id,
  ...props 
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-sm font-semibold text-gray-900 mb-2"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          block w-full px-4 py-2.5 
          text-gray-900 placeholder-gray-400
          bg-white border-2 border-gray-200
          rounded-lg shadow-sm
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500
          hover:border-gray-300
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
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

export default Input;

