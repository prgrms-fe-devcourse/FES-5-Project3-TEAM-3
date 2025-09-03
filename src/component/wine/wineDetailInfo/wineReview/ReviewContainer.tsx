import type { Tables } from '@/supabase/database.types';
import Review from './Review';

function ReviewContainer({
  reviews,
  refresh,
}: {
  reviews: Tables<'reviews'>[];
  refresh: () => void;
}) {
  return (
    <div className="w-1/2 flex flex-col gap-5">
      {reviews.map((review) => (
        <Review review={review} key={review.review_id} refresh={refresh} />
      ))}
    </div>
  );
}

export default ReviewContainer;
