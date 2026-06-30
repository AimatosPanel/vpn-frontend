import React from 'react';

export default function Modal({ modalData, onClose, onCopy }) {
  if (!modalData) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#1D1B20] rounded-[28px] max-w-lg w-full p-6 space-y-5 shadow-2xl border border-[#2B2930] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-[#A3CFB1]">🎉 Клиент успешно создан!</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-200 text-xl">&times;</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase text-[#CAC4D0] mb-1 font-bold">Имя пользователя</label>
            <div className="bg-[#211F26] rounded-[16px] px-4 py-2.5 text-xs font-mono text-[#D0BCFF]">{modalData.name}</div>
          </div>

          {[
            { label: 'VLESS Reality (TCP)', link: modalData.vless_link },
            { label: 'Hysteria 2', link: modalData.hysteria_link },
            { label: 'NaiveProxy (TLS)', link: modalData.naive_tls_link }
          ].map((item, idx) => item.link && (
            <div key={idx} className="space-y-1">
              <label className="block text-[10px] uppercase text-[#CAC4D0] font-bold">{item.label}</label>
              <div className="flex space-x-2">
                <input type="text" readOnly value={item.link} className="w-full bg-[#211F26] rounded-[16px] px-3 py-2 text-[10px] font-mono text-[#E6E1E5] focus:outline-none"/>
                <button onClick={() => onCopy(item.link)} className="bg-[#4A4458] hover:bg-[#625B71] text-[#E8DEF8] px-3.5 rounded-full text-[10px] font-bold transition">Копировать</button>
              </div>
            </div>
          ))}
        </div>

        <button onClick={onClose} className="w-full bg-[#D0BCFF] text-[#381E72] py-3 rounded-full text-xs font-bold transition">
          Закрыть
        </button>
      </div>
    </div>
  );
}