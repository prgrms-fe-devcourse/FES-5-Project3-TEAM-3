import { useEffect, useState } from 'react';
import supabase from '@/supabase/supabase';
import { fetchPopularPosts, fetchGlobalTopTags } from '@/supabase/community/communityService';
import type { PostWithProfile } from '@/supabase/community/communityService';

/**
 * popular / globalTags 로직 분리 훅
 */
export function usePopularTags(popularLimit = 5, tagLimit = 5) {
  const [popular, setPopular] = useState<PostWithProfile[] | null>(null);
  const [globalTags, setGlobalTags] = useState<string[] | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const data = await fetchPopularPosts(popularLimit);
        if (!mounted) return;
        setPopular(data as PostWithProfile[]);
      } catch (err) {
        console.error('[usePopularTags] fetchPopularPosts error', err);
        if (!mounted) return;
        setPopular([]);
      }
    })();

    (async () => {
      try {
        const tags = await fetchGlobalTopTags(tagLimit);
        if (!mounted) return;
        setGlobalTags(tags);
      } catch (err) {
        console.error('[usePopularTags] fetchGlobalTopTags error', err);
        if (!mounted) return;
        setGlobalTags([]);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [popularLimit, tagLimit]);

  const handleTagClick = async (tag: string) => {
    const plain = tag.replace(/^#/, '').trim();
    if (!plain) return;
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('post_id')
        .contains('hashtag_list', [plain])
        .order('like_count', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('[handleTagClick] supabase error', error);
      }
      if (data && (data as any).post_id) {
        window.location.href = `/community/detail/${(data as any).post_id}`;
        return;
      }
    } catch (e) {
      console.error('[handleTagClick] caught', e);
    }
    window.location.href = `/community/tag/${encodeURIComponent(plain)}`;
  };

  return { popular, globalTags, handleTagClick };
}
