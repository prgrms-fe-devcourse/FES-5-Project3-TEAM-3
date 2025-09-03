import supabase from '@/supabase/supabase';
import { useEffect, useState } from 'react';

export type ReviewAgg = {
  rating: number | null;
  country: string | null;
};

export function useMyReviewAgg() {
  const [data, setData] = useState<ReviewAgg[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      setLoading(true);
      setError(null);

      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (userErr) {
        if (!cancelled) {
          setError(userErr.message);
          setLoading(false);
        }
        return;
      }
      const userId = userData.user.id;
      if (!userId) {
        setData([]);
        setLoading(false);
        return;
      }

      const { data: rows, error: queryErr } = await supabase
        .from('reviews')
        .select('rating, wines ( country )')
        .eq('user_id', userId);

      if (queryErr) {
        if (!cancelled) setError(queryErr.message);
      } else {
        const flatten: ReviewAgg[] = (rows ?? []).map((r) => ({
          rating: typeof r.rating === 'number' ? r.rating : null,
          country: r.wines?.country ?? null,
        }));

        if (!cancelled) setData(flatten);
      }

      if (!cancelled) setLoading(false);
    };

    fetch();

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error };
}
