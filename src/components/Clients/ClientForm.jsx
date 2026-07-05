import React, { useState, useEffect } from 'react';
import { useCreateClient } from '../../hooks/useApi';
import { Button } from '../Common/UI';

export default function ClientForm({ onClose, onSuccess }) {
  const [name, setName] = useState('');
  const [limit, setLimit] = useState('');
  const [duration, setDuration] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const createMutation = useCreateClient((data) => {
    setName('');
    setLimit('');
    setDuration('');
    setIsOpen(false);
    setTimeout(() => onSuccess(data), 300);
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onClose, 300);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      name,
      allowed_protocols: "vless,hysteria2,tuic,naive"
    };

    if (limit) payload.traffic_limit_gb = parseFloat(limit);
    if (duration) payload.duration_days = parseInt(duration);

    createMutation.mutate(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div 
        onClick={handleClose}
        className={`absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300 ease-out ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div 
        className={`relative bg-[#1D1B20]/95 border border-[#2B2930] w-full max-h-[92vh] md:max-h-[85vh] overflow-y-auto flex flex-col p-6 shadow-2xl transition-all duration-300 ease-[cubic-bezier(0.32,0.94,0.6,1)] rounded-t-[28px] rounded-b-none md:rounded-[28px] md:max-w-md md:w-full pb-safe z-10 ${
          isOpen 
            ? 'translate-y-0 opacity-100 scale-100' 
            : 'translate-y-full opacity-0 md:translate-y-0 md:opacity-0 md:scale-95'
        }`}
      >
        <div className="md:hidden w-12 h-1.5 bg-[#8F8B97]/30 rounded-full mx-auto mb-3 mt-1 flex-shrink-0" />

        <div className="flex justify-between items-center pb-3 border-b border-[#2B2930]/40">
          <div className="flex items-center space-x-2.5">
            <span className="text-xl">👥</span>
            <h3 className="text-sm font-semibold text-white tracking-wide">Новый VPN-профиль</h3>
          </div>
          <button 
            type="button" 
            onClick={handleClose} 
            className="text-gray-400 hover:text-white text-2xl transition-all duration-150 outline-none cursor-pointer"
          >
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div>
            <label className="block text-[10px] text-[#CAC4D0] mb-1.5 font-bold uppercase tracking-wider">
              Имя пользователя (только латиница и цифры)
            </label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))} 
              required 
              placeholder="alex_vpn" 
              className="w-full bg-[#211F26] border border-[#2B2930] rounded-[16px] px-4 py-3 text-sm text-[#E6E1E5] placeholder-[#8F8B97] focus:outline-none focus:border-[#D0BCFF] focus:ring-1 focus:ring-[#D0BCFF] transition-all duration-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[10px] text-[#CAC4D0] mb-1.5 font-bold uppercase tracking-wider">
                Лимит трафика (ГБ)
              </label>
              <input 
                type="number" 
                value={limit} 
                onChange={e => setLimit(e.target.value)} 
                placeholder="0 — безлимит" 
                className="w-full bg-[#211F26] border border-[#2B2930] rounded-[16px] px-4 py-3 text-sm text-[#E6E1E5] placeholder-[#8F8B97] focus:outline-none focus:border-[#D0BCFF] focus:ring-1 focus:ring-[#D0BCFF] transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-[10px] text-[#CAC4D0] mb-1.5 font-bold uppercase tracking-wider">
                Срок действия (дней)
              </label>
              <input 
                type="number" 
                value={duration} 
                onChange={e => setDuration(e.target.value)} 
                placeholder="0 — бессрочно" 
                className="w-full bg-[#211F26] border border-[#2B2930] rounded-[16px] px-4 py-3 text-sm text-[#E6E1E5] placeholder-[#8F8B97] focus:outline-none focus:border-[#D0BCFF] focus:ring-1 focus:ring-[#D0BCFF] transition-all duration-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5 pt-4 border-t border-[#2B2930]/40">
            <Button 
              onClick={handleClose}
              variant="secondary-block"
            >
              Отмена
            </Button>
            <Button 
              type="submit" 
              disabled={createMutation.isPending}
              variant="primary-block"
            >
              {createMutation.isPending ? 'Создание...' : 'Создать'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}