import React, { useState, useEffect } from 'react';
import { useUsers, useNodes } from '../hooks/useApi';
import FormatService from '../services/FormatService';
import CountryFlag from '../components/Common/CountryFlag';
import PageContainer from '../components/Common/PageContainer';

function formatUptime(seconds) {
  if (!seconds || seconds <= 0) return '—';
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d} дн. ${h} ч.`;
  if (h > 0) return `${h} ч. ${m} мин.`;
  return `${m} мин.`;
}

const StatsCard = ({ title, value, icon, containerBg, iconColor }) => (
  <div className="rounded-[20px] sm:rounded-[28px] bg-[#1D1B20]/95 border border-[#2B2930] p-3 sm:p-6 flex items-center justify-between transition-all duration-300 hover:border-[#CAC4D0]/15 shadow-sm group">
    <div className="space-y-1 sm:space-y-1.5 min-w-0">
      <span className="text-[8px] sm:text-[10px] text-[#CAC4D0] uppercase tracking-wider font-bold block truncate">
        {title}
      </span>
      <h3 className="text-xs sm:text-2xl font-black text-white tracking-wide break-all truncate">
        {value}
      </h3>
    </div>
    <div className={`hidden sm:flex p-4 rounded-2xl shrink-0 transition-transform duration-300 group-hover:scale-105 ${containerBg} ${iconColor}`}>
      {icon}
    </div>
  </div>
);

export default function StatsView() {
  const { data: nodes = [], isLoading: nodesLoading } = useNodes();
  const { data: clients = [], isLoading: clientsLoading } = useUsers();
  
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [ping, setPing] = useState(null);

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0] || {};
  const nodeStatus = selectedNode.status || 'offline';
  const cpuUsage = selectedNode.cpu_usage !== undefined && selectedNode.cpu_usage !== null 
    ? selectedNode.cpu_usage.toFixed(1) 
    : '0';
  const ramPercent = selectedNode.ram_percent !== undefined && selectedNode.ram_percent !== null 
    ? selectedNode.ram_percent.toFixed(1) 
    : '0';
  const ramUsed = FormatService.formatBytes(selectedNode.ram_used_bytes || 0);
  const ramTotal = FormatService.formatBytes(selectedNode.ram_total_bytes || 0);
  const uptime = selectedNode.uptime_seconds ? formatUptime(selectedNode.uptime_seconds) : '—';
  const nodeName = selectedNode.name || 'Не выбран';

  const measureRealPing = async (ip) => {
    if (!ip) {
      setPing(null);
      return;
    }
    if (ip === '127.0.0.1' || ip === 'localhost') {
      setPing(1);
      return;
    }
    const start = performance.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);
    const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';

    try {
      await fetch(`${protocol}//${ip}`, {
        mode: 'no-cors',
        cache: 'no-store',
        signal: controller.signal,
      });
    } catch (e) {
    } finally {
      clearTimeout(timeoutId);
    }

    const duration = Math.round(performance.now() - start);
    setPing(duration >= 1500 ? 't/o' : duration);
  };

  useEffect(() => {
    if (nodes.length > 0 && selectedNodeId === null) {
      setSelectedNodeId(nodes[0].id);
    }
  }, [nodes, selectedNodeId]);

  useEffect(() => {
    if (selectedNode && selectedNode.ip) {
      measureRealPing(selectedNode.ip);
    }
  }, [selectedNodeId, selectedNode?.ip, nodes]);

  const totalDownload = clients.reduce((acc, u) => acc + (u.traffic_downlink_bytes || 0), 0);
  const totalUpload = clients.reduce((acc, u) => acc + (u.traffic_uplink_bytes || 0), 0);
  const totalTraffic = totalDownload + totalUpload;
  const onlineUsersCount = clients.filter(u => u.online).length;

  const totalRatio = totalDownload + totalUpload;
  const dlPercent = totalRatio > 0 ? (totalDownload / totalRatio) * 100 : 50;
  const ulPercent = totalRatio > 0 ? (totalUpload / totalRatio) * 100 : 50;

  if ((nodesLoading || clientsLoading) && nodes.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-3.5">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#D0BCFF] border-t-transparent"></div>
          <span className="text-[#938F99] text-xs font-bold tracking-wider uppercase">Чтение системных метрик...</span>
        </div>
      </div>
    );
  }

  const hasMultipleNodes = nodes.length > 1;

  const statsIcon = (
    <svg className="w-6 h-6 text-[#D0BCFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 8v6m-4-2v2m-4-6v6M3 21h18M3 3v18" />
    </svg>
  );

  const headerAction = !hasMultipleNodes && selectedNode.name && (
    <div className="flex items-center gap-2 bg-[#211F26] border border-[#2B2930] rounded-full pl-2.5 pr-4 py-1.5 shadow-sm text-xs select-none w-full sm:w-auto justify-center">
      <CountryFlag code={selectedNode.location_code} className="w-5 h-3.5 rounded border border-white/10 shrink-0" />
      <span className="font-semibold text-white truncate max-w-[120px]">{selectedNode.name}</span>
      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${nodeStatus === 'online' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
    </div>
  );

  return (
    <PageContainer 
      title="Мониторинг инфраструктуры" 
      subtitle="Автоматическое обновление • каждые 5 секунд" 
      icon={statsIcon}
      action={headerAction}
    >
      <div className="space-y-6 sm:space-y-8">
        {hasMultipleNodes && (
          <div className="flex gap-2 overflow-x-auto pb-2.5 max-w-full no-scrollbar border-b border-[#2B2930]/40">
            {nodes.map((node) => {
              const isActive = node.id === selectedNodeId;
              const isOnline = node.status === 'online';

              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`px-4 py-2.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap border flex items-center space-x-2.5 outline-none cursor-pointer ${
                    isActive 
                      ? 'bg-[#2B2930] text-[#D0BCFF] border-[#D0BCFF]/25 shadow-sm scale-102' 
                      : 'bg-transparent text-[#CAC4D0] border-transparent hover:bg-white/5 active:scale-98'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500 shadow-[0_0_8px_#10B981]' : 'bg-rose-500'}`} />
                  <CountryFlag code={node.location_code} className="w-5 h-3.5 rounded-sm border border-white/10 shrink-0" />
                  <span>{node.name}</span>
                </button>
              );
            })}
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 sm:gap-5">
          <StatsCard 
            title="Сегодня (эст.)"
            value={FormatService.formatBytes(totalTraffic * 0.08)}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            }
            containerBg="bg-[#D0BCFF]/10"
            iconColor="text-[#D0BCFF]"
          />
          
          <StatsCard 
            title="За месяц"
            value={FormatService.formatBytes(totalTraffic)}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            }
            containerBg="bg-[#80CBC4]/10"
            iconColor="text-[#80CBC4]"
          />

          <StatsCard 
            title="В сети"
            value={`${onlineUsersCount} чел.`}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
            containerBg="bg-[#FF8A80]/10"
            iconColor="text-[#FF8A80]"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#1D1B20]/95 border border-[#2B2930] rounded-[28px] p-4.5 sm:p-6 flex flex-col justify-between shadow-sm space-y-4 sm:space-y-6">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-[#D0BCFF]/10 rounded-xl">
                <svg className="w-5 h-5 text-[#D0BCFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.003 9.003 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Анализ трафика сети
              </h4>
            </div>
            
            <div className="space-y-2">
              <div className="w-full bg-[#211F26] h-3.5 rounded-full overflow-hidden flex border border-[#2B2930]">
                <div 
                  className="bg-[#80CBC4] h-full transition-all duration-500 rounded-l-full" 
                  style={{ width: `${dlPercent}%` }} 
                  title={`Входящий: ${dlPercent.toFixed(1)}%`} 
                />
                <div 
                  className="bg-[#D0BCFF] h-full transition-all duration-500 rounded-r-full" 
                  style={{ width: `${ulPercent}%` }} 
                  title={`Исходящий: ${ulPercent.toFixed(1)}%`} 
                />
              </div>
              <div className="flex justify-between items-center text-[9px] sm:text-[10px] text-[#CAC4D0] font-bold uppercase tracking-wider px-1">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#80CBC4]" /> входящий ({dlPercent.toFixed(0)}%)</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#D0BCFF]" /> исходящий ({ulPercent.toFixed(0)}%)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
              <div className="bg-[#211F26]/60 p-3 sm:p-4.5 rounded-2xl border border-[#2B2930]/40 flex items-center gap-2.5 sm:gap-4">
                <div className="bg-[#80CBC4]/10 p-2 sm:p-3 rounded-xl flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#80CBC4]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <span className="text-[8px] sm:text-[9px] text-[#CAC4D0] font-bold uppercase tracking-wider block truncate">Загрузка (DL)</span>
                  <p className="text-xs sm:text-base font-black text-white mt-0.5 truncate">
                    {FormatService.formatBytes(totalDownload)}
                  </p>
                </div>
              </div>
              
              <div className="bg-[#211F26]/60 p-3 sm:p-4.5 rounded-2xl border border-[#2B2930]/40 flex items-center gap-2.5 sm:gap-4">
                <div className="bg-[#D0BCFF]/10 p-2 sm:p-3 rounded-xl flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#D0BCFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <span className="text-[8px] sm:text-[9px] text-[#CAC4D0] font-bold uppercase tracking-wider block truncate">Отдача (UL)</span>
                  <p className="text-xs sm:text-base font-black text-white mt-0.5 truncate">
                    {FormatService.formatBytes(totalUpload)}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-3.5 border-t border-[#2B2930]/40 flex justify-between items-center text-[11px] sm:text-xs text-[#CAC4D0]">
              <span>Суммарный объем пропущенных данных:</span>
              <span className="font-extrabold text-white text-xs sm:text-sm">{FormatService.formatBytes(totalTraffic)}</span>
            </div>
          </div>

          <div className="bg-[#1D1B20]/95 border border-[#2B2930] rounded-[28px] p-4.5 sm:p-6 flex flex-col justify-between shadow-sm space-y-4 sm:space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-[#80CBC4]/10 rounded-xl">
                  <svg className="w-5 h-5 text-[#80CBC4]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  Ресурсы: {nodeName}
                </h4>
              </div>

              {nodeStatus === 'online' ? (
                <span className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 px-2.5 sm:px-3 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {ping !== null ? (ping === 't/o' ? 'Timeout' : `${ping} ms`) : '...'}
                </span>
              ) : (
                <span className="text-[9px] sm:text-[10px] font-bold text-rose-400 uppercase tracking-wider bg-rose-500/10 border border-rose-500/20 px-2.5 sm:px-3 py-1 rounded-full">
                  Выключен
                </span>
              )}
            </div>

            {nodeStatus === 'offline' ? (
              <div className="flex flex-col items-center justify-center py-8 text-center space-y-3 my-auto bg-[#211F26]/30 rounded-2xl border border-dashed border-[#2B2930]">
                <span className="text-rose-400 text-sm font-bold uppercase tracking-wider">⚠️ Сервер не отвечает</span>
                <p className="text-[11px] text-[#CAC4D0] leading-relaxed max-w-xs px-4">
                  Запустите службу <code className="bg-black/40 px-1.5 py-0.5 rounded font-mono text-white text-[10px]">vpn-node</code> на целевом сервере.
                </p>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-5 my-auto">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-[#CAC4D0] font-semibold">
                    <span>Загрузка процессора CPU</span>
                    <span className="font-extrabold text-white">{cpuUsage}%</span>
                  </div>
                  <div className="w-full bg-[#211F26] h-2.5 rounded-full overflow-hidden border border-[#2B2930]">
                    <div 
                      className="bg-[#D0BCFF] h-full transition-all duration-500 rounded-full" 
                      style={{ width: `${cpuUsage}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-[#CAC4D0] font-semibold">
                    <span>Оперативная память RAM</span>
                    <span className="font-extrabold text-white">
                      {ramPercent}% <span className="text-[9px] sm:text-[10px] font-normal text-[#CAC4D0]">({ramUsed} / {ramTotal})</span>
                    </span>
                  </div>
                  <div className="w-full bg-[#211F26] h-2.5 rounded-full overflow-hidden border border-[#2B2930]">
                    <div 
                      className="bg-[#80CBC4] h-full transition-all duration-500 rounded-full" 
                      style={{ width: `${ramPercent}%` }}
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-[#2B2930]/40 space-y-1.5">
                  <div className="flex justify-between items-center text-[11px] sm:text-xs text-[#CAC4D0]">
                    <span>Время аптайма сервера:</span>
                    <span className="font-extrabold text-white">{uptime}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] sm:text-xs text-[#CAC4D0]">
                    <span>IP-адрес подключения:</span>
                    <span className="font-mono text-white select-all text-[11px]">{selectedNode.ip || '—'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}