import React, { useState } from 'react';
import { apiService } from '../../services/ApiService';

export default function ClientForm({ onSuccess, onError }) {
  const [name, setName] = useState('');
  const [limit, setLimit] = useState('');
  const [duration, setDuration] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name,
      allowed_protocols: "vless,hysteria2,tuic,naive"
    };

    if (limit) payload.traffic_limit_gb = parseFloat(limit);
    if (duration) payload.duration_days = parseInt(duration);

    try {
      const result = await apiService.createClient(payload);
      setName('');
      setLimit('');
      setDuration('');
      onSuccess(result);
    } catch (err) {
      onError(err.message || 'Ошибка генерации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1D1B20] rounded-[28px] p-6 border border-[#2B2930] space-y-4">
      <h2 className="text-md font-bold text-[#D0BCFF]">👥 Новый VPN-профиль</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs text-[#CAC4D0] mb-1 font-medium">Имя пользователя (латиница)</label>
          <input 
            type="text" 
            value={name} 
            onChange={e => setName(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))} 
            required 
            placeholder="alex_vpn" 
            className="w-full bg-[#211F26] border border-[#8F8B97] rounded-[16px] px-4 py-2.5 text-sm text-[#E6E1E5] focus:outline-none focus:border-[#D0BCFF]"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-[#CAC4D0] mb-1 font-medium">Лимит трафика (ГБ)</label>
            <input 
              type="number" 
              value={limit} 
              onChange={e => setLimit(e.target.value)} 
              placeholder="0 — безлимит" 
              className="w-full bg-[#211F26] border border-[#8F8B97] rounded-[16px] px-4 py-2.5 text-sm text-[#E6E1E5]"
            />
          </div>
          <div>
            <label className="block text-xs text-[#CAC4D0] mb-1 font-medium">Срок действия (дней)</label>
            <input 
              type="number" 
              value={duration} 
              onChange={e => setDuration(e.target.value)} 
              placeholder="0 — бессрочно" 
              className="w-full bg-[#211F26] border border-[#8F8B97] rounded-[16px] px-4 py-2.5 text-sm text-[#E6E1E5]"
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-[#D0BCFF] hover:bg-[#CCC2DC] text-[#381E72] font-bold py-3 px-4 rounded-full text-xs font-bold transition disabled:opacity-50"
        >
          {loading ? 'Идет создание...' : 'Сгенерировать ключи'}
        </button>
      </form>
    </div>
  );
}