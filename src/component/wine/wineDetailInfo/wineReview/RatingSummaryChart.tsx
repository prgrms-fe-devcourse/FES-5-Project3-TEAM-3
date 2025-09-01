import { useEffect, useRef } from 'react';
import { Chart, type ChartConfiguration, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

interface RatingSummaryChartType {
  data: number[];
}

Chart.register(...registerables, ChartDataLabels);

function RatingSummaryChart({ data }: RatingSummaryChartType) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart<'bar'> | null>(null);
  useEffect(() => {
    if (!canvasRef.current) return;
    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels: ['5점', '4점', '3점', '2점', '1점'],
        datasets: [
          {
            data: data,
            backgroundColor: '#E5C67F',
            hoverBackgroundColor: '#E5C67F',
            barThickness: 16,
          },
        ],
      },
      options: {
        responsive: true,
        indexAxis: 'y',
        maintainAspectRatio: false,
        scales: {
          x: {
            ticks: {
              display: false,
            },
            grid: {
              drawTicks: false,
              drawOnChartArea: false,
            },
          },
          y: {
            grid: {
              drawOnChartArea: false,
            },
          },
        },
        layout: { padding: { right: 40 } },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
          },
          datalabels: {
            anchor: 'end',
            align: 'end',
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
    chartRef.current.data.datasets[0].data = data;
    chartRef.current.update('active');
  }, [data]);

  return <canvas ref={canvasRef} />;
}

export default RatingSummaryChart;
