import supabase from '@/supabase/supabase';
import { useEffect, useState } from 'react';

type UseMyBadgesOptions = {
  refreshOnMount?: boolean;
};

export function useMyBadges(options: UseMyBadgesOptions = { refreshOnMount: true }) {
  const { refreshOnMount } = options;
  const [badges, setBadges] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data: userData } = await supabase.auth.getUser();
        const userId = userData.user?.id;

        if (!userId) {
          setError('로그인이 필요한 서비스입니다.');
          setLoading(false);
          return;
        }

        if (refreshOnMount) {
          const { error: rpcErr } = await supabase.rpc('compute_and_upsert_user_badges', {
            p_user_id: userId,
          });
          if (rpcErr) console.error('badge rpc error:', rpcErr.message);
        }

        const { data, error: queryErr } = await supabase
          .from('user_badge')
          .select('badge_type')
          .eq('user_id', userId)
          .single();

        if (queryErr) {
          if (queryErr.code !== 'PGRST116') throw queryErr;
          setBadges([]);
        } else {
          setBadges(data?.badge_type ?? []);
        }
      } catch (err: any) {
        setError(err.message ?? String(err));
      } finally {
        setLoading(false);
      }
    })();
  }, [refreshOnMount]);

  return { badges, loading, error };
}
