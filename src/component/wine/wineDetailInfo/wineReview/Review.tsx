import type { Tables } from '@/supabase/database.types';
import TastingInfo from '../../tasting/TastingInfo';
import ReviewRatings from './ReviewRatings';

function Review({ review }: { review: Tables<'reviews'> }) {
  const {
    sweetness_score: sweetness,
    acidity_score: acidic,
    tannin_score: tannic,
    body_score: body,
    created_at,
    likes,
    user_id,
    rating,
    content,
  } = review;
  return (
    <div className="flex justify-center items-baseline gap-5 border border-gray-400 rounded-2xl px-5 py-3">
      <TastingInfo style="review" tasting={{ sweetness, acidic, tannic, body }} />
      <div className="flex flex-col flex-1">
        <div className="flex justify-between">
          <p className="py-3">리뷰작성한사람 {created_at.slice(0, 10)}</p>
          <ReviewRatings rating={rating} w="w-6 h-6" />
        </div>
        {content}
      </div>
      <button type="button" className="flex flex-col">
        <img src="/icon/like.svg" alt="좋아요" className="w-6 h-6" />
        {likes}
      </button>
    </div>
  );
}

export default Review;
