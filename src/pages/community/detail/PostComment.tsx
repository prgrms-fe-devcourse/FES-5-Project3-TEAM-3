import Button from "@/component/Button";
import { usePost } from "@/hook/fetch";
import { useIsMine } from "@/hook/useisMine";
import { useAuth } from "@/store/@store";
import type { Tables } from "@/supabase/database.types";
import supabase from "@/supabase/supabase";
import { useEffect, useState } from "react";

interface Props{
  nickname: string,
  profileImage: string
  content: string
  created_at:string
}
type Post = Tables<'posts'>; 


function PostComment({ nickname, profileImage, content, created_at }: Props) {
  const { userId } = useAuth();
  const isMine = useIsMine();
  const [comment, setComment] = useState('');
  const [postData, setPostData] = useState<Post[]>([]);
  const [reply, setReply] = useState(false);
  const handleReply = () => {
    setReply(!reply);
  };

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
      post_id: postId ?? '',
      user_id: userId,
      content: comment,
    });
  };

  return (
    <li className="flex gap-3">
      <img src={profileImage} alt="댓글작성자" className="w-9 h-9 rounded-full" />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{nickname}</span>
            <span className="text-xs text-gray-400">{created_at}</span>

            {userId && (
              <>
                <button className="cursor-pointer">
                  <img src="/icon/modify.svg" alt="수정하기" className="w-3 h-3" />
                </button>
                <button className="cursor-pointer">
                  <img src="/icon/delete.svg" alt="삭제하기" className="w-3 h-3" />
                </button>
              </>
            )}
          </div>
        </div>
        <p className="mt-1 mb-1 text-sm text-gray-700">{content}</p>
        <div className="flex gap-2">
          <button className="flex gap-1 py-1 text-sm cursor-pointer">
            <img src="/icon/like.svg" alt="좋아요" className="w-4 h-4 " />
            <span>10</span>
          </button>
          <button className="flex gap-1 py-1 text-sm cursor-pointer">
            <img src="/icon/comment.svg" alt="답글" className="w-4 h-4 " />
            <span>2</span>
          </button>
          <button className="flex gap-1 py-1 text-sm cursor-pointer" onClick={handleReply}>
            <span>답글</span>
          </button>
        </div>

        {/* 답글 작성 폼 */}

        {reply && (
          <form
            className="reply-form mt-3 pl-10 flex gap-3 items-start"
            onSubmit={(e) => handleSubmit(e)}
          >
            <textarea
              name="reply"
              className="w-5/6 rounded border border-gray-200 p-2 resize-none text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
              rows={2}
              placeholder="답글을 입력하세요."
              onChange={(e) => setComment(e.target.value)}
            />
            <div className="flex gap-2">
              <Button type="submit" size="sm" borderType="outline">
                등록
              </Button>
              <Button type="button" size="sm" borderType="outline">
                취소
              </Button>
            </div>
          </form>
        )}
      </div>
    </li>
  );
}
export default PostComment

