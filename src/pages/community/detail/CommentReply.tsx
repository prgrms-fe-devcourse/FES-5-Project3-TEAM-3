import { useIsMine } from '@/hook/useIsMine';
import { useEffect, useState } from 'react';
import supabase from '@/supabase/supabase';
import EditBtn from '@/component/community/EditBtn';
import { useTimer } from '@/hook/useTimer';
import useToast from '@/hook/useToast';
import { useKeyDown } from '@/hook/useKeyDown';


interface Props {
  profileImage: string;
  nickname: string | null | undefined;
  created_at: string;
  content: string;
  userId: string | null;
  replyId: string;
  onDelete: (id: string) => Promise<void>;
}

function CommentReply({
  profileImage,
  nickname,
  created_at,
  replyId,
  userId,
  content,
  onDelete,
}: Props) {
  if (!userId) return;
  
  const time = useTimer(created_at)
  const isMine = useIsMine(userId);
  const [edit, setEdit] = useState(false);
  const [editComment, setEditComment] = useState('');
  const [renderComment, setRenderComment] = useState('');

   useEffect(() => {
     setRenderComment(content);
   }, [content]);

   // edit이 true가 될 때만 현재 본문을 수정 입력으로 복사
   useEffect(() => {
     if (edit) setEditComment(renderComment);
   }, [edit, renderComment]);

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
      setEdit(false);
    } 
  };

  return (
    <div className="flex gap-2 items-start flex-1">
      <span className="text-gray-200">ㄴ</span>
      <img src={profileImage} alt="대댓글작성자" className="w-9 h-9 rounded-full" />
      <div className="flex justify-between flex-col">
        <div className="flex items-center gap-3">
          <span className="text-sm">{nickname}</span>
          <span className="text-xs text-gray-400">{time}</span>
          {isMine && (
            <>
              <EditBtn state={edit} setState={setEdit} onSave={handleSave} />
              <button className="cursor-pointer" onClick={() => onDelete(replyId)}>
                <img src="/icon/delete.svg" alt="삭제하기" className="w-3 h-3" />
              </button>
            </>
          )}
        </div>
        {edit ? (
          <textarea
            rows={3}
            value={editComment}
            autoFocus
            className="resize-none w-200 border-text-secondary border-1"
            onKeyDown={(e) => useKeyDown(e)}
            onChange={(e) => setEditComment(e.target.value)}
          />
        ) : (
          <p className=" my-1 text-sm text-gray-700 whitespace-pre-line break-words">
            {renderComment}
          </p>
        )}
        <div>
          <button className="flex gap-1 py-1 text-sm cursor-pointer">
            <img src="/icon/like.svg" alt="좋아요" className="w-4 h-4 " />
            <span>1</span>
          </button>
        </div>
      </div>
    </div>
  );
}
export default CommentReply;
