import type { Tables } from '@/supabase/database.types';
import InputComment from './InputComment.';
import PostComment from './PostComment';
import { useEffect, useState } from 'react';
import supabase from '@/supabase/supabase';

type Reply = Tables<'reply'>;
type ReplyData = Reply & {
  profile: Pick<Tables<'profile'>, 'profile_id' | 'nickname' | 'profile_image_url'> | null;
};

function CommunityDetail() {
  const [replies, setReplies] = useState<ReplyData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('reply')
        .select('*,profile:profile!reply_user_id_fkey (profile_id,nickname,profile_image_url)')
        .is('parent_id', null)
        .order('created_at', { ascending: false });
      if (error) {
        console.log(error);
        return;
      }
      if (data) setReplies(data);
    };
    fetchData();
  }, []);

  const handleSubmit = async () => {
    console.log(removeEventListener);
  };
  handleSubmit();

  return (
    <div className="min-h-full">
      <div className="max-w-[90rem] mx-auto px-6 py-10">
        <div className="space-y-6">
          <article className="bg-white p-6 rounded-lg shadow-sm">
            <header className="mb-4">
              {/* 게시글 제목 */}
              <h1 className="text-2xl font-semibold text-gray-900">게시글 제목 예시</h1>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* 작성자 정보 */}
                  <img
                    src="/images/avatar-placeholder.png"
                    alt="작성자"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="text-sm">
                    <p className="font-medium text-gray-800">이순신</p>
                    <p className="text-xs text-gray-400">2025-08-28 · 좋아요 10</p>
                  </div>
                </div>

                {/*
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                      수정
                    </button>
                    <button className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700">
                      삭제
                    </button>
                  </div> */}
              </div>
            </header>

            {/* 게시글 본문 */}
            <div className="px-13 max-w-none text-gray-800">
              <p>여기에는 게시글 본문이 들어갑니다. 텍스트, 이미지 등</p>
              <figure>
                <img
                  src="/images/content-placeholder.jpg"
                  alt="대충 이미지 들어갈 자리"
                  className="rounded"
                />
              </figure>
            </div>
            {/* 게시글 태그 및 좋아요(하단) */}
            <footer className="px-12 mt-4 flex items-center justify-between">
              <div className="flex gap-2">
                <span className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary-400 text-sm text-primary-400 bg-white shadow-sm">
                  와인 최고
                </span>

                <span className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary-400 text-sm text-primary-400 bg-white shadow-sm">
                  대충 와인 좋다고 하는 태그
                </span>
              </div>
              <button className="flex gap-2 py-1 text-sm cursor-pointer">
                <img src="/icon/like.svg" alt="좋아요" />
                <span className="mt-2">10</span>
              </button>
            </footer>
          </article>

          {/* 댓글 작성 폼 */}
          <section className="bg-white p-6 rounded-lg shadow-sm">
            <div className="mb-6">
              <InputComment />
            </div>

            {/* 댓글 목록 */}
            <ul className="space-y-4">
              {replies.map(
                ({ parent_id, user_id, reply_id, profile, content, created_at, like_count }) => {
                  const nickname = profile?.nickname ?? '알 수 없는 사용자';
                  const avatar = profile?.profile_image_url ?? '/img/default-avatar.png';
                  return (
                    <PostComment
                      key={reply_id}
                      likes={like_count}
                      replyId={reply_id}
                      user_id={user_id}
                      parent_id={parent_id}
                      nickname={nickname}
                      profileImage={avatar}
                      content={content}
                      created_at={created_at}
                    />
                  );
                }
              )}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
export default CommunityDetail;
