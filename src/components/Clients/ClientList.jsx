import React, { useState } from 'react';
import ClientCard from './ClientCard';
import { useBulkToggle, useBulkReset, useBulkDelete } from '../../hooks/useApi';
import { useHasPermission } from '../../hooks/useHasPermission';

export default function ClientList({ users = [], onCopy, onEdit, onToggle }) {
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const { hasPermission } = useHasPermission();

  const canWrite = hasPermission('clients:write');

  const bulkToggleMutation = useBulkToggle(() => setSelectedIds([]));
  const bulkResetMutation = useBulkReset(() => setSelectedIds([]));
  const bulkDeleteMutation = useBulkDelete(() => setSelectedIds([]));

  const isBulkLoading = 
    bulkToggleMutation.isPending || 
    bulkResetMutation.isPending || 
    bulkDeleteMutation.isPending;

  const getFilteredUsers = () => {
    let result = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()));
    
    switch (activeFilter) {
      case 'online':
        return result.filter(u => u.online);
      case 'active':
        return result.filter(u => u.is_active);
      case 'suspended':
        return result.filter(u => !u.is_active);
      case 'expired':
        return result.filter(u => {
          const isExpired = u.expires_at && new Date(u.expires_at) < new Date();
          const limitBytes = u.traffic_limit_gb * 1073741824;
          const isOverlimit = u.traffic_limit_gb > 0 && u.traffic_used_bytes >= limitBytes;
          return isExpired || isOverlimit;
        });
      default:
        return result;
    }
  };

  const filtered = getFilteredUsers();

  const handleSelectAll = (e) => {
    setSelectedIds(e.target.checked ? filtered.map(u => u.id) : []);
  };

  const handleToggle = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const handleBulkAction = (action) => {
    if (selectedIds.length === 0 || !canWrite) return;
    
    if (action === 'delete') {
      if (confirm(`Вы действительно хотите удалить выбранные профили (${selectedIds.length} шт.)?`)) {
        bulkDeleteMutation.mutate(selectedIds);
      }
    } else if (action === 'toggle') {
      bulkToggleMutation.mutate(selectedIds);
    } else if (action === 'reset') {
      if (confirm('Сбросить счетчик использованного трафика для выбранных профилей?')) {
        bulkResetMutation.mutate(selectedIds);
      }
    }
  };

  const filterTabs = [
    { id: 'all', label: `Все`, count: users.length },
    { id: 'online', label: `В сети`, count: users.filter(u => u.online).length },
    { id: 'active', label: `Активные`, count: users.filter(u => u.is_active).length },
    { id: 'suspended', label: `Пауза`, count: users.filter(u => !u.is_active).length },
    { id: 'expired', label: `Истекшие`, count: users.filter(u => {
        const isExpired = u.expires_at && new Date(u.expires_at) < new Date();
        const limitBytes = u.traffic_limit_gb * 1073741824;
        const isOverlimit = u.traffic_limit_gb > 0 && u.traffic_used_bytes >= limitBytes;
        return isExpired || isOverlimit;
      }).length }
  ];

  return (
    <div className="bg-[#1D1B20]/95 rounded-[28px] p-6 border border-[#2B2930] space-y-6 shadow-sm">
      {}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        <div className="relative w-full sm:max-w-xs">
          <span className="absolute left-4 top-2.5 text-[#CAC4D0] text-xs">🔍</span>
          <input 
            type="text" 
            placeholder="Поиск пользователей..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#211F26] border border-[#2B2930] rounded-full pl-10 pr-4 py-2 text-xs text-[#E6E1E5] placeholder-[#8F8B97] focus:outline-none focus:border-[#D0BCFF] focus:ring-1 focus:ring-[#D0BCFF] transition-all duration-200"
          />
        </div>
      </div>

      {}
      <div className="flex gap-2 overflow-x-auto pb-1.5 max-w-full no-scrollbar border-b border-[#2B2930]/40">
        {filterTabs.map(tab => {
          const isSelected = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveFilter(tab.id); setSelectedIds([]); }}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap border flex items-center space-x-1.5 outline-none cursor-pointer ${
                isSelected 
                  ? 'bg-[#2B2930] text-[#D0BCFF] border-[#D0BCFF]/20 shadow-sm scale-102' 
                  : 'bg-transparent text-[#CAC4D0] border-transparent hover:bg-white/5 active:scale-98'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[9px] ${isSelected ? 'bg-[#381E72] text-[#D0BCFF]' : 'bg-[#2B2930] text-[#CAC4D0]'}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {}
      {canWrite && selectedIds.length > 0 && (
        <div className="p-3.5 bg-[#141218] border border-[#2B2930] rounded-[20px] flex flex-wrap gap-3 items-center justify-between text-xs transition-all duration-300 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center space-x-2 px-1">
            <span className="h-2 w-2 rounded-full bg-[#D0BCFF] animate-pulse" />
            <span className="font-semibold text-[#CAC4D0]">Выбрано профилей: {selectedIds.length}</span>
          </div>
          <div className="flex gap-1.5">
            <button 
              onClick={() => handleBulkAction('toggle')} 
              disabled={isBulkLoading} 
              className="bg-[#2B2930] hover:bg-white/5 active:scale-95 border border-[#D0BCFF]/10 text-[#D0BCFF] px-4 py-2 rounded-xl text-[10px] font-semibold transition-all duration-150 cursor-pointer"
            >
              Вкл / Выкл
            </button>
            <button 
              onClick={() => handleBulkAction('reset')} 
              disabled={isBulkLoading} 
              className="bg-[#2B2930] hover:bg-white/5 active:scale-95 border border-[#D0BCFF]/10 text-[#D0BCFF] px-4 py-2 rounded-xl text-[10px] font-semibold transition-all duration-150 cursor-pointer"
            >
              Сбросить трафик
            </button>
            <button 
              onClick={() => handleBulkAction('delete')} 
              disabled={isBulkLoading} 
              className="bg-[#601410]/20 hover:bg-[#601410]/30 active:scale-95 border border-[#F2B8B5]/10 text-[#F2B8B5] px-4 py-2 rounded-xl text-[10px] font-semibold transition-all duration-150 cursor-pointer"
            >
              Удалить
            </button>
          </div>
        </div>
      )}

      {canWrite && filtered.length > 0 && (
        <div className="flex items-center space-x-3 px-3 py-1 select-none">
          <input 
            type="checkbox" 
            checked={selectedIds.length === filtered.length && filtered.length > 0} 
            onChange={handleSelectAll}
            className="rounded border-[#8F8B97] text-[#D0BCFF] focus:ring-0 bg-black/40 h-4.5 w-4.5 cursor-pointer transition-all duration-200"
          />
          <span className="text-[11px] text-[#CAC4D0] font-semibold">Выделить всех отфильтрованных ({filtered.length})</span>
        </div>
      )}

      {}
      <div className="flex flex-col gap-3.5">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-xs text-gray-500 border border-dashed border-[#2B2930] rounded-[24px]">
            Пользователи не найдены в выбранной категории.
          </div>
        ) : (
          filtered.map(user => (
            <ClientCard 
              key={user.id} 
              user={user} 
              onToggle={onToggle}
              onDelete={() => {}} 
              onCopy={onCopy}
              onEdit={canWrite ? onEdit : null} 
              isSelected={selectedIds.includes(user.id)}
              onSelectToggle={() => handleToggle(user.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}