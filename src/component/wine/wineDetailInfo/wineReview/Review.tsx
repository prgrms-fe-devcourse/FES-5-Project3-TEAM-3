import type { Tables } from '@/supabase/database.types';
import TastingInfo from '../../tasting/TastingInfo';
import ReviewRatings from './ReviewRatings';
import React, { useEffect, useState } from 'react';
import supabase from '@/supabase/supabase';
import { useAuth } from '@/store/@store';
import useToast from '@/hook/useToast';
import { useConfirm } from '@/hook/useConfirm';
import { useReviewStore } from '@/store/reviewStore';
import { pairingCategory } from '../../filterSearch/filterInfo';

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
  const [user, setUser] = useState<{ profile_image_url: string; nickname: string }>();

  const confirm = useConfirm();
  const openModal = useReviewStore((s) => s.openModal);

  useEffect(() => {
    const getUserLike = async () => {
      if (!userId) {
        setReviewLiked(false); // 또는 0
        return;
      }

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
        const nullUser = { profile_image_url: '/image/defaultProfile.png', nickname: '알수없음' };
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

  const toggleLike = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
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

  const editReview = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    if (userId !== user_id) {
      useToast('warn', '본인이 작성한 리뷰만 수정할 수 있습니다');
      return;
    }
    const { data, error } = await supabase
      .from('reviews')
      .select(
        ` *,
    hashtags(tag_text),
    pairings(pairing_category, pairing_name)
  `
      )
      .eq('user_id', userId!)
      .eq('review_id', review_id);

    if (error) {
      useToast('error', '리뷰정보를 가져오는데 실패하였습니다');
      console.log(error);
      return null;
    }

    const { hashtags, pairings, ...review } = data[0];

    const formatted = {
      review,
      tags: data[0].hashtags[0]?.tag_text || [],
      pairings:
        data[0].pairings?.map((p) => ({
          [pairingCategory[p.pairing_category!]]: p.pairing_name,
        })) ?? [],
    };
    openModal(formatted);
  };

  const deleteReview = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const ok = await confirm({
      title: '정말 삭제하시겠습니까?',
      description: <></>,
      confirmText: '삭제하기',
      cancelText: '취소',
      tone: 'danger',
    });

    if (!ok) return;
    try {
      const { error } = await supabase.from('reviews').delete().eq('review_id', review_id);
      if (error) {
        console.error(error);
        return null;
      } else {
        useToast('error', '리뷰가 삭제되었습니다');
        refresh();
      }
    } catch (err: any) {
      useToast('error', err?.message ?? '처리 중 오류가 발생했습니다.');
    }
  };

  return (
    <div
      className={`w-full md:min-w-160 flex flex-wrap md:wrap-normal justify-center items-baseline gap-5 border border-gray-400 rounded-2xl px-5 py-3 relative ${user_id === userId && 'hover:bg-secondary-100/50 hover:shadow-md'}`}
      onClick={editReview}
    >
      <TastingInfo style="review" tasting={{ sweetness, acidic, tannic, body }} />
      <>
        <div className="flex flex-col flex-1">
          <div className="flex justify-between items-center gap-5">
            <div className="flex items-center gap-2">
              <img
                src={
                  user?.profile_image_url ? user?.profile_image_url : '/image/defaultProfile.png'
                }
                alt="사용자프로필"
                className="w-8 h-8"
              />
              <div className="py-3">
                <span className="text-nowrap">{user?.nickname} </span>
                <span className="text-gray-500 whitespace-nowrap">{created_at.slice(0, 10)}</span>
              </div>
            </div>
            <ReviewRatings rating={rating} w="w-6" h="h-6" />
          </div>
          <p className="max-w-110">{content}</p>
        </div>
        <div>
          <button
            type="button"
            className={`flex flex-col ${userId && 'cursor-pointer'}`}
            onClick={toggleLike}
          >
            {reviewLiked ? (
              <img src="/icon/like_true.svg" alt="좋아요" className="w-6 h-6" />
            ) : (
              <img src="/icon/like.svg" alt="좋아요" className="w-6 h-6" />
            )}
            {likeCount}
          </button>
          {user_id && user_id === userId && (
            <button
              type="button"
              className="absolute bottom-3 right-3 p-2 rounded-full bg-secondary-50"
              onClick={deleteReview}
            >
              <img src="/icon/delete.svg" alt="삭제" className="w-6 h-6" />
            </button>
          )}
        </div>
      </>
    </div>
  );
}

export default Review;
