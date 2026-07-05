import { useCallback } from 'react';
import { apiService } from '../services/ApiService';

export function useHasPermission() {
  const token = localStorage.getItem("admin_token");
  const isExpired = apiService.isTokenExpired(token);
  const isRoot = localStorage.getItem("admin_is_root") === "1";
  
  const hasPermission = useCallback((permission) => {
    if (isExpired) return false;
    if (isRoot) return true;
    
    try {
      const perms = JSON.parse(localStorage.getItem("admin_permissions") || "[]");
      return perms.includes(permission);
    } catch (e) {
      return false;
    }
  }, [isRoot, isExpired]);

  const currentRole = isExpired ? "" : (localStorage.getItem("admin_role") || "");

  return { hasPermission, isRoot: !isExpired && isRoot, currentRole, isExpired };
}