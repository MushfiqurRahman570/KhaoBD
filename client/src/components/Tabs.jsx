import React from 'react';

export default function Tabs({ tabs, active, onChange }) {
  return (
    <div className="border-b sticky top-16 bg-white z-10">
      <div className="max-w-5xl mx-auto px-4 flex gap-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              active === tab.key
                ? 'border-brand-500 text-brand-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            {tab.label}
            {typeof tab.count === 'number' && (
              <span className="ml-1 text-xs text-gray-400">
                (
                {tab.count}
                )
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
