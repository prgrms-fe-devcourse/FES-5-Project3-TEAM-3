import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { WineRow } from './useMyReviews';
import supabase from '@/supabase/supabase';
import { upsertTable } from '@/utils/supabase/upsertTable';

type WishCardItem = Pick<WineRow, 'wine_id' | 'name' | 'country' | 'abv' | 'image_url'> & {
  rating: number;
  wishlist_id: string;
  bookmarked: boolean;
};

type Result = {
  items: WishCardItem[];
  totalPages: number;
  loading: boolean;
  error: string | null;
  toggleBookmark: (wine_id: string, next: boolean) => Promise<void>;
  refresh: () => Promise<void>;
};

export function useWishList(page: number, pageSize: number = 10): Result {
  const [data, setData] = useState<WishCardItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);

  const isCancelled = useRef(false);

  const range = useMemo(
    () => ({ from: (page - 1) * pageSize, to: page * pageSize - 1 }),
    [page, pageSize]
  );

  const fetchPage = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (userErr) throw userErr;

      const userId = userData?.user?.id;
      if (!userId) {
        if (isCancelled.current) return;

        setData([]);
        setTotalPages(1);
        return;
      }

      // totalPage computation
      const { count, error: countErr } = await supabase
        .from('wishlists')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('bookmark', true);

      if (countErr) throw countErr;

      if (!isCancelled.current) {
        setTotalPages(Math.max(1, Math.ceil((count ?? 0) / pageSize)));
      }

      // fetch Window
      const { data: wishlist, error: queryErr } = await supabase
        .from('wishlists')
        .select('wishlist_id, wine_id, bookmark')
        .eq('user_id', userId)
        .eq('bookmark', true)
        .order('created_at', { ascending: false })
        .range(range.from, range.to);

      if (queryErr) throw queryErr;

      if (!wishlist || wishlist.length === 0) {
        if (isCancelled.current) return;

        setData([]);
        return;
      }

      // wine data
      const wineIds = wishlist!.map((r) => r.wine_id);
      if (wineIds.length === 0) {
        if (isCancelled.current) return;
        setData([]);
        return;
      }

      const { data: wines, error: winesErr } = await supabase
        .from('wines')
        .select('wine_id, name, image_url, country, abv')
        .in('wine_id', wineIds);

      if (winesErr) throw winesErr;

      // review data
      const { data: revs, error: revErr } = await supabase
        .from('reviews')
        .select('wine_id, rating')
        .in('wine_id', wineIds);

      if (revErr) throw revErr;

      const avgByWine = new Map<string, number>();
      if (revs?.length) {
        const sum = new Map<string, number>();
        const cnt = new Map<string, number>();

        for (const r of revs) {
          sum.set(r.wine_id, (sum.get(r.wine_id) ?? 0) + r.rating);
          cnt.set(r.wine_id, (cnt.get(r.wine_id) ?? 0) + 1);
        }
        for (const [id, s] of sum.entries()) {
          const c = cnt.get(id) ?? 1;
          avgByWine.set(id, Number((s / c).toFixed(1)));
        }
      }

      // merge data
      const wishlistMap = new Map(wishlist?.map((item) => [item.wine_id, item]));
      const wineMap = new Map(wines?.map((w) => [w.wine_id, w]) ?? []);
      const merged = wineIds
        .map((id) => {
          const w = wineMap.get(id);
          if (!w) return null;
          const meta = wishlistMap.get(id);
          return {
            ...w,
            rating: avgByWine.get(id) ?? 0,
            wishlist_id: meta?.wishlist_id,
            bookmarked: meta?.bookmark,
          };
        })
        .filter(Boolean) as WishCardItem[];

      if (!isCancelled.current) setData(merged);
    } catch (err: any) {
      if (!isCancelled.current) {
        setError(err?.message ?? String(err));
      }
    } finally {
      if (!isCancelled.current) {
        setLoading(false);
      }
    }
  }, [pageSize, range]);

  useEffect(() => {
    isCancelled.current = false;
    fetchPage();

    return () => {
      isCancelled.current = true;
    };
  }, [fetchPage]);

  const toggleBookmark = useCallback(
    async (wine_id: string, next: boolean) => {
      const target = data.find((d) => d.wine_id === wine_id);
      if (!target) return;

      const { error: updateError } = await upsertTable({
        method: 'update',
        tableName: 'wishlists',
        matchKey: 'wishlist_id',
        uploadData: { wishlist_id: target.wishlist_id, bookmark: next },
      });

      if (updateError) {
        if (!isCancelled.current) setError(String(updateError));
        return;
      }

      if (!isCancelled.current) {
        setData((prev) =>
          prev.map((d) => (d.wine_id === wine_id ? { ...d, bookmarked: next } : d))
        );
      }
    },
    [data]
  );

  const refresh = useCallback(async () => {
    await fetchPage();
  }, [fetchPage]);

  return { items: data, totalPages, loading, error, toggleBookmark, refresh };
}
