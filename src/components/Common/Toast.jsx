import React, { useEffect } from 'react';

export default function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center space-x-3 px-5 py-3.5 rounded-2xl border shadow-2xl animate-in slide-in-from-bottom-5 duration-200 ${
      type === 'error' 
        ? 'bg-[#2C1A1D] border-[#F2B8B5] text-[#F2B8B5]' 
        : 'bg-[#1C2C1E] border-[#A3CFB1] text-[#A3CFB1]'
    }`}>
      <span>{type === 'error' ? '⚠️' : '✨'}</span>
      <span className="text-xs font-bold tracking-wide">{message}</span>
      <button onClick={onClose} className="text-sm opacity-50 hover:opacity-100 pl-2">&times;</button>
    </div>
  );
}