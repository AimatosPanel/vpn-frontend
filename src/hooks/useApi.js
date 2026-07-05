import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/ApiService';
import { useToast } from '../context/ToastContext';

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => apiService.getClients(),
    refetchInterval: 5000,
    placeholderData: (prev) => prev,
  });
}

export function useNodes() {
  return useQuery({
    queryKey: ['nodes'],
    queryFn: () => apiService.getNodes(),
    refetchInterval: 5000,
    placeholderData: (prev) => prev,
  });
}

export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: () => apiService.getSettings(),
    staleTime: 300000,
  });
}

export function useCreateClient(onSuccess) {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (payload) => apiService.createClient(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      showToast('Профиль успешно сгенерирован', 'success');
      if (onSuccess) onSuccess(data);
    },
    onError: (err) => {
      showToast(err.message || 'Ошибка генерации профиля', 'error');
    }
  });
}

export function useUpdateClient(onSuccess) {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: ({ id, payload }) => apiService.updateClient(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      showToast('Настройки профиля сохранены', 'success');
      if (onSuccess) onSuccess();
    },
    onError: (err) => {
      showToast(err.message || 'Ошибка обновления настроек', 'error');
    }
  });
}

export function useDeleteClient(onSuccess) {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (id) => apiService.deleteClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      showToast('Профиль успешно удален', 'success');
      if (onSuccess) onSuccess();
    },
    onError: () => {
      showToast('Не удалось удалить пользователя', 'error');
    }
  });
}

export function useToggleClient() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (id) => apiService.toggleClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: () => {
      showToast('Ошибка изменения статуса активности', 'error');
    }
  });
}

export function useBulkToggle(onSuccess) {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (ids) => apiService.bulkToggle(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      showToast('Статус выбранных профилей изменен', 'success');
      if (onSuccess) onSuccess();
    },
    onError: () => {
      showToast('Ошибка групповой смены статуса', 'error');
    }
  });
}

export function useBulkDelete(onSuccess) {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (ids) => apiService.bulkDelete(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      showToast('Выбранные профили успешно удалены', 'success');
      if (onSuccess) onSuccess();
    },
    onError: () => {
      showToast('Ошибка группового удаления', 'error');
    }
  });
}

export function useBulkReset(onSuccess) {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (ids) => apiService.bulkReset(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      showToast('Статистика трафика успешно сброшена', 'success');
      if (onSuccess) onSuccess();
    },
    onError: () => {
      showToast('Ошибка сброса трафика', 'error');
    }
  });
}

export function useCreateNode(onSuccess) {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (payload) => apiService.createNode(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nodes'] });
      showToast('Узел успешно подключен', 'success');
      if (onSuccess) onSuccess();
    },
    onError: (err) => {
      showToast(err.message || 'Ошибка сохранения настроек узла', 'error');
    }
  });
}

export function useUpdateNode(onSuccess) {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: ({ id, payload }) => apiService.updateNode(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nodes'] });
      showToast('Конфигурация узла успешно изменена', 'success');
      if (onSuccess) onSuccess();
    },
    onError: (err) => {
      showToast(err.message || 'Ошибка обновления настроек узла', 'error');
    }
  });
}

export function useDeleteNode(onSuccess) {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (id) => apiService.deleteNode(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nodes'] });
      showToast('Узел успешно удален', 'success');
      if (onSuccess) onSuccess();
    },
    onError: (err) => {
      showToast(err.message || 'Ошибка удаления узла', 'error');
    }
  });
}

export function useSaveSettings() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (payload) => apiService.saveSettings(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      showToast('Конфигурация успешно сохранена', 'success');
    },
    onError: () => {
      showToast('Не удалось сохранить настройки', 'error');
    }
  });
}