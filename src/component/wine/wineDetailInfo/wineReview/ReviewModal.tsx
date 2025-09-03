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
  pairings: Tables<'pairings'>[];
  tags: Tables<'hashtag_counts'>[];
  refresh: () => void;
}) {
  const user_id = useAuth().userId;
  const pairingText = pairings.map(
    (p) => `${pairingCategory[p.pairing_category ?? '기타']}/${p.pairing_name}`
  );
  const tagText = tags.map((t) => t.tag_text ?? '');

  const { isOpen, closeModal, setContent, toggleOnlyReview, onlyReview, rating, content, reset } =
    useReviewStore(
      useShallow((s) => ({
        isOpen: s.isOpen,
        closeModal: s.closeModal,
        setContent: s.setContent,
        toggleOnlyReview: s.toggleOnlyReview,
        onlyReview: s.onlyReview,
        addTag: s.addTag,
        deleteTag: s.deleteTag,
        rating: s.rating,
        content: s.content,
        reset: s.reset,
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

  const submitReview = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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

    const { data: existing } = await supabase
      .from('reviews')
      .select()
      .eq('user_id', user_id)
      .eq('wine_id', wineId)
      .maybeSingle();

    if (existing) {
      useToast('warn', '이미 작성한 리뷰가 있습니다');
      reset();
      return;
    }

    if (onlyReview) {
      const review = { wine_id: wineId, rating, content, user_id };
      const { data, error } = await supabase.from('reviews').insert(review).select();
      if (error) {
        console.error(error);
        return;
      }
      reset();
      closeModal();
      refresh();
      return data;
    } else {
      const { rating, sweetness, acidic, tannic, body, content, tag, pairing } =
        useReviewStore.getState();
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

      const { data, error } = await supabase.from('reviews').insert(review).select();
      if (error) {
        console.error('리뷰', error);
        return;
      } else {
        const { error } = await supabase
          .from('hashtags')
          .upsert([{ review_id: data[0].review_id, wine_id: wineId, user_id, tag_text: tag }]);
        if (error) console.error('태그', error);
        else {
          const pariringObject = pairing.map((p) => {
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
          const { error } = await supabase.from('pairings').upsert(pariringObject);
          if (error) console.error(error);
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
            ) : (
              <TastingInfo type="select" style="review" className="w-5 h-5" />
            )}
          </div>
          <div className="flex flex-col justify-center relative">
            <ReviewTagInput disabled={onlyReview} tagOptions={tagText} />
            <hr className="text-gray-400 p-2" />
            <ReviewPairingInput disabled={onlyReview} pairingOptions={pairingText} />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <ReviewRatings type="select" w="w-8" h="h-8" />
          <label htmlFor="onlyReview" className="text-text-primary">
            <input
              type="checkbox"
              id="onlyReview"
              checked={onlyReview}
              onChange={toggleOnlyReview}
            />{' '}
            리뷰만 작성하기
          </label>
        </div>
        <form onSubmit={submitReview}>
          <textarea
            className="w-full h-20 bg-white rounded-2xl resize-none p-3"
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
          <Button fullWidth>작성완료</Button>
        </form>
      </div>
    </div>,
    document.body
  );
}

export default ReviewModal;
