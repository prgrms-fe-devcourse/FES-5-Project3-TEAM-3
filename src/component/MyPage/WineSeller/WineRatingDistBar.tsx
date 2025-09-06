import Spinner from '@/component/Spinner';
import ReviewRatings from '@/component/wine/wineDetailInfo/wineReview/ReviewRatings';
import type { ReviewAgg } from '@/hook/myPage/useMyReviewAgg';
import {
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  Tooltip,
  type ChartOptions,
} from 'chart.js';
import { memo, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, ChartDataLabels);

interface DistBarProps {
  data: ReviewAgg[];
  title?: string;
  loading?: boolean;
}

function WineRatingDistBar({ data, title = '평균 별점', loading }: DistBarProps) {
  const avg = useMemo(() => {
    const nums = data.map((d) => d.rating).filter((n) => typeof n === 'number');
    if (!nums.length) return 0;

    const raw = nums.reduce((a, b) => a + b, 0) / nums.length;

    return parseFloat(raw.toFixed(1));
  }, [data]);

  const histogram = useMemo(() => {
    const buckets = [0, 0, 0, 0, 0];
    data.forEach((d) => {
      if (typeof d.rating === 'number') {
        const idx = Math.min(4, Math.max(0, Math.round(d.rating) - 1));
        buckets[idx] += 1;
      }
    });

    return {
      labels: ['⭐️ 1', '⭐️ 2', '⭐️ 3', '⭐️ 4', '⭐️ 5'],
      datasets: [
        {
          data: buckets,
          borderWidth: 0,
          backgroundColor: '#E5C67F',
          borderRadius: 8,
          barPercentage: 0.7,
          categoryPercentage: 0.8,
        },
      ],
    };
  }, [data]);

  const options = useMemo<ChartOptions<'bar'>>(
    () => ({
      indexAxis: 'y' as const,
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { display: false, grid: { display: false } },
        y: { grid: { display: false } },
      },
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
        datalabels: {
          anchor: 'center',
          align: 'center',
          color: '#333',
          display: (context: any) => context.dataset.data[context.dataIndex] !== 0,
          formatter: (value: number) => value,
        },
      },
    }),
    []
  );

  if (loading) {
    return <Spinner />;
  }

  const hasData = data.length > 0;

  return (
    <div className="border-none p-5">
      <h3 className="font-semibold mb-4 text-text-primary">{title}</h3>
      {hasData ? (
        <div className="flex flex-col items-start gap-3">
          <div className="inline-flex gap-6">
            <ReviewRatings rating={avg} type="readonly" w="w-5" h="h-5" />
            <span>
              <strong>{avg}</strong>
              {` (${data.length})`}
            </span>
          </div>
          <div className="min-h-56 w-auto">
            <Bar data={histogram} options={options} />
          </div>
        </div>
      ) : (
        <p className="text-text-secondary">데이터가 없습니다.</p>
      )}
    </div>
  );
}
export default memo(WineRatingDistBar);
