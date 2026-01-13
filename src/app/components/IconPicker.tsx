// src/components/dashboard/IconPicker.tsx
'use client';

import { useState } from 'react';
import { ServiceIcon, availableIcons } from './ServiceIcon';

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Service Icon
      </label>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 p-3 border rounded-lg bg-white hover:bg-gray-50"
      >
        <ServiceIcon name={value || 'star'} size={24} />
        <span className="capitalize">{value || 'Select an icon'}</span>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-white border rounded-lg shadow-lg p-4 grid grid-cols-4 gap-2">
          {availableIcons.map((iconName) => (
            <button
              key={iconName}
              type="button"
              onClick={() => {
                onChange(iconName);
                setIsOpen(false);
              }}
              className={`p-3 rounded-lg flex flex-col items-center gap-1 hover:bg-gray-100 ${
                value === iconName ? 'bg-blue-100 ring-2 ring-blue-500' : ''
              }`}
            >
              <ServiceIcon name={iconName} size={24} />
              <span className="text-xs capitalize">{iconName}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}