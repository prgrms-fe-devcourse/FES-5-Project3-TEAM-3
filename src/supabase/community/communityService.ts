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
    // DB의 hashtag_counts 테이블에서 tag_count 내림차순으로 가져오기
    const { data, error } = await supabase
      .from('hashtag_counts')
      .select('tag_text, tag_count')
      .order('tag_count', { ascending: false })
      .limit(limit);

    if (error) throw error;

    const tags = Array.isArray(data) ? data.map((r: any) => r.tag_text).filter(Boolean) : [];
    return tags;
  } catch (err) {
    console.error('[fetchGlobalTopTags] error', err);
    return [];
  }
}
