import { useCallback } from 'react';
import { createPortal } from 'react-dom';
import TastingInfo from '../../tasting/TastingInfo';
import ReviewRatings from './ReviewRatings';
import Button from '@/component/Button';
import { useReviewStore } from '@/store/reviewStore';

function ReviewModal({ wineImage, wineName }: { wineImage: string[]; wineName: string }) {
  const { isOpen, state, closeModal, dispatch } = useReviewStore();
  const handleToggleOnlyReview = useCallback(() => dispatch({ type: 'toggleOnlyReview' }), []);
  const handleContentChange = useCallback(
    (v: string) => dispatch({ type: 'setContent', payload: v }),
    []
  );

  if (!isOpen) return null;
  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black/25 z-100">
      <form>
        <div className="shadow-2xl bg-background-base rounded-2xl w-150 h-fit p-8 flex flex-col gap-5 align-center">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl text-text-primary">리뷰작성하기</h2>
            <button type="button" aria-label="모달닫기" onClick={closeModal}>
              <img src="/icon/close.svg" alt="close" className="w-6 h-6" />
            </button>
          </div>
          <div className="flex justify-center items-center gap-5">
            <img
              src={wineImage.length !== 0 ? (wineImage[1] ?? wineImage[0]) : '/image/wineImage.svg'}
              alt={wineName}
            />
            <div className="flex flex-col justify-center">
              <h3 className="text-text-primary text-xl mb-5">{wineName}</h3>
              <TastingInfo type="select" style="review" className="w-5 h-5" />
            </div>
            <div className="flex flex-col">페어링등록 태그등록</div>
          </div>
          <div className="flex justify-between items-center">
            <ReviewRatings w="w-8" h="h-8" />
            <label htmlFor="onlyReview">
              <input
                type="checkbox"
                id="onlyReview"
                checked={state.onlyReview}
                onChange={handleToggleOnlyReview}
              />{' '}
              리뷰만 작성하기
            </label>
          </div>
          <textarea
            className="w-full h-20 bg-white rounded-2xl resize-none p-3"
            onChange={(e) => handleContentChange(e.target.value)}
          ></textarea>
          <Button fullWidth>작성완료</Button>
        </div>
      </form>
    </div>,
    document.body
  );
}

export default ReviewModal;
