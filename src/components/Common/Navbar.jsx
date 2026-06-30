import React from 'react';

export default function Navbar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'clients', label: 'Клиенты', icon: '👥' },
    { id: 'stats', label: 'Мониторинг', icon: '📊' },
    { id: 'nodes', label: 'Узлы сети', icon: '🌐' },
    { id: 'logs', label: 'События', icon: '📋' },
    { id: 'settings', label: 'Конфиг', icon: '⚙️' }
  ];

  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <div className="max-w-6xl mx-auto bg-[#16141F]/80 backdrop-blur-xl border border-white/5 rounded-2xl px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
        <div className="flex items-center space-x-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] shadow-lg shadow-purple-500/20">
            <span className="text-lg">🛡️</span>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <h1 className="text-lg font-black tracking-wider text-white bg-clip-text">AIMATOS<span className="text-[#8B5CF6]">PANEL</span></h1>
            <p className="text-[9px] text-gray-400 uppercase tracking-widest">Next-Gen Core</p>
          </div>
        </div>

        <div className="flex bg-[#0B0914] p-1 rounded-xl border border-white/5 space-x-1 overflow-x-auto max-w-full">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all duration-300 flex items-center space-x-2 whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white shadow-md shadow-purple-600/10' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
