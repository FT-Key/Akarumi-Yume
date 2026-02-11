'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';

const STEPS = [
  { num: 1, label: 'Dirección' },
  { num: 2, label: 'Resumen' },
  { num: 3, label: 'Pago' }
];

const ProgressSteps = ({ currentStep }) => {
  return (
    <div className="flex justify-center mb-12">
      <div className="flex items-center gap-4">
        {STEPS.map((step, idx) => (
          <React.Fragment key={step.num}>
            <div className="flex items-center gap-2">
              {/* Círculo con número */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                  currentStep >= step.num
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white scale-110'
                    : 'bg-white/10 text-gray-500'
                }`}
              >
                {step.num}
              </div>

              {/* Label del paso */}
              <span 
                className={`text-sm font-medium transition-colors duration-300 ${
                  currentStep >= step.num ? 'text-white' : 'text-gray-500'
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Separador chevron */}
            {idx < STEPS.length - 1 && (
              <ChevronRight 
                className={`transition-colors duration-300 ${
                  currentStep > step.num ? 'text-purple-400' : 'text-gray-600'
                }`}
                size={20} 
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProgressSteps;