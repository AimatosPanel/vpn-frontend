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
    if (isSuspended) return { label: 'Приостановлен', style: 'bg-gray-500/10 text-gray-400 border-gray-500/20' };
    if (isExpired) return { label: 'Истек срок', style: 'bg-rose-500/10 text-rose-400 border-rose-500/20' };
    if (isOverlimit) return { label: 'Лимит исчерпан', style: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
    return { label: 'Активен', style: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
  };

  const status = getStatus();
  const progress = user.traffic_limit_gb > 0 
    ? Math.min((user.traffic_used_bytes / limitBytes) * 100, 100) 
    : 0;

  return (
    <div className={`relative bg-[#16141F] rounded-2xl p-5 border transition-all duration-300 ${
      isSelected ? 'border-[#8B5CF6] shadow-lg shadow-purple-500/5' : 'border-white/5 hover:border-white/10'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <input 
            type="checkbox" 
            checked={isSelected} 
            onChange={onSelectToggle}
            className="rounded border-white/10 text-[#8B5CF6] focus:ring-[#8B5CF6] bg-black/40 h-4 w-4 cursor-pointer"
          />
          <div>
            <h3 className="font-extrabold text-sm text-white tracking-wide">{user.name}</h3>
            <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold inline-block mt-1.5 border ${status.style}`}>
              {status.label}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={() => onToggle(user.id)} 
            className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors duration-300 focus:outline-none ${
              user.is_active ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-white/10'
            }`}
          >
            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-black transition-transform duration-300 ${
              user.is_active ? 'translate-x-5.5' : 'translate-x-1'
            }`} />
          </button>
          <button 
            onClick={() => onDelete(user.id)} 
            className="text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 p-2 rounded-xl transition-all duration-200"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-xs text-gray-400">
          <span>Использовано: <strong className="text-white">{FormatService.formatBytes(user.traffic_used_bytes)}</strong></span>
          <span>Лимит: <strong className="text-white">{user.traffic_limit_gb > 0 ? `${user.traffic_limit_gb} ГБ` : 'Безлимит'}</strong></span>
        </div>
        <div className="w-full bg-black/40 rounded-full h-2 overflow-hidden border border-white/5">
          <div 
            className="bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] h-full transition-all duration-500 rounded-full" 
            style={{ width: `${progress}%` }} 
          />
        </div>
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-white/5 text-[10px] text-gray-400">
        <span>До: {FormatService.formatShortDate(user.expires_at)}</span>
        <div className="flex space-x-1.5">
          <button 
            onClick={() => onCopy(`${window.location.origin}/sub/${user.vless_uuid}`)} 
            className="bg-white/5 hover:bg-white/10 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-200"
          >
            🔗 Ссылка
          </button>
          <button 
            onClick={() => setShowKeys(!showKeys)} 
            className="bg-[#8B5CF6]/10 hover:bg-[#8B5CF6]/20 text-[#C084FC] px-3 py-1.5 rounded-lg text-[10px] font-bold border border-[#8B5CF6]/20 transition-all duration-200"
          >
            Ключи
          </button>
        </div>
      </div>

      {showKeys && (
        <div className="mt-4 p-3 bg-black/40 rounded-xl border border-white/5 space-y-2 text-[10px] animate-in slide-in-from-top-2 duration-300">
          {[
            { label: 'VLESS Link', value: `vless://${user.vless_uuid}@your-server:8443?security=reality#Reality-${user.name}` },
            { label: 'Hysteria 2 Link', value: `hysteria2://${user.hysteria2_password}@your-server:8444#Hysteria2-${user.name}` }
          ].map((item, idx) => (
            <div key={idx} className="flex justify-between items-center">
              <span className="font-semibold text-gray-300">{item.label}</span>
              <div className="flex space-x-2">
                <button onClick={() => onCopy(item.value)} className="text-[#C084FC] hover:underline">Copy</button>
                <button onClick={() => setQrCodeLink(qrCodeLink === item.value ? null : item.value)} className="text-gray-400 hover:underline">QR</button>
              </div>
            </div>
          ))}

          {qrCodeLink && (
            <div className="flex flex-col items-center p-2 bg-white rounded-xl mt-2 max-w-[120px] mx-auto transition-all">
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(qrCodeLink)}`} alt="QR Code" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
