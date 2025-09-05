import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { fetchPopularPosts, fetchGlobalTopTags } from '@/supabase/community/communityService';
import type { PostWithProfile } from '@/supabase/community/communityService';

/**
 * popular / globalTags 로직 분리 훅
 */
export function usePopularTags(popularLimit = 5, tagLimit = 5) {
  const [popular, setPopular] = useState<PostWithProfile[] | null>(null);
  const [globalTags, setGlobalTags] = useState<string[] | null>(null);
  const navigate = useNavigate();

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

  const handleTagClick = (tag: string) => {
    const plain = tag.replace(/^#/, '').trim();
    if (!plain) return;
    navigate(`/community?tag=${encodeURIComponent(plain)}`);
  };

  return { popular, globalTags, handleTagClick };
}
