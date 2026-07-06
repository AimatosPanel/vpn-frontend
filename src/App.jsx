import React, { useState, useEffect } from 'react';
import ClientsView from './views/ClientsView';
import StatsView from './views/StatsView';
import NodesView from './views/NodesView';
import LogsView from './views/LogsView';
import SettingsView from './views/SettingsView';
import SubscriptionView from './views/SubscriptionView';
import Navbar from './components/Common/Navbar';
import Toast from './components/Common/Toast';
import LoginView from './views/LoginView';
import { useRouter } from './components/Common/Router';
import { useToast } from './context/ToastContext';
import { apiService } from './services/ApiService';

export default function App() {
  const { currentPath } = useRouter();
  const { toast, clearToast } = useToast();
  
  const [token, setToken] = useState(localStorage.getItem("admin_token") || "");
  const [role, setRole] = useState(localStorage.getItem("admin_role") || "");
  useEffect(() => {
    if (!token) return;

    const verifySession = () => {
      if (apiService.isTokenExpired(token)) {
        apiService.clearSession();
      }
    };
    verifySession();
    const sessionTimer = setInterval(verifySession, 10000);

    return () => clearInterval(sessionTimer);
  }, [token]);
  const matchCabinet = currentPath.match(/^\/cabinet\/([^/]+)/);
  if (matchCabinet) {
    return <SubscriptionView uuid={matchCabinet[1]} />;
  }
  if (!token) {
    return (
      <LoginView 
        onLoginSuccess={(data) => {
          setToken(data.token);
          setRole(data.role);
        }} 
      />
    );
  }

  const handleLogout = () => {
    apiService.clearSession();
  };

  const renderView = () => {
    switch (currentPath) {
      case '/':
      case '/clients':
        return <ClientsView />;
      case '/stats':
        return <StatsView />;
      case '/nodes':
        return <NodesView />;
      case '/logs':
        return <LogsView />;
      case '/settings':
        return <SettingsView />;
      default:
        return <ClientsView />;
    }
  };

  return (
    <div className="bg-[#141218] text-[#E6E1E5] min-h-screen font-sans selection:bg-[#D0BCFF] selection:text-[#381E72]">
      
      {}
      <Navbar onLogout={handleLogout} />
      
      <div className="w-full">
        {renderView()}
      </div>

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={clearToast} 
        />
      )}
    </div>
  );
}