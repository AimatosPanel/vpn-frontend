import React, { useState, useEffect } from 'react';

export default function CountryFlag({ code, className = "w-10 h-7.5 rounded-lg border border-[#2B2930] shadow-sm" }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const flagCode = (code || '').toLowerCase().trim();
  const hasValidFlag = flagCode.length === 2;
  const flagUrl = hasValidFlag 
    ? `https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/4.1.5/flags/4x3/${flagCode}.svg` 
    : null;

  useEffect(() => {
    setLoaded(false);
    setError(false);
  }, [code]);

  return (
    <div className={`relative bg-[#211F26] flex items-center justify-center shrink-0 overflow-hidden select-none ${className}`}>
      {}
      <span className="text-[70%] leading-none absolute">🌐</span>

      {flagUrl && !error && (
        <img 
          src={flagUrl} 
          alt={flagCode.toUpperCase()} 
          className={`w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-250 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}
    </div>
  );
}