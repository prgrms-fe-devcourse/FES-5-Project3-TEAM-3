import TastingInfo from '@/component/wine/tasting/TastingInfo';
import ReviewRatings from '@/component/wine/wineDetailInfo/wineReview/ReviewRatings';
import type { ReviewWithWine } from '@/hook/myPage/useMyReviews';
import truncateText from '@/utils/truncateText';
import { useCallback } from 'react';
import { Link } from 'react-router';

const FALLBACK_IMG = '/image/wineImage.svg';

interface WineSellerProps {
  item: ReviewWithWine;
  onEdit?: (row: ReviewWithWine) => void;
}

function WineSellerCard({ item, onEdit }: WineSellerProps) {
  const wine = item.wines;
  const image = wine?.image_url?.[0] ?? wine?.image_url?.[1] ?? FALLBACK_IMG;
  const abvText = wine?.abv ? wine.abv : undefined;
  const to = `/wines/detail/${item.wine_id}`;

  const handleEdit = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      onEdit?.(item);
    },
    [item, onEdit]
  );

  return (
    <div
      className={[
        'relative group',
        'rounded-lg border border-secondary-500 bg-secondary-100 p-4 sm:p-5 shadow-sm',
        'flex flex-col gap-4 justify-center items-center',
        'min-w-[190px] max-w-[280px] shrink-0 cursor-pointer',
        'transition-all duration-200 ease-out',
        'hover:bg-secondary-200/70 hover:shadow-lg',
        'motion-safe:hover:translate-y-0.5 motion-safe:hover:scale-[1.01]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-700/80',
      ].join(' ')}
    >
      <button
        type="button"
        onClick={handleEdit}
        className={[
          'absolute right-3 top-3 z-10 rounded-full p-2 cursor-pointer',
          'bg-secondary-50 shadow',
          'opacity-0 group-hover:opacity-100 focus:opacity-100',
          'transition-opacity duration-150',
          'hover:bg-secondary-100',
        ].join(' ')}
        aria-label="리뷰 수정"
        title="리뷰 수정"
      >
        <img src="/icon/edit.svg" alt="수정" />
      </button>
      <Link
        to={to}
        className="w-full flex flex-col gap-4 justify-center items-center focus:outline-none"
      >
        <div className="flex gap-4">
          {/* bottle image */}
          <div className="rounded-md overflow-hidden bg-transparent flex items-center justify-center">
            <img
              src={image}
              alt={wine?.name ?? '와인 이미지'}
              className="w-20 max-h-40 object-contain"
            />
          </div>
          {/* wine info section */}
          <div className="flex flex-col gap-3 justify-center items-center">
            <h3 className="text-lg font-semibold text-text-primary text-center">
              {wine?.name ? truncateText(wine.name, 25) : 'Unknown wine'}
            </h3>
            <p className="text-sm text-text-secondary">{wine?.country ?? 'Country : -'}</p>
            <p className="text-sm text-text-secondary">{abvText ?? 'ABV : -'}</p>
            <div>
              <ReviewRatings rating={Number(item.rating ?? 0)} type="readonly" w="w-5" h="h-5" />
            </div>
          </div>
        </div>

        <hr className="border-secondary-500 w-full" />

        <TastingInfo
          style="review"
          type="readonly"
          tasting={{
            sweetness: item.sweetness_score,
            acidic: item.acidity_score,
            tannic: item.tannin_score,
            body: item.body_score,
          }}
        />
      </Link>
    </div>
  );
}
export default WineSellerCard;
