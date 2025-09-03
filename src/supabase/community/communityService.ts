import supabase from '@/supabase/supabase';
import type { Database } from '@/supabase/database.types';

type PostRow = Database['public']['Tables']['posts']['Row'];
type ProfileJoined = { nickname?: string | null; profile_image_url?: string | null };
export type PostWithProfile = PostRow & { profile?: ProfileJoined | null };

/**
 * 인기글 조회 (단순 좋아요 순)
 */
export async function fetchPopularPosts(limit = 5) {
  try {
    // 1) profile 조인 없이 최소 필드로 먼저 확인
    const { data, error } = await supabase
      .from('posts')
      .select('post_id, title, like_count')
      .order('like_count', { ascending: false })
      .limit(limit);

    if (error) throw error;

    const rows = Array.isArray(data)
      ? data.map((r: any) => ({
          post_id: r?.post_id,
          title: r?.title ?? null,
          like_count: Number(r?.like_count ?? 0),
        }))
      : [];

    return rows;
  } catch (err) {
    console.error('[fetchPopularPosts] caught error:', err);
    throw err;
  }
}

/**
 * Global top tags (서비스 전체 기준, 클라이언트 집계)
 * - 소규모/개발 환경에서 사용. 데이터 많으면 RPC/view로 이전 권장.
 */
export async function fetchGlobalTopTags(limit = 5) {
  try {
    const { data, error } = await supabase.from('posts').select('hashtag_list').limit(1000);
    if (error) throw error;

    const map = new Map<string, number>();
    (data ?? []).forEach((r: any) => {
      const list: string[] = Array.isArray(r?.hashtag_list) ? r.hashtag_list : [];
      list.forEach((t) => {
        const tag = (t ?? '').trim();
        if (!tag) return;
        map.set(tag, (map.get(tag) ?? 0) + 1);
      });
    });

    return Array.from(map.entries())
      .map(([tag, cnt]) => ({ tag, cnt }))
      .sort((a, b) => b.cnt - a.cnt)
      .slice(0, limit)
      .map((x) => x.tag);
  } catch (err) {
    console.error('[fetchGlobalTopTags] error', err);
    return [];
  }
}
