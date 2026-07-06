import React, { useState, useEffect } from 'react';
import { apiService } from '../services/ApiService';
import FormatService from '../services/FormatService';
import { QRCodeSVG } from 'qrcode.react'; 
import Logo from '../components/Common/Logo';

function QrCodeLoader({ value, size = 112, className = "" }) {
  return (
    <div className={`flex items-center justify-center bg-white rounded-2xl shadow-inner p-3 select-none shrink-0 ${className}`}>
      <QRCodeSVG
        value={value}
        size={size}
        level="M"
        bgColor="#FFFFFF"
        fgColor="#000000"
        className="w-full h-full"
      />
    </div>
  );
}

export default function SubscriptionView({ uuid }) {
  const [sub, setSub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('home'); 
  const [activeOs, setActiveOs] = useState('android'); 
  const [copiedLabel, setCopiedLabel] = useState(null);
  const [qrModalData, setQrModalData] = useState(null); 

  const appsToInstall = [
    {
      id: 'hiddify',
      name: 'Hiddify Next',
      platform: 'Android, iOS, Win, Mac, Linux',
      icon: '🚀',
      downloadUrl: 'https://hiddify.com'
    },
    {
      id: 'shadowrocket',
      name: 'Shadowrocket',
      platform: 'Apple iOS / iPadOS (Платный)',
      icon: '🚀',
      downloadUrl: 'https://apps.apple.com/app/shadowrocket/id932747118'
    },
    {
      id: 'nekobox',
      name: 'NekoBox',
      platform: 'Android, Windows',
      icon: '🐱',
      downloadUrl: 'https://github.com/MatsuriDayo/NekoBoxForAndroid/releases'
    },
    {
      id: 'wireguard',
      name: 'WireGuard Client',
      platform: 'Все ОС (Для файлов .conf)',
      icon: '🛡️',
      downloadUrl: 'https://www.wireguard.com/install/'
    }
  ];

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      try {
        setLoading(true);
        const data = await apiService.getSubscription(uuid);
        setSub(data);
      } catch (err) {
        setError('Указанная подписка не найдена в системе или её действие приостановлено.');
      } finally {
        setLoading(false);
      }
    };
    fetchSubscriptionData();
  }, [uuid]);

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedLabel(label);
    setTimeout(() => setCopiedLabel(null), 2000);
  };

  const downloadWireguardFile = (configText, username) => {
    const element = document.createElement("a");
    const file = new Blob([configText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `wireguard_${username}.conf`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141218] text-[#E6E1E5] flex flex-col items-center justify-center p-6">
        <div className="relative flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#2B2930] border-t-[#D0BCFF] rounded-full animate-spin"></div>
        </div>
        <span className="text-xs font-semibold text-[#CAC4D0] uppercase tracking-wider mt-4 animate-pulse">
          Защищенное соединение...
        </span>
      </div>
    );
  }

  if (error || !sub) {
    return (
      <div className="min-h-screen bg-[#141218] text-[#E6E1E5] flex items-center justify-center p-6">
        <div className="bg-[#1D1B20] border border-[#2B2930] p-8 rounded-[24px] text-center max-w-sm w-full space-y-4 shadow-2xl">
          <span className="text-5xl block animate-bounce" role="img" aria-label="warning">⚠️</span>
          <h1 className="text-base font-black text-[#F2B8B5] tracking-tight uppercase">Доступ ограничен</h1>
          <p className="text-xs text-[#CAC4D0] leading-relaxed">
            {error || 'Не удалось получить данные подписки. Проверьте правильность ссылки.'}
          </p>
          <div className="text-[10px] text-[#938F99] font-mono select-all bg-black/40 p-3 rounded-xl border border-[#2B2930] break-all">
            UUID: {uuid}
          </div>
        </div>
      </div>
    );
  }

  const totalBytes = sub.traffic_limit_gb ? sub.traffic_limit_gb * 1073741824 : 0;
  const usedBytes = sub.traffic_used_bytes || 0;
  const isUnlimited = !sub.traffic_limit_gb || sub.traffic_limit_gb === 0;
  const progressPercent = isUnlimited ? 0 : Math.min((usedBytes / totalBytes) * 100, 100);
  const remainingBytes = isUnlimited ? null : Math.max(totalBytes - usedBytes, 0);

  const isExpired = sub.expires_at && new Date(sub.expires_at) < new Date();
  const isOverlimit = !isUnlimited && usedBytes >= totalBytes;

  const subUrl = `${window.location.origin}/sub/${uuid}`;

  const getStatusBadge = () => {
    if (!sub.is_active) {
      return (
        <span className="text-xs font-semibold text-[#F2B8B5] flex items-center gap-1.5 select-none">
          <span className="h-2 w-2 rounded-full bg-[#F2B8B5]"></span>
          Приостановлена
        </span>
      );
    }
    if (isExpired) {
      return (
        <span className="text-xs font-semibold text-[#F2B8B5] flex items-center gap-1.5 select-none">
          <span className="h-2 w-2 rounded-full bg-[#F2B8B5]"></span>
          Истек срок
        </span>
      );
    }
    if (isOverlimit) {
      return (
        <span className="text-xs font-semibold text-[#FFE082] flex items-center gap-1.5 select-none">
          <span className="h-2 w-2 rounded-full bg-[#FFE082]"></span>
          Лимит исчерпан
        </span>
      );
    }
    return (
      <span className="text-xs font-semibold text-[#A3CFB1] flex items-center gap-1.5 select-none">
        <span className="h-2 w-2 rounded-full bg-[#A3CFB1]"></span>
        Активна
      </span>
    );
  };

  const renderDiscreteProgressBar = (percent, isOver, isExp) => {
    const totalSegments = 12;
    const activeSegmentsCount = Math.min(Math.round((percent / 100) * totalSegments), totalSegments);

    const getActiveColorClass = () => {
      if (isOver || isExp) return 'bg-[#F2B8B5]';
      if (percent >= 80) return 'bg-[#FFE082]';
      return 'bg-[#D0BCFF]';
    };

    return (
      <div className="flex items-center space-x-[4px] py-1" title={`Использовано: ${percent.toFixed(1)}%`}>
        {Array.from({ length: totalSegments }).map((_, idx) => {
          const isActiveSegment = idx < activeSegmentsCount;
          return (
            <div
              key={idx}
              className={`h-[6px] w-full rounded-[3px] transition-all duration-300 ${
                isActiveSegment ? getActiveColorClass() : 'bg-[#2B2930]'
              }`}
            />
          );
        })}
      </div>
    );
  };
  const configList = [
    {
      name: 'VLESS Reality (TCP)',
      link: sub.vless_tcp_link,
      type: 'VLESS / TCP / REALITY',
      desc: 'Классический маскировочный протокол. Оптимален для мобильных сетей по умолчанию.'
    },
    {
      name: 'VLESS Reality (gRPC)',
      link: sub.vless_grpc_link,
      type: 'VLESS / GRPC / REALITY',
      desc: 'Интеграция сессий в gRPC потоки. Симулирует веб-платформы видеоконференций.'
    },
    {
      name: 'VLESS Reality (HTTP/2)',
      link: sub.vless_h2_link,
      type: 'VLESS / HTTP2 / REALITY',
      desc: 'Передача данных внутри мультиплексированного HTTP/2 соединения.'
    },
    {
      name: 'VLESS Reality (QUIC)',
      link: sub.vless_quic_link,
      type: 'VLESS / QUIC / REALITY',
      desc: 'Протокол VLESS поверх QUIC. Оптимален для стабильного переподключения на смартфонах.'
    },
    {
      name: 'VLESS Reality (HTTPUpgrade)',
      link: sub.vless_httpupgrade_link,
      type: 'VLESS / HTTPUPGRADE / REALITY',
      desc: 'Высокоскоростная передача через современный механизм апгрейда HTTP-соединений.'
    },
    {
      name: 'VLESS Reality (WebSocket)',
      link: sub.vless_ws_link,
      type: 'VLESS / WS / REALITY',
      desc: 'Традиционное WebSocket-соединение с обфускацией и защитой Reality.'
    },
    {
      name: 'VLESS XTLS-Vision',
      link: sub.vless_xtls_link,
      type: 'VLESS / TLS / VISION',
      desc: 'Высокоскоростной транспорт со встроенным механизмом подавления тайминг-анализа TLS.'
    },
    {
      name: 'VMess WebSocket (TLS)',
      link: sub.vmess_ws_link,
      type: 'VMESS / WS / TLS',
      desc: 'Полнофункциональное подключение через WebSocket, поддерживающее CDN-маршрутизацию.'
    },
    {
      name: 'VMess gRPC (TLS)',
      link: sub.vmess_grpc_link,
      type: 'VMESS / GRPC / TLS',
      desc: 'Классический VMess поверх GRPC-каналов с общим TLS шифрованием домена.'
    },
    {
      name: 'VMess HTTPUpgrade (TLS)',
      link: sub.vmess_httpupgrade_link,
      type: 'VMESS / HTTPUPGRADE / TLS',
      desc: 'Альтернативный легковесный веб-транспорт со стабильным TLS-туннелированием.'
    },
    {
      name: 'VMess Reality (TCP)',
      link: sub.vmess_reality_link,
      type: 'VMESS / TCP / REALITY',
      desc: 'Сочетание классического шифрования VMess и технологии маскировки Reality.'
    },
    {
      name: 'Hysteria 2',
      link: sub.hysteria_link,
      type: 'HYSTERIA 2 / UDP / TLS',
      desc: 'Протокол на базе UDP с продвинутым алгоритмом контроля заторов. Эффективен при высоком пинге.'
    },
    {
      name: 'Trojan Reality (TCP)',
      link: sub.trojan_reality_link,
      type: 'TROJAN / TCP / REALITY',
      desc: 'Надежная аутентификация Trojan в связке с маскировкой под доверенный домен.'
    },
    {
      name: 'Trojan gRPC (TLS)',
      link: sub.trojan_grpc_link,
      type: 'TROJAN / GRPC / TLS',
      desc: 'Использование протокола Trojan внутри защищенного gRPC-канала.'
    },
    {
      name: 'Trojan WebSocket (TLS)',
      link: sub.trojan_ws_link,
      type: 'TROJAN / WS / TLS',
      desc: 'Альтернативный обфусцированный транспорт с поддержкой веб-сокетов.'
    },
    {
      name: 'WireGuard Tunnel',
      link: sub.wireguard_config ? 'wireguard_modal' : null,
      type: 'WIREGUARD / X25519',
      desc: 'Нативный высокопроизводительный сетевой туннель на уровне операционной системы.'
    },
    {
      name: 'Shadowsocks 2022',
      link: sub.shadowsocks_link,
      type: 'SHADOWSOCKS / TCP / UDP',
      desc: 'Легковесный и криптографически стойкий стандарт. Оптимален для мобильных девайсов и роутеров.'
    },
    {
      name: 'Socks5 Proxy (TLS)',
      link: sub.socks5_tls_link,
      type: 'SOCKS5 / TLS',
      desc: 'Прокси Socks5 внутри TLS-шифрования для изоляции трафика отдельных приложений.'
    },
    {
      name: 'HTTP CONNECT Proxy (TLS)',
      link: sub.http_tls_link,
      type: 'HTTP / CONNECT / TLS',
      desc: 'Стандартный HTTP-прокси с поддержкой шифрования TLS.'
    },
    {
      name: 'NaiveProxy (TLS)',
      link: sub.naive_tls_link,
      type: 'NAIVEPROXY / HTTPS',
      desc: 'Высококлассная маскировка трафика под стек Chromium Cronet с защитой от активного зондирования.'
    }
  ].filter(item => item.link);

  return (
    <div className="min-h-screen bg-[#141218] text-[#E6E1E5] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {}
          <div className="lg:col-span-4 lg:sticky lg:top-8 space-y-6">
            
            {}
            <div className="bg-[#1D1B20] border border-[#2B2930] rounded-[24px] p-6 space-y-3.5 flex flex-col items-start shadow-md w-full">
              <div className="flex items-center space-x-3 w-full">
                <Logo className="w-9 h-9 text-[#D0BCFF]" />
                <div className="min-w-0 w-full">
                  <h1 className="text-base font-black text-white uppercase tracking-wider truncate">
                    {sub.brand_name || 'AimatosPanel'}
                  </h1>
                  <p className="text-xs text-[#CAC4D0] truncate mt-0.5">
                    Пользователь: <span className="text-[#D0BCFF] font-medium">{sub.name}</span>
                  </p>
                </div>
              </div>
              <div className="w-full flex justify-start pt-1">
                {getStatusBadge()}
              </div>
            </div>

            {}
            <div className="bg-[#1D1B20] border border-[#2B2930] rounded-[24px] p-6 space-y-5 shadow-lg">
              <div className="flex justify-between items-center">
                <h2 className="text-[10px] font-extrabold uppercase tracking-widest text-[#D0BCFF]">
                  Обзор трафика
                </h2>
                <span className="text-xs font-bold text-[#E6E1E5]">
                  {isUnlimited ? 'Безлимит' : `Осталось: ${FormatService.formatBytes(remainingBytes)}`}
                </span>
              </div>

              <div className="space-y-2">
                {renderDiscreteProgressBar(progressPercent, isOverlimit, isExpired)}
                <div className="flex justify-between text-xs text-[#CAC4D0] font-medium">
                  <span>
                    Использовано: <strong className="text-white">{FormatService.formatBytes(usedBytes)}</strong>
                  </span>
                  <span>
                    Лимит: <strong className="text-white">{isUnlimited ? 'Безлимит' : `${sub.traffic_limit_gb} GB`}</strong>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center text-xs">
                <div className="bg-[#211F26] p-3 rounded-xl border border-[#2B2930]/40 flex flex-col justify-center items-center">
                  <span className="text-[8px] text-[#938F99] font-bold uppercase tracking-wider">Истекает</span>
                  <span className="text-white font-bold mt-1">{sub.expires_at ? FormatService.formatShortDate(sub.expires_at) : 'Бессрочно'}</span>
                </div>
                <div className="bg-[#211F26] p-3 rounded-xl border border-[#2B2930]/40 flex flex-col justify-center items-center">
                  <span className="text-[8px] text-[#938F99] font-bold uppercase tracking-wider">Статус</span>
                  <span className="text-[#A3CFB1] font-bold mt-1">{FormatService.formatRemainingDays(sub.expires_at).text}</span>
                </div>
              </div>
            </div>

            {}
            <div className="hidden lg:flex flex-col items-center justify-center bg-[#1D1B20] border border-[#2B2930] rounded-[24px] p-6 text-center space-y-4 shadow-lg w-full">
              <div className="space-y-1">
                <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">Скан QR-подписки</h3>
                <p className="text-[11px] text-[#CAC4D0] max-w-[240px]">
                  Отсканируйте камерой приложения для мгновенного импорта.
                </p>
              </div>
              <QrCodeLoader value={subUrl} size={112} className="w-36 h-36" />
            </div>

          </div>

          {}
          <div className="lg:col-span-8 space-y-6">
            
            <div className="flex bg-[#1D1B20] border border-[#2B2930] p-1 rounded-full w-full select-none shadow-md">
              {[
                { id: 'home', label: 'Главная', icon: '🏠' },
                { id: 'protocols', label: 'Подключения', icon: '🔗' },
                { id: 'instructions', label: 'Настройка', icon: '📖' }
              ].map((tab) => {
                const isTabActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full text-xs font-bold tracking-wide transition-all duration-200 outline-none cursor-pointer active:scale-95 text-[#CAC4D0] hover:text-white"
                    style={isTabActive ? { backgroundColor: '#4A4458', color: '#E8DEF8' } : {}}
                  >
                    <span className="text-sm">{tab.icon}</span>
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="space-y-6">

              {}
              {activeTab === 'home' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  
                  <div className="bg-[#1D1B20] border border-[#2B2930] rounded-[24px] p-6 text-center space-y-4 shadow-lg">
                    <div className="space-y-1">
                      <h3 className="text-xs font-black text-white uppercase tracking-wider">Мгновенный импорт</h3>
                      <p className="text-xs text-[#CAC4D0]">
                        Нажмите кнопку ниже для автоматического импорта конфигурации в рекомендованный клиент Hiddify.
                      </p>
                    </div>
                    <a
                      href={`hiddify://import/${subUrl}#${sub.brand_name || 'VPN'}`}
                      className="inline-flex w-full items-center justify-center gap-2 bg-[#D0BCFF] hover:bg-[#CCC2DC] text-[#381E72] active:scale-95 py-3.5 px-6 rounded-full text-xs font-black uppercase tracking-wider shadow-md transition-all duration-200 cursor-pointer select-none"
                    >
                      🚀 Подключить автоматически (Hiddify)
                    </a>
                  </div>

                  {}
                  <div className="lg:hidden bg-[#1D1B20] border border-[#2B2930] rounded-[24px] p-6 flex flex-col items-center text-center space-y-4 shadow-lg w-full">
                    <div className="space-y-1">
                      <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">QR-код подписки</h3>
                      <p className="text-xs text-[#CAC4D0] max-w-[240px]">
                        Отсканируйте камерой внутри клиента для быстрого добавления.
                      </p>
                    </div>
                    <QrCodeLoader value={subUrl} size={112} className="w-36 h-36" />
                  </div>

                  {}
                  <div className="bg-[#1D1B20] border border-[#2B2930] rounded-[24px] p-6 space-y-5 shadow-lg">
                    <div className="space-y-1">
                      <h2 className="text-[10px] font-extrabold uppercase tracking-widest text-[#D0BCFF]">
                        Рекомендуемые приложения
                      </h2>
                      <p className="text-xs text-[#CAC4D0]">
                        Скачайте проверенные клиенты для стабильного обхода ограничений на любой операционной системе.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                      {appsToInstall.map((app) => (
                        <div
                          key={app.id}
                          className="bg-[#211F26] border border-[#2B2930]/60 rounded-[16px] p-4.5 flex flex-col justify-between space-y-4 h-full"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-lg shrink-0">
                              {app.icon}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="text-xs font-extrabold text-white truncate">{app.name}</h4>
                              <span className="text-[9px] text-gray-400 block truncate mt-0.5">{app.platform}</span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <a
                              href={app.downloadUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="flex-1 bg-[#4A4458] hover:bg-[#5E576F] text-[#E8DEF8] active:scale-95 py-2 px-3 rounded-xl text-[11px] font-bold tracking-wide transition-all duration-200 text-center cursor-pointer"
                            >
                              Скачать
                            </a>
                            <button
                              onClick={() => setQrModalData({ title: app.name, subtitle: app.platform, value: app.downloadUrl })}
                              className="bg-[#2B2930] hover:bg-white/5 border border-[#4A4458]/40 active:scale-95 text-white py-2 px-3 rounded-xl text-[11px] font-semibold transition-all duration-200 cursor-pointer"
                            >
                              QR-код
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {}
              {activeTab === 'protocols' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  
                  <div className="bg-[#1D1B20] border border-[#2B2930] rounded-[24px] p-6 space-y-4 shadow-lg">
                    <div className="space-y-1">
                      <h2 className="text-[10px] font-extrabold uppercase tracking-widest text-[#D0BCFF]">
                        Ваша ссылка на подписку
                      </h2>
                      <p className="text-xs text-[#CAC4D0]">
                        Используется для ручного добавления конфигураций во внешние утилиты.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        readOnly
                        value={subUrl}
                        className="w-full bg-[#211F26] border border-[#2B2930] rounded-[16px] px-4 py-3 text-xs font-mono text-[#D0BCFF] focus:outline-none select-all"
                      />
                      <button
                        onClick={() => copyToClipboard(subUrl, 'subscription-url')}
                        className="bg-[#D0BCFF] hover:bg-[#CCC2DC] text-[#381E72] active:scale-95 px-6 py-3 rounded-[16px] text-xs font-black uppercase tracking-wider transition-all duration-200 shrink-0 cursor-pointer text-center"
                      >
                        {copiedLabel === 'subscription-url' ? 'Скопировано' : 'Копировать'}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-[#CAC4D0] px-1">
                      Индивидуальные конфигурации соединений ({configList.length})
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                      {configList.length === 0 ? (
                        <div className="bg-[#1D1B20] border border-[#2B2930] rounded-[24px] p-6 text-center text-xs text-gray-500 col-span-full">
                          Доступные конфигурации отсутствуют (проверьте настройки на сервере).
                        </div>
                      ) : (
                        configList.map((item, idx) => (
                          <div
                            key={idx}
                            className="bg-[#1D1B20] border border-[#2B2930] rounded-[24px] p-5 flex flex-col justify-between space-y-4 shadow-md h-full"
                          >
                            <div className="space-y-1.5">
                              <h4 className="text-xs font-bold text-white tracking-wide block truncate">
                                {item.name}
                              </h4>
                              <span className="text-[9px] text-[#D0BCFF] font-mono block tracking-wider uppercase font-semibold">
                                {item.type}
                              </span>
                              <p className="text-[11px] text-[#CAC4D0] leading-relaxed">
                                {item.desc}
                              </p>
                            </div>

                            <div className="flex gap-2">
                              {item.link === 'wireguard_modal' ? (
                                <button
                                  onClick={() => setQrModalData({ title: 'WireGuard Tunnel', subtitle: sub.name, value: sub.wireguard_config, isWg: true })}
                                  className="flex-1 bg-[#D0BCFF] text-[#381E72] hover:bg-[#CCC2DC] active:scale-95 py-2.5 px-3 rounded-xl text-[11px] font-bold tracking-wide transition-all duration-200 cursor-pointer text-center"
                                >
                                  Показать .conf
                                </button>
                              ) : (
                                <>
                                  <button
                                    onClick={() => copyToClipboard(item.link, `proto-${idx}`)}
                                    className="flex-1 bg-[#4A4458] hover:bg-[#5E576F] text-[#E8DEF8] active:scale-95 py-2.5 px-3 rounded-xl text-[11px] font-bold tracking-wide transition-all duration-200 cursor-pointer text-center"
                                  >
                                    {copiedLabel === `proto-${idx}` ? 'Скопировано!' : 'Копировать'}
                                  </button>
                                  <button
                                    onClick={() => setQrModalData({ title: item.name, subtitle: item.type, value: item.link })}
                                    className="bg-[#2B2930] hover:bg-white/5 border border-[#4A4458]/40 active:scale-95 text-white py-2.5 px-3 rounded-xl text-[11px] font-semibold transition-all duration-200 cursor-pointer"
                                  >
                                    QR-код
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>
              )}

              {}
              {activeTab === 'instructions' && (
                <div className="bg-[#1D1B20] border border-[#2B2930] rounded-[24px] p-6 space-y-6 shadow-lg animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <h2 className="text-[10px] font-extrabold uppercase tracking-widest text-[#D0BCFF]">
                      Инструкция по настройке
                    </h2>
                    <p className="text-xs text-[#CAC4D0]">
                      Выберите платформу ниже для быстрого изучения шагов настройки.
                    </p>
                  </div>

                  <div className="flex bg-[#211F26] p-1 rounded-full border border-[#2B2930]">
                    {[
                      { id: 'android', label: 'Android' },
                      { id: 'ios', label: 'Apple iOS' },
                      { id: 'desktop', label: 'PC / macOS' }
                    ].map((os) => (
                      <button
                        key={os.id}
                        onClick={() => setActiveOs(os.id)}
                        className="flex-1 py-2 text-[11px] font-bold rounded-full transition-all duration-250 outline-none cursor-pointer text-[#CAC4D0] hover:text-[#E6E1E5]"
                        style={activeOs === os.id ? { backgroundColor: '#4A4458', color: '#E8DEF8' } : {}}
                      >
                        {os.label}
                      </button>
                    ))}
                  </div>

                  <div className="text-xs text-[#CAC4D0] leading-relaxed space-y-4 pt-1">
                    {activeOs === 'android' && (
                      <ol className="list-none space-y-3.5">
                        <li className="flex items-start gap-3">
                          <span className="h-5 w-5 rounded-full bg-[#4A4458] text-[#E8DEF8] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                          <span>Установите <strong>Hiddify Next</strong> на ваше Android-устройство (доступно в Google Play или GitHub).</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="h-5 w-5 rounded-full bg-[#4A4458] text-[#E8DEF8] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                          <span>Перейдите на вкладку <strong>«Главная»</strong> дашборда и нажмите кнопку <strong>«Подключить автоматически»</strong>.</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="h-5 w-5 rounded-full bg-[#4A4458] text-[#E8DEF8] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                          <span>Клиент запустится и автоматически импортирует ваш профиль. Нажмите кнопку для запуска.</span>
                        </li>
                      </ol>
                    )}

                    {activeOs === 'ios' && (
                      <ol className="list-none space-y-3.5">
                        <li className="flex items-start gap-3">
                          <span className="h-5 w-5 rounded-full bg-[#4A4458] text-[#E8DEF8] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                          <span>Скачайте приложение <strong>Hiddify</strong> или клиент <strong>Shadowrocket</strong> в App Store.</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="h-5 w-5 rounded-full bg-[#4A4458] text-[#E8DEF8] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                          <span>Перейдите в раздел <strong>«Подключения»</strong> на этой странице и скопируйте <strong>«Ссылку на подписку»</strong>.</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="h-5 w-5 rounded-full bg-[#4A4458] text-[#E8DEF8] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                          <span>В приложении добавьте ссылку как новый тип подписки (URL / Subscription) и запустите VPN.</span>
                        </li>
                      </ol>
                    )}

                    {activeOs === 'desktop' && (
                      <ol className="list-none space-y-3.5">
                        <li className="flex items-start gap-3">
                          <span className="h-5 w-5 rounded-full bg-[#4A4458] text-[#E8DEF8] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                          <span>Загрузите версию <strong>Hiddify Next</strong> для Windows или macOS на официальном сайте.</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="h-5 w-5 rounded-full bg-[#4A4458] text-[#E8DEF8] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                          <span>Скопируйте <strong>«Ссылку на подписку»</strong> из вкладки <strong>«Подключения»</strong>.</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="h-5 w-5 rounded-full bg-[#4A4458] text-[#E8DEF8] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                          <span>В интерфейсе настольного приложения выберите опцию <strong>«Добавить конфигурацию из буфера»</strong>.</span>
                        </li>
                      </ol>
                    )}
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>

      {}
      {qrModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div 
            onClick={() => setQrModalData(null)}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          
          <div className="relative bg-[#1D1B20] border border-[#2B2930] w-full max-w-sm rounded-[28px] p-6 shadow-2xl flex flex-col items-center text-center space-y-5 z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="space-y-1 w-full">
              <div className="flex justify-between items-center w-full select-none">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D0BCFF]">
                  {qrModalData.isWg ? 'Конфигурация WireGuard' : 'Сканирование QR-кода'}
                </span>
                <button 
                  onClick={() => setQrModalData(null)}
                  className="text-gray-400 hover:text-white text-2xl transition outline-none cursor-pointer"
                >
                  &times;
                </button>
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider pt-3">
                {qrModalData.title}
              </h3>
              {qrModalData.subtitle && !qrModalData.isWg && (
                <p className="text-[11px] text-[#CAC4D0] mt-1">
                  {qrModalData.subtitle}
                </p>
              )}
            </div>

            {qrModalData.isWg ? (
              <div className="w-full space-y-3">
                <textarea
                  readOnly
                  value={qrModalData.value}
                  rows={8}
                  className="w-full bg-[#211F26] border border-[#2B2930] rounded-[16px] p-3 text-[10px] font-mono text-[#D0BCFF] focus:outline-none select-all resize-none"
                />
                <button
                  onClick={() => downloadWireguardFile(qrModalData.value, qrModalData.subtitle)}
                  className="w-full bg-[#381E72] hover:bg-[#4F2D91] text-[#EADDFF] py-2.5 rounded-full text-xs font-bold transition-all"
                >
                  💾 Скачать файл .conf
                </button>
              </div>
            ) : (
              <QrCodeLoader value={qrModalData.value} size={112} className="w-36 h-36" />
            )}

            <div className="w-full flex gap-2 pt-1 select-none">
              <button
                onClick={() => copyToClipboard(qrModalData.value, 'modal-copy')}
                className="flex-1 bg-[#4A4458] hover:bg-[#5E576F] text-[#E8DEF8] active:scale-95 py-2.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer text-center"
              >
                {copiedLabel === 'modal-copy' ? 'Скопировано!' : 'Скопировать'}
              </button>
              <button
                onClick={() => setQrModalData(null)}
                className="bg-[#2B2930] hover:bg-white/5 border border-[#4A4458]/40 active:scale-95 text-white py-2.5 px-5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}