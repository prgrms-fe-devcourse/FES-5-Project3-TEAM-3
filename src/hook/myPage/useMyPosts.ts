import type { PostWithProfile } from '@/pages/community/Main/Card';
import supabase from '@/supabase/supabase';
import { useEffect, useState } from 'react';

export function useMyPosts(
  userId?: string,
  page = 1,
  pageSize = 6,
  options?: { enabled?: boolean }
) {
  const enabled = options?.enabled ?? true;

  const [data, setData] = useState<{ rows: PostWithProfile[]; total: number }>({
    rows: [],
    total: 0,
  });
  const [loading, setLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    const fetch = async () => {
      if (!userId) {
        setData({ rows: [], total: 0 });
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const from = (page - 1) * pageSize;
      const to = page * pageSize - 1;

      const {
        data: rows,
        error: queryErr,
        count,
      } = await supabase
        .from('posts')
        .select('*, profile(nickname, profile_image_url)', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (queryErr) {
        if (!cancelled) setError(queryErr.message);
      } else if (rows) {
        if (!cancelled) {
          setData({
            rows: rows as PostWithProfile[],
            total: count ?? rows.length,
          });
        }
      }

      if (!cancelled) setLoading(false);
    };

    fetch();

    return () => {
      cancelled = true;
    };
  }, [enabled, userId, page, pageSize]);

  return { data, loading, error };
}

// tanstackQuery 방식
// return useQuery({
//   queryKey: ['userPosts', userId, page],
//   enabled: !!userId,
//   queryFn: async (): Promise<{ rows: PostWithProfile[]; total: number }> => {
//     if (!userId) return { rows: [], total: 0 };

//     const from = (page - 1) * pageSize;
//     const to = page * pageSize - 1;

//     const { data, error, count } = await supabase
//       .from('posts')
//       .select('*, profile(nickname, profile_image_url)', { count: 'exact' })
//       .eq('user_id', userId)
//       .order('created_at', { ascending: false })
//       .range(from, to);

//     if (error) throw error;
//     return { rows: (data as PostWithProfile[]) ?? [], total: count ?? 0 };
//   },
//   placeholderData: keepPreviousData,
// });
