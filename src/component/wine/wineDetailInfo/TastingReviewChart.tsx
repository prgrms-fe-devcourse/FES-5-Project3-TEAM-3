import { useEffect, useRef } from 'react';
import { Chart, type ChartConfiguration, registerables } from 'chart.js';

interface TastingReviewChartType {
  infoData: number[];
  reviewData: number[];
}

Chart.register(...registerables);

function TastingReviewChart({ infoData, reviewData }: TastingReviewChartType) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart<'bar'> | null>(null);
  useEffect(() => {
    if (!canvasRef.current) return;
    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels: ['당도', '산미', '탄닌', '바디'],
        datasets: [
          {
            label: '공식',
            data: infoData,
            backgroundColor: '#6E0E2E',
            barThickness: 16,
            borderRadius: 4,
          },
          {
            label: '리뷰',
            data: reviewData,
            backgroundColor: '#EFD6B2',
            barThickness: 16,
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        indexAxis: 'y',
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: true,
        },
        scales: {
          x: {
            min: 0,
            max: 6, // 눈금과 상관없이 막대 최대값 여유 공간
            ticks: {
              stepSize: 1, // 눈금 간격
              callback: (value) => (Number(value) > 5 ? '(점)' : value),
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              title: () => '', // title 제거
              label: (context) => {
                const datasetLabel = context.dataset.label; // 예: '리뷰' or '공식'
                const value = context.formattedValue;
                return `${datasetLabel} : ${value}`;
              },
            },
            xAlign: 'left',
            position: 'nearest',
          },
        },
      },
    };

    if (!chartRef.current) chartRef.current = new Chart(canvasRef.current, config);

    Chart.defaults.font.size = 16;

    // cleanup
    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;
    chartRef.current.data.datasets[0].data = infoData;
    chartRef.current.data.datasets[1].data = reviewData;
    chartRef.current.update('active');
  }, [infoData, reviewData]);

  return <canvas ref={canvasRef} />;
}

export default TastingReviewChart;
