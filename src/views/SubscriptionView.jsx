import React, { useState, useEffect } from 'react';
import { apiService } from '../services/ApiService';
import FormatService from '../services/FormatService';

export default function SubscriptionView({ uuid }) {
  const [sub, setSub] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSub = async () => {
      try {
        const data = await apiService.getSubscription(uuid);
        setSub(data);
      } catch (e) { 
        setError('Подписка не найдена или неактивна'); 
      }
    };
    fetchSub();
  }, [uuid]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#141218] text-white">
        <div className="bg-[#1D1B20] p-6 rounded-[28px] border border-[#2B2930] text-center max-w-sm space-y-3">
          <span className="text-4xl">⚠️</span>
          <h1 className="text-md font-bold text-[#F2B8B5]">Ошибка подписки</h1>
          <p className="text-xs text-[#CAC4D0]">{error}</p>
        </div>
      </div>
    );
  }

  if (!sub) return <div className="text-center py-20 text-xs text-white">Авторизация профиля в сети...</div>;

  const totalBytes = sub.traffic_limit_gb * 1073741824;
  const progress = sub.traffic_limit_gb > 0 ? (sub.traffic_used_bytes / totalBytes) * 100 : 0;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#141218] text-[#E6E1E5]">
      <div className="bg-[#1D1B20] border border-[#2B2930] rounded-[32px] p-6 w-full max-w-md space-y-6">
        <div className="text-center space-y-1">
          <span className="text-3xl block">🚀</span>
          <h1 className="text-md font-bold">Ваш VPN кабинет</h1>
          <span className="text-xs text-[#D0BCFF] font-bold">Профиль: {sub.name}</span>
        </div>

        <div className="p-4 bg-[#211F26] rounded-2xl border border-[#2B2930]/60 space-y-3 text-xs">
          <div className="flex justify-between">
            <span>Расход трафика:</span>
            <span className="font-bold">{FormatService.formatBytes(sub.traffic_used_bytes)}</span>
          </div>
          <div className="w-full bg-[#4A4458] rounded-full h-1.5 overflow-hidden">
            <div className="bg-[#D0BCFF] h-full" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex justify-between text-[10px] text-gray-400">
            <span>Предел: {sub.traffic_limit_gb > 0 ? `${sub.traffic_limit_gb} ГБ` : 'Безлимит'}</span>
            <span>Срок: {FormatService.formatShortDate(sub.expires_at)}</span>
          </div>
        </div>

        <div className="space-y-3">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Быстрый импорт конфигурации</span>
          <div className="bg-[#211F26] p-3 rounded-xl border border-[#2B2930]/50 flex justify-between items-center text-xs">
            <span>Универсальный импорт (Hiddify / Nekobox)</span>
            <button 
              onClick={() => { 
                navigator.clipboard.writeText(`${window.location.origin}/sub/${uuid}`); 
                alert('Ссылка скопирована!'); 
              }} 
              className="bg-[#D0BCFF] text-[#381E72] px-3 py-1 rounded-full text-[10px] font-bold transition"
            >
              Копировать
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}