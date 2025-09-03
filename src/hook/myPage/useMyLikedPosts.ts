import type { PostWithProfile } from '@/pages/community/Main/Card';
import supabase from '@/supabase/supabase';
import { useEffect, useState } from 'react';

export function useMyLikedPosts(
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
        .select('*, profile(nickname, profile_image_url), post_like!inner(user_id)', {
          count: 'exact',
        })
        .eq('post_like.user_id', userId)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (!cancelled) {
        if (queryErr) {
          setError(queryErr.message);
        } else if (rows) {
          const cleaned = (rows ?? []).map((r) => {
            const { post_like, ...rest } = r;
            return rest as PostWithProfile;
          });
          setData({
            rows: cleaned,
            total: count ?? cleaned.length,
          });
        }
        setLoading(false);
      }
    };

    fetch();

    return () => {
      cancelled = true;
    };
  }, [enabled, userId, page, pageSize]);

  return { data, loading, error };
}
