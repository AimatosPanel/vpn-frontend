import React, { useState, useEffect } from 'react';
import { apiService } from '../services/ApiService';
import Toast from '../components/Common/Toast';

export default function SettingsView() {
  const [settings, setSettings] = useState({
    vless_port: '8443',
    vless_grpc_port: '8447',
    hysteria_port: '8444',
    tuic_port: '8445',
    naive_port: '8446',
    reality_sni: 'microsoft.com',
    hysteria_obfs: 'ObfsSecretPass123',
    log_mask_ips: '1',
    log_retention_days: '7'
  });
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await apiService.getSettings();
        setSettings(prev => ({ ...prev, ...data }));
      } catch (e) {
        setToast({ message: 'Ошибка при получении настроек панели', type: 'error' });
      }
    };
    loadSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiService.saveSettings(settings);
      setToast({ message: 'Настройки успешно сохранены', type: 'success' });
    } catch (err) {
      setToast({ message: 'Не удалось сохранить настройки', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <h2 className="text-md font-bold text-[#D0BCFF]">⚙️ Глобальная конфигурация сети</h2>
      <form onSubmit={handleSubmit} className="bg-[#1D1B20] rounded-[28px] p-6 border border-[#2B2930] space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-[#CAC4D0] mb-1 font-medium">Порт VLESS TCP Reality</label>
            <input type="text" name="vless_port" value={settings.vless_port} onChange={handleChange} className="w-full bg-[#211F26] border border-[#8F8B97] rounded-[16px] px-4 py-2.5 text-sm text-[#E6E1E5] focus:outline-none focus:border-[#D0BCFF]" />
          </div>
          <div>
            <label className="block text-xs text-[#CAC4D0] mb-1 font-medium">Порт VLESS gRPC Reality</label>
            <input type="text" name="vless_grpc_port" value={settings.vless_grpc_port} onChange={handleChange} className="w-full bg-[#211F26] border border-[#8F8B97] rounded-[16px] px-4 py-2.5 text-sm text-[#E6E1E5] focus:outline-none focus:border-[#D0BCFF]" />
          </div>
          <div>
            <label className="block text-xs text-[#CAC4D0] mb-1 font-medium">Порт Hysteria 2 (UDP)</label>
            <input type="text" name="hysteria_port" value={settings.hysteria_port} onChange={handleChange} className="w-full bg-[#211F26] border border-[#8F8B97] rounded-[16px] px-4 py-2.5 text-sm text-[#E6E1E5] focus:outline-none focus:border-[#D0BCFF]" />
          </div>
          <div>
            <label className="block text-xs text-[#CAC4D0] mb-1 font-medium">Порт TUIC 5 (UDP)</label>
            <input type="text" name="tuic_port" value={settings.tuic_port} onChange={handleChange} className="w-full bg-[#211F26] border border-[#8F8B97] rounded-[16px] px-4 py-2.5 text-sm text-[#E6E1E5] focus:outline-none focus:border-[#D0BCFF]" />
          </div>
          <div>
            <label className="block text-xs text-[#CAC4D0] mb-1 font-medium">Порт NaiveProxy</label>
            <input type="text" name="naive_port" value={settings.naive_port} onChange={handleChange} className="w-full bg-[#211F26] border border-[#8F8B97] rounded-[16px] px-4 py-2.5 text-sm text-[#E6E1E5] focus:outline-none focus:border-[#D0BCFF]" />
          </div>
          <div>
            <label className="block text-xs text-[#CAC4D0] mb-1 font-medium">Reality SNI (Домен маскировки)</label>
            <input type="text" name="reality_sni" value={settings.reality_sni} onChange={handleChange} className="w-full bg-[#211F26] border border-[#8F8B97] rounded-[16px] px-4 py-2.5 text-sm text-[#E6E1E5] focus:outline-none focus:border-[#D0BCFF]" />
          </div>
        </div>

        <div className="border-t border-[#2B2930] pt-4 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-xs font-bold text-[#E6E1E5]">Маскировать IP-адреса</h4>
              <p className="text-[10px] text-gray-400">Скрывает последний октет IPv4-адресов в логах для приватности</p>
            </div>
            <select name="log_mask_ips" value={settings.log_mask_ips} onChange={handleChange} className="bg-[#211F26] border border-[#8F8B97] text-xs px-3 py-1.5 rounded-lg text-white">
              <option value="1">Включено</option>
              <option value="0">Выключено</option>
            </select>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-xs font-bold text-[#E6E1E5]">Срок очистки системных логов</h4>
              <p className="text-[10px] text-gray-400">Количество дней до автоудаления событий из БД</p>
            </div>
            <input type="number" name="log_retention_days" value={settings.log_retention_days} onChange={handleChange} className="w-24 bg-[#211F26] border border-[#8F8B97] rounded-[12px] px-3 py-1.5 text-xs text-center text-[#E6E1E5] focus:outline-none" />
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-[#D0BCFF] text-[#381E72] font-bold py-3 rounded-full text-xs transition disabled:opacity-50">
          {loading ? 'Сохранение настроек...' : 'Сохранить изменения'}
        </button>
      </form>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </main>
  );
}