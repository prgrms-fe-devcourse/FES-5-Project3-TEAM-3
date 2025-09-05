import { useAuth } from '@/store/@store';
import { useState } from 'react';

export function useSearch() {
  const { userId } = useAuth();
  const user_id = userId ?? 'guest';
  const USER_SEARCH = `recently-search:${user_id}`;

  const parseArray = (s: string | null): string[] => {
    if (!s) return [];
    try {
      const value = JSON.parse(s);
      return Array.isArray(value) ? value : [];
    } catch {
      return [];
    }
  };

  const [recentSearch, setRecentSearch] = useState<string[]>(() =>
    parseArray(localStorage.getItem(USER_SEARCH))
  );

  return { USER_SEARCH, setRecentSearch, recentSearch, parseArray };
}
