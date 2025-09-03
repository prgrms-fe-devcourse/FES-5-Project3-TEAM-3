import React, { useEffect, useState } from 'react';
import supabase from '@/supabase/supabase';
import useToast from '@/hook/useToast';

type LikeKind = 'post' | 'reply';

interface Props {
  itemId: string;
  kind: LikeKind;
  initialLiked?: boolean;
  initialCount?: number;
  className?: string;
  onToggle?: (liked: boolean, count: number) => void;
  ownerId?: string | null; // 포스트/답글 작성자 id
}

export default function LikeButton({
  itemId,
  kind,
  initialLiked = false,
  initialCount = 0,
  className,
  onToggle,
  ownerId = null,
}: Props) {
  const [liked, setLiked] = useState<boolean>(initialLiked);
  const [count, setCount] = useState<number>(initialCount);
  const [busy, setBusy] = useState(false);
  const toast = useToast;

  // 마운트 시 현재 사용자가 이미 좋아요 눌렀는지 확인 (초기 liked 상태 동기화)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        const uid = (userData as any)?.user?.id ?? null;
        if (!mounted || !itemId) return;
        const table = kind === 'post' ? 'post_like' : 'reply_like';
        const idCol = kind === 'post' ? 'post_id' : 'reply_id';

        // 내가 눌렀는지 조회
        if (uid) {
          const { data: likeRow, error: lrErr } = await supabase
            .from(table)
            .select(`${table}_id`)
            .eq(idCol, itemId)
            .eq('user_id', uid)
            .limit(1)
            .maybeSingle();
          if (!lrErr && likeRow) setLiked(true);
        }

        // 총합 조회 (head: true for count)
        const { count } = await supabase
          .from(table)
          .select(`${table}_id`, { count: 'exact', head: true })
          .eq(idCol, itemId);
        if (mounted) setCount(Number(count ?? initialCount ?? 0));
      } catch (err) {
        // silent
      }
    })();
    return () => {
      mounted = false;
    };
  }, [itemId, kind]);

  const handleClick = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (busy) return;
    setBusy(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const uid = (userData as any)?.user?.id ?? null;
      // 비로그인 체크
      if (!uid) {
        toast('info', '로그인이 필요합니다. 로그인 후 시도하세요.');
        setBusy(false);
        return;
      }

      // 본인 작성글/답글 금지 처리 (ownerId가 전달된 경우에만 검사)
      if (ownerId && ownerId === uid) {
        toast('warn', '본인 게시글에는 좋아요를 누를 수 없습니다.');
        setBusy(false);
        return;
      }

      try {
        if (kind === 'post') {
          const { data, error } = await supabase.rpc('toggle_post_like', { p_post_id: itemId, p_user_id: uid });
          if (!error && data) {
            const res = Array.isArray(data) ? (data[0] as any) : (data as any);
            if (res) {
              const newLiked = res.action === 'liked';
              const newCount = Number(res.like_count ?? (newLiked ? count + 1 : Math.max(0, count - 1)));
              setLiked(newLiked);
              setCount(newCount);
              onToggle?.(newLiked, newCount);
              setBusy(false);
              return;
            }
          }
        } else {
          const { data, error } = await supabase.rpc('toggle_reply_like', { r_reply_id: itemId, r_user_id: uid });
          if (!error && data) {
            const res = Array.isArray(data) ? (data[0] as any) : (data as any);
            if (res) {
              const newLiked = res.action === 'liked';
              const newCount = Number(res.like_count ?? (newLiked ? count + 1 : Math.max(0, count - 1)));
              setLiked(newLiked);
              setCount(newCount);
              onToggle?.(newLiked, newCount);
              setBusy(false);
              return;
            }
          }
        }
      } catch {
      }

      // 페일백 테이블 처리 (post_like / reply_like)
      const table = kind === 'post' ? 'post_like' : 'reply_like';
      const idCol = kind === 'post' ? 'post_id' : 'reply_id';

      const { data: exist, error: exErr } = await supabase
        .from(table)
        .select('*')
        .eq(idCol, itemId)
        .eq('user_id', uid)
        .limit(1)
        .maybeSingle();

      if (!exErr && exist) {
        // 삭제 (match로 안전하게 삭제)
        const { error: delErr } = await supabase.from(table).delete().match({ [idCol]: itemId, user_id: uid });
        if (!delErr) {
          setLiked(false);
          setCount((c) => Math.max(0, c - 1));
          onToggle?.(false, Math.max(0, count - 1));
        }
      } else {
        if (kind === 'post') {
          const { data: ins, error: insErr } = await supabase
            .from('post_like')
            .insert({ post_id: itemId, user_id: uid })
            .select()
            .single();
          if (!insErr && ins) {
            setLiked(true);
            setCount((c) => c + 1);
            onToggle?.(true, count + 1);
          }
        } else {
          const { data: ins, error: insErr } = await supabase
            .from('reply_like')
            .insert({ reply_id: itemId, user_id: uid })
            .select()
            .single();
          if (!insErr && ins) {
            setLiked(true);
            setCount((c) => c + 1);
            onToggle?.(true, count + 1);
          }
        }
      }
    } catch (err) {
      console.error('[LikeButton] error', err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className}
      aria-pressed={liked}
      aria-busy={busy}
    >
      <img src={liked ? '/icon/like_true.svg' : '/icon/like.svg'} alt="좋아요" className={`w-4 h-4 ${busy ? 'opacity-60' : ''}`} />
      <span className="ml-1">{count}</span>
    </button>
  );
}
