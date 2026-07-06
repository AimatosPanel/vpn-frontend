import React, { useState, useEffect, useRef } from 'react';
import { useNodes } from '../hooks/useApi';
import { apiService } from '../services/ApiService';
import PageContainer from '../components/Common/PageContainer';

export default function LogsView() {
  const { data: nodes = [] } = useNodes();
  
  const [logs, setLogs] = useState([]);
  const [selectedNode, setSelectedNode] = useState('master');
  const [level, setLevel] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const consoleEndRef = useRef(null);

  useEffect(() => {
    if (isPaused) return;

    const unsubscribe = apiService.subscribeToLogsStream(
      selectedNode,
      (newLog) => {
        if (level && newLog.level.toLowerCase() !== level.toLowerCase()) return;
        setLogs(prev => [...prev, newLog].slice(-150));
      },
      () => {}
    );

    return () => unsubscribe();
  }, [selectedNode, level, isPaused]);

  useEffect(() => {
    if (consoleEndRef.current && !isPaused) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isPaused]);

  const formatLogTime = (timeStr) => {
    if (!timeStr) return '';
    try {
      const date = new Date(timeStr);
      if (isNaN(date.getTime())) return timeStr;
      return date.toLocaleTimeString();
    } catch (e) {
      return timeStr;
    }
  };

  const logsIcon = (
    <svg className="w-6 h-6 text-[#D0BCFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );

  return (
    <PageContainer 
      title="Системный журнал" 
      subtitle="Стриминг событий распределенной сети в реальном времени" 
      icon={logsIcon}
    >
      <div className="space-y-6">
        {}
        <div className="bg-[#1D1B20]/95 border border-[#2B2930] rounded-[28px] p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end shadow-sm">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-[#CAC4D0] tracking-wider block">Выбор источника</label>
            <div className="relative">
              <select 
                value={selectedNode} 
                onChange={e => setSelectedNode(e.target.value)} 
                className="w-full bg-[#211F26] border border-[#2B2930] rounded-[16px] px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#D0BCFF] focus:ring-1 focus:ring-[#D0BCFF] transition-all cursor-pointer appearance-none"
              >
                <option value="master">Центральный Мастер</option>
                {nodes.map(node => (
                  <option key={node.id} value={node.id}>{node.name} ({node.ip})</option>
                ))}
              </select>
              <span className="absolute right-4 top-3.5 pointer-events-none text-gray-400 text-[10px] select-none">▼</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-[#CAC4D0] tracking-wider block">Важность событий</label>
            <div className="relative">
              <select 
                value={level} 
                onChange={e => setLevel(e.target.value)} 
                className="w-full bg-[#211F26] border border-[#2B2930] rounded-[16px] px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#D0BCFF] focus:ring-1 focus:ring-[#D0BCFF] transition-all cursor-pointer appearance-none"
              >
                <option value="">Все логи (All Events)</option>
                <option value="info">INFO — Сводка</option>
                <option value="warn">WARN — Предупреждения</option>
                <option value="error">ERROR — Ошибки</option>
              </select>
              <span className="absolute right-4 top-3.5 pointer-events-none text-gray-400 text-[10px] select-none">▼</span>
            </div>
          </div>

          <div>
            <button 
              onClick={() => setIsPaused(!isPaused)} 
              className={`w-full py-2.5 rounded-full text-xs font-bold transition duration-200 cursor-pointer outline-none flex items-center justify-center gap-1.5 ${
                isPaused 
                  ? 'bg-[#FFE082] text-black hover:bg-[#FFD54F]' 
                  : 'bg-[#2B2930] text-[#D0BCFF] border border-[#D0BCFF]/10 hover:bg-white/5'
              }`}
            >
              <span>{isPaused ? '▶️' : '⏸️'}</span>
              <span>{isPaused ? 'Запустить поток' : 'Приостановить'}</span>
            </button>
          </div>

          <div>
            <button 
              onClick={() => setLogs([])} 
              className="w-full bg-[#2B2930] hover:bg-white/5 active:scale-98 border border-[#D0BCFF]/10 text-white py-2.5 rounded-full text-xs font-bold transition duration-150 cursor-pointer outline-none flex items-center justify-center gap-1.5"
            >
              <span>🗑️</span>
              <span>Очистить экран</span>
            </button>
          </div>
        </div>

        {}
        <div className="flex flex-col shadow-2xl">
          <div className="bg-[#1D1B20]/90 border border-[#2B2930] border-b-0 rounded-t-[24px] px-5 py-3.5 flex items-center justify-between select-none">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-[#FF5F56] shadow-[0_0_6px_rgba(255,95,86,0.3)]" />
              <span className="w-3 h-3 rounded-full bg-[#FFBD2E] shadow-[0_0_6px_rgba(255,189,46,0.3)]" />
              <span className="w-3 h-3 rounded-full bg-[#27C93F] shadow-[0_0_6px_rgba(39,201,63,0.3)]" />
              <span className="text-[10px] text-gray-400 font-mono pl-3 font-semibold tracking-wider">live_stream.log</span>
            </div>
            
            <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider flex items-center gap-1.5 bg-[#141218] border border-white/5 px-2.5 py-1 rounded-full">
              <span className={`w-1.5 h-1.5 rounded-full ${isPaused ? 'bg-[#FFE082]' : 'bg-emerald-400 animate-pulse'}`} />
              {isPaused ? 'На паузе' : 'Стриминг'}
            </span>
          </div>

          <div className="bg-[#0C0B0E] border border-[#2B2930] rounded-b-[24px] p-5 h-[480px] overflow-y-auto font-mono text-[10px] sm:text-[11px] leading-relaxed space-y-2 shadow-inner scrollbar-thin animate-in fade-in duration-350">
            {logs.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-600 text-xs italic select-none">
                Ожидание системных событий... Поток активен.
              </div>
            ) : (
              logs.map((log, idx) => (
                <div key={idx} className="text-[#CAC4D0] hover:bg-white/5 px-1 rounded transition duration-75">
                  <span className="text-[#938F99]">[{formatLogTime(log.time)}]</span>{' '}
                  <span className={`mx-2 px-2 py-0.5 rounded-md font-bold text-[9px] inline-block ${
                    log.level === 'ERROR' 
                      ? 'bg-red-500/15 text-red-400 border border-red-500/20' 
                      : log.level === 'WARN' 
                        ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20' 
                        : 'bg-blue-500/15 text-blue-300 border border-blue-500/20'
                  }`}>
                    {log.level}
                  </span>{' '}
                  <span className="text-[#D0BCFF] font-semibold">[{log.component}]</span>: {log.message}
                </div>
              ))
            )}
            <div ref={consoleEndRef} />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}