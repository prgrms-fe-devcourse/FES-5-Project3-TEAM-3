import Button from '@/component/Button';
import { usePost } from '@/utils/supabase/fetch';
import { useAuth } from '@/store/@store';
import type { Tables } from '@/supabase/database.types';
import supabase from '@/supabase/supabase';
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import type { ReplyData } from '@/@types/global';
import useToast from '@/hook/useToast';
import { useKeyDown } from '@/hook/useKeyDown';

type Post = Tables<'posts'>;

interface Props {
  setReplies: Dispatch<SetStateAction<ReplyData[]>>;
}

function InputComment({ setReplies }: Props) {
  const { userId } = useAuth();
  const [postData, setPostData] = useState<Post[]>([]);
  // post_id 넣은 state
  const [comment, setComment] = useState('');

  /* 기능 확인을 위해 임시적으로 postId를 뽑아썻습니다 postId를 내려주었다면 지워주세요 */
  useEffect(() => {
    const fetchData = async () => {
      const post = await usePost();
      if (post) setPostData(post);
    };
    fetchData();
  }, []);

  const postId = postData.find((x) => x.post_id)?.post_id;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId) {
      useToast('error', '로그인 후 이용해주세요');
      return;
    }
    if (comment.trim() === '') {
      useToast('warn', '최소 한글자 이상 작성해야합니다');
      return;
    }

    const { error } = await supabase.from('reply').insert({
      user_id: userId,
      post_id: postId ?? '',
      content: comment.trim(),
    });

    if (error) console.error(error);
    if (!error) setComment('');

    const { data } = await supabase
      .from('reply')
      .select('*,profile(profile_id,nickname,profile_image_url)')
      .is('parent_id', null)
      .order('created_at', { ascending: false });

    if (data) setReplies(data);
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
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={(e) => useKeyDown(e)}
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
