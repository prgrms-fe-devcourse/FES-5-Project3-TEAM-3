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
 */
export async function fetchGlobalTopTags(limit = 5) {
  try {
    // 좋아요 많은 글 순서대로 일정건수(fetchLimit) 가져온 뒤, 각 포스트의 첫 번째 태그만 집계
    const fetchLimit = 1000; // 안전 상한, 필요 시 조정
    const { data, error } = await supabase
      .from('posts')
      .select('hashtag_list')
      .order('like_count', { ascending: false })
      .limit(fetchLimit);

    if (error) throw error;

    const map = new Map<string, number>();
    (data ?? []).forEach((r: any) => {
      const list: string[] = Array.isArray(r?.hashtag_list) ? r.hashtag_list : [];
      const first = (list[0] ?? '').toString().trim();
      if (!first) return;
      map.set(first, (map.get(first) ?? 0) + 1);
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
