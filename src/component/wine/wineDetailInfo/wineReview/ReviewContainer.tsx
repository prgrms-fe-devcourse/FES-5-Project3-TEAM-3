import type { Tables } from '@/supabase/database.types';
import Review from './Review';

function ReviewContainer({ reviews }: { reviews: Tables<'reviews'>[] }) {
  return (
    <div className="w-1/2 flex flex-col gap-5">
      {reviews.map((review) => (
        <Review review={review} />
      ))}
    </div>
  );
}

export default ReviewContainer;
