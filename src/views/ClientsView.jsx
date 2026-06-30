import React, { useState, useEffect } from 'react';
import { apiService } from '../services/ApiService';
import ClientForm from '../components/Clients/ClientForm';
import ClientList from '../components/Clients/ClientList';
import Modal from '../components/Common/Modal';
import Toast from '../components/Common/Toast';

export default function ClientsView() {
  const [users, setUsers] = useState([]);
  const [modalData, setModalData] = useState(null);
  const [toast, setToast] = useState(null);

  const loadUsers = async () => {
    try {
      const data = await apiService.getClients();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setToast({ message: 'Ошибка при загрузке пользователей', type: 'error' });
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setToast({ message: 'Адрес подписки успешно скопирован в буфер!', type: 'success' });
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <ClientForm 
          onSuccess={(data) => { setModalData(data); loadUsers(); }}
          onError={(err) => setToast({ message: err, type: 'error' })}
        />
      </div>
      <div className="lg:col-span-2">
        <ClientList users={users} onRefresh={loadUsers} onCopy={handleCopy} />
      </div>

      <Modal modalData={modalData} onClose={() => setModalData(null)} onCopy={handleCopy} />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </main>
  );
}