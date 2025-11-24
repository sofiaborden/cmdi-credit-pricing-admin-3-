import React, { useState } from 'react';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  rightContent?: React.ReactNode;
  defaultOpen?: boolean;
}

const Accordion: React.FC<AccordionProps> = ({ title, children, rightContent, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 rounded-lg">
      <div 
        className="flex justify-between items-center p-4 cursor-pointer bg-gray-50 hover:bg-gray-100"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
            <h3 className="text-md font-semibold text-gray-800 ml-2">{title}</h3>
        </div>
        <div>
            {rightContent}
        </div>
      </div>
      {isOpen && (
        <div className="bg-white">
          {children}
        </div>
      )}
    </div>
  );
};

export default Accordion;
