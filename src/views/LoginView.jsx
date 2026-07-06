import React, { useState } from 'react';
import { apiService } from '../services/ApiService';
import Logo from '../components/Common/Logo';

export default function LoginView({ onLoginSuccess }) {
  const [screen, setScreen] = useState('login'); // login, forgot-cli
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await apiService.login(username, password);
      onLoginSuccess(data);
    } catch (err) {
      setError(err.message || 'Неверные учетные данные');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#141218] text-[#E6E1E5] flex items-center justify-center p-4">
      <div className="bg-[#1D1B20]/95 border border-[#2B2930] rounded-[28px] p-8 max-w-md w-full shadow-2xl space-y-6">
        
        {}
        <div className="flex flex-col items-center space-y-2 select-none text-center">
          <Logo className="w-12 h-12 text-[#D0BCFF]" />
          <h1 className="text-lg font-black tracking-wider text-white uppercase">
            AIMATOS<span className="text-[#D0BCFF] font-medium">PANEL</span>
          </h1>
          <span className="text-[10px] text-[#938F99] uppercase tracking-widest font-bold">
            Панель управления распределенной сетью
          </span>
        </div>

        {error && (
          <div className="bg-[#2C1A1D] border border-[#F2B8B5] text-[#F2B8B5] rounded-2xl p-3 text-xs text-center">
            ⚠️ {error}
          </div>
        )}

        {}
        {screen === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-[10px] text-[#CAC4D0] uppercase font-bold tracking-wider mb-1.5">Логин администратора</label>
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full bg-[#211F26] border border-[#2B2930] rounded-[16px] px-4 py-3 text-sm text-[#E6E1E5] placeholder-[#8F8B97] focus:outline-none focus:border-[#D0BCFF] transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] text-[#CAC4D0] uppercase font-bold tracking-wider mb-1.5">Пароль</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#211F26] border border-[#2B2930] rounded-[16px] px-4 py-3 text-sm text-[#E6E1E5] placeholder-[#8F8B97] focus:outline-none focus:border-[#D0BCFF] transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D0BCFF] hover:bg-[#CCC2DC] text-[#381E72] active:scale-98 py-3.5 rounded-full text-xs font-black uppercase tracking-wider transition duration-200 cursor-pointer"
            >
              {loading ? 'Авторизация...' : 'Войти в панель'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => { setScreen('forgot-cli'); setError(''); }}
                className="text-xs text-[#D0BCFF] hover:underline cursor-pointer"
              >
                Забыли пароль?
              </button>
            </div>
          </form>
        )}

        {}
        {screen === 'forgot-cli' && (
          <div className="space-y-4 text-xs text-center">
            <div className="bg-[#2B2930]/30 border border-[#D0BCFF]/10 rounded-2xl p-4 text-[#CAC4D0] leading-relaxed text-left space-y-3">
              <span className="text-base block text-center">🛡️ Безопасное восстановление</span>
              <p>
                В целях безопасности восстановление пароля возможно только через консольную утилиту на сервере Мастера.
              </p>
              <ol className="list-decimal list-inside space-y-1.5 text-[11px]">
                <li>Подключитесь к вашему серверу по SSH.</li>
                <li>Запустите системную утилиту управления:</li>
              </ol>
              
              <div className="bg-black/60 rounded-xl p-2.5 font-mono text-[11px] text-white flex justify-between items-center select-all border border-white/5">
                <span>aimatos</span>
                <span className="text-[9px] text-[#D0BCFF] uppercase font-bold tracking-wider select-none bg-[#381E72]/40 px-2 py-0.5 rounded-md">CLI</span>
              </div>

              <ol className="list-decimal list-inside space-y-1.5 text-[11px] start-3" start="3">
                <li>Выберите пункт <strong className="text-white">«Учетные записи и сброс паролей»</strong>.</li>
                <li>Затем выберите <strong className="text-white">«Сбросить пароль администратора»</strong>.</li>
                <li>Задайте новые данные доступа. Новый пароль будет отображаться в CLI в течение следующих 24 часов.</li>
              </ol>
            </div>

            <button
              type="button"
              onClick={() => setScreen('login')}
              className="w-full bg-[#4A4458] hover:bg-[#5E576F] text-[#E8DEF8] active:scale-98 py-3 rounded-full text-xs font-bold transition duration-150 cursor-pointer"
            >
              Вернуться к авторизации
            </button>
          </div>
        )}

      </div>
    </div>
  );
}