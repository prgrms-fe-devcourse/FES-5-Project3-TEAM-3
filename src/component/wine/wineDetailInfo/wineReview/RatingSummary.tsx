import RatingSummaryChart from './RatingSummaryChart';
import ReviewRatings from './ReviewRatings';

function RatingSummary() {
  const rating = 4.5;
  const reviewerCount = 1482;
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg px-3">리뷰</h3>
      <div className="min-w-100 flex flex-col justify-center items-baseline p-5 rounded-xl border border-gray-400">
        <div className="flex gap-5 items-center">
          <ReviewRatings w="w-8" h="h-8" rating={rating} />
          <p className="text-lg">
            {rating} ({reviewerCount})
          </p>
        </div>
        <div className="min-h-60  w-90">
          <RatingSummaryChart data={[972, 385, 72, 22, 30]} />
        </div>
      </div>
    </div>
  );
}

export default RatingSummary;
