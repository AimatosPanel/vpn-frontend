import React, { useState } from 'react';
import { useNodes, useCreateNode, useUpdateNode, useDeleteNode } from '../hooks/useApi';
import CountryFlag from '../components/Common/CountryFlag';
import PageContainer from '../components/Common/PageContainer';
import { useHasPermission } from '../hooks/useHasPermission';

export default function NodesView() {
  const { data: nodes = [], isLoading } = useNodes();
  const { hasPermission } = useHasPermission();
  const canWrite = hasPermission('nodes:write');

  const createMutation = useCreateNode(() => handleCloseModal());
  const updateMutation = useUpdateNode(() => handleCloseModal());
  const deleteMutation = useDeleteNode();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [animateModal, setAnimateModal] = useState(false);
  const [editingNode, setEditingNode] = useState(null);

  const [form, setForm] = useState({
    ip: '',
    name: '',
    location_code: 'NL',
    location_name: 'Netherlands',
    vless_port: 8443,
    vless_grpc_port: 8447,
    hysteria_port: 8444,
    tuic_port: 8445,
    naive_port: 8446,
    fallback_action: 'throttle',
    fallback_speed_limit: 1,
    custom_dns: '8.8.8.8,1.1.1.1'
  });

  const openAddModal = () => {
    if (!canWrite) return;
    setEditingNode(null);
    setForm({
      ip: '',
      name: '',
      location_code: 'NL',
      location_name: 'Netherlands',
      vless_port: 8443,
      vless_grpc_port: 8447,
      hysteria_port: 8444,
      tuic_port: 8445,
      naive_port: 8446,
      fallback_action: 'throttle',
      fallback_speed_limit: 1,
      custom_dns: '8.8.8.8,1.1.1.1'
    });
    setIsModalOpen(true);
    setTimeout(() => setAnimateModal(true), 50);
  };

  const openEditModal = (node) => {
    if (!canWrite) return;
    setEditingNode(node);
    setForm({
      ip: node.ip,
      name: node.name,
      location_code: node.location_code || 'NL',
      location_name: node.location_name || 'Netherlands',
      vless_port: node.vless_port || 8443,
      vless_grpc_port: node.vless_grpc_port || 8447,
      hysteria_port: node.hysteria_port || 8444,
      tuic_port: node.tuic_port || 8445,
      naive_port: node.naive_port || 8446,
      fallback_action: node.fallback_action || 'throttle',
      fallback_speed_limit: node.fallback_speed_limit || 1,
      custom_dns: node.custom_dns || '8.8.8.8,1.1.1.1'
    });
    setIsModalOpen(true);
    setTimeout(() => setAnimateModal(true), 50);
  };

  const handleCloseModal = () => {
    setAnimateModal(false);
    setTimeout(() => {
      setIsModalOpen(false);
      setEditingNode(null);
    }, 300);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const numericFields = ['vless_port', 'vless_grpc_port', 'hysteria_port', 'tuic_port', 'naive_port', 'fallback_speed_limit'];
    setForm((prev) => ({
      ...prev,
      [name]: numericFields.includes(name) ? parseInt(value) || 0 : value
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!canWrite) return;
    if (editingNode) {
      updateMutation.mutate({ id: editingNode.id, payload: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const handleDeleteNode = (id, name) => {
    if (!canWrite) return;
    if (confirm(`Вы действительно хотите отключить узел ${name}?`)) {
      deleteMutation.mutate(id);
    }
  };

  const nodesIcon = (
    <svg className="w-6 h-6 text-[#D0BCFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  );

  const addNodeAction = canWrite && (
    <button 
      onClick={openAddModal}
      className="w-full sm:w-auto bg-[#D0BCFF] hover:bg-[#CCC2DC] active:scale-95 text-[#381E72] font-semibold py-2.5 px-5 rounded-full text-xs transition duration-200 flex items-center justify-center gap-1.5 shadow-sm cursor-pointer outline-none"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#381E72]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
      <span>Подключить узел</span>
    </button>
  );

  return (
    <PageContainer 
      title="Распределенные узлы сети" 
      subtitle="Серверы с установленным агентом синхронизации vpn-node" 
      icon={nodesIcon}
      action={addNodeAction}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {isLoading && nodes.length === 0 ? (
          <div className="col-span-full py-16 text-center text-xs text-gray-500">Загрузка структуры сети...</div>
        ) : nodes.length === 0 ? (
          <div className="col-span-full py-16 text-center text-xs text-gray-500 border border-dashed border-[#2B2930] rounded-[28px]">
            Узлы сети еще не зарегистрированы.
          </div>
        ) : (
          nodes.map((node) => {
            const isOnline = node.status === 'online';
            return (
              <div key={node.id} className="bg-[#1D1B20]/95 border border-[#2B2930] rounded-[28px] p-6 flex flex-col justify-between shadow-sm transition-all duration-300 hover:border-[#CAC4D0]/15 hover:shadow-md group">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center space-x-3.5 min-w-0">
                    <CountryFlag 
                      code={node.location_code} 
                      className="w-10 h-7.5 rounded-lg border border-[#2B2930] shadow-sm shrink-0" 
                    />
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm text-white truncate" title={node.name}>{node.name}</h3>
                      <p className="text-[10px] text-gray-400 font-mono mt-0.5 truncate select-all">{node.ip}</p>
                    </div>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border ${
                    isOnline 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' 
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/25'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                    {node.status}
                  </span>
                </div>

                {isOnline ? (
                  <div className="grid grid-cols-3 gap-2.5 bg-[#211F26] p-3.5 rounded-2xl border border-white/5 text-[10px] font-mono mt-4">
                    <div>
                      <span className="text-gray-400 block text-[9px] uppercase tracking-wider font-bold">CPU:</span>
                      <span className="text-white font-black">{node.cpu_usage ? `${node.cpu_usage.toFixed(1)}%` : '0%'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[9px] uppercase tracking-wider font-bold">RAM:</span>
                      <span className="text-white font-black">{node.ram_percent ? `${node.ram_percent.toFixed(1)}%` : '0%'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[9px] uppercase tracking-wider font-bold">Uptime:</span>
                      <span className="text-white font-black">
                        {node.uptime_seconds ? `${Math.floor(node.uptime_seconds / 3600)} ч.` : '—'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="py-4 text-center text-[10px] text-gray-500 italic mt-4 border border-dashed border-[#2B2930]/40 rounded-2xl">
                    Узел временно недоступен
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 text-[10px] text-[#CAC4D0] border-t border-[#2B2930]/40 pt-4 mt-4">
                  <div className="bg-[#211F26]/40 px-3 py-2 rounded-xl border border-[#2B2930]/40 flex justify-between items-center">
                    <span>VLESS TCP</span>
                    <strong className="text-white font-mono">{node.vless_port}</strong>
                  </div>
                  <div className="bg-[#211F26]/40 px-3 py-2 rounded-xl border border-[#2B2930]/40 flex justify-between items-center">
                    <span>VLESS gRPC</span>
                    <strong className="text-white font-mono">{node.vless_grpc_port}</strong>
                  </div>
                  <div className="bg-[#211F26]/40 px-3 py-2 rounded-xl border border-[#2B2930]/40 flex justify-between items-center">
                    <span>Hysteria 2</span>
                    <strong className="text-white font-mono">{node.hysteria_port}</strong>
                  </div>
                  <div className="bg-[#211F26]/40 px-3 py-2 rounded-xl border border-[#2B2930]/40 flex justify-between items-center">
                    <span>TUIC 5</span>
                    <strong className="text-white font-mono">{node.tuic_port}</strong>
                  </div>
                </div>

                {canWrite && (
                  <div className="flex justify-end space-x-2 pt-4 mt-4 border-t border-[#2B2930]/40">
                    <button 
                      onClick={() => openEditModal(node)}
                      className="bg-[#2B2930] hover:bg-white/5 active:scale-95 border border-[#D0BCFF]/10 text-[#D0BCFF] px-4 py-2 rounded-xl text-[10px] font-semibold transition-all duration-150 cursor-pointer"
                    >
                      Настроить
                    </button>
                    <button 
                      onClick={() => handleDeleteNode(node.id, node.name)}
                      className="bg-[#601410]/20 hover:bg-[#601410]/30 active:scale-95 border border-[#F2B8B5]/10 text-[#F2B8B5] px-4 py-2 rounded-xl text-[10px] font-semibold transition-all duration-150 cursor-pointer"
                    >
                      Отключить
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {isModalOpen && canWrite && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div 
            onClick={handleCloseModal}
            className={`absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300 ease-out ${
              animateModal ? 'opacity-100' : 'opacity-0'
            }`}
          />

          <div 
            className={`relative bg-[#1D1B20]/95 border border-[#2B2930] w-full max-h-[92vh] md:max-h-[85vh] overflow-y-auto flex flex-col p-6 shadow-2xl transition-all duration-300 ease-[cubic-bezier(0.32,0.94,0.6,1)] rounded-t-[28px] rounded-b-none md:rounded-[28px] md:max-w-lg md:w-full pb-safe z-10 ${
              animateModal 
                ? 'translate-y-0 opacity-100 scale-100' 
                : 'translate-y-full opacity-0 md:translate-y-0 md:opacity-0 md:scale-95'
            }`}
          >
            <div className="md:hidden w-12 h-1.5 bg-[#8F8B97]/30 rounded-full mx-auto mb-3 mt-1 flex-shrink-0" />

            <div className="flex justify-between items-center pb-3 border-b border-[#2B2930]/40">
              <h3 className="text-sm font-semibold text-white tracking-wide">
                {editingNode ? `⚙️ Изменение узла: ${editingNode.name}` : '🌐 Подключение нового узла'}
              </h3>
              <button 
                type="button" 
                onClick={handleCloseModal} 
                className="text-gray-400 hover:text-white text-2xl transition outline-none cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[10px] text-[#CAC4D0] uppercase font-bold tracking-wider mb-1.5">Имя узла</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={form.name} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="NL-Amsterdam-1"
                    className="w-full bg-[#211F26] border border-[#2B2930] rounded-[16px] px-4 py-3 text-sm text-[#E6E1E5] placeholder-[#8F8B97] focus:outline-none focus:border-[#D0BCFF]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[#CAC4D0] uppercase font-bold tracking-wider mb-1.5">IP / Домен сервера</label>
                  <input 
                    type="text" 
                    name="ip" 
                    value={form.ip} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="185.122.80.12"
                    className="w-full bg-[#211F26] border border-[#2B2930] rounded-[16px] px-4 py-3 text-sm text-[#E6E1E5] placeholder-[#8F8B97] focus:outline-none focus:border-[#D0BCFF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[10px] text-[#CAC4D0] uppercase font-bold tracking-wider mb-1.5">Код страны (ISO-2)</label>
                  <input 
                    type="text" 
                    name="location_code" 
                    value={form.location_code} 
                    onChange={handleInputChange} 
                    maxLength={2} 
                    placeholder="NL"
                    className="w-full bg-[#211F26] border border-[#2B2930] rounded-[16px] px-4 py-3 text-sm text-[#E6E1E5] placeholder-[#8F8B97] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[#CAC4D0] uppercase font-bold tracking-wider mb-1.5">Город / Локация</label>
                  <input 
                    type="text" 
                    name="location_name" 
                    value={form.location_name} 
                    onChange={handleInputChange} 
                    placeholder="Amsterdam, Netherlands"
                    className="w-full bg-[#211F26] border border-[#2B2930] rounded-[16px] px-4 py-3 text-sm text-[#E6E1E5] placeholder-[#8F8B97] focus:outline-none"
                  />
                </div>
              </div>

              <div className="bg-[#211F26]/60 p-4.5 rounded-2xl border border-[#2B2930]/60 space-y-3.5">
                <h4 className="text-[10px] font-bold text-[#D0BCFF] uppercase tracking-wider">Настройка сетевых портов</h4>
                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[9px] text-[#CAC4D0] uppercase font-bold mb-1">VLESS TCP</label>
                    <input 
                      type="number" 
                      name="vless_port" 
                      value={form.vless_port} 
                      onChange={handleInputChange} 
                      className="w-full bg-[#141218] border border-[#2B2930] rounded-xl px-2.5 py-2 text-center text-[#E6E1E5] font-mono focus:outline-none focus:border-[#D0BCFF]"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-[#CAC4D0] uppercase font-bold mb-1">VLESS gRPC</label>
                    <input 
                      type="number" 
                      name="vless_grpc_port" 
                      value={form.vless_grpc_port} 
                      onChange={handleInputChange} 
                      className="w-full bg-[#141218] border border-[#2B2930] rounded-xl px-2.5 py-2 text-center text-[#E6E1E5] font-mono focus:outline-none focus:border-[#D0BCFF]"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-[#CAC4D0] uppercase font-bold mb-1">Hysteria 2</label>
                    <input 
                      type="number" 
                      name="hysteria_port" 
                      value={form.hysteria_port} 
                      onChange={handleInputChange} 
                      className="w-full bg-[#141218] border border-[#2B2930] rounded-xl px-2.5 py-2 text-center text-[#E6E1E5] font-mono focus:outline-none focus:border-[#D0BCFF]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[10px] text-[#CAC4D0] uppercase font-bold tracking-wider mb-1.5">DNS-серверы</label>
                  <input 
                    type="text" 
                    name="custom_dns" 
                    value={form.custom_dns} 
                    onChange={handleInputChange} 
                    placeholder="8.8.8.8,1.1.1.1"
                    className="w-full bg-[#211F26] border border-[#2B2930] rounded-[16px] px-4 py-3 text-sm text-[#E6E1E5] placeholder-[#8F8B97] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[#CAC4D0] uppercase font-bold tracking-wider mb-1.5">Fallback Политика</label>
                  <select 
                    name="fallback_action" 
                    value={form.fallback_action} 
                    onChange={handleInputChange}
                    className="w-full bg-[#211F26] border border-[#2B2930] rounded-[16px] px-4 py-3 text-sm text-[#E6E1E5] focus:outline-none"
                  >
                    <option value="throttle">Ограничить скорость</option>
                    <option value="block">Полная блокировка</option>
                  </select>
                </div>
              </div>

              {form.fallback_action === 'throttle' && (
                <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                  <label className="block text-[10px] text-[#CAC4D0] uppercase font-bold tracking-wider mb-1.5">Лимит скорости (Мбит/с)</label>
                  <input 
                    type="number" 
                    name="fallback_speed_limit" 
                    value={form.fallback_speed_limit} 
                    onChange={handleInputChange} 
                    className="w-full bg-[#211F26] border border-[#2B2930] rounded-[16px] px-4 py-3 text-sm text-[#E6E1E5] focus:outline-none"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#2B2930]/40">
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  className="bg-[#4A4458] hover:bg-[#5E576F] active:scale-95 text-[#E8DEF8] py-3.5 rounded-full text-xs font-semibold"
                >
                  Отмена
                </button>
                <button 
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="bg-[#D0BCFF] hover:bg-[#E8DEF8] active:scale-95 text-[#381E72] py-3.5 rounded-full text-xs font-semibold"
                >
                  {createMutation.isPending || updateMutation.isPending ? 'Загрузка...' : editingNode ? 'Сохранить' : 'Подключить'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {canWrite && (
        <button 
          onClick={openAddModal}
          className="sm:hidden fixed bottom-24 right-6 z-40 bg-[#D0BCFF] hover:bg-[#CCC2DC] active:scale-95 text-[#381E72] h-14 w-14 rounded-[16px] shadow-[0_4px_16px_rgba(0,0,0,0.4)] flex items-center justify-center transition-all duration-200 cursor-pointer outline-none border border-[#D0BCFF]/10"
          title="Добавить узел"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#381E72]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      )}
    </PageContainer>
  );
}