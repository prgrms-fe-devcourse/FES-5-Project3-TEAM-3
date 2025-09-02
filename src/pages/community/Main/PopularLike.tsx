import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import supabase from '@/supabase/supabase';

interface Props {
  postId: string;
  like_count?: number;
  detailLink?: string;
}

export default function PopularLike({ postId, like_count = 0, detailLink }: Props) {
  const [likedByMe, setLikedByMe] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        const uid = (userData as any)?.user?.id ?? null;
        if (!mounted || !uid) return;

        const { data: likeRow, error } = await supabase
          .from('post_like')
          .select('post_like_id')
          .eq('post_id', postId)
          .eq('user_id', uid)
          .limit(1)
          .maybeSingle();

        if (!mounted) return;
        if (!error && likeRow) setLikedByMe(true);
      } catch (e) {
        // silent
      }
    })();
    return () => {
      mounted = false;
    };
  }, [postId]);

  const inner = (
    <div className="flex items-center gap-1">
      <img
        src={likedByMe ? '/icon/like_true.svg' : '/icon/like.svg'}
        alt="좋아요"
        className="w-4 h-4"
      />
      <span className="text-gray-400">{like_count}</span>
    </div>
  );

  return detailLink ? <Link to={detailLink}>{inner}</Link> : inner;
}
