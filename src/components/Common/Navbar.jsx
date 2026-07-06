import React from 'react';
import { useRouter } from './Router';
import Logo from './Logo';
const Icon = ({ name, className = "w-5 h-5" }) => {
  const paths = {
    trophy: <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34M12 2a4 4 0 0 0-4 4v4c0 1.25.7 2.33 1.72 2.88l.28.12h4l.28-.12C15.3 12.33 16 11.25 16 10V6a4 4 0 0 0-4-4z" />,
    stats: <path d="M18 20V10M12 20V4M6 20v-6" />,
    nodes: <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />,
    logs: <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
    settings: <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  };

  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      {paths[name] || null}
    </svg>
  );
};

export default function Navbar({ onLogout }) {
  const { currentPath, navigate } = useRouter();

  const tabs = [
    { id: 'clients', path: '/', label: 'Клиенты', icon: (cls) => <Icon name="trophy" className={cls} /> },
    { id: 'stats', path: '/stats', label: 'Мониторинг', icon: (cls) => <Icon name="stats" className={cls} /> },
    { id: 'nodes', path: '/nodes', label: 'Узлы сети', icon: (cls) => <Icon name="nodes" className={cls} /> },
    { id: 'logs', path: '/logs', label: 'События', icon: (cls) => <Icon name="logs" className={cls} /> },
    { id: 'settings', path: '/settings', label: 'Конфиг', icon: (cls) => <Icon name="settings" className={cls} /> }
  ];

  const getActiveTabId = () => {
    const tab = tabs.find(t => t.path === currentPath);
    if (tab) return tab.id;
    if (currentPath === '/clients') return 'clients';
    return 'clients';
  };

  const activeTab = getActiveTabId();

  return (
    <>
      {}
      <header className="hidden md:block sticky top-0 z-40 w-full bg-[#1C1B1F]/90 backdrop-blur-md border-b border-[#2D2F39]/60 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {}
          <div className="flex items-center space-x-3 select-none w-1/4">
            <Logo className="w-8 h-8 text-[#D0BCFF]" />
            <div className="flex flex-col">
              <h1 className="text-sm font-black tracking-wider text-white uppercase">
                AIMATOS<span className="text-[#D0BCFF] font-medium">PANEL</span>
              </h1>
              <span className="text-[9px] text-[#938F99] uppercase tracking-widest font-bold">
                Dev v3.0
              </span>
            </div>
          </div>

          {}
          <nav className="flex items-center space-x-1 bg-[#141218]/60 p-1 rounded-full border border-[#2D2F39]/30 shadow-inner">
            {tabs.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => navigate(tab.path)}
                  className={`relative px-4.5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 select-none cursor-pointer outline-none flex items-center space-x-2 active:scale-95 ${
                    isActive
                      ? 'bg-[#381E72] text-[#EADDFF] border border-[#D0BCFF]/10 shadow-lg shadow-[#381E72]/45 scale-102'
                      : 'text-[#CAC4D0] hover:bg-[#EADDFF]/8 hover:text-white'
                  }`}
                >
                  {tab.icon(`w-4 h-4 transition-transform duration-200 ${isActive ? 'scale-110 text-[#EADDFF]' : 'text-[#CAC4D0]'}`)}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {}
          <div className="flex items-center justify-end w-1/4">
            <button 
              onClick={onLogout}
              className="bg-[#2B2930] hover:bg-[#601410]/20 border border-[#D0BCFF]/10 text-gray-300 hover:text-[#F2B8B5] transition-all px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider cursor-pointer flex items-center gap-2 shadow-sm active:scale-95"
            >
              <span>🚪</span>
              <span>Выйти</span>
            </button>
          </div>

        </div>
      </header>

      {}
      <header className="md:hidden sticky top-0 z-40 w-full bg-[#1C1B1F]/90 backdrop-blur-md border-b border-[#2D2F39]/60 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2.5 select-none">
          <Logo className="w-7 h-7 text-[#D0BCFF]" />
          <h1 className="text-xs font-black tracking-wider text-white uppercase">
            AIMATOS<span className="text-[#D0BCFF] font-medium">PANEL</span>
          </h1>
        </div>
        
        <button 
          onClick={onLogout}
          className="bg-[#2B2930] hover:bg-[#601410]/20 active:scale-95 border border-[#D0BCFF]/10 text-gray-300 hover:text-[#F2B8B5] transition-all px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider cursor-pointer flex items-center gap-1.5 shadow-sm"
        >
          <span>🚪</span>
          <span>Выйти</span>
        </button>
      </header>

      {}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#1D1B20]/95 backdrop-blur-lg border-t border-[#2D2F39]/60 pb-safe shadow-[0_-4px_24px_rgba(0,0,0,0.4)]">
        <div className="flex justify-around items-center h-20 max-w-md mx-auto px-2">
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => navigate(tab.path)}
                className="flex-1 flex flex-col items-center justify-center h-full outline-none cursor-pointer group active:scale-95 transition-transform"
              >
                <div className={`relative px-5 py-1.5 rounded-full transition-all duration-200 ${
                  isActive 
                    ? 'bg-[#381E72] text-[#EADDFF] scale-105 shadow-md shadow-[#381E72]/30' 
                    : 'text-[#CAC4D0] group-hover:text-white'
                }`}>
                  {tab.icon(`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 text-[#EADDFF]' : 'text-[#CAC4D0]'}`)}
                </div>
                <span className={`text-[10px] font-bold tracking-wider mt-1.5 transition-colors ${
                  isActive ? 'text-[#D0BCFF]' : 'text-[#CAC4D0]'
                }`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}