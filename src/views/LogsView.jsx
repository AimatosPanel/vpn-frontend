import React, { useState, useEffect, useRef } from 'react';
import { apiService } from '../services/ApiService';

export default function LogsView() {
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
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-md font-bold text-[#D0BCFF]">📋 Стриминг логов реального времени (SSE)</h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => setIsPaused(!isPaused)} 
            className={`px-4 py-2 rounded-full text-xs font-bold transition ${isPaused ? 'bg-[#FFE082] text-black' : 'bg-[#211F26] border border-[#2B2930]'}`}
          >
            {isPaused ? '▶️ Запустить' : '⏸️ Пауза'}
          </button>
          <button onClick={() => setLogs([])} className="bg-[#211F26] border border-[#2B2930] px-4 py-2 rounded-full text-xs font-bold">Очистить</button>
        </div>
      </div>

      <div className="bg-[#1D1B20] p-4 rounded-[24px] border border-[#2B2930] flex gap-4">
        <div>
          <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Выбор ноды</label>
          <select value={selectedNode} onChange={e => setSelectedNode(e.target.value)} className="bg-[#211F26] border border-[#8F8B97] text-xs px-3 py-1.5 rounded-lg text-white">
            <option value="master">Мастер-сервер</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Фильтр важности</label>
          <select value={level} onChange={e => setLevel(e.target.value)} className="bg-[#211F26] border border-[#8F8B97] text-xs px-3 py-1.5 rounded-lg text-white">
            <option value="">Все логи</option>
            <option value="info">INFO</option>
            <option value="warn">WARN</option>
            <option value="error">ERROR</option>
          </select>
        </div>
      </div>

      <div className="bg-[#0C0B0E] rounded-[24px] p-5 h-96 overflow-y-auto font-mono text-[11px] leading-relaxed space-y-1.5 shadow-inner">
        {logs.map((log, idx) => (
          <div key={idx} className="text-[#CAC4D0]">
            <span className="text-[#8F8B97]">[{new Date(log.time).toLocaleTimeString()}]</span>{' '}
            <span className={log.level === 'ERROR' ? 'text-[#F2B8B5] font-bold' : log.level === 'WARN' ? 'text-[#FFE082]' : 'text-[#D0BCFF]'}>
              [{log.level}]
            </span>{' '}
            <span className="text-gray-500">[{log.component}]</span>: {log.message}
          </div>
        ))}
        <div ref={consoleEndRef} />
      </div>
    </main>
  );
}