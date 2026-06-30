import React, { useState } from 'react';
import FormatService from '../../services/FormatService';

export default function ClientCard({ user, onToggle, onDelete, onCopy, isSelected, onSelectToggle }) {
  const [showKeys, setShowKeys] = useState(false);
  const [qrCodeLink, setQrCodeLink] = useState(null);

  const isExpired = user.expires_at && new Date(user.expires_at) < new Date();
  const limitBytes = user.traffic_limit_gb * 1073741824;
  const isOverlimit = user.traffic_limit_gb > 0 && user.traffic_used_bytes >= limitBytes;
  const isSuspended = !user.is_active;

  const getStatus = () => {
    if (isSuspended) return { label: 'Приостановлен', style: 'bg-gray-800 text-gray-400 border border-gray-700' };
    if (isExpired) return { label: 'Срок истек', style: 'bg-[#3C2E30] text-[#F2B8B5] border border-[#523335]' };
    if (isOverlimit) return { label: 'Лимит исчерпан', style: 'bg-[#3C352E] text-[#FFE082] border border-[#524433]' };
    return { label: 'Активен', style: 'bg-[#2E3C30] text-[#A3CFB1] border border-[#3D5233]' };
  };

  const status = getStatus();
  const progress = user.traffic_limit_gb > 0 
    ? Math.min((user.traffic_used_bytes / limitBytes) * 100, 100) 
    : 0;

  return (
    <div className={`bg-[#211F26] rounded-[24px] p-5 border transition-all duration-200 ${
      isSelected ? 'border-[#D0BCFF] shadow-lg' : 'border-[#2B2930] hover:border-[#D0BCFF]/30'
    }`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-3">
          <input 
            type="checkbox" 
            checked={isSelected} 
            onChange={onSelectToggle}
            className="accent-[#D0BCFF] h-4 w-4 cursor-pointer"
          />
          <div>
            <h3 className="font-bold text-sm text-[#E6E1E5]">{user.name}</h3>
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold inline-block mt-1 ${status.style}`}>
              {status.label}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={() => onToggle(user.id)} 
            className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${user.is_active ? 'bg-[#D0BCFF]' : 'bg-[#4A4458]'}`}
          >
            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-[#1D1B20] transition-transform ${user.is_active ? 'translate-x-5.5' : 'translate-x-1'}`} />
          </button>
          <button onClick={() => onDelete(user.id)} className="text-[#F2B8B5] hover:bg-[#8C1D18]/30 p-2 rounded-full transition">🗑️</button>
        </div>
      </div>

      <div className="space-y-1.5 mt-3">
        <div className="flex justify-between text-xs text-[#CAC4D0]">
          <span>Трафик: <strong>{FormatService.formatBytes(user.traffic_used_bytes)}</strong></span>
          <span>Лимит: <strong>{user.traffic_limit_gb > 0 ? `${user.traffic_limit_gb} ГБ` : 'Безлимит'}</strong></span>
        </div>
        <div className="w-full bg-[#4A4458] rounded-full h-1.5 overflow-hidden">
          <div className="bg-[#D0BCFF] h-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="flex justify-between items-center mt-4 pt-3 border-t border-[#2B2930] text-[10px] text-[#CAC4D0]">
        <span>Истекает: {FormatService.formatShortDate(user.expires_at)}</span>
        <div className="flex space-x-2">
          <button onClick={() => onCopy(`${window.location.origin}/sub/${user.vless_uuid}`)} className="bg-[#4A4458] hover:bg-[#625B71] px-2.5 py-1 rounded-full text-[10px] font-bold">🔗 Ссылка</button>
          <button onClick={() => setShowKeys(!showKeys)} className="bg-[#D0BCFF]/10 hover:bg-[#D0BCFF]/20 text-[#D0BCFF] px-2.5 py-1 rounded-full text-[10px] font-bold border border-[#D0BCFF]/20">Ключи</button>
        </div>
      </div>

      {showKeys && (
        <div className="mt-3 p-3 bg-[#141218] rounded-xl border border-[#2B2930] space-y-2 text-[10px] animate-in slide-in-from-top-2 duration-150">
          {[
            { label: 'VLESS Link', value: `vless://${user.vless_uuid}@your-server:8443?security=reality#Reality-${user.name}` },
            { label: 'Hysteria 2 Link', value: `hysteria2://${user.hysteria2_password}@your-server:8444#Hysteria2-${user.name}` }
          ].map((item, idx) => (
            <div key={idx} className="flex justify-between items-center">
              <span className="font-bold text-[#E6E1E5]">{item.label}</span>
              <div className="flex space-x-1.5">
                <button onClick={() => onCopy(item.value)} className="text-[#D0BCFF] hover:underline">Copy</button>
                <button onClick={() => setQrCodeLink(qrCodeLink === item.value ? null : item.value)} className="text-gray-400 hover:underline">QR</button>
              </div>
            </div>
          ))}

          {qrCodeLink && (
            <div className="flex flex-col items-center p-2 bg-white rounded-lg mt-2 max-w-[120px] mx-auto animate-in zoom-in-95">
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(qrCodeLink)}`} alt="QR Code" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}