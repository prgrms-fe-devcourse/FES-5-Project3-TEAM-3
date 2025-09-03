import Button from '@/component/Button';
import { useAuth } from '@/store/@store';
import supabase from '@/supabase/supabase';
import { useState, type Dispatch, type SetStateAction } from 'react';
import type { ReplyData } from '@/@types/global';
import useToast from '@/hook/useToast';
import { useKeyDown } from '@/hook/useKeyDown';


interface Props {
  setReplies: Dispatch<SetStateAction<ReplyData[]>>;
  postId: string;
}

function InputComment({ setReplies, postId }: Props) {
  const { userId } = useAuth();
  const [comment, setComment] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId) {
      useToast('error', '로그인 후 이용해주세요');
      return;
    }
    if (!postId) {
      console.error('InputComment: missing postId');
      useToast('error', '게시글 정보를 찾을 수 없습니다.');
      return;
    }
    if (comment.trim() === '') {
      useToast('warn', '최소 한글자 이상 작성해야합니다.');
      return;
    }

    const { data: inserted, error: insertError } = await supabase
      .from('reply')
      .insert({
        user_id: userId,
        post_id: postId,
        content: comment.trim(),
      })
      .select(
        `
       reply_id,
       content,
       created_at,
       user_id,
       parent_id,
       profile:profile(
         nickname,
         profile_image_url
       )
     `
      )
      .single();

    if (insertError) {
      console.error('insert reply error', insertError);
      useToast('error', '댓글 등록에 실패했습니다.');
      return;
    }

    // 댓글 카운트 증가 동기화 (posts.reply_count += 1)
    try {
      if (inserted && postId) {
        const { data: postRow } = await supabase.from('posts').select('reply_count').eq('post_id', postId).maybeSingle();
        const current = (postRow as any)?.reply_count ?? 0;
        await supabase.from('posts').update({ reply_count: current + 1 }).eq('post_id', postId);
      }
    } catch (e) {
      console.error('[InputComment] reply_count increment error', e);
    }

    // 해당 게시글의 최상위 댓글만 다시 로드 (postId 필터 적용)
    const { data, error } = await supabase
      .from('reply')
      .select('*,profile(profile_id,nickname,profile_image_url)')
      .eq('post_id', postId)
      .is('parent_id', null)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('fetch replies error', error);
      // 성공적으로 insert는 되었으니 화면에 바로 반영 (prepend) 처리
      if (inserted) {
        setReplies((prev) => [inserted as ReplyData, ...prev]);
        setComment('');
      }
      return;
    }

    if (data) {
      setReplies(data as ReplyData[]);
      setComment('');
    }
  };

  return (
    <form className="flex gap-3" onSubmit={(e) => handleSubmit(e)}>
      {userId ? (
        <textarea
          id="comment"
          className="block w-5/6 rounded border border-gray-800 p-3 resize-none focus:outline-none focus:ring-2 focus:ring-primary-400"
          placeholder="댓글을 입력하세요."
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={(e) => useKeyDown(e)}
          value={comment}
          rows={1}
        />
      ) : (
        <textarea
          id="comment"
          disabled
          className="block w-5/6 rounded border border-gray-800 p-3 resize-none focus:outline-none focus:ring-2 focus:ring-primary-400"
          placeholder="로그인 후 이용해주세요."
          value={comment}
          rows={1}
        />
      )}

      <Button type="submit" size="md" borderType="outline" className="h-12.5">
        등록
      </Button>
    </form>
  );
}
export default InputComment;
