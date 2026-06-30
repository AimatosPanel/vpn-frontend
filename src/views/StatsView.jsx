import React, { useState, useEffect } from 'react';
import { apiService } from '../services/ApiService';
import FormatService from '../services/FormatService';

export default function StatsView() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await apiService.fetchJson('/api/node/status');
        setStats(data);
      } catch (e) {}
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <h2 className="text-md font-bold text-[#D0BCFF]">📊 Системный мониторинг и состояние служб</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1D1B20] p-5 rounded-[24px] border border-[#2B2930]">
          <span className="text-[10px] text-[#CAC4D0] uppercase font-bold block">Загрузка процессора CPU</span>
          <span className="text-xl font-extrabold mt-1 block">{stats ? `${stats.cpu_usage.toFixed(1)}%` : '—'}</span>
        </div>
        <div className="bg-[#1D1B20] p-5 rounded-[24px] border border-[#2B2930]">
          <span className="text-[10px] text-[#CAC4D0] uppercase font-bold block">Использование ОЗУ RAM</span>
          <span className="text-xl font-extrabold mt-1 block">{stats ? `${stats.ram_percent.toFixed(1)}%` : '—'}</span>
          <span className="text-[9px] text-gray-500">{stats ? `Всего: ${FormatService.formatBytes(stats.ram_total_bytes)}` : ''}</span>
        </div>
        <div className="bg-[#1D1B20] p-5 rounded-[24px] border border-[#2B2930]">
          <span className="text-[10px] text-[#CAC4D0] uppercase font-bold block">Uptime сервера</span>
          <span className="text-xl font-extrabold mt-1 block">{stats ? `${(stats.uptime_seconds / 3600 / 24).toFixed(1)} дн.` : '—'}</span>
        </div>
      </div>
    </main>
  );
}