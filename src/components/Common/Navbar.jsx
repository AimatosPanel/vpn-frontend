import React from 'react';

export default function Navbar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'clients', label: 'Клиенты', icon: '👥' },
    { id: 'stats', label: 'Мониторинг', icon: '📊' },
    { id: 'nodes', label: 'Ноды', icon: '🌐' },
    { id: 'logs', label: 'Логи', icon: '📋' },
    { id: 'settings', label: 'Настройки', icon: '⚙️' }
  ];

  return (
    <nav className="bg-[#1D1B20]/90 backdrop-blur-md border-b border-[#2b2930] sticky top-0 z-40 shadow-lg">
      <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-3">
          <div className="bg-[#4F378B] text-[#E8DEF8] p-2.5 rounded-xl shadow-md">🛡️</div>
          <h1 className="text-xl font-bold tracking-tight text-[#E6E1E5]">AimatosPanel</h1>
        </div>

        <div className="flex bg-[#211F26] p-1.5 rounded-full border border-[#4A4458] space-x-1 shadow-inner overflow-x-auto max-w-full">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 flex items-center space-x-1.5 whitespace-nowrap ${
                activeTab === tab.id ? 'bg-[#D0BCFF] text-[#381E72] shadow-md' : 'text-[#CAC4D0] hover:text-[#E8DEF8]'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}