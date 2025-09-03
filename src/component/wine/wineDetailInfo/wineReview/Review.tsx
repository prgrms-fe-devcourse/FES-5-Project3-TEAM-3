import type { Tables } from '@/supabase/database.types';
import TastingInfo from '../../tasting/TastingInfo';
import ReviewRatings from './ReviewRatings';
import { useEffect, useState } from 'react';
import supabase from '@/supabase/supabase';
import { useAuth } from '@/store/@store';
import useToast from '@/hook/useToast';

function Review({ review, refresh }: { review: Tables<'reviews'>; refresh: () => void }) {
  const {
    sweetness_score: sweetness,
    acidity_score: acidic,
    tannin_score: tannic,
    body_score: body,
    created_at,
    likes,
    rating,
    content,
    review_id,
    user_id,
  } = review;
  const [reviewLiked, setReviewLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const userId = useAuth().userId;
  if (!userId) return;
  const [user, setUser] = useState<{ profile_image_url: string; nickname: string }>();

  useEffect(() => {
    const getUserLike = async () => {
      if (!userId) return;
      const { data, error } = await supabase
        .from('review_like')
        .select()
        .eq('review_id', review_id)
        .eq('user_id', userId);
      if (error) console.error(error);
      else {
        if (data.length === 0) return;
        setReviewLiked(data[0].likes);
      }
    };
    getUserLike();
  }, [userId, review_id]);

  useEffect(() => {
    const getProfile = async (id: string | null) => {
      if (!id) {
        const nullUser = { profile_image_url: '', nickname: '알수없음' };
        setUser(nullUser);
      } else {
        const { data, error } = await supabase
          .from('profile')
          .select('profile_image_url,nickname')
          .eq('profile_id', id);
        if (error) {
          console.error(error);
          return;
        }

        if (data) setUser(data[0]);
      }
    };
    getProfile(user_id);
  }, []);

  const toggleLike = async () => {
    if (!userId) {
      useToast('error', '좋아요를 누르려면 로그인하셔야 합니다');
      return;
    }
    const { data, error } = await supabase.rpc('toggle_review_like', {
      p_review_id: review_id,
      p_user_id: userId,
    });
    if (error) console.error(error);
    else {
      setLikeCount(data[0].count);
      setReviewLiked(data[0].action === 'liked');
    }
  };

  const deleteReview = async () => {
    const { error } = await supabase.from('reviews').delete().eq('review_id', review_id);
    if (error) {
      console.error(error);
      return null;
    } else {
      useToast('error', '리뷰가 삭제되었습니다');
      refresh();
    }
  };

  return (
    <div className="flex justify-center items-baseline gap-5 border border-gray-400 rounded-2xl px-5 py-3 relative">
      <TastingInfo style="review" tasting={{ sweetness, acidic, tannic, body }} />
      <div className="flex flex-col flex-1">
        <div className="flex justify-between items-center">
          <div className="flex gap-1">
            <img src={user?.profile_image_url} alt="사용자프로필" className="w-8 h-8" />
            <p className="py-3">
              {user?.nickname} <span className="text-gray-500">{created_at.slice(0, 10)}</span>
            </p>
          </div>
          <ReviewRatings rating={rating} w="w-6" h="h-6" />
        </div>
        {content}
      </div>
      <div>
        <button type="button" className="flex flex-col" onClick={toggleLike}>
          {reviewLiked ? (
            <img src="/icon/like_true.svg" alt="좋아요" className="w-6 h-6" />
          ) : (
            <img src="/icon/like.svg" alt="좋아요" className="w-6 h-6" />
          )}
          {likeCount}
        </button>
        {user_id === userId && (
          <button type="button" className="absolute bottom-3 right-5" onClick={deleteReview}>
            <img src="/icon/delete.svg" alt="삭제" className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
}

export default Review;
