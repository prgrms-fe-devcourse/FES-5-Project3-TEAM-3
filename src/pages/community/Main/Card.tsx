import { useState } from 'react';
import { Link } from 'react-router';
import type { Database } from '@/supabase/database.types';
import LikeButton from '@/component/LikeButton';

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

  // 좋아요 카운트는 포스트 데이터에서 초기화 (LikeButton이 'liked' 여부는 자체 조회)
  const [likesCount, setLikesCount] = useState<number>(post?.like_count ?? 0);

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

              <LikeButton
                itemId={post?.post_id ?? ''}
                kind="post"
                initialLiked={false}
                initialCount={likesCount}
                ownerId={post?.user_id ?? null}
                className={`flex items-center gap-1 ${false ? 'text-gray-600' : ''} cursor-pointer`}
                onToggle={(_, count) => {
                  setLikesCount(count);
                }}
              />
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
