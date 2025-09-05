import WineWishCard from '@/component/MyPage/WineWishCard';
import Pagination from '@/component/Pagination';
import Spinner from '@/component/Spinner';
import { useWishList } from '@/hook/myPage/useWishList';
import useToast from '@/hook/useToast';
import { useState } from 'react';

const FALLBACK_IMG = '/image/wineImage.svg';

function WishList() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { items, totalPages, loading, error, toggleBookmark } = useWishList(page, pageSize);

  let content = null;

  if (loading) {
    content = <Spinner />;
  } else if (error) {
    useToast('error', '데이터를 불러오는 데 실패했습니다.');
    content = <p className="text-error-500">데이터를 불러오지 못했습니다.</p>;
  } else if (items && items.length === 0) {
    content = <p className="text-text-secondary">저장된 위시리스트가 없습니다.</p>;
  } else if (items && items.length > 0) {
    content = (
      <section className="w-full flex flex-col justify-center items-start gap-8">
        <div className="grid px-1 grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {items.map((w) => (
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
        <Pagination
          page={page}
          onPageChange={setPage}
          totalPages={totalPages}
          showFirstLast={false}
          showPrevNext
          size="md"
        />
      </section>
    );
  }

  return (
    <div className="flex flex-col gap-12 overflow-scroll h-full">
      <h2 className="w-full inline-flex flex-col justify-start items-start text-2xl font-semibold">
        My Wish List
      </h2>
      {content}
    </div>
  );
}
export default WishList;
