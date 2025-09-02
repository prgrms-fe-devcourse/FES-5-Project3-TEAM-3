import { type MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import TastingInfo from '../../tasting/TastingInfo';
import ReviewRatings from './ReviewRatings';
import Button from '@/component/Button';
import { useReviewStore } from '@/store/reviewStore';
import { useShallow } from 'zustand/shallow';
import ReviewTagInput from './ReviewTagInput';
import ReviewPairingInput from './ReviewPairingInput';

function ReviewModal({ wineImage, wineName }: { wineImage: string[]; wineName: string }) {
  const { isOpen, closeModal, setContent, toggleOnlyReview, onlyReview } = useReviewStore(
    useShallow((s) => ({
      isOpen: s.isOpen,
      closeModal: s.closeModal,
      setContent: s.setContent,
      toggleOnlyReview: s.toggleOnlyReview,
      onlyReview: s.onlyReview,
      addTag: s.addTag,
      deleteTag: s.deleteTag,
    }))
  );

  const close = (e: MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
    e.stopPropagation();
    closeModal();
  };
  const stopPropagation = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
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
            <TastingInfo type="select" style="review" className="w-5 h-5" />
          </div>
          <div className="flex flex-col justify-center">
            <ReviewTagInput />
            <hr className="text-gray-400 p-2" />
            <ReviewPairingInput />
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
        <form>
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
