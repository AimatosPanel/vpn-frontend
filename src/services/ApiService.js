class ApiService {
  constructor() {
    this.fallbackKey = "SuperSecretAdminKey123";
  }

    etApiBaseUrl() {
        if (window.API_BASE_URL && window.API_BASE_URL.trim() !== "") {
        return window.API_BASE_URL;
        }
        const envUrl = import.meta.env.VITE_API_BASE_URL;
        if (envUrl && envUrl.trim() !== "") {
        return envUrl;
        }
        return window.location.origin;
    }

  getApiKey() {
    return localStorage.getItem("api_key") || this.fallbackKey;
  }

  getHeaders() {
    return {
      'Content-Type': 'application/json',
      'X-API-Key': this.getApiKey()
    };
  }

  async fetchJson(endpoint, options = {}) {
    const baseUrl = this.getApiBaseUrl();
    const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;
    const headers = { ...this.getHeaders(), ...options.headers };

    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Ошибка сервера' }));
      throw new Error(errorData.error || `Ошибка: ${response.status}`);
    }
    return response.json();
  }

    async getClients() { return this.fetchJson('/users'); }
  async createClient(payload) { return this.fetchJson('/users', { method: 'POST', body: JSON.stringify(payload) }); }
  async updateClient(id, payload) { return this.fetchJson(`/users/${id}`, { method: 'PUT', body: JSON.stringify(payload) }); }
  async deleteClient(id) { return this.fetchJson(`/users/${id}`, { method: 'DELETE' }); }
  async toggleClient(id) { return this.fetchJson(`/users/${id}/toggle`, { method: 'POST' }); }

    async bulkToggle(ids) { return this.fetchJson('/users/bulk/toggle', { method: 'POST', body: JSON.stringify({ ids }) }); }
  async bulkDelete(ids) { return this.fetchJson('/users/bulk/delete', { method: 'POST', body: JSON.stringify({ ids }) }); }
  async bulkReset(ids) { return this.fetchJson('/users/bulk/reset', { method: 'POST', body: JSON.stringify({ ids }) }); }
  async bulkExtend(ids, days) { return this.fetchJson('/users/bulk/extend', { method: 'POST', body: JSON.stringify({ ids, days }) }); }

    async getSettings() { return this.fetchJson('/settings'); }
  async saveSettings(settings) { return this.fetchJson('/settings', { method: 'POST', body: JSON.stringify(settings) }); }

    async getLogs(nodeId, type, filters = {}) {
    const { level = '', component = '', search = '', limit = 100, offset = 0 } = filters;
    return this.fetchJson(`/api/logs?node_id=${nodeId}&type=${type}&level=${level}&component=${component}&search=${search}&limit=${limit}&offset=${offset}`);
  }
  async getSubscription(uuid) { return this.fetchJson(`/sub/${uuid}?format=json`); }

    subscribeToLogsStream(nodeId, onMessage, onError) {
    const baseUrl = this.getApiBaseUrl();
    const streamUrl = `${baseUrl}/api/stream/logs?node_id=${nodeId || 'master'}&X-API-Key=${encodeURIComponent(this.getApiKey())}`;
    const eventSource = new EventSource(streamUrl);

    eventSource.onmessage = (event) => {
      try { onMessage(JSON.parse(event.data)); } catch (e) {}
    };
    eventSource.onerror = (err) => { onError(err); eventSource.close(); };
    return () => eventSource.close();
  }
}

export const apiService = new ApiService();