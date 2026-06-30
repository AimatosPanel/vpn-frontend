import React, { useState } from 'react';
import ClientCard from './ClientCard';
import { apiService } from '../../services/ApiService';

export default function ClientList({ users = [], onRefresh, onCopy }) {
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkLoading, setBulkProcessing] = useState(false);

  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()));

  const handleSelectAll = (e) => {
    setSelectedIds(e.target.checked ? filtered.map(u => u.id) : []);
  };

  const handleToggle = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const handleBulkAction = async (action) => {
    if (selectedIds.length === 0) return;
    setBulkProcessing(true);
    try {
      if (action === 'delete') await apiService.bulkDelete(selectedIds);
      if (action === 'toggle') await apiService.bulkToggle(selectedIds);
      if (action === 'reset') await apiService.bulkReset(selectedIds);
      setSelectedIds([]);
      onRefresh();
    } catch (e) {
      alert("Ошибка при выполнении операции: " + e.message);
    } finally {
      setBulkProcessing(false);
    }
  };

  return (
    <div className="bg-[#1D1B20] rounded-[28px] p-6 border border-[#2B2930] space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-md font-bold text-[#D0BCFF]">👥 Пользователи ({filtered.length})</h2>
        <input 
          type="text" 
          placeholder="Поиск по имени..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-[#211F26] border border-[#8F8B97] rounded-full px-4 py-1.5 text-xs text-[#E6E1E5]"
        />
      </div>

      {selectedIds.length > 0 && (
        <div className="p-3 bg-[#141218] rounded-xl flex flex-wrap gap-2 items-center text-xs">
          <span className="font-bold text-[#D0BCFF]">Групповые действия ({selectedIds.length}):</span>
          <button onClick={() => handleBulkAction('toggle')} disabled={bulkLoading} className="bg-[#4A4458] px-3 py-1.5 rounded-lg text-[10px] font-bold transition">Вкл/Выкл</button>
          <button onClick={() => handleBulkAction('reset')} disabled={bulkLoading} className="bg-[#4A4458] px-3 py-1.5 rounded-lg text-[10px] font-bold transition">Сбросить трафик</button>
          <button onClick={() => handleBulkAction('delete')} disabled={bulkLoading} className="bg-[#8C1D18]/20 text-[#F2B8B5] px-3 py-1.5 rounded-lg text-[10px] font-bold transition">Удалить</button>
        </div>
      )}

      {filtered.length > 0 && (
        <div className="flex items-center space-x-3 px-2">
          <input 
            type="checkbox" 
            checked={selectedIds.length === filtered.length} 
            onChange={handleSelectAll}
            className="accent-[#D0BCFF]"
          />
          <span className="text-xs text-[#CAC4D0]">Выделить всех</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(user => (
          <ClientCard 
            key={user.id} 
            user={user} 
            onToggle={async (id) => { await apiService.toggleClient(id); onRefresh(); }}
            onDelete={async (id) => { if(confirm('Удалить?')) { await apiService.deleteClient(id); onRefresh(); } }}
            onCopy={onCopy}
            isSelected={selectedIds.includes(user.id)}
            onSelectToggle={() => handleToggle(user.id)}
          />
        ))}
      </div>
    </div>
  );
}