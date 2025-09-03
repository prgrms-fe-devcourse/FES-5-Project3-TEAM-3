// components/skeletons/SearchResultSkeleton.tsx

import SkeletonItem from './SkeletonItem';

const CARD_PER_PAGE = 20;

export default function SearchResultSkeleton() {
  return (
    <div
      className="min-h-screen w-249 mx-auto mt-8 flex flex-col flex-1"
      role="status"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="w-300 flex flex-col mt-10">
        {/* 상단 카운트 바 */}
        <div className="w-full border-b pb-3">
          <div className="h-5 w-24 bg-gray-200 animate-pulse rounded" />
        </div>

        <div className="flex flex-col gap-10">
          {/* 카드 그리드 */}
          <section className="mt-8 grid grid-cols-4 gap-8">
            {Array.from({ length: CARD_PER_PAGE }).map((_, i) => (
              <SkeletonItem key={i} />
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}
