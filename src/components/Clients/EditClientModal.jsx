import React, { useState, useEffect } from 'react';
import { useUpdateClient, useDeleteClient } from '../../hooks/useApi';
import { Button } from '../Common/UI';

export default function EditClientModal({ user, onClose }) {
  const [name, setName] = useState('');
  const [limit, setLimit] = useState('');
  const [speedUp, setSpeedUp] = useState('');
  const [speedDown, setSpeedDown] = useState('');
  const [protocols, setProtocols] = useState([]);
  const [expiry, setExpiry] = useState('');
  const [note, setNote] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const updateMutation = useUpdateClient(() => handleClose());
  const deleteMutation = useDeleteClient(() => handleClose());

  const availableProtocols = ['vless', 'hysteria2', 'tuic', 'naive'];

  useEffect(() => {
    if (user) {
      setName(user.name);
      setLimit(user.traffic_limit_gb || '');
      setSpeedUp(user.speed_limit_up_mbps || '');
      setSpeedDown(user.speed_limit_down_mbps || '');
      setProtocols(user.allowed_protocols ? user.allowed_protocols.split(',') : []);
      setNote(user.note || '');
      if (user.expires_at) {
        setExpiry(new Date(user.expires_at).toISOString().split('T')[0]);
      } else {
        setExpiry('');
      }
    }
  }, [user]);

  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onClose, 300);
  };

  const handleProtocolToggle = (proto) => {
    setProtocols(prev => prev.includes(proto) ? prev.filter(p => p !== proto) : [...prev, proto]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name,
      traffic_limit_gb: parseFloat(limit) || 0,
      speed_limit_up_mbps: parseInt(speedUp) || 0,
      speed_limit_down_mbps: parseInt(speedDown) || 0,
      allowed_protocols: protocols.join(','),
      expires_at: expiry ? `${expiry} 23:59:59` : null,
      note
    };
    updateMutation.mutate({ id: user.id, payload });
  };

  const handleDelete = () => {
    if (confirm(`Вы уверены, что хотите полностью удалить профиль ${user.name}?`)) {
      deleteMutation.mutate(user.id);
    }
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
          <h3 className="text-sm font-semibold text-white tracking-wide">⚙️ Настройки: {user.name}</h3>
          <button type="button" onClick={handleClose} className="text-gray-400 hover:text-white text-2xl transition-all duration-150 outline-none cursor-pointer">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs mt-4">
          <div>
            <label className="block text-[10px] text-[#CAC4D0] uppercase font-semibold tracking-wider mb-1.5">Имя пользователя (латиница)</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))} 
              required 
              className="w-full bg-[#211F26] border border-[#2B2930] rounded-[16px] px-4 py-2.5 text-sm text-[#E6E1E5] focus:outline-none focus:border-[#D0BCFF] focus:ring-1 focus:ring-[#D0BCFF] transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-[10px] text-[#CAC4D0] uppercase font-semibold tracking-wider mb-1.5">Заметка / Telegram-аккаунт</label>
            <input 
              type="text" 
              value={note} 
              onChange={e => setNote(e.target.value)} 
              placeholder="@username или имя контакта"
              className="w-full bg-[#211F26] border border-[#2B2930] rounded-[16px] px-4 py-2.5 text-sm text-[#E6E1E5] focus:outline-none focus:border-[#D0BCFF] focus:ring-1 focus:ring-[#D0BCFF] transition-all duration-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[10px] text-[#CAC4D0] uppercase font-semibold tracking-wider mb-1.5">Лимит (ГБ)</label>
              <input 
                type="number" 
                value={limit} 
                onChange={e => setLimit(e.target.value)} 
                placeholder="0 — безлимит"
                className="w-full bg-[#211F26] border border-[#2B2930] rounded-[16px] px-4 py-2.5 text-sm text-[#E6E1E5] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] text-[#CAC4D0] uppercase font-semibold tracking-wider mb-1.5">Срок действия</label>
              <input 
                type="date" 
                value={expiry} 
                onChange={e => setExpiry(e.target.value)} 
                className="w-full bg-[#211F26] border border-[#2B2930] rounded-[16px] px-4 py-2.5 text-sm text-[#E6E1E5] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[10px] text-[#CAC4D0] uppercase font-semibold tracking-wider mb-1.5">Отдача (Мбит/с)</label>
              <input 
                type="number" 
                value={speedUp} 
                onChange={e => setSpeedUp(e.target.value)} 
                placeholder="0 — безлимит"
                className="w-full bg-[#211F26] border border-[#2B2930] rounded-[16px] px-4 py-2.5 text-sm text-[#E6E1E5] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] text-[#CAC4D0] uppercase font-semibold tracking-wider mb-1.5">Прием (Мбит/с)</label>
              <input 
                type="number" 
                value={speedDown} 
                onChange={e => setSpeedDown(e.target.value)} 
                placeholder="0 — безлимит"
                className="w-full bg-[#211F26] border border-[#2B2930] rounded-[16px] px-4 py-2.5 text-sm text-[#E6E1E5] focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="block text-[10px] text-[#CAC4D0] uppercase font-semibold tracking-wider">Разрешенные протоколы</span>
            <div className="flex flex-wrap gap-2">
              {availableProtocols.map(proto => {
                const isSelected = protocols.includes(proto);
                return (
                  <button
                    type="button"
                    key={proto}
                    onClick={() => handleProtocolToggle(proto)}
                    className={`px-3.5 py-2 rounded-full text-[10px] font-semibold transition-all duration-200 border outline-none cursor-pointer ${
                      isSelected 
                        ? 'bg-[#2B2930] text-[#D0BCFF] border-[#D0BCFF]/30' 
                        : 'bg-transparent text-gray-400 border-white/5 hover:bg-white/5'
                    }`}
                  >
                    {proto.toUpperCase()}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5 pt-4 border-t border-[#2B2930]">
            <Button 
              onClick={handleClose} 
              variant="secondary-block"
            >
              Отмена
            </Button>
            <Button 
              type="submit" 
              disabled={updateMutation.isPending}
              variant="primary-block"
            >
              {updateMutation.isPending ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </div>

          <div className="pt-2 border-t border-[#2B2930]/40">
            <Button 
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              variant="danger-block"
            >
              <span>🗑️</span>
              <span>Удалить этот профиль</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}