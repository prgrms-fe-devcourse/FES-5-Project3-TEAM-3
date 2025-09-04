import { type FormEvent, type MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import TastingInfo from '../../tasting/TastingInfo';
import ReviewRatings from './ReviewRatings';
import Button from '@/component/Button';
import { useReviewStore } from '@/store/reviewStore';
import { useShallow } from 'zustand/shallow';
import ReviewTagInput from './ReviewTagInput';
import ReviewPairingInput from './ReviewPairingInput';
import { useAuth } from '@/store/@store';
import supabase from '@/supabase/supabase';
import useToast from '@/hook/useToast';
import { pairingCategory } from '../../filterSearch/filterInfo';
import type { Tables } from '@/supabase/database.types';

function ReviewModal({
  wineId,
  wineImage,
  wineName,
  pairings,
  tags,
  refresh,
}: {
  wineId: string;
  wineImage: string[];
  wineName: string;
  pairings: Tables<'wine_pairings_counts'>[];
  tags: Tables<'hashtag_counts'>[];
  refresh: () => void;
}) {
  const user_id = useAuth().userId;
  const pairingText = pairings.map(
    (p) => `${pairingCategory[p.pairing_category ?? '기타']}/${p.pairing_name}`
  );
  const tagText = tags.map((t) => t.tag_text ?? '');

  const {
    isOpen,
    closeModal,
    setContent,
    toggleOnlyReview,
    onlyReview,
    rating,
    content,
    reset,
    sweetness,
    acidic,
    tannic,
    body,
    editMode,
    tag,
    pairing,
  } = useReviewStore(
    useShallow((s) => ({
      isOpen: s.isOpen,
      closeModal: s.closeModal,
      setContent: s.setContent,
      toggleOnlyReview: s.toggleOnlyReview,
      onlyReview: s.onlyReview,
      rating: s.rating,
      content: s.content,
      reset: s.reset,
      sweetness: s.sweetness,
      tannic: s.tannic,
      acidic: s.acidic,
      body: s.body,
      editMode: s.isEditMode,
      tag: s.tag,
      pairing: s.pairing,
    }))
  );

  const close = (e: MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
    e.stopPropagation();
    reset();
    closeModal();
  };
  const stopPropagation = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // 줄바꿈 막기
      submitReview();
    }
  };

  const submitReview = async (e?: FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();

    if (!user_id) {
      useToast('error', '리뷰를 작성하려면 로그인하셔야 합니다');
      return;
    }
    if (!rating) {
      useToast('error', '별점을 입력해주세요');
      return;
    }
    if (!content) {
      useToast('error', '리뷰 내용을 입력해주세요');
      return;
    }

    if (onlyReview) {
      const review = { wine_id: wineId, rating, content, user_id };
      const { data, error } = await supabase
        .from('reviews')
        .upsert(review, { onConflict: 'user_id, wine_id' })
        .select();
      if (error) {
        console.error(error);
        return;
      }
      reset();
      closeModal();
      refresh();
      return data;
    } else {
      if (!rating || !sweetness || !acidic || !tannic || !body) {
        useToast('error', '맛 평가를 입력해주세요');
        return;
      }
      if (!tag) {
        useToast('error', '태그를 입력해주세요');
        return;
      }
      if (!pairing) {
        useToast('error', '페어링을 입력해주세요');
        return;
      }

      // const review = {
      //   p_wine_id: wineId,
      //   p_rating: rating,
      //   p_content: content,
      //   p_user_id: user_id,
      //   p_sweetness: sweetness,
      //   p_acidity: acidic,
      //   p_tannin: tannic,
      //   p_body: body,
      //   p_pairings: pairing,
      //   p_tags: tag,
      // };

      // const { data, error } = await supabase
      //   .rpc('insert_review_with_tags_and_pairings', {
      //     ...review,
      //     p_pairings: JSON.stringify(review.p_pairings),
      //   })
      //   .select();
      // if (error) console.log(error);
      // else console.log('성공', data);

      const review = {
        wine_id: wineId,
        rating,
        content,
        user_id,
        sweetness_score: sweetness,
        acidity_score: acidic,
        tannin_score: tannic,
        body_score: body,
      };

      const { data, error } = await supabase
        .from('reviews')
        .upsert(review, { onConflict: 'user_id, wine_id' })
        .select();
      if (error) {
        console.error('리뷰', error);
        return;
      } else {
        const { error: error_tags } = await supabase
          .from('hashtags')
          .upsert([{ review_id: data[0].review_id, wine_id: wineId, user_id, tag_text: tag }], {
            onConflict: 'user_id, wine_id, tag_text',
          });
        if (error_tags) console.error('태그', error);
        else {
          const pairingObject = pairing.map((p) => {
            const [category, value] = Object.entries(p)[0];
            const categoryen = pairingCategory[category];
            return {
              review_id: data[0].review_id,
              user_id,
              wine_id: wineId,
              pairing_category: categoryen,
              pairing_name: value,
            };
          });
          const { error: error_pairing } = await supabase.from('pairings').insert(pairingObject);
          if (error_pairing) console.error(error);
          else {
            console.log(data);
            reset();
            closeModal();
            refresh();
            return data;
          }
        }
      }
    }
  };

  if (!isOpen) return null;
  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/25 z-100"
      onClick={close}
    >
      <div
        className="shadow-2xl bg-background-base rounded-2xl w-180 h-fit p-8 flex flex-col gap-5 align-center"
        onClick={stopPropagation}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-2xl text-text-primary">리뷰작성하기</h2>
          <button type="button" aria-label="모달닫기" onClick={close}>
            <img src="/icon/close.svg" alt="close" className="w-6 h-6" />
          </button>
        </div>
        <div className="flex justify-around items-center gap-5">
          <img
            src={wineImage.length !== 0 ? (wineImage[1] ?? wineImage[0]) : '/image/wineImage.svg'}
            alt={wineName}
          />
          <div className="flex flex-col justify-center">
            <h3 className="text-text-primary text-xl mb-5">{wineName}</h3>
            {onlyReview ? (
              <TastingInfo
                type="readonly"
                tasting={{ sweetness: 0, tannic: 0, acidic: 0, body: 0 }}
                style="review"
                className="w-5 h-5 bg-gray-300"
                gap="gap-3"
              />
            ) : editMode ? (
              <TastingInfo
                type="select"
                style="review"
                className="w-5 h-5"
                tasting={{ sweetness, tannic, acidic, body }}
              />
            ) : (
              <TastingInfo type="select" style="review" className="w-5 h-5" />
            )}
          </div>
          <div className="flex flex-col justify-center relative">
            <ReviewTagInput disabled={onlyReview} tagOptions={tagText} isEditMode={editMode} />
            <hr className="text-gray-400 p-2" />
            <ReviewPairingInput
              disabled={onlyReview}
              pairingOptions={pairingText}
              isEditMode={editMode}
            />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <ReviewRatings type="select" w="w-8" h="h-8" rating={rating ?? undefined} />
          <label htmlFor="onlyReview" className="text-text-primary">
            <input
              type="checkbox"
              id="onlyReview"
              checked={onlyReview ?? false}
              disabled={editMode}
              onChange={toggleOnlyReview}
            />{' '}
            리뷰만 작성하기
          </label>
        </div>
        <form onSubmit={submitReview}>
          <textarea
            className="w-full h-20 bg-white rounded-2xl resize-none p-3"
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            value={content}
          ></textarea>
          <Button fullWidth>작성완료</Button>
        </form>
      </div>
    </div>,
    document.body
  );
}

export default ReviewModal;
