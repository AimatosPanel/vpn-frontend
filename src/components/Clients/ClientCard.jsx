import React from 'react';
import FormatService from '../../services/FormatService';
import M3ProgressBar from './M3ProgressBar';
import { Switch, Button, IconButton } from '../Common/UI';
import { useHasPermission } from '../../hooks/useHasPermission';

export default function ClientCard({ user, onToggle, onDelete, onCopy, onEdit, isSelected, onSelectToggle }) {
  const { hasPermission } = useHasPermission();
  const canWrite = hasPermission('clients:write');

  const isExpired = user.expires_at && new Date(user.expires_at) < new Date();
  const limitBytes = user.traffic_limit_gb * 1073741824;
  const isOverlimit = user.traffic_limit_gb > 0 && user.traffic_used_bytes >= limitBytes;

  const progress = user.traffic_limit_gb > 0 
    ? Math.min((user.traffic_used_bytes / limitBytes) * 100, 100) 
    : 0;

  const remainingBytes = user.traffic_limit_gb > 0 ? Math.max(limitBytes - user.traffic_used_bytes, 0) : null;
  const expiryInfo = FormatService.formatRemainingDays(user.expires_at);

  return (
    <div className={`bg-[#1D1B20]/90 border rounded-[24px] p-5 transition-all duration-300 shadow-sm hover:shadow-md ${
      isSelected ? 'border-[#D0BCFF] bg-[#211F26]' : 'border-[#2B2930] hover:border-[#CAC4D0]/15'
    }`}>
      
      {}
      <div className="hidden lg:grid grid-cols-12 gap-4 items-center">
        {}
        <div className="col-span-3 flex items-center space-x-3.5 min-w-0">
          {canWrite && (
            <input 
              type="checkbox" 
              checked={isSelected} 
              onChange={onSelectToggle}
              className="rounded-lg border-[#8F8B97] text-[#D0BCFF] focus:ring-0 bg-black/40 h-5 w-5 cursor-pointer transition-all duration-200"
            />
          )}
          <div className="space-y-1 min-w-0 flex-1">
            <h3 className="font-semibold text-sm text-white tracking-wide truncate" title={user.name}>{user.name}</h3>
            {user.note ? (
              <span className="text-[10px] text-[#D0BCFF] bg-[#D0BCFF]/10 px-2.5 py-0.5 rounded-full font-semibold inline-block max-w-full truncate" title={user.note}>
                {user.note}
              </span>
            ) : (
              <span className="text-[10px] text-gray-500 block">Нет заметок</span>
            )}
          </div>
        </div>

        {}
        <div className="col-span-3 space-y-1 w-full">
          <div className="flex justify-between text-[10px] text-[#CAC4D0] font-medium tracking-wide">
            <span>Использовано: <strong className="text-white">{FormatService.formatBytes(user.traffic_used_bytes)}</strong></span>
            <span>Осталось: <strong className="text-white">{remainingBytes !== null ? FormatService.formatBytes(remainingBytes) : '∞'}</strong></span>
          </div>
          <M3ProgressBar value={progress} isOverlimit={isOverlimit} isExpired={isExpired} />
        </div>

        {}
        <div className="col-span-2 flex justify-center">
          <span className={`px-3 py-1 rounded-full text-[10px] font-semibold tracking-wide border ${expiryInfo.style}`}>
            {expiryInfo.text}
          </span>
        </div>

        {}
        <div className="col-span-2 flex items-center space-x-2 min-w-0 justify-center">
          <span className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${user.online ? 'bg-[#A3CFB1] shadow-[0_0_8px_#A3CFB1]' : 'bg-gray-600'}`} />
          <span className={`text-[11px] font-semibold truncate ${user.online ? 'text-[#A3CFB1]' : 'text-[#CAC4D0]'}`}>
            {user.online ? 'В сети' : FormatService.formatRelativeTime(user.last_seen)}
          </span>
        </div>

        {}
        <div className="col-span-2 flex items-center justify-end gap-3.5">
          <Switch 
            checked={user.is_active} 
            onChange={() => onToggle(user.id)} 
            disabled={!canWrite}
            variant="success"
          />

          <div className="flex space-x-1.5 items-center">
            <IconButton 
              onClick={() => onCopy(`${window.location.origin}/cabinet/${user.vless_uuid}`)}
              variant="secondary"
              title="Скопировать ссылку подписки"
            >
              🔗
            </IconButton>
            {canWrite && (
              <IconButton 
                onClick={() => onEdit && onEdit(user)}
                variant="ghost"
                title="Настройки профиля"
              >
                ✏️
              </IconButton>
            )}
          </div>
        </div>
      </div>

      {}
      <div className="lg:hidden space-y-4">
        {}
        <div className="flex justify-between items-start gap-2">
          <div className="flex items-center space-x-3 min-w-0">
            {canWrite && (
              <input 
                type="checkbox" 
                checked={isSelected} 
                onChange={onSelectToggle}
                className="rounded-lg border-[#8F8B97] text-[#D0BCFF] focus:ring-0 bg-black/40 h-5 w-5 cursor-pointer transition-all duration-200"
              />
            )}
            <div className="space-y-1 min-w-0">
              <h3 className="font-semibold text-sm text-white tracking-wide truncate" title={user.name}>{user.name}</h3>
              {user.note ? (
                <span className="text-[10px] text-[#D0BCFF] bg-[#D0BCFF]/10 px-2.5 py-0.5 rounded-full font-semibold inline-block max-w-xs truncate">
                  {user.note}
                </span>
              ) : (
                <span className="text-[10px] text-gray-500 block">Нет заметок</span>
              )}
            </div>
          </div>

          <Switch 
            checked={user.is_active} 
            onChange={() => onToggle(user.id)} 
            disabled={!canWrite}
          />
        </div>

        {}
        <div className="space-y-1.5 bg-[#141218]/40 p-3.5 rounded-2xl border border-[#2B2930]/40">
          <div className="flex justify-between text-[10px] text-[#CAC4D0] font-medium tracking-wide">
            <span>Использовано: <strong className="text-white">{FormatService.formatBytes(user.traffic_used_bytes)}</strong></span>
            <span>Осталось: <strong className="text-white">{remainingBytes !== null ? FormatService.formatBytes(remainingBytes) : '∞'}</strong></span>
          </div>
          <M3ProgressBar value={progress} isOverlimit={isOverlimit} isExpired={isExpired} />
        </div>

        {}
        <div className="flex items-center justify-between gap-2 pt-0.5">
          <div className="flex items-center space-x-2 min-w-0">
            <span className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${user.online ? 'bg-[#A3CFB1] shadow-[0_0_8px_#A3CFB1]' : 'bg-gray-600'}`} />
            <span className={`text-[11px] font-semibold truncate ${user.online ? 'text-[#A3CFB1]' : 'text-[#CAC4D0]'}`}>
              {user.online ? 'В сети' : FormatService.formatRelativeTime(user.last_seen)}
            </span>
          </div>

          <span className={`px-3 py-0.5 rounded-full text-[10px] font-semibold tracking-wide border ${expiryInfo.style}`}>
            {expiryInfo.text}
          </span>
        </div>

        {}
        <div className="flex justify-end gap-2.5 pt-3 border-t border-[#2B2930]/40">
          <Button 
            onClick={() => onCopy(`${window.location.origin}/cabinet/${user.vless_uuid}`)}
            variant="secondary"
            className={`flex-1 ${!canWrite ? 'max-w-full' : 'max-w-[150px]'} !py-2 !px-3 !rounded-xl`}
          >
            <span>🔗</span> <span>Кабинет</span>
          </Button>
          {canWrite && (
            <Button 
              onClick={() => onEdit && onEdit(user)}
              variant="outline"
              className="flex-1 max-w-[150px] !py-2 !px-3 !rounded-xl"
            >
              <span>✏️</span> <span>Настройки</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}