import React, { useState, useEffect } from 'react';
import ClientsView from './views/ClientsView';
import StatsView from './views/StatsView';
import NodesView from './views/NodesView';
import LogsView from './views/LogsView';
import SettingsView from './views/SettingsView';
import SubscriptionView from './views/SubscriptionView';
import Navbar from './components/Common/Navbar';

export default function App() {
  const [route, setRoute] = useState({ path: window.location.pathname, param: null });
  const [activeTab, setActiveTab] = useState('clients');

  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      const matchSub = path.match(/^\/sub\/([^/]+)/);
      if (matchSub) {
        setRoute({ path: '/sub', param: matchSub[1] });
      } else {
        setRoute({ path: '/', param: null });
      }
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  if (route.path === '/sub') {
    return <SubscriptionView uuid={route.param} />;
  }

  return (
    <div className="bg-[#141218] text-[#E6E1E5] min-h-screen font-sans selection:bg-[#D0BCFF] selection:text-[#381E72]">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {activeTab === 'clients' && <ClientsView />}
      {activeTab === 'stats' && <StatsView />}
      {activeTab === 'nodes' && <NodesView />}
      {activeTab === 'logs' && <LogsView />}
      {activeTab === 'settings' && <SettingsView />}
    </div>
  );
}