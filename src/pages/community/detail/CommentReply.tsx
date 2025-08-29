import { useIsMine } from '@/hook/useIsMine';
import EditBtn from './editBtn';
import { useEffect, useState } from 'react';
import supabase from '@/supabase/supabase';

interface Props {
  profileImage: string | null | undefined;
  nickname: string | null | undefined;
  created_at: string;
  content: string;
  userId: string | null;
  replyId: string;
  setComment: (value: React.SetStateAction<string>) => void;
  onDelete: (id:string) =>Promise<void>
}

function CommentReply({ profileImage, nickname, created_at, replyId, userId,setComment,content,onDelete }: Props) {
  if (!userId) return;
  const isMine = useIsMine(userId);
  const [edit, setEdit] = useState(false);
  const [editComment,setEditComment] = useState('')
  const [renderComment, setRenderComment] = useState('')
  
    useEffect(() => {
      setRenderComment(content)
    },[content])
  
    const handleSave = async () => {
      setRenderComment(editComment);
      const { error } = await supabase
        .from('reply')
        .update({ content: editComment })
        .eq('reply_id', replyId)
        .select('content')
        .single();
      if (error) console.log(error);
      setEdit(false);
      setComment(editComment);
    };
  return (
    <li className="flex gap-2 items-start">
      <span className="text-gray-200">ㄴ</span>
      <div>
        <div className="flex items-center gap-2">
          <img src={profileImage ?? ''} alt="프로필이미지" />
          <span className="text-xs">{nickname}</span>
          <span className="text-[10px] text-gray-400">{created_at}</span>
          {isMine && (
            <>
              <EditBtn state={edit} setState={setEdit} onSave={handleSave} />
              <button className="cursor-pointer" onClick={()=>onDelete(replyId)}>
                <img src="/icon/delete.svg" alt="삭제하기" className="w-3 h-3" />
              </button>
            </>
          )}
        </div>
        {
          edit ? (
          <textarea
            rows={2}
            value={editComment}
            autoFocus
            className="resize-none w-1/4"
            onChange={(e) => setEditComment(e.target.value)}
          />
          ): (
            <div className="text-sm">{renderComment}</div>
          )
        }
        
      </div>
    </li>
  );
}
export default CommentReply;
