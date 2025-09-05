import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import InputComment from './InputComment.';
import PostComment from './PostComment';
import supabase from '@/supabase/supabase';
import type { ReplyData } from '@/@types/global';
import type { PostWithProfile } from '@/supabase/community/communityService';
import LikeButton from '@/component/LikeButton';
import { useTimer } from '@/hook/useTimer';
import useToast from '@/hook/useToast';
import { useIsMine } from '@/hook/useIsMine';

function CommunityDetail() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostWithProfile | null>(null);
  const [replies, setReplies] = useState<ReplyData[]>([]);
  const [loading, setLoading] = useState(true);
  const time = useTimer(post?.created_at ?? '');
  const isMine = useIsMine(post?.user_id ?? '');
  const category = post?.post_category ?? 'free';

  // 포스트 좋아요 카운트 로컬 상태
  const [likesCount, setLikesCount] = useState<number>(post?.like_count ?? 0);

  // post가 변경되면 likesCount 동기화
  useEffect(() => {
    setLikesCount(post?.like_count ?? 0);
  }, [post?.like_count]);

  useEffect(() => {
    if (!postId) return;
    let mounted = true;

    const fetchPostAndReplies = async () => {
      setLoading(true);
      try {
        // 게시글 상세 조회 (작성자 프로필 포함)
        const { data: postData, error: postError } = await supabase
          .from('posts')
          .select('*, profile(nickname, profile_image_url)')
          .eq('post_id', postId)
          .maybeSingle();

        if (postError) {
          console.error('fetch post error', postError);
        } else if (mounted) {
          setPost(postData as PostWithProfile | null);
        }

        // 댓글 조회
        const { data: replyData, error: replyError } = await supabase
          .from('reply')
          .select('*, profile(profile_id,nickname,profile_image_url)')
          .eq('post_id', postId)
          .is('parent_id', null)
          .order('created_at', { ascending: false });

        if (replyError) {
          console.error('fetch replies error', replyError);
        } else if (mounted) {
          setReplies((replyData ?? []) as ReplyData[]);
        }
      } catch (err) {
        console.error('fetch detail caught', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    // 즉시 호출
    fetchPostAndReplies();

    // 뒤로/앞으로 이동(popstate) 시에도 재조회하도록 리스너 추가
    const onPop = () => {
      fetchPostAndReplies();
    };
    window.addEventListener('popstate', onPop);

    return () => {
      mounted = false;
      window.removeEventListener('popstate', onPop);
    };
  }, [postId]);

  const handleDelete = (targetId: string) => {
    setReplies((prev) => prev.filter((c) => c.reply_id !== targetId));
  };

  if (!postId) return;

  const categoryStyle =
    category === 'review'
      ? { background: '#E6F7EE', color: '#0F9D58' }
      : category === 'question'
        ? { background: '#EEF2FF', color: '#2B6CB0' }
        : { background: '#FFF1F0', color: '#B91C1C' };

  return (
    <div className="min-h-full">
      <div className="max-w-[90rem] mx-auto px-6 py-10">
        <div className="space-y-6">
          <article className="bg-white p-6 rounded-lg shadow-sm">
            <header className="mb-4">
              <div className="flex items-center justify-between">
                <div className="flex gap-3">
                  <h1 className="text-2xl font-semibold text-gray-900">
                    {loading ? '로딩 중...' : (post?.title ?? '제목 없음')}
                  </h1>
                  <span
                    className="px-2 py-1 rounded-md text-[16px] font-medium"
                    style={categoryStyle}
                  >
                    {category === 'review' ? '리뷰' : category === 'question' ? '질문' : '자유'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/community')}
                  className="ml-4 px-3 py-1 rounded-md border text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  목록으로
                </button>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={post?.profile?.profile_image_url ?? '/images/avatar-placeholder.png'}
                    alt="작성자"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex gap-2 text-sm">
                    <p className="font-medium text-gray-800">
                      {post?.profile?.nickname ?? '작성자'}
                    </p>
                    <p className="text-gray-500">{time}</p>
                  </div>

                  {/* 작성자일 경우 수정/삭제 버튼 */}
                  {isMine && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          // edit 모드로 CommunityWrite 이동, post 전체를 state로 전달
                          navigate('/community/write', { state: { mode: 'edit', post } });
                        }}
                      >
                        <img
                          src="/icon/modify.svg"
                          alt="수정하기"
                          className="w-5 h-5 cursor-pointer"
                        />
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          if (!postId) return;
                          const ok = confirm('정말 게시글을 삭제하시겠습니까?');
                          if (!ok) return;
                          try {
                            const { error } = await supabase
                              .from('posts')
                              .delete()
                              .eq('post_id', postId);
                            if (error) throw error;
                            useToast('success', '삭제되었습니다.');
                            navigate('/community');
                          } catch (e) {
                            console.error('[CommunityDetail] delete error', e);
                            useToast('error', '삭제에 실패했습니다.');
                          }
                        }}
                      >
                        <img
                          src="/icon/delete.svg"
                          alt="삭제하기"
                          className="w-5 h-5 cursor-pointer"
                        />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </header>

            <div className="px-13 max-w-none text-gray-800">
              {/* 본문(이미 HTML로 저장된 경우) */}
              {post?.content ? (
                (() => {
                  const content = String(post.content ?? '');
                  // HTML 여부 판단
                  const isHtml = /<\/?[a-z][\s\S]*>/i.test(content);
                  if (isHtml) {
                    const normalized = content
                      .replace(/<p>(?:\s|&nbsp;)*<\/p>/gi, '<p><br/></p>')
                      .replace(/<div>(?:\s|&nbsp;|<br\s*\/?>)*<\/div>/gi, '<p><br/></p>');
                    return <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: normalized }} />;
                  }
                  // plain text: 개행 보존
                  return <div className="whitespace-pre-wrap text-gray-800">{content}</div>;
                })()
              ) : (
                <p>본문이 없습니다.</p>
              )}
            </div>

            <footer className="px-12 mt-4 flex items-center justify-between">
              <div className="flex gap-2">
                {Array.isArray((post as any)?.hashtag_list) &&
                  (post as any).hashtag_list.map((t: string) => (
                    <span
                      key={t}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary-400 text-sm text-primary-400 bg-white shadow-sm"
                    >
                      # {t}
                    </span>
                  ))}
              </div>

              <LikeButton
                itemId={postId ?? ''}
                kind="post"
                initialLiked={false}
                initialCount={likesCount}
                ownerId={post?.user_id ?? null}
                className="flex items-center gap-1 cursor-pointer"
                onToggle={(_liked, count) => {
                  setLikesCount(count);
                  // 로컬 post 객체에도 동기화
                  setPost((p) => (p ? { ...p, like_count: count } : p));
                }}
              />
            </footer>
          </article>

          {/* 댓글 작성 폼 */}
          <section className="bg-white p-6 rounded-lg shadow-sm">
            <div className="mb-6">
              <InputComment setReplies={setReplies} postId={postId} />
            </div>

            {/* 댓글 목록 */}
            <ul className="space-y-4">
              {replies.map((r) => {
                const nickname = r.profile?.nickname;
                const avatar = r.profile?.profile_image_url;
                return (
                  <PostComment
                    key={r.reply_id}
                    content={r.content}
                    likes={r.like_count}
                    replyId={r.reply_id}
                    user_id={r.user_id}
                    parent_id={r.parent_id}
                    nickname={nickname}
                    profileImage={avatar}
                    created_at={r.created_at}
                    onDelete={() => handleDelete(r.reply_id)}
                  />
                );
              })}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
export default CommunityDetail;
