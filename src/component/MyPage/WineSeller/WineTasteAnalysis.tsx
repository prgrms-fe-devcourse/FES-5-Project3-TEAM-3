import { useMyReviewAgg } from '@/hook/myPage/useMyReviewAgg';
import WineAnalysisPie from './WineAnalysisPie';
import WineRatingDistBar from './WineRatingDistBar';

function WineTasteAnalysis() {
  const { data, loading, error } = useMyReviewAgg();

  if (error) {
    console.error(error);
    return <p className="text-error-500">데이터를 불러오는 데 실패했습니다.</p>;
  }

  return (
    <section className="flex flex-col gap-6 w-full">
      <h2 className="w-full inline-flex flex-col justify-start items-start text-2xl font-semibold">
        Wine Taste Analysis
      </h2>
      <p className="w-full inline-flex flex-col justify-start items-start font-light text-text-secondary">
        그동안 기록하신 와인들을 바탕으로 와인 취향을 분석했어요.
      </p>

      <div className="flex justify-start items-start gap-40">
        <WineAnalysisPie data={data} loading={loading} />
        <WineRatingDistBar data={data} loading={loading} />
      </div>
    </section>
  );
}
export default WineTasteAnalysis;
