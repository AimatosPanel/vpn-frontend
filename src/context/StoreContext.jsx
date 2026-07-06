import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/ApiService';

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [settings, setSettings] = useState({
    brand_name: 'AimatosPanel',
    reality_sni: 'microsoft.com',
    hysteria_obfs: 'ObfsSecretPass123',
    log_mask_ips: '1',
    log_retention_days: '7'
  });

  const [usersLoading, setUsersLoading] = useState(false);
  const [nodesLoading, setNodesLoading] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  const clearToast = useCallback(() => {
    setToast(null);
  }, []);
  const loadUsers = useCallback(async (silent = false) => {
    if (!silent) setUsersLoading(true);
    try {
      const data = await apiService.getClients();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      if (!silent) showToast('Ошибка при загрузке пользователей', 'error');
    } finally {
      setUsersLoading(false);
    }
  }, [showToast]);

  const createClient = useCallback(async (payload) => {
    try {
      const result = await apiService.createClient(payload);
      await loadUsers(true);
      showToast('Профиль пользователя успешно создан', 'success');
      return result;
    } catch (err) {
      showToast(err.message || 'Ошибка создания профиля', 'error');
      throw err;
    }
  }, [loadUsers, showToast]);

  const updateClient = useCallback(async (id, payload) => {
    try {
      await apiService.updateClient(id, payload);
      await loadUsers(true);
      showToast('Настройки профиля успешно изменены', 'success');
    } catch (err) {
      showToast(err.message || 'Ошибка обновления профиля', 'error');
      throw err;
    }
  }, [loadUsers, showToast]);

  const deleteClient = useCallback(async (id) => {
    try {
      await apiService.deleteClient(id);
      await loadUsers(true);
      showToast('Профиль пользователя успешно удален', 'success');
    } catch (err) {
      showToast('Не удалось удалить пользователя', 'error');
      throw err;
    }
  }, [loadUsers, showToast]);

  const toggleClient = useCallback(async (id) => {
    try {
      await apiService.toggleClient(id);
      await loadUsers(true);
    } catch (err) {
      showToast('Ошибка переключения активности', 'error');
    }
  }, [loadUsers, showToast]);
  const loadNodes = useCallback(async (silent = false) => {
    if (!silent) setNodesLoading(true);
    try {
      const data = await apiService.getNodes();
      setNodes(Array.isArray(data) ? data : []);
    } catch (err) {
      if (!silent) showToast('Не удалось загрузить список узлов', 'error');
    } finally {
      setNodesLoading(false);
    }
  }, [showToast]);

  const createNode = useCallback(async (payload) => {
    try {
      await apiService.createNode(payload);
      await loadNodes(true);
      showToast('Новый узел успешно подключен', 'success');
    } catch (err) {
      showToast(err.message || 'Ошибка сохранения узла', 'error');
      throw err;
    }
  }, [loadNodes, showToast]);

  const updateNode = useCallback(async (id, payload) => {
    try {
      await apiService.updateNode(id, payload);
      await loadNodes(true);
      showToast('Настройки узла успешно сохранены', 'success');
    } catch (err) {
      showToast(err.message || 'Ошибка сохранения узла', 'error');
      throw err;
    }
  }, [loadNodes, showToast]);

  const deleteNode = useCallback(async (id) => {
    try {
      await apiService.deleteNode(id);
      await loadNodes(true);
      showToast('Узел успешно удален', 'success');
    } catch (err) {
      showToast(err.message || 'Ошибка удаления узла', 'error');
      throw err;
    }
  }, [loadNodes, showToast]);
  const loadSettings = useCallback(async () => {
    setSettingsLoading(true);
    try {
      const data = await apiService.getSettings();
      setSettings(prev => ({ ...prev, ...data }));
    } catch (err) {
      showToast('Ошибка при получении настроек панели', 'error');
    } finally {
      setSettingsLoading(false);
    }
  }, [showToast]);

  const saveSettings = useCallback(async (newSettings) => {
    try {
      await apiService.saveSettings(newSettings);
      setSettings(newSettings);
      showToast('Глобальная конфигурация успешно сохранена', 'success');
    } catch (err) {
      showToast('Не удалось сохранить настройки', 'error');
      throw err;
    }
  }, [showToast]);
  useEffect(() => {
    const interval = setInterval(() => {
      loadUsers(true);
      loadNodes(true);
    }, 5000);

    return () => clearInterval(interval);
  }, [loadUsers, loadNodes]);

  return (
    <StoreContext.Provider value={{
      users,
      nodes,
      settings,
      usersLoading,
      nodesLoading,
      settingsLoading,
      toast,
      showToast,
      clearToast,
      loadUsers,
      createClient,
      updateClient,
      deleteClient,
      toggleClient,
      loadNodes,
      createNode,
      updateNode,
      deleteNode,
      loadSettings,
      saveSettings
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore должен использоваться внутри StoreProvider');
  }
  return context;
}