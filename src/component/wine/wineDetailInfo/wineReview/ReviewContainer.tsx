import type { Tables } from '@/supabase/database.types';
import Review from './Review';
import Pagination from '@/component/Pagination';
import { useEffect, useState } from 'react';

function ReviewContainer({
  reviews,
  refresh,
}: {
  reviews: Tables<'reviews'>[];
  refresh: () => void;
}) {
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [reviewData, setReviewData] = useState(reviews);
  const pageChange = (newPage: number) => {
    const from = (newPage - 1) * 3;
    const to = newPage * 3;
    setPage(newPage);
    setReviewData(reviews.slice(from, to));
  };

  useEffect(() => {
    setTotalPage(Math.ceil(reviews.length / 3));
    setReviewData(reviews.slice(0, 3));
    setPage(1);
  }, [reviews]);

  if (reviewData.length === 0) {
    return (
      <div className="min-w-140 self-center text-center text-lg text-text-secondary">
        리뷰가 없습니다
      </div>
    );
  }

  return (
    <div className="flex flex-col  gap-5">
      {reviewData.map((review) => (
        <Review review={review} key={review.review_id} refresh={refresh} />
      ))}
      <Pagination
        page={page}
        totalPages={totalPage}
        onPageChange={pageChange}
        className="self-end"
      />
    </div>
  );
}

export default ReviewContainer;
