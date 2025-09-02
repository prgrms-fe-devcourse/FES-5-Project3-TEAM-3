import AddNewCard from '@/component/MyPage/WineSeller/AddNewCard';
import WineSellerCard from '@/component/MyPage/WineSeller/WineSellerCard';
import WineSellerCardSkeleton from '@/component/MyPage/WineSeller/WineSellerCardSkeleton';
import WineTasteAnalysis from '@/component/MyPage/WineSeller/WineTasteAnalysis';
import Pagination from '@/component/Pagination';
import { useMyReviews } from '@/hook/myPage/useMyReviews';
import { useProfile } from '@/hook/profileSetting/useProfileBasic';
import useToast from '@/hook/useToast';
import { useAuth } from '@/store/@store';
import { useState } from 'react';

function WineSeller() {
  const profileId = useAuth((s) => s.userId);
  const { data: profile, isLoading: profileLoading } = useProfile(profileId ?? undefined);

  const displayName = profile?.nickname ?? '회원';

  const PAGE_SIZE = 8;
  const [page, setPage] = useState(1);
  const { data, loading, error, totalPages } = useMyReviews(page, PAGE_SIZE, true);

  const subtitle = profileLoading
    ? '불러오는 중...'
    : data.length > 0
      ? `${displayName} 님께서 기록하신 와인 리스트입니다.`
      : '아직 작성한 리뷰가 없습니다.';

  const isLastPage = page === totalPages;
  const showAddCard = !loading && isLastPage;

  // skeleton 처리
  let cards = (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, idx) => (
        <WineSellerCardSkeleton key={idx} />
      ))}
    </div>
  );

  if (error) {
    console.error(error);
    useToast('error', '데이터를 불러오는 데 실패했습니다.');
    cards = <p className="text-error-500">'데이터를 불러올 수 없습니다.'</p>;
  }

  if (!loading && data.length === 0) {
    cards = (
      <div>
        <AddNewCard />
      </div>
    );
  }

  cards = (
    <>
      {data.map((row) => (
        <WineSellerCard key={row.review_id} item={row} />
      ))}
      {showAddCard && <AddNewCard />}
    </>
  );

  return (
    <div className="flex flex-col gap-12 overflow-scroll">
      <section className="flex flex-col gap-6">
        <h2 className="w-full inline-flex flex-col justify-start items-start text-2xl font-semibold">
          My Wine Seller
        </h2>
        <h3 className="w-full inline-flex flex-col justify-start items-start font-light text-text-secondary">
          {subtitle}
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">{cards}</div>
        <Pagination
          page={page}
          onPageChange={setPage}
          totalPages={totalPages}
          showFirstLast={false}
          showPrevNext
          size="md"
        />
      </section>
      <WineTasteAnalysis />
    </div>
  );
}
export default WineSeller;
