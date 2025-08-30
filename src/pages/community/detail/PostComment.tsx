import Button from '@/component/Button';
import { usePost } from '@/utils/supabase/fetch';
import { useIsMine } from '@/hook/useIsMine';
import { useAuth } from '@/store/@store';
import type { Tables } from '@/supabase/database.types';
import supabase from '@/supabase/supabase';
import { useEffect, useState} from 'react';
import CommentReply from './CommentReply';
import EditBtn from '../../../component/community/EditBtn';
import { useTimer } from '@/hook/useTimer';
import type { ReplyData } from '@/@types/global';
import useToast from '@/hook/useToast';
import { useKeyDown } from '@/hook/useKeyDown';

interface Props {
  nickname: string;
  profileImage: string;
  created_at: string;
  replyId: string;
  user_id: string | null;
  parent_id: string | null;
  likes: number;
  content:string,
  onDelete: () => void
}
type Post = Tables<'posts'>;

function PostComment({
  replyId,
  user_id,
  nickname,
  profileImage,
  created_at,
  likes,
  content,
  onDelete,
}: Props) {
  const { userId } = useAuth();
  const isMine = useIsMine(user_id ?? '');
  const time = useTimer(created_at);


  const [comment, setComment] = useState('');
  const [editComment, setEditComment] = useState('');
  const [renderComment, setRenderComment] = useState('');
  const [postData, setPostData] = useState<Post[]>([]);
  const [reply, setReply] = useState(false);

  const [edit, setEdit] = useState(false);
  const [children, setChildren] = useState<ReplyData[]>([]);
  const childrenCount = children.length;

  // 답글버튼 누르면 댓글UI토글
  const handleReply = () => {
    setReply(!reply);
  };

  useEffect(() => {
    setRenderComment(content);
  }, [content]);

  // edit이 true가 될 때만 현재 본문을 수정 입력으로 복사
  useEffect(() => {
    if (edit) setEditComment(renderComment);
  }, [edit, renderComment]);

  // 확인을 위헤 임시로 postId를뽑아썻습니다.
  useEffect(() => {
    const fetchData = async () => {
      const post = await usePost();
      if (post) setPostData(post);
    };
    fetchData();
  }, []);

  const postId = postData.find((x) => x.post_id)?.post_id;

  // 대댓글렌더링을 위한 데이터fetch
  useEffect(() => {
    const fetchChild = async () => {
      const { data, error } = await supabase
        .from('reply')
        .select('*,profile(profile_id,nickname,profile_image_url)')
        .eq('parent_id', replyId)
        .order('created_at', { ascending: false });
      if (error) {
        console.log(error);
        return;
      }
      setChildren(data);
    };
    fetchChild();
  }, [replyId]);

  // 수정 저장 기능
  const handleSave = async () => {
    if (editComment.trim() === '') {
      useToast('error', '최소 한글자 이상 입력해야합니다.')
      return
    }
    const { data, error } = await supabase
      .from('reply')
      .update({ content: editComment.trim() })
      .eq('reply_id', replyId)
      .select('reply_id,content')
      .single();
    if (error) console.log(error);
    if (data) {
      setRenderComment(data.content);
      setEdit(false)
     } 
  };

  //삭제기능
  const handleDelete = async () => {
    const confirmDelete = confirm('정말 삭제하시겠습니까?');
    if (confirmDelete) {
      try {
        const { error } = await supabase.from('reply').delete().eq('reply_id', replyId);
        if (!error) onDelete();
        if (error) console.error(error);
      } catch {
        console.error();
      }
    }
  };

  //대댓글삭제
  const handleDeleteChild = async (targetId: string) => {
    const ok = confirm('정말 삭제하시겠습니까?');
    if (!ok) return;

    setChildren((prev) => prev.filter((c) => c.reply_id !== targetId));

    const { error } = await supabase.from('reply').delete().eq('reply_id', targetId);

    if (error) {
      console.error(error);
    }
  };

  // 댓글 기능
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
 if (editComment.trim() === '') {
     useToast('error', '최소 한글자 이상 입력해야합니다.');
     return;
   }
    if (!postId) {
      console.log('postId가 없음');
      return;
    }

    const { data, error } = await supabase
      .from('reply')
      .insert({
        post_id: postId,
        user_id: userId,
        content: comment.trim(),
        parent_id: replyId,
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

    if (error) {
      console.log(error);
      return;
    }
    if (data) {
      setChildren((prev) => [...prev, data]);
    }
    setComment('');
  };

  return (
    <li className="flex gap-3">
      <img src={profileImage} alt="댓글작성자" className="w-9 h-9 rounded-full" />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{nickname}</span>
            <span className="text-xs text-gray-400">{time}</span>

            {isMine && (
              <>
                <EditBtn state={edit} setState={setEdit} onSave={handleSave} />
                <button className="cursor-pointer" onClick={handleDelete}>
                  <img src="/icon/delete.svg" alt="삭제하기" className="w-3 h-3" />
                </button>
              </>
            )}
          </div>
        </div>
        {edit ? (
          <textarea
            rows={3}
            value={editComment}
            autoFocus
            className="resize-none w-full border-text-secondary border-1"
            onChange={(e) => setEditComment(e.target.value)}
          />
        ) : (
          <p className="mt-1 mb-1 text-sm text-gray-700 whitespace-pre-line break-words">{renderComment}</p>
        )}

        <div className="flex gap-2">
          <button className="flex gap-1 py-1 text-sm cursor-pointer">
            <img src="/icon/like.svg" alt="좋아요" className="w-4 h-4 " />
            <span>{likes}</span>
          </button>
          <button className="flex gap-1 py-1 text-sm cursor-pointer" onClick={handleReply}>
            <img src="/icon/comment.svg" alt="답글" className="w-4 h-4 " />
            <span>{childrenCount}</span>
          </button>
        </div>

        {/* 답글 작성 폼 */}

        {reply && (
          <>
            <form
              className="reply-form mt-3 pl-10 flex gap-3 items-start"
              onSubmit={(e) => handleSubmit(e)}
            >
              <textarea
                name="reply"
                className="w-5/6 rounded border border-gray-200 p-2 resize-none text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                rows={3}
                value={comment}
                placeholder="답글을 입력하세요."
                onKeyDown={(e)=>useKeyDown(e)}
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
          </>
        )}
        {childrenCount > 0 && (
          <div className="mt-2 space-y-2">
            {children.map((child) => (
              <CommentReply
                key={child.reply_id}
                replyId={child.reply_id}
                userId={child.user_id}
                profileImage={child.profile?.profile_image_url}
                nickname={child.profile?.nickname}
                created_at={child.created_at}
                content={child.content}
                onDelete={handleDeleteChild}
              />
            ))}
          </div>
        )}
      </div>
    </li>
  );
}
export default PostComment;
