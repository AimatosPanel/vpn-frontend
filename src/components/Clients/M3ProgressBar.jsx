import React from 'react';

export default function M3ProgressBar({ value = 0, isOverlimit = false, isExpired = false }) {
  const totalSegments = 12;
  const activeCount = Math.min(Math.round((value / 100) * totalSegments), totalSegments);
  const getActiveColorClass = () => {
    if (isOverlimit || isExpired) return 'bg-[#F2B8B5]'; 
    if (value >= 80) return 'bg-[#FFE082]'; 
    return 'bg-[#D0BCFF]'; 
  };

  return (
    <div 
      className="flex items-center space-x-[3px] py-1 select-none" 
      title={`Использовано: ${value.toFixed(1)}%`}
    >
      {Array.from({ length: totalSegments }).map((_, idx) => {
        const isActive = idx < activeCount;
        return (
          <div
            key={idx}
            className={`h-[4px] w-full rounded-[2px] transition-all duration-300 ${
              isActive ? getActiveColorClass() : 'bg-[#2B2930]'
            }`}
          />
        );
      })}
    </div>
  );
}