import Button from '@/component/Button';
import { usePost } from '@/hook/fetch';
import { useAuth } from '@/store/@store';
import type { Tables } from '@/supabase/database.types';
import supabase from '@/supabase/supabase';
import { useEffect, useState } from 'react';

type Post = Tables<'posts'>;

function InputComment() {
  const { userId } = useAuth();
  const [comment, setComment] = useState('');
  const [postData, setPostData] = useState<Post[]>([]);

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

    const { error } = await supabase.from('reply').insert({
      user_id: userId,
      post_id: postId ?? '',
      content: comment,
    });

    if (error) console.error(error);
  };

  return (
    <form className="flex gap-3" onSubmit={(e) => handleSubmit(e)}>
      <textarea
        id="comment"
        className="block w-5/6 rounded border border-gray-800 p-3 resize-none focus:outline-none focus:ring-2 focus:ring-primary-400"
        placeholder="댓글을 입력하세요."
        onChange={(e) => setComment(e.target.value)}
        rows={1}
      />
      <Button type="submit" size="md" borderType="outline" className="h-12.5">
        등록
      </Button>
    </form>
  );
}
export default InputComment;
