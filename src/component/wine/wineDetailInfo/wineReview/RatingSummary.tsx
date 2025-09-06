import RatingSummaryChart from './RatingSummaryChart';
import ReviewRatings from './ReviewRatings';
interface ratingSummaryProps {
  rating: number;
  reviewerCount: number;
  ratingChartData: number[];
}

function RatingSummary({ rating, reviewerCount, ratingChartData }: ratingSummaryProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="min-w-100 flex flex-col justify-center items-baseline p-5 rounded-xl border border-gray-400">
        <h3 className="text-lg px-2 pb-3">리뷰</h3>
        <div className="flex gap-5 items-center">
          <ReviewRatings w="w-8" h="h-8" rating={rating} />
          <p className="text-lg">
            {rating} ({reviewerCount})
          </p>
        </div>
        <div className="min-h-60  w-90">
          <RatingSummaryChart data={ratingChartData} />
        </div>
      </div>
    </div>
  );
}

export default RatingSummary;
