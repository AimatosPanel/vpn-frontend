class ApiService {
  getApiBaseUrl() {
    if (window.API_BASE_URL && window.API_BASE_URL.trim() !== "") {
      return window.API_BASE_URL;
    }
    const envUrl = import.meta.env.VITE_API_BASE_URL;
    if (envUrl && envUrl.trim() !== "") {
      return envUrl;
    }
    if (window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost") {
      return "http://127.0.0.1:8090";
    }
    return window.location.origin;
  }

  getAdminToken() {
    return localStorage.getItem("admin_token") || "";
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };
    const token = this.getAdminToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  parseJwt(token) {
    try {
      if (!token) return null;
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  }
  isTokenExpired(token) {
    if (!token) return true;
    try {
      const claims = this.parseJwt(token);
      if (!claims || !claims.exp) return true;
      
      const now = Math.floor(Date.now() / 1000);
      return claims.exp < now; // Токен просрочен, если текущее время больше exp
    } catch (e) {
      return true;
    }
  }
  clearSession() {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_role");
    localStorage.removeItem("admin_username");
    localStorage.removeItem("admin_permissions");
    localStorage.removeItem("admin_is_root");
    
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  }

  async fetchJson(endpoint, options = {}) {
    const token = this.getAdminToken();
    if (token && this.isTokenExpired(token)) {
      this.clearSession();
      throw new Error('Время действия сессии истекло');
    }

    const baseUrl = this.getApiBaseUrl();
    const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;
    const headers = { ...this.getHeaders(), ...options.headers };

    try {
      const response = await fetch(url, { ...options, headers });
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          this.clearSession();
        }
        
        const errorData = await response.json().catch(() => ({ error: 'Ошибка сессии или сервера' }));
        throw new Error(errorData.error || `Ошибка: ${response.status}`);
      }
      
      return response.json();
    } catch (err) {
      if (err.message && (err.message.includes('Failed to fetch') || err.message.includes('NetworkError'))) {
        throw new Error('Сервер панели временно недоступен. Проверьте соединение.');
      }
      throw err;
    }
  }

  async login(username, password) {
    const res = await this.fetchJson('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    if (res.token) {
      localStorage.setItem("admin_token", res.token);
      localStorage.setItem("admin_username", res.username);
      
      const claims = this.parseJwt(res.token);
      if (claims) {
        localStorage.setItem("admin_permissions", JSON.stringify(claims.permissions || []));
        localStorage.setItem("admin_is_root", claims.is_root ? "1" : "0");
        localStorage.setItem("admin_role", claims.role_name || "");
      }
    }
    return res;
  }

  async forgotPassword(email) {
    return this.fetchJson('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  }

  async resetPassword(token, password) {
    return this.fetchJson('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password })
    });
  }

  async getAdmins() { return this.fetchJson('/api/admins'); }
  async createAdmin(payload) { return this.fetchJson('/api/admins', { method: 'POST', body: JSON.stringify(payload) }); }
  async updateAdmin(id, payload) { return this.fetchJson(`/api/admins/${id}`, { method: 'PUT', body: JSON.stringify(payload) }); }
  async deleteAdmin(id) { return this.fetchJson(`/api/admins/${id}`, { method: 'DELETE' }); }

  async getClients() { return this.fetchJson('/users'); }
  async createClient(payload) { return this.fetchJson('/users', { method: 'POST', body: JSON.stringify(payload) }); }
  async updateClient(id, payload) { return this.fetchJson(`/users/${id}`, { method: 'PUT', body: JSON.stringify(payload) }); }
  async deleteClient(id) { return this.fetchJson(`/users/${id}`, { method: 'DELETE' }); }
  async toggleClient(id) { return this.fetchJson(`/users/${id}/toggle`, { method: 'POST' }); }

  async bulkToggle(ids) { return this.fetchJson('/users/bulk/toggle', { method: 'POST', body: JSON.stringify({ ids }) }); }
  async bulkDelete(ids) { return this.fetchJson('/users/bulk/delete', { method: 'POST', body: JSON.stringify({ ids }) }); }
  async bulkReset(ids) { return this.fetchJson('/users/bulk/reset', { method: 'POST', body: JSON.stringify({ ids }) }); }

  async getNodes() { return this.fetchJson('/api/nodes'); }
  async createNode(payload) { return this.fetchJson('/api/nodes', { method: 'POST', body: JSON.stringify(payload) }); }
  async updateNode(id, payload) { return this.fetchJson(`/api/nodes/${id}`, { method: 'PUT', body: JSON.stringify(payload) }); }
  async deleteNode(id) { return this.fetchJson(`/api/nodes/${id}`, { method: 'DELETE' }); }

  async getSettings() { return this.fetchJson('/settings'); }
  async saveSettings(settings) { return this.fetchJson('/settings', { method: 'POST', body: JSON.stringify(settings) }); }

  async getLogs(nodeId, type, filters = {}) {
    const { level = '', component = '', search = '', limit = 100, offset = 0 } = filters;
    return this.fetchJson(`/api/logs?node_id=${nodeId}&type=${type}&level=${level}&component=${component}&search=${search}&limit=${limit}&offset=${offset}`);
  }
  async getSubscription(uuid) { return this.fetchJson(`/sub/${uuid}?format=json`); }

  subscribeToLogsStream(nodeId, onMessage, onError) {
    const baseUrl = this.getApiBaseUrl();
    const streamUrl = `${baseUrl}/api/stream/logs?node_id=${nodeId || 'master'}&X-API-Key=${encodeURIComponent(this.getAdminToken())}`;
    const eventSource = new EventSource(streamUrl);

    eventSource.onmessage = (event) => {
      try { onMessage(JSON.parse(event.data)); } catch (e) {}
    };
    eventSource.onerror = (err) => { onError(err); eventSource.close(); };
    return () => eventSource.close();
  }
}

export const apiService = new ApiService();