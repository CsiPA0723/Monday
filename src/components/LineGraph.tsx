import React, { useEffect, useRef } from 'react';
import { Chart, ChartData, ChartOptions } from "chart.js";

type LineGraphProps = {
  data: ChartData
  options?: ChartOptions
};

function LineGraph({ data, options }: LineGraphProps) {
  const chartCanvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart>(null);

  const prepareData = (data: ChartData) => ({
    labels: data.labels,
    datasets: data.datasets.map(v => ({
      backgroundColor: "rgba(114, 137, 218, 0.5)",
      borderColor: "rgb(114, 137, 218)",
      borderWidth: 1,
      fill: false,
      ...v,
    }))
  });

  useEffect(() => {
    if(!chartRef.current) return;
    chartRef.current.data = prepareData(data);
    chartRef.current.update();
  }, [data]);

  useEffect(() => {
    if(!chartCanvasRef.current) return;
    const ctx = chartCanvasRef.current.getContext("2d");
    chartRef.current = new Chart(ctx, {
      type: "line",
      data: prepareData(data),
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
            labels: {
              color: "#99AAB5"
            }
          },
        },
        layout: { 
          padding: {
            top: 10,
            left: 15,
            right: 15,
            bottom: 15
          }
        },
        interaction: {
          mode: 'index',
          axis: 'xy',
          intersect: false,
        },
        scales: {
          x: {
            ticks: {
              color: "#99AAB5",
            },
            grid: {
              color: "rgba(153,170,181,0.28)"
            }
          },
          y: {
            ticks: {
              color: "#99AAB5",
              font: {
                weight: "bold"
              }
            },
            grid: {
              color: "rgba(153,170,181,0.28)",
            }
          }
        },
        ...options
      }
    });
  }, []);

  return (
    <div style={{
      margin: "0px auto",
      maxWidth: "800px",
      maxHeight: "400px",
      borderRadius: "20px",
      backgroundColor: "#1e1e4b",
    }}>
      <canvas width={800} height={400} ref={chartCanvasRef} />
    </div>
  );
}

export default LineGraph;
