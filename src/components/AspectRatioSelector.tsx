import React from 'react';
import { AspectRatio } from '../types';
import { ASPECT_RATIOS } from '../constants';

interface AspectRatioSelectorProps {
  selected: AspectRatio;
  onSelect: (ratio: AspectRatio) => void;
  className?: string;
}

export const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({
  selected,
  onSelect,
  className = ''
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        Aspect Ratio
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {Object.entries(ASPECT_RATIOS).map(([key, config]) => (
          <button
            key={key}
            onClick={() => onSelect(key as AspectRatio)}
            className={`
              relative p-3 rounded-lg border-2 transition-all duration-200
              ${selected === key
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }
            `}
          >
            <div className="text-center">
              <div className="text-sm font-medium">{config.label}</div>
              <div className="text-xs text-gray-500 mt-1">{config.ratio}</div>
              <div 
                className={`
                  mx-auto mt-2 border-2 rounded
                  ${selected === key ? 'border-blue-400' : 'border-gray-300'}
                `}
                style={{
                  width: '24px',
                  height: `${(config.height / config.width) * 24}px`,
                  maxHeight: '24px'
                }}
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};