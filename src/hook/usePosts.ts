import { useCallback, useEffect, useRef, useState } from 'react';
import supabase from '@/supabase/supabase';
import type { PostWithProfile } from '@/supabase/community/communityService';

export function usePosts(limit = 30) {
  const [posts, setPosts] = useState<PostWithProfile[] | null>(null); // null = loading
  const [search, setSearch] = useState<string>('');
  const [sortBy, setSortBy] = useState<'recent' | 'likes'>('recent'); // 추가: 정렬 상태
  const placeholders = Array.from({ length: 9 }).map((_, i) => i);
  const debounceRef = useRef<number | null>(null);

  const fetchPosts = useCallback(
    async (term?: string, sort?: 'recent' | 'likes') => {
      setPosts(null);
      try {
        const trimmed = (term ?? '').trim();
        const orderMode = sort ?? sortBy;

        // 기본 builder
        let builder = supabase.from('posts').select('*, profile(nickname, profile_image_url)');

        // 정렬 적용 (builder에 체인)
        if (orderMode === 'likes') {
          builder = builder.order('like_count', { ascending: false });
        } else {
          builder = builder.order('created_at', { ascending: false });
        }
        builder = builder.limit(limit);

        if (trimmed) {
          // 태그 검색 모드: "#tag" 형태이면 hashtag_list 배열에 포함된 항목으로 필터
          if (trimmed.startsWith('#')) {
            const tag = trimmed.replace(/^#/, '').trim().toLowerCase();
            if (tag) {
              // 기존 builder에 contains로 필터 적용 (재할당 하지 않음)
              builder = builder.contains('hashtag_list', [tag]);
            }
          } else {
            const pattern = `%${trimmed.replace(/%/g, '\\%')}%`;
            // builder.or은 supabase에서 사용가능한 포맷으로 조합
            builder = builder.or(`title.ilike.${pattern},content.ilike.${pattern}`);
          }
        }

        const { data, error } = await builder;
        if (error) {
          console.error('[usePosts] fetch posts error', error);
          setPosts([]);
          return;
        }
        setPosts((data ?? []) as PostWithProfile[]);
      } catch (err) {
        console.error('[usePosts] unexpected', err);
        setPosts([]);
      }
    },
    [limit, sortBy]
  );

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    debounceRef.current = window.setTimeout(() => {
      fetchPosts(search);
    }, 350);
    return () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    };
  }, [search, fetchPosts]);

  return { posts, search, setSearch, fetchPosts, placeholders, sortBy, setSortBy, debounceRef };
}
