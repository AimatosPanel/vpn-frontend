import React, { useState, useEffect } from 'react';
import { useSettings, useSaveSettings } from '../hooks/useApi';
import { apiService } from '../services/ApiService';
import PageContainer from '../components/Common/PageContainer';
import { Switch, Button } from '../components/Common/UI';
import { useHasPermission } from '../hooks/useHasPermission';

export default function SettingsView() {
  const { data: currentSettings, isLoading } = useSettings();
  const saveMutation = useSaveSettings();
  const { hasPermission, isRoot } = useHasPermission();

  const canWriteSettings = hasPermission('settings:write');
  const canManageAdmins = hasPermission('admins:manage');

  const [settings, setSettings] = useState({
    brand_name: 'AimatosPanel',
    reality_sni: 'microsoft.com',
    hysteria_obfs: 'ObfsSecretPass123',
    log_mask_ips: '1',
    log_retention_days: '7',
    
    torrent_policy: 'block',
    torrent_throttle_speed: '512',
    dns_adblock: '1',
    dns_malware: '1',
    dns_adblock_custom_urls: '',
    dns_upstream_servers: '1.1.1.1,8.8.8.8',

    wireguard_subnet: '10.8.0.0/24',
    wireguard_mtu: '1420',
    wireguard_dns: '1.1.1.1, 10.8.0.1',
    shadowsocks_method: '2022-blake3-aes-128-gcm',
    enable_vless_tcp_reality: '1',
    enable_vless_grpc_reality: '1',
    enable_vless_h2_reality: '1',
    enable_vless_quic_reality: '1',
    enable_vless_httpupgrade_reality: '1',
    enable_vless_ws_reality: '1',
    enable_vless_xtls_vision: '1',

    enable_vmess_ws_tls: '1',
    enable_vmess_grpc: '1',
    enable_vmess_httpupgrade: '1',
    enable_vmess_reality: '1',

    enable_trojan_reality: '1',
    enable_trojan_grpc: '1',
    enable_trojan_ws_tls: '1',

    enable_wireguard: '1',
    enable_shadowsocks: '1',
    enable_socks5_tls: '1',
    enable_http_tls: '1',
    enable_naive: '1',
    port_vless_h2_reality: '8450',
    port_vless_quic_reality: '8451',
    port_vless_httpupgrade_reality: '8452',
    port_vless_ws_reality: '8453',
    port_vless_xtls_vision: '8454',

    port_vmess_ws_tls: '8455',
    port_vmess_grpc: '8456',
    port_vmess_httpupgrade: '8457',
    port_vmess_reality: '8458',

    port_trojan_reality: '8459',
    port_trojan_grpc: '8460',
    port_trojan_ws_tls: '8461',

    port_socks5_tls: '8462',
    port_http_tls: '8463',
    port_naive: '8446',
    tls_cert: '',
    tls_key: ''
  });

  const [admins, setAdmins] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [adminForm, setAdminForm] = useState({
    username: '',
    email: '',
    password: '',
    role_id: 0
  });

  const [adminsMessage, setAdminsMessage] = useState('');

  const fetchAdminsAndRoles = async () => {
    if (canManageAdmins) {
      try {
        const adminsData = await apiService.getAdmins();
        setAdmins(adminsData || []);
        
        const rolesData = await apiService.fetchJson('/api/roles');
        setRoles(rolesData || []);
      } catch (err) {}
    }
  };

  useEffect(() => {
    if (currentSettings) {
      setSettings(prev => ({ ...prev, ...currentSettings }));
    }
    fetchAdminsAndRoles();
  }, [currentSettings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleToggle = (key, checked) => {
    setSettings(prev => ({ ...prev, [key]: checked ? '1' : '0' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canWriteSettings) return;
    saveMutation.mutate(settings);
  };

  const openAddAdminModal = () => {
    setEditingAdmin(null);
    const defaultRoleID = roles.length > 0 ? roles[roles.length - 1].ID || roles[0].id : 0;
    setAdminForm({ username: '', email: '', password: '', role_id: defaultRoleID });
    setIsAdminModalOpen(true);
  };

  const openEditAdminModal = (adm) => {
    setEditingAdmin(adm);
    setAdminForm({ username: adm.username, email: adm.email, password: '', role_id: adm.role_id });
    setIsAdminModalOpen(true);
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setAdminsMessage('');
    
    const payload = {
      username: adminForm.username,
      email: adminForm.email,
      role_id: parseInt(adminForm.role_id),
      password: adminForm.password
    };

    try {
      if (editingAdmin) {
        await apiService.updateAdmin(editingAdmin.id, payload);
        setAdminsMessage('Данные администратора обновлены');
      } else {
        await apiService.createAdmin(payload);
        setAdminsMessage('Новый администратор успешно добавлен');
      }
      setIsAdminModalOpen(false);
      fetchAdminsAndRoles();
    } catch (err) {
      alert(err.message || 'Ошибка сохранения');
    }
  };

  const handleDeleteAdmin = async (id) => {
    if (confirm('Вы действительно хотите удалить этого администратора?')) {
      try {
        await apiService.deleteAdmin(id);
        fetchAdminsAndRoles();
      } catch (err) {
        alert(err.message || 'Не удалось удалить администратора');
      }
    }
  };

  const settingsIcon = (
    <svg className="w-6 h-6 text-[#D0BCFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

  if (isLoading) {
    return (
      <PageContainer title="Конфигурация сети" icon={settingsIcon}>
        <div className="py-16 text-center text-xs text-gray-500">Чтение параметров конфигурации...</div>
      </PageContainer>
    );
  }

  const renderProtocolControl = (label, toggleKey, portKey) => (
    <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-[#141218]/40 p-4 rounded-xl border border-white/5 gap-4">
      <div className="flex items-center space-x-3">
        <Switch 
          checked={settings[toggleKey] === '1'} 
          disabled={!canWriteSettings}
          onChange={(checked) => handleToggle(toggleKey, checked)} 
        />
        <span className="text-xs font-semibold text-[#E6E1E5]">{label}</span>
      </div>
      {portKey && settings[toggleKey] === '1' && (
        <div className="flex items-center space-x-2 shrink-0 animate-in fade-in duration-200">
          <span className="text-[10px] text-gray-400 font-bold">Порт:</span>
          <input 
            type="number" 
            name={portKey}
            disabled={!canWriteSettings}
            value={settings[portKey]} 
            onChange={handleChange} 
            min={1}
            max={65535}
            className="w-20 bg-[#141218] border border-[#2B2930] rounded-[12px] px-3 py-1.5 text-xs text-center font-bold text-white focus:outline-none focus:border-[#D0BCFF] disabled:opacity-50" 
          />
        </div>
      )}
    </div>
  );

  return (
    <PageContainer 
      title="Конфигурация сети" 
      subtitle="Управление криптографией, транспортом и безопасностью панели" 
      icon={settingsIcon}
    >
      <div className="space-y-6">
        <form onSubmit={handleSubmit} className="bg-[#1D1B20]/95 rounded-[28px] p-6 border border-[#2B2930] space-y-6 shadow-sm">
          
          <div className="bg-[#211F26]/40 p-5 rounded-2xl border border-[#2B2930]/40 space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#D0BCFF]">Брендирование подписки</h3>
            <div>
              <label className="block text-xs text-[#CAC4D0] mb-1.5 font-semibold">Кастомное имя подписки</label>
              <input 
                type="text" 
                name="brand_name" 
                disabled={!canWriteSettings}
                value={settings.brand_name} 
                onChange={handleChange} 
                placeholder="AimatosPanel"
                className="w-full bg-[#141218] border border-[#2B2930] rounded-[16px] px-4 py-3 text-sm text-[#E6E1E5] focus:outline-none focus:border-[#D0BCFF] focus:ring-1 focus:ring-[#D0BCFF] transition-all disabled:opacity-50" 
              />
            </div>
          </div>

          <div className="bg-[#211F26]/40 p-5 rounded-2xl border border-[#2B2930]/40 space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#D0BCFF]">Сетевая криптография и Stealth</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#CAC4D0] mb-1.5 font-semibold">Reality SNI (Домен маскировки)</label>
                <input 
                  type="text" 
                  name="reality_sni" 
                  disabled={!canWriteSettings}
                  value={settings.reality_sni} 
                  onChange={handleChange} 
                  placeholder="microsoft.com"
                  className="w-full bg-[#141218] border border-[#2B2930] rounded-[16px] px-4 py-3 text-sm text-[#E6E1E5] focus:outline-none focus:border-[#D0BCFF] focus:ring-1 focus:ring-[#D0BCFF] transition-all disabled:opacity-50" 
                />
              </div>
              <div>
                <label className="block text-xs text-[#CAC4D0] mb-1.5 font-semibold">Hysteria 2 Obfs Password</label>
                <input 
                  type="text" 
                  name="hysteria_obfs" 
                  disabled={!canWriteSettings}
                  value={settings.hysteria_obfs} 
                  onChange={handleChange} 
                  placeholder="ObfsSecretPass123"
                  className="w-full bg-[#141218] border border-[#2B2930] rounded-[16px] px-4 py-3 text-sm text-[#E6E1E5] focus:outline-none focus:border-[#D0BCFF] focus:ring-1 focus:ring-[#D0BCFF] transition-all disabled:opacity-50" 
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-[#CAC4D0] mb-1.5 font-semibold">Шифрование Shadowsocks 2022</label>
              <select
                name="shadowsocks_method"
                disabled={!canWriteSettings}
                value={settings.shadowsocks_method}
                onChange={handleChange}
                className="w-full bg-[#141218] border border-[#2B2930] rounded-[16px] px-4 py-3 text-sm text-[#E6E1E5] focus:outline-none focus:border-[#D0BCFF] transition-all disabled:opacity-50"
              >
                <option value="2022-blake3-aes-128-gcm">2022-blake3-aes-128-gcm (По умолчанию)</option>
                <option value="2022-blake3-aes-256-gcm">2022-blake3-aes-256-gcm (Макс. защита)</option>
                <option value="2022-blake3-chacha20-poly1305">2022-blake3-chacha20-poly1305 (Для ARM)</option>
              </select>
            </div>
          </div>

          <div className="bg-[#211F26]/40 p-5 rounded-2xl border border-[#2B2930]/40 space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#D0BCFF]">Пользовательские SSL Сертификаты (TLS / Domain)</h3>
            <p className="text-[10px] text-gray-400">Используются для классических зашифрованных TLS-транспортов. Если оставить поля пустыми, узел автоматически сгенерирует криптоустойчивый ECDSA-сертификат локально.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#CAC4D0] mb-1.5 font-semibold">Сертификат (tls_cert)</label>
                <textarea 
                  name="tls_cert" 
                  rows={4}
                  disabled={!canWriteSettings}
                  value={settings.tls_cert} 
                  onChange={handleChange} 
                  placeholder="-----BEGIN CERTIFICATE-----"
                  className="w-full bg-[#141218] border border-[#2B2930] rounded-[16px] p-3 text-[10px] font-mono text-[#D0BCFF] focus:outline-none focus:border-[#D0BCFF] resize-none disabled:opacity-50" 
                />
              </div>
              <div>
                <label className="block text-xs text-[#CAC4D0] mb-1.5 font-semibold">Приватный ключ (tls_key)</label>
                <textarea 
                  name="tls_key" 
                  rows={4}
                  disabled={!canWriteSettings}
                  value={settings.tls_key} 
                  onChange={handleChange} 
                  placeholder="-----BEGIN EC PRIVATE KEY-----"
                  className="w-full bg-[#141218] border border-[#2B2930] rounded-[16px] p-3 text-[10px] font-mono text-[#D0BCFF] focus:outline-none focus:border-[#D0BCFF] resize-none disabled:opacity-50" 
                />
              </div>
            </div>
          </div>

          <div className="bg-[#211F26]/40 p-5 rounded-2xl border border-[#2B2930]/40 space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#D0BCFF]">Вариации транспортов VLESS</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderProtocolControl("VLESS TCP Reality", "enable_vless_tcp_reality", null)}
              {renderProtocolControl("VLESS gRPC Reality", "enable_vless_grpc_reality", null)}
              {renderProtocolControl("VLESS HTTP/2 Reality", "enable_vless_h2_reality", "port_vless_h2_reality")}
              {renderProtocolControl("VLESS QUIC Reality", "enable_vless_quic_reality", "port_vless_quic_reality")}
              {renderProtocolControl("VLESS HTTPUpgrade Reality", "enable_vless_httpupgrade_reality", "port_vless_httpupgrade_reality")}
              {renderProtocolControl("VLESS WS Reality", "enable_vless_ws_reality", "port_vless_ws_reality")}
              {renderProtocolControl("VLESS XTLS Vision", "enable_vless_xtls_vision", "port_vless_xtls_vision")}
            </div>
          </div>

          <div className="bg-[#211F26]/40 p-5 rounded-2xl border border-[#2B2930]/40 space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#D0BCFF]">Вариации транспортов VMess</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderProtocolControl("VMess WebSocket + TLS (CDN)", "enable_vmess_ws_tls", "port_vmess_ws_tls")}
              {renderProtocolControl("VMess gRPC + TLS", "enable_vmess_grpc", "port_vmess_grpc")}
              {renderProtocolControl("VMess HTTPUpgrade + TLS", "enable_vmess_httpupgrade", "port_vmess_httpupgrade")}
              {renderProtocolControl("VMess Reality (TCP)", "enable_vmess_reality", "port_vmess_reality")}
            </div>
          </div>

          <div className="bg-[#211F26]/40 p-5 rounded-2xl border border-[#2B2930]/40 space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#D0BCFF]">Вариации транспортов Trojan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderProtocolControl("Trojan Reality (TCP)", "enable_trojan_reality", "port_trojan_reality")}
              {renderProtocolControl("Trojan gRPC + TLS", "enable_trojan_grpc", "port_trojan_grpc")}
              {renderProtocolControl("Trojan WebSocket + TLS", "enable_trojan_ws_tls", "port_trojan_ws_tls")}
            </div>
          </div>

          <div className="bg-[#211F26]/40 p-5 rounded-2xl border border-[#2B2930]/40 space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#D0BCFF]">Сетевые туннели и Прокси</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderProtocolControl("WireGuard Network Tunnel", "enable_wireguard", null)}
              {renderProtocolControl("Shadowsocks (AEAD 2022)", "enable_shadowsocks", null)}
              {renderProtocolControl("NaiveProxy + TLS", "enable_naive", "port_naive")}
              {renderProtocolControl("Socks5 Proxy + TLS", "enable_socks5_tls", "port_socks5_tls")}
              {renderProtocolControl("HTTP Connect Proxy + TLS", "enable_http_tls", "port_http_tls")}
            </div>
          </div>

          <div className="bg-[#211F26]/40 p-5 rounded-2xl border border-[#2B2930]/40 space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#D0BCFF]">Глубокие параметры WireGuard</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-[#CAC4D0] mb-1.5 font-semibold">Адресная IPv4 подсеть CIDR</label>
                <input 
                  type="text" 
                  name="wireguard_subnet" 
                  disabled={!canWriteSettings}
                  value={settings.wireguard_subnet} 
                  onChange={handleChange} 
                  placeholder="10.8.0.0/24"
                  className="w-full bg-[#141218] border border-[#2B2930] rounded-[16px] px-4 py-3 text-sm text-[#E6E1E5] focus:outline-none focus:border-[#D0BCFF] focus:ring-1 focus:ring-[#D0BCFF] transition-all disabled:opacity-50" 
                />
              </div>
              <div>
                <label className="block text-xs text-[#CAC4D0] mb-1.5 font-semibold">Параметр MTU туннеля</label>
                <input 
                  type="text" 
                  name="wireguard_mtu" 
                  disabled={!canWriteSettings}
                  value={settings.wireguard_mtu} 
                  onChange={handleChange} 
                  placeholder="1420"
                  className="w-full bg-[#141218] border border-[#2B2930] rounded-[16px] px-4 py-3 text-sm text-[#E6E1E5] focus:outline-none" 
                />
              </div>
              <div>
                <label className="block text-xs text-[#CAC4D0] mb-1.5 font-semibold">DNS для WG клиентов</label>
                <input 
                  type="text" 
                  name="wireguard_dns" 
                  disabled={!canWriteSettings}
                  value={settings.wireguard_dns} 
                  onChange={handleChange} 
                  placeholder="1.1.1.1, 10.8.0.1"
                  className="w-full bg-[#141218] border border-[#2B2930] rounded-[16px] px-4 py-3 text-sm text-[#E6E1E5] focus:outline-none" 
                />
              </div>
            </div>
          </div>

          <div className="bg-[#211F26]/40 p-5 rounded-2xl border border-[#2B2930]/40 space-y-5">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#D0BCFF]">Аудит, Безопасность и Маршрутизация</h3>
            
            <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-[#141218]/50 p-4 rounded-xl border border-white/5 gap-4">
              <div>
                <h4 className="text-xs font-semibold text-[#E6E1E5]">Политика P2P / BitTorrent трафика</h4>
                <p className="text-[10px] text-gray-400 mt-0.5">Укажите действие узла при обнаружении торрент-сигнатур</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                <select
                  name="torrent_policy"
                  disabled={!canWriteSettings}
                  value={settings.torrent_policy}
                  onChange={handleChange}
                  className="bg-[#141218] border border-[#2B2930] rounded-xl px-4 py-2.5 text-xs font-semibold text-white focus:outline-none"
                >
                  <option value="allow">Разрешить торренты</option>
                  <option value="block">Полностью блокировать (Drop)</option>
                  <option value="throttle">Ограничить скорость (Throttle)</option>
                </select>
                {settings.torrent_policy === 'throttle' && (
                  <div className="flex items-center gap-1.5 animate-in fade-in duration-200">
                    <input 
                      type="number" 
                      name="torrent_throttle_speed" 
                      disabled={!canWriteSettings}
                      value={settings.torrent_throttle_speed} 
                      onChange={handleChange} 
                      className="w-20 bg-[#141218] border border-[#2B2930] rounded-xl px-3 py-2 text-xs font-bold text-center text-white focus:outline-none" 
                    />
                    <span className="text-[10px] text-gray-400 font-bold uppercase">кбит/с</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 bg-[#141218]/50 p-4 rounded-xl border border-white/5">
              <div className="flex justify-between items-center gap-4">
                <div>
                  <h4 className="text-xs font-semibold text-[#E6E1E5]">DNS-фильтрация AdBlock</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">Блокировка рекламы и аналитики на уровне узла</p>
                </div>
                <Switch 
                  checked={settings.dns_adblock === '1'} 
                  disabled={!canWriteSettings}
                  onChange={(checked) => handleToggle("dns_adblock", checked)} 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 bg-[#141218]/50 p-4 rounded-xl border border-white/5">
              <div className="flex justify-between items-center gap-4">
                <div>
                  <h4 className="text-xs font-semibold text-[#E6E1E5]">Защита от вредоносных сайтов (Anti-Malware)</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">Автоматический бан фишинговых и мошеннических доменов</p>
                </div>
                <Switch 
                  checked={settings.dns_malware === '1'} 
                  disabled={!canWriteSettings}
                  onChange={(checked) => handleToggle("dns_malware", checked)} 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#CAC4D0] mb-1.5 font-semibold">Глобальные Upstream DNS серверы</label>
                <input 
                  type="text" 
                  name="dns_upstream_servers" 
                  disabled={!canWriteSettings}
                  value={settings.dns_upstream_servers} 
                  onChange={handleChange} 
                  placeholder="1.1.1.1, 8.8.8.8"
                  className="w-full bg-[#141218] border border-[#2B2930] rounded-[16px] px-4 py-3 text-xs text-[#E6E1E5] font-mono focus:outline-none" 
                />
              </div>
              <div>
                <label className="block text-xs text-[#CAC4D0] mb-1.5 font-semibold">Ссылки на внешние AdBlock листы (через запятую)</label>
                <input 
                  type="text" 
                  name="dns_adblock_custom_urls" 
                  disabled={!canWriteSettings}
                  value={settings.dns_adblock_custom_urls} 
                  onChange={handleChange} 
                  placeholder="https://example.com/adlist.txt"
                  className="w-full bg-[#141218] border border-[#2B2930] rounded-[16px] px-4 py-3 text-xs text-[#E6E1E5] font-mono focus:outline-none" 
                />
              </div>
            </div>

            <div className="flex justify-between items-center bg-[#141218]/50 p-4 rounded-xl border border-white/5 gap-4">
              <div>
                <h4 className="text-xs font-semibold text-[#E6E1E5]">Маскировать IP-адреса</h4>
                <p className="text-[10px] text-gray-400 mt-0.5">Скрывать последний октет IP-клиентов в журнале соединений</p>
              </div>
              <Switch 
                checked={settings.log_mask_ips === '1'} 
                disabled={!canWriteSettings}
                onChange={(checked) => handleToggle("log_mask_ips", checked)} 
              />
            </div>
            
            <div className="flex justify-between items-center bg-[#141218]/50 p-4 rounded-xl border border-white/5 gap-4">
              <div>
                <h4 className="text-xs font-semibold text-[#E6E1E5]">Срок хранения логов в БД</h4>
                <p className="text-[10px] text-gray-400 mt-0.5">Количество дней до автоматического удаления журналов из SQLite</p>
              </div>
              <div className="flex items-center space-x-2 shrink-0">
                <input 
                  type="number" 
                  name="log_retention_days" 
                  disabled={!canWriteSettings}
                  value={settings.log_retention_days} 
                  onChange={handleChange} 
                  min={1}
                  className="w-18 bg-[#141218] border border-[#2B2930] rounded-[12px] px-3 py-2 text-xs text-center font-bold text-white focus:outline-none focus:border-[#D0BCFF] disabled:opacity-50" 
                />
                <span className="text-[10px] text-gray-400 font-bold uppercase">дн.</span>
              </div>
            </div>
          </div>

          {canWriteSettings && (
            <Button 
              type="submit" 
              disabled={saveMutation.isPending} 
              variant="primary"
              className="w-full !py-3.5"
            >
              {saveMutation.isPending ? 'Сохранение глобальной конфигурации...' : 'Сохранить изменения'}
            </Button>
          )}
        </form>

        {canManageAdmins && (
          <div className="bg-[#1D1B20]/95 rounded-[28px] p-6 border border-[#2B2930] space-y-4 shadow-sm animate-in fade-in duration-200">
            <div className="flex justify-between items-center pb-2 border-b border-[#2B2930]/40">
              <div>
                <h3 className="text-sm font-semibold text-white tracking-wide">👥 Системные Администраторы</h3>
                <p className="text-[10px] text-gray-400 mt-0.5">Управление пользователями с разграничением прав панели</p>
              </div>
              <button 
                onClick={openAddAdminModal}
                className="bg-[#D0BCFF] hover:bg-[#CCC2DC] text-[#381E72] active:scale-95 px-4 py-2 rounded-full text-xs font-bold transition duration-200"
              >
                + Добавить админа
              </button>
            </div>

            {adminsMessage && (
              <div className="bg-[#1C2C1E] text-[#A3CFB1] rounded-2xl p-3 text-[11px] text-center">{adminsMessage}</div>
            )}

            <div className="flex flex-col gap-2.5">
              {admins.map((adm) => (
                <div key={adm.id} className="bg-[#211F26] p-4 rounded-2xl border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-sm text-white">{adm.username}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase border ${
                        adm.is_root 
                          ? 'bg-[#FFE082]/10 text-[#FFE082] border-[#FFE082]/20' 
                          : 'bg-[#D0BCFF]/10 text-[#D0BCFF] border-[#D0BCFF]/20'
                      }`}>
                        {adm.role_name}
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-400 font-mono">{adm.email}</span>
                  </div>

                  <div className="flex space-x-2">
                    {(!adm.is_root || isRoot) && (
                      <button 
                        onClick={() => openEditAdminModal(adm)}
                        className="bg-[#4A4458] text-white hover:bg-white/5 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase"
                      >
                        Редактировать
                      </button>
                    )}
                    {!adm.is_root && (
                      <button 
                        onClick={() => handleDeleteAdmin(adm.id)}
                        className="bg-[#601410]/20 text-[#F2B8B5] hover:bg-[#601410]/35 border border-[#F2B8B5]/10 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase"
                      >
                        Удалить
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {isAdminModalOpen && canManageAdmins && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4">
          <div onClick={() => setIsAdminModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
          
          <form onSubmit={handleAdminSubmit} className="relative bg-[#1D1B20] border border-[#2B2930] w-full max-w-md rounded-[28px] p-6 shadow-2xl space-y-4 z-10 text-xs text-[#E6E1E5]">
            <div className="flex justify-between items-center pb-2 border-b border-[#2B2930]/40">
              <h3 className="text-sm font-semibold text-white">
                {editingAdmin ? `⚙️ Редактирование админа: ${editingAdmin.username}` : '👥 Создание администратора'}
              </h3>
              <button 
                type="button" 
                onClick={() => setIsAdminModalOpen(false)}
                className="text-gray-400 hover:text-white text-2xl transition outline-none"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-[10px] text-[#CAC4D0] uppercase font-bold tracking-wider mb-1">Имя пользователя (Логин)</label>
                <input 
                  type="text" 
                  required
                  value={adminForm.username} 
                  onChange={e => setAdminForm({...adminForm, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')})} 
                  placeholder="operator_1"
                  className="w-full bg-[#211F26] border border-[#2B2930] rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#D0BCFF]"
                />
              </div>

              <div>
                <label className="block text-[10px] text-[#CAC4D0] uppercase font-bold tracking-wider mb-1">Email (Для сброса пароля)</label>
                <input 
                  type="email" 
                  required
                  value={adminForm.email} 
                  onChange={e => setAdminForm({...adminForm, email: e.target.value})} 
                  placeholder="contact@domain.com"
                  className="w-full bg-[#211F26] border border-[#2B2930] rounded-xl px-3 py-2.5 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] text-[#CAC4D0] uppercase font-bold tracking-wider mb-1">
                  {editingAdmin ? 'Новый пароль (Оставьте пустым для сохранения старого)' : 'Пароль'}
                </label>
                <input 
                  type="password" 
                  required={!editingAdmin}
                  value={adminForm.password} 
                  onChange={e => setAdminForm({...adminForm, password: e.target.value})} 
                  placeholder="••••••••"
                  className="w-full bg-[#211F26] border border-[#2B2930] rounded-xl px-3 py-2.5 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] text-[#CAC4D0] uppercase font-bold tracking-wider mb-1">Группа прав (Роль)</label>
                <select 
                  value={adminForm.role_id} 
                  onChange={e => setAdminForm({...adminForm, role_id: e.target.value})}
                  className="w-full bg-[#211F26] border border-[#2B2930] rounded-xl px-3 py-2.5 focus:outline-none text-white cursor-pointer"
                >
                  {roles.map((role) => {
                    if (role.name === 'Root Role' && !isRoot) return null;
                    return (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#2B2930]/40">
              <button 
                type="button" 
                onClick={() => setIsAdminModalOpen(false)}
                className="bg-[#4A4458] text-[#E8DEF8] py-2.5 rounded-full text-xs font-semibold"
              >
                Отмена
              </button>
              <button 
                type="submit"
                className="bg-[#D0BCFF] text-[#381E72] py-2.5 rounded-full text-xs font-semibold"
              >
                {editingAdmin ? 'Сохранить' : 'Создать'}
              </button>
            </div>
          </form>
        </div>
      )}
    </PageContainer>
  );
}