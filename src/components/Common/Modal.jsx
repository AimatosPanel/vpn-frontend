import React, { useState, useEffect } from 'react';

export default function Modal({ modalData, onClose, onCopy }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (modalData) {
      const timer = setTimeout(() => setIsOpen(true), 50);
      return () => clearTimeout(timer);
    } else {
      setIsOpen(false);
    }
  }, [modalData]);

  if (!modalData) return null;

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onClose, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      {}
      <div 
        onClick={handleClose}
        className={`absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300 ease-out ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {}
      <div 
        className={`relative bg-[#1D1B20]/95 border border-[#2B2930] w-full max-h-[92vh] md:max-h-[85vh] overflow-y-auto flex flex-col p-6 shadow-2xl transition-all duration-300 ease-[cubic-bezier(0.32,0.94,0.6,1)] rounded-t-[28px] rounded-b-none md:rounded-[28px] md:max-w-lg md:w-full pb-safe z-10 ${
          isOpen 
            ? 'translate-y-0 opacity-100 scale-100' 
            : 'translate-y-full opacity-0 md:translate-y-0 md:opacity-0 md:scale-95'
        }`}
      >
        {}
        <div className="md:hidden w-12 h-1.5 bg-[#8F8B97]/30 rounded-full mx-auto mb-3 mt-1 flex-shrink-0" />

        <div className="flex justify-between items-center pb-3 border-b border-[#2B2930]/40">
          <h3 className="text-sm font-semibold text-[#A3CFB1]">🎉 Клиент успешно создан!</h3>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-200 text-2xl transition-all outline-none cursor-pointer">&times;</button>
        </div>

        <div className="space-y-4 mt-4 text-xs">
          <div>
            <label className="block text-[10px] uppercase text-[#CAC4D0] mb-1.5 font-semibold tracking-wider">Имя пользователя</label>
            <div className="bg-[#211F26] rounded-[16px] px-4 py-3 text-xs font-mono text-[#D0BCFF] border border-[#2B2930]/60 select-all">{modalData.name}</div>
          </div>

          {[
            { label: 'VLESS Reality (TCP)', link: modalData.vless_link },
            { label: 'Hysteria 2', link: modalData.hysteria_link },
            { label: 'NaiveProxy (TLS)', link: modalData.naive_tls_link }
          ].map((item, idx) => item.link && (
            <div key={idx} className="space-y-1.5">
              <label className="block text-[10px] uppercase text-[#CAC4D0] font-semibold tracking-wider">{item.label}</label>
              <div className="flex space-x-2">
                <input type="text" readOnly value={item.link} className="w-full bg-[#211F26] border border-[#2B2930]/60 rounded-[16px] px-3.5 py-2.5 text-[10px] font-mono text-[#E6E1E5] focus:outline-none select-all"/>
                <button onClick={() => onCopy(item.link)} className="bg-[#4A4458] hover:bg-[#625B71] active:scale-95 text-[#E8DEF8] px-4 rounded-xl text-[10px] font-semibold transition-all duration-200 shrink-0 cursor-pointer">Копировать</button>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 mt-2 border-t border-[#2B2930]/40">
          <button onClick={handleClose} className="w-full bg-[#D0BCFF] hover:bg-[#CCC2DC] text-[#381E72] active:scale-95 py-3.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer">
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}