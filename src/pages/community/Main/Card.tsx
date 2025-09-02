import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import type { Database } from '@/supabase/database.types';
import supabase from '@/supabase/supabase';
import useToast from '@/hook/useToast';

type PostRow = Database['public']['Tables']['posts']['Row'];
type ProfileJoined = {
  nickname?: string | null;
  profile_image_url?: string | null;
};
type PostWithProfile = PostRow & { profile?: ProfileJoined | null };

export default function Card({ post }: { post?: PostWithProfile }) {
  const rawImg =
    post?.thumbnail_image ?? (Array.isArray(post?.image_url) ? post?.image_url?.[0] : undefined);
  const img = typeof rawImg === 'string' && rawImg.trim() !== '' ? rawImg : null;
  const category = post?.post_category ?? 'free';
  const replies = post?.reply_count ?? 0;

  const [likesCount, setLikesCount] = useState<number>(post?.like_count ?? 0);
  const [likedByMe, setLikedByMe] = useState<boolean>(false);
  const [loadingLike, setLoadingLike] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const uid = (userData as any)?.user?.id ?? null;
      if (!mounted) return;
      setCurrentUserId(uid);

      if (!uid || !post?.post_id) return;

      // 내가 이미 좋아요 눌렀는지 확인
      const { data: likeRow, error } = await supabase
        .from('post_like')
        .select('post_like_id')
        .eq('post_id', post.post_id)
        .eq('user_id', uid)
        .limit(1)
        .maybeSingle();

      if (!mounted) return;
      if (!error && likeRow) setLikedByMe(true);
    })();

    return () => {
      mounted = false;
    };
  }, [post?.post_id]);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!post?.post_id) return;

    const uid = currentUserId;
    if (!uid) {
      useToast('info', '로그인이 필요합니다. 로그인 후 시도하세요.');
      return;
    }
    if (post.user_id && post.user_id === uid) {
      useToast('warn', '본인 게시글에는 좋아요를 누를 수 없습니다.');
      return;
    }

    if (loadingLike) return;
    setLoadingLike(true);

    const { data, error } = await supabase.rpc('toggle_post_like', {
      p_post_id: post.post_id,
      p_user_id: uid,
    });

    setLoadingLike(false);

    if (error) {
      console.error('toggle_post_like error', error);
      return;
    }

    const res = Array.isArray(data) ? (data[0] as any) : (data as any);
    if (!res) return;

    if (res.action === 'liked') {
      setLikedByMe(true);
      setLikesCount(Number(res.like_count ?? likesCount + 1));
    } else if (res.action === 'unliked') {
      setLikedByMe(false);
      setLikesCount(Number(res.like_count ?? Math.max(0, likesCount - 1)));
    }
  };

  const categoryStyle =
    category === 'review'
      ? { background: '#E6F7EE', color: '#0F9D58' }
      : category === 'question'
        ? { background: '#EEF2FF', color: '#2B6CB0' }
        : { background: '#FFF1F0', color: '#B91C1C' };

  // profile 우선 사용: nickname / profile_image_url
  const nickname = post?.profile?.nickname ?? post?.user_id ?? '익명';
  const avatarUrl = post?.profile?.profile_image_url ?? null;

  return (
    <article className="bg-white flex-1 rounded-2xl shadow-md overflow-hidden flex flex-col">
      <Link to={`/community/detail/${post?.post_id ?? ''}`} className="flex flex-col h-full">
        <div className="w-full h-44 bg-gray-100 overflow-hidden">
          {img ? (
            <img
              src={img}
              alt={post?.title ?? '게시글 이미지'}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm text-gray-400 bg-gray-100">
              이미지 없음
            </div>
          )}
        </div>

        <div className="flex flex-col flex-1 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="px-2 py-1 rounded-md text-xs font-medium" style={categoryStyle}>
              {category === 'review' ? '리뷰' : category === 'question' ? '질문' : '자유'}
            </span>
            <div className="text-xs text-gray-400">
              {post?.created_at ? new Date(post.created_at).toLocaleDateString() : ''}
            </div>
          </div>

          <div className="flex-1">
            <h3 className="text-base font-semibold mb-2 line-clamp-2">
              {post?.title
                ? post.title.replace(/<[^>]+>/g, '').slice(0, 26) +
                  (post.title.length > 26 ? '...' : '')
                : '제목 없음'}
            </h3>
            <p className="text-sm text-gray-500 mb-3">
              {post?.content
                ? post.content.replace(/<[^>]+>/g, '').slice(0, 45) +
                  (post.content.length > 45 ? '...' : '')
                : ''}
            </p>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-400 mt-auto">
            <div className="flex items-center gap-2">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={nickname ?? '익명'}
                  className="w-7 h-7 rounded-full object-cover"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 text-sm">
                  {String(nickname).slice(0, 1).toUpperCase()}
                </div>
              )}
              <div className="text-sm">{nickname}</div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <img src="/icon/comment.svg" alt="댓글" className="w-4 h-4" />
                <span className="mt-0.5">{replies}</span>
              </div>

              <button
                type="button"
                className={`flex items-center gap-1 cursor-pointer ${likedByMe ? 'text-gray-600' : ''}`}
                onClick={handleLike}
                aria-pressed={likedByMe}
                aria-busy={loadingLike}
              >
                <img
                  src={likedByMe ? '/icon/like_true.svg' : '/icon/like.svg'}
                  alt="좋아요"
                  className={`w-4 h-4 ${loadingLike ? 'opacity-60' : ''}`}
                />
                <span className="mt-0.5">{likesCount}</span>
              </button>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
