import Button from '@/component/Button';
import Spinner from '@/component/Spinner';
import type { ReviewAgg } from '@/hook/myPage/useMyReviewAgg';
import { ArcElement, Chart, Legend, Tooltip } from 'chart.js';
import { memo, useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';

Chart.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  data: ReviewAgg[];
  title?: string;
  loading?: boolean;
}

const COLORS = [
  '#6E0E2E', // top1
  '#A8324A', // top2
  '#F0AEB9', // top3
  '#D4AF37', // top4
  '#94A3B8', // 나머지 = 기타
];

function WineAnalysisPie({ data, title = '국가별 취향', loading }: PieChartProps) {
  const pie = useMemo(() => {
    const count = new Map<string, number>();
    data.forEach((d) => {
      const key = (d.country || '기타').trim();
      count.set(key, (count.get(key) ?? 0) + 1);
    });

    const sorted = [...count.entries()].sort((a, b) => b[1] - a[1]);
    const top = sorted.slice(0, 4);
    const rest = sorted.slice(4);
    const others = rest.reduce((s, [_, v]) => s + v, 0);

    const labels = [...top.map(([k]) => k), ...(others ? ['기타'] : [])];
    const values = [...top.map(([_, v]) => v), ...(others ? [others] : [])];

    return {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: labels.map((_, idx) => COLORS[idx]),
          borderWidth: 0,
        },
      ],
    };
  }, [data, COLORS]);

  const total = pie.datasets[0]?.data.reduce((s, n) => s + n, 0) || 0;

  if (loading) {
    return <Spinner />;
  }

  const hasData = pie.labels.length > 0;

  return (
    <div className="border-none p-5">
      <h3 className="font-semibold mb-4 text-text-primary">{title}</h3>
      {hasData ? (
        <div className="flex items-center gap-6">
          <div className="size-50">
            <Doughnut
              data={pie}
              options={{
                cutout: '50%',
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    enabled: true,
                    callbacks: {
                      label: (ctx) => {
                        const v = Number(ctx.parsed);
                        const pct = total ? Math.round((v / total) * 100) : 0;
                        return `${v} (${pct} %)`;
                      },
                    },
                  },
                  datalabels: {
                    color: '#F0F6FF',
                    formatter: (v: number) => {
                      if (!total || v === 0) return '';
                      const pct = Math.round((v / total) * 100);
                      return `${pct} %`;
                    },
                    anchor: 'center',
                    align: 'center',
                    clamp: true,
                  },
                },
              }}
            />
          </div>
          <ul className="flex flex-col gap-2">
            {pie.labels.map((label, idx) => {
              const color = pie.datasets[0].backgroundColor[idx];

              return (
                <li>
                  <Button
                    key={label}
                    type="button"
                    size="sm"
                    color="secondary"
                    hasIcon
                    className={'text-text-secondary bg-secondary-200/50'}
                  >
                    <span
                      aria-hidden
                      className="size-3 rounded-full"
                      style={{ background: color }}
                    ></span>
                    {label}
                  </Button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <p className="text-text-secondary">데이터가 없습니다.</p>
      )}
    </div>
  );
}
export default memo(WineAnalysisPie);
