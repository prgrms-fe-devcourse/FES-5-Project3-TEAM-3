import type { Database } from '@/supabase/database.types';
import supabase from '@/supabase/supabase';
import { useEffect, useState } from 'react';

type ReviewRow = Database['public']['Tables']['reviews']['Row'];
export type WineRow = Database['public']['Tables']['wines']['Row'];

export type ReviewWithWine = ReviewRow & {
  wines: Pick<WineRow, 'name' | 'country' | 'abv' | 'image_url'> | null;
};

export function useMyReviews(page: number, pageSize: number = 8, reserveLastSlot: boolean = true) {
  const [data, setData] = useState<ReviewWithWine[]>([]);
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError(null);

      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (userErr) {
        if (!cancelled) setError(userErr.message);
        setLoading(false);
        return;
      }

      const userId = userData.user.id;
      if (!userId) {
        if (!cancelled) {
          setData([]);
          setCount(0);
          setLoading(false);
        }
        return;
      }

      // total reviews count
      const { count: total, error: countErr } = await supabase
        .from('reviews')
        .select('review_id', { count: 'exact', head: true })
        .eq('user_id', userId);
      if (countErr) {
        if (!cancelled) setError(countErr.message);
        setLoading(false);
        return;
      }

      const totalCount = total ?? 0;

      // totalPage computation
      const totalPages = Math.max(
        1,
        Math.ceil((totalCount + (reserveLastSlot ? 1 : 0)) / pageSize)
      );

      // fetch Window
      let from = (page - 1) * pageSize;
      let size = pageSize;
      const isLastPage = page === totalPages;
      if (isLastPage && reserveLastSlot) {
        const consumed = pageSize * (totalPages - 1);
        const remaining = Math.max(0, totalCount - consumed);
        size = Math.min(pageSize - 1, remaining);
        from = consumed;
      }

      if (size <= 0) {
        if (!cancelled) {
          setData([]);
          setCount(totalCount);
          setLoading(false);
        }
        return;
      }

      const to = from + size - 1;
      const { data: rows, error: queryErr } = await supabase
        .from('reviews')
        .select(
          `*,
          wines( name, country, abv, image_url )`
        )
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (queryErr) {
        if (!cancelled) {
          setError(queryErr.message);
        }
      } else {
        if (!cancelled) {
          setData(rows ?? []);
          setCount(totalCount);
        }
      }

      if (!cancelled) setLoading(false);
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [page, pageSize, reserveLastSlot]);

  const totalPages = Math.max(1, Math.ceil((count + (reserveLastSlot ? 1 : 0)) / pageSize));

  return { data, loading, error, count, totalPages };
}
