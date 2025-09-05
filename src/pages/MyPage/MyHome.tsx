import { BADGE_CATALOG } from '@/assets/badgeCatalog';
import BadgeCard from '@/component/MyPage/BadgeCard';
import WineAnalysisPie from '@/component/MyPage/WineSeller/WineAnalysisPie';
import WineSellerCard from '@/component/MyPage/WineSeller/WineSellerCard';
import WineSellerCardSkeleton from '@/component/MyPage/WineSeller/WineSellerCardSkeleton';
import WineWishCard from '@/component/MyPage/WineWishCard';
import Spinner from '@/component/Spinner';
import { useMyBadges } from '@/hook/myPage/useMyBadges';
import { useMyReviewAgg } from '@/hook/myPage/useMyReviewAgg';
import { useMyReviews } from '@/hook/myPage/useMyReviews';
import { useWishList } from '@/hook/myPage/useWishList';
import useToast from '@/hook/useToast';
import { Link } from 'react-router';

const FALLBACK_IMG = '/image/wineImage.svg';

function MyHome() {
  const {
    data: wineSellerData,
    loading: wineSellerLoading,
    error: wineSellerErr,
  } = useMyReviews(1, 4, true, 'created_desc');
  const { data: chartData, loading: chartLoading, error: chartErr } = useMyReviewAgg();
  const {
    items: wishListData,
    loading: wishListLoading,
    error: wishListErr,
    toggleBookmark,
  } = useWishList(1, 3);
  const {
    badges: badgeData,
    loading: badgeLoading,
    error: badgeErr,
  } = useMyBadges({ refreshOnMount: true });

  let wineSellerContent = null;
  if (wineSellerLoading) {
    wineSellerContent = (
      <div className="grid gap-4 grid-cols-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <WineSellerCardSkeleton key={idx} />
        ))}
      </div>
    );
  } else if (wineSellerErr) {
    console.error('WineSeller fetch error:', wineSellerErr);
    useToast('error', '데이터를 불러오는 데 실패했습니다.');
    wineSellerContent = <p className="text-error-500 my-8">데이터를 불러오지 못했습니다.</p>;
  } else if (!wineSellerLoading && wineSellerData.length === 0) {
    wineSellerContent = <p className="text-text-secondary my-8">아직 작성한 리뷰가 없습니다.</p>;
  } else if (!wineSellerLoading && wineSellerData.length > 0) {
    wineSellerContent = (
      <div className="grid gap-4 grid-cols-4">
        {wineSellerData.slice(0, 4).map((row) => (
          <WineSellerCard key={row.review_id} item={row} />
        ))}
      </div>
    );
  }

  let wishListContent = null;
  if (wishListLoading) {
    wishListContent = <Spinner />;
  } else if (wishListErr) {
    console.error('Wish List fetch error:', wishListErr);
    useToast('error', '데이터를 불러오는 데 실패했습니다.');
    wishListContent = <p className="text-error-500 my-8">데이터를 불러오지 못했습니다.</p>;
  } else if (!wishListLoading && wishListData.length === 0) {
    wishListContent = <p className="text-text-secondary my-8">저장된 위시리스트가 없습니다.</p>;
  } else if (!wishListLoading && wishListData.length > 0) {
    wishListContent = (
      <div className="grid gap-4 grid-cols-3">
        {wishListData.slice(0, 3).map((w) => (
          <WineWishCard
            key={w.wine_id}
            wine_id={w.wine_id}
            name={w.name}
            imageUrl={w.image_url[0] ?? w.image_url[1] ?? FALLBACK_IMG}
            country={w.country}
            abv={w.abv}
            rating={w.rating}
            bookmarked={w.bookmarked}
            onToggleBookmark={toggleBookmark}
          />
        ))}
      </div>
    );
  }

  let badgeContent = null;
  if (badgeLoading) {
    badgeContent = <Spinner />;
  } else if (badgeErr) {
    console.error('Badge fetch error:', badgeErr);
    useToast('error', '데이터를 불러오는 데 실패했습니다.');
    badgeContent = <p className="text-error-500 my-8">데이터를 불러오지 못했습니다.</p>;
  } else if (!badgeLoading && badgeData.length === 0) {
    badgeContent = <p className="text-text-secondary my-8">아직 달성된 업적이 없습니다.</p>;
  } else if (!badgeLoading && badgeData.length > 0) {
    const earnedSet = new Set(badgeData);
    const earnedBadges = BADGE_CATALOG.filter((b) => earnedSet.has(b.title)).slice(0, 5);
    badgeContent = (
      <div className="grid gap-4 grid-cols-5">
        {earnedBadges.map((b) => (
          <BadgeCard key={b.code} badge={b} earned={earnedSet.has(b.title)} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12 overflow-scroll">
      <section className="flex flex-col gap-6 border-2 border-secondary-500/30 rounded-xl p-6">
        <div className="flex justify-between w-full">
          <h2 className="w-full inline-flex flex-col justify-start items-start text-2xl font-semibold">
            Wine Sellers
          </h2>
          <Link
            to={'/my-page/wine-seller'}
            aria-label="와인셀러 메뉴로 이동합니다."
            className="inline-flex gap-1 items-center"
          >
            <span className="block break-keep min-w-14 text-slate-500 font-light text-sm">
              전체 보기
            </span>
            <img src="/icon/rightChevron.svg" alt=">" className="size-4 object-contain" />
          </Link>
        </div>
        {wineSellerContent}
      </section>
      <div className="flex justify-between gap-6">
        <section className="w-1/2 flex flex-col gap-6 border-2 border-secondary-500/30 rounded-xl p-6">
          <div className="flex justify-between w-full">
            <h2 className="w-full inline-flex flex-col justify-start items-start text-2xl font-semibold">
              Wish Lists
            </h2>
            <Link
              to={'/my-page/wish-list'}
              aria-label="Wish List 메뉴로 이동합니다."
              className="inline-flex gap-1 items-center"
            >
              <span className="block break-keep min-w-14 text-slate-500 font-light text-sm">
                전체 보기
              </span>
              <img src="/icon/rightChevron.svg" alt=">" className="size-4 object-contain" />
            </Link>
          </div>
          {wishListContent}
        </section>
        <section className="w-1/2 border-2 border-secondary-500/30 rounded-xl p-6">
          <h2 className="w-full inline-flex flex-col justify-start items-start text-2xl font-semibold">
            Wine Taste Analysis
          </h2>
          {chartErr ? (
            <p className="text-error-500 my-8">데이터를 불러오지 못했습니다.</p>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <WineAnalysisPie data={chartData} loading={chartLoading} title="" />
            </div>
          )}
        </section>
      </div>
      <section className="flex flex-col gap-6 border-2 border-secondary-500/30 rounded-xl p-6">
        <div className="flex justify-between w-full">
          <h2 className="w-full inline-flex flex-col justify-start items-start text-2xl font-semibold">
            My Achievement
          </h2>
          <Link
            to={'/my-page/achievement'}
            aria-label="나의 업적 메뉴로 이동합니다."
            className="inline-flex gap-1 items-center"
          >
            <span className="block break-keep min-w-14 text-slate-500 font-light text-sm">
              전체 보기
            </span>
            <img src="/icon/rightChevron.svg" alt=">" className="size-4 object-contain" />
          </Link>
        </div>
        {badgeContent}
      </section>
    </div>
  );
}
export default MyHome;
