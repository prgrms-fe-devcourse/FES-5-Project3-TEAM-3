import TastingInfo from '@/component/wine/tasting/TastingInfo';
import ReviewRatings from '@/component/wine/wineDetailInfo/wineReview/ReviewRatings';
import type { ReviewWithWine } from '@/hook/myPage/useMyReviews';
import truncateText from '@/utils/truncateText';

const FALLBACK_IMG = '/image/wineImage.svg';

function WineSellerCard({ item }: { item: ReviewWithWine }) {
  const wine = item.wines;
  const image = wine?.image_url?.[0] ?? wine?.image_url?.[1] ?? FALLBACK_IMG;
  const abvText = wine?.abv ? wine.abv : undefined;

  return (
    <article className="rounded-lg border border-secondary-500 bg-secondary-100 p-4 sm:p-5 shadow-sm flex flex-col gap-4 justify-center items-center min-w-[190px] max-w-[280px] shrink-0 cursor-pointer">
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
    </article>
  );
}
export default WineSellerCard;
