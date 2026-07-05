import React from 'react';

export default function PageContainer({ title, subtitle, icon, action, children }) {
  return (
    <main className="max-w-6xl mx-auto px-4 pt-4 pb-28 md:py-8 animate-in fade-in duration-300 relative">
      {}
      <div className="mb-6 md:mb-8 bg-[#1D1B20]/60 border border-[#2B2930]/60 rounded-[24px] sm:rounded-[28px] p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-md shadow-sm">
        <div className="flex items-center space-x-3.5 min-w-0">
          {icon && (
            <div className="p-3 bg-[#381E72]/50 text-[#D0BCFF] rounded-2xl shrink-0 border border-[#D0BCFF]/10 shadow-inner flex items-center justify-center">
              {icon}
            </div>
          )}
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg md:text-xl font-black text-white tracking-wide uppercase truncate select-none">
              {title}
            </h2>
            {subtitle && (
              <p className="text-[9px] sm:text-[10px] md:text-xs text-[#CAC4D0] tracking-wider uppercase font-semibold mt-1 truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {}
        {action && (
          <div className="hidden sm:flex items-center justify-end shrink-0 w-auto">
            {action}
          </div>
        )}
      </div>

      {}
      <div className="w-full">
        {children}
      </div>
    </main>
  );
}