import React, { useState } from 'react';
import { useUsers, useToggleClient } from '../hooks/useApi';
import ClientForm from '../components/Clients/ClientForm'; 
import ClientList from '../components/Clients/ClientList';
import Modal from '../components/Common/Modal';
import EditClientModal from '../components/Clients/EditClientModal'; 
import PageContainer from '../components/Common/PageContainer';
import { useHasPermission } from '../hooks/useHasPermission';

export default function ClientsView() {
  const { data: users = [] } = useUsers();
  const toggleMutation = useToggleClient();
  const { hasPermission } = useHasPermission();

  const canWrite = hasPermission('clients:write');

  const [modalData, setModalData] = useState(null);
  const [editingUser, setEditingUser] = useState(null); 
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  const clientsIcon = (
    <svg className="w-6 h-6 text-[#D0BCFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );

  const createAction = canWrite && (
    <button 
      onClick={() => setIsCreateOpen(true)}
      className="w-full sm:w-auto bg-[#D0BCFF] hover:bg-[#CCC2DC] active:scale-95 text-[#381E72] font-semibold py-2.5 px-5 rounded-full text-xs transition duration-200 flex items-center justify-center gap-1.5 shadow-sm cursor-pointer outline-none"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#381E72]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
      <span>Создать профиль</span>
    </button>
  );

  return (
    <PageContainer 
      title="Клиенты панели" 
      subtitle={`Всего добавлено профилей: ${users.length}`} 
      icon={clientsIcon}
      action={createAction}
    >
      <div className="w-full">
        <ClientList 
          users={users} 
          onRefresh={() => {}} 
          onCopy={handleCopy} 
          onEdit={canWrite ? setEditingUser : null} 
          onToggle={canWrite ? (id) => toggleMutation.mutate(id) : () => {}}
          canWrite={canWrite}
        />
      </div>

      {isCreateOpen && canWrite && (
        <ClientForm 
          onClose={() => setIsCreateOpen(false)}
          onSuccess={(data) => { 
            setIsCreateOpen(false); 
            setModalData(data); 
          }}
        />
      )}

      <Modal modalData={modalData} onClose={() => setModalData(null)} onCopy={handleCopy} />
      
      {editingUser && canWrite && (
        <EditClientModal 
          user={editingUser} 
          onClose={() => setEditingUser(null)} 
        />
      )}

      {canWrite && (
        <button 
          onClick={() => setIsCreateOpen(true)}
          className="lg:hidden fixed bottom-24 right-6 z-40 bg-[#D0BCFF] hover:bg-[#CCC2DC] active:scale-95 text-[#381E72] h-14 w-14 rounded-[16px] shadow-[0_4px_16px_rgba(0,0,0,0.4)] flex items-center justify-center transition-all duration-200 cursor-pointer outline-none hover:shadow-[0_6px_20px_rgba(208,188,255,0.4)] border border-[#D0BCFF]/10"
          title="Создать профиль"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#381E72]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      )}
    </PageContainer>
  );
}