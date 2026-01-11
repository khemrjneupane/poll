"use client";
import { useEffect, useRef, useMemo } from "react";
import Chart, { ChartType } from "chart.js/auto";
import { Party } from "@/types/vote";

interface ElectionChartProps {
  parties: Party[];
  type?: "pie" | "bar";
}

const ElectionChart = ({ parties, type = "pie" }: ElectionChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const initializedRef = useRef(false);

  // Deep memoize the parties data to prevent unnecessary updates
  const partiesKey = useMemo(
    () => JSON.stringify(parties.map((p) => ({ id: p.id, votes: p.votes }))),
    [parties]
  );

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const sortedParties = [...parties].sort((a, b) => b.votes - a.votes);
    const totalVotes = sortedParties.reduce((sum, p) => sum + p.votes, 0);

    if (!chartRef.current) {
      // First time - create chart
      chartRef.current = new Chart(ctx, {
        type: type as ChartType,
        data: {
          labels: sortedParties.map((p) => p.name),
          datasets: [
            {
              data: sortedParties.map((p) => p.votes),
              backgroundColor: sortedParties.map((p) => p.color),
              borderColor: "#ffffff",
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 0, // Disable animation to prevent loops
          },
          plugins: {
            legend: {
              position: type === "pie" ? "bottom" : "top",
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const value = context.parsed as number;
                  const percentage =
                    totalVotes > 0
                      ? ((value / totalVotes) * 100).toFixed(1)
                      : "0";
                  return `${context.label}: ${value} votes (${percentage}%)`;
                },
              },
            },
          },
          scales:
            type === "bar"
              ? {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      stepSize: 1,
                    },
                  },
                }
              : undefined,
        },
      });
      initializedRef.current = true;
    } else {
      // Subsequent updates - just update data
      chartRef.current.data.labels = sortedParties.map((p) => p.name);
      chartRef.current.data.datasets[0].data = sortedParties.map(
        (p) => p.votes
      );
      chartRef.current.data.datasets[0].backgroundColor = sortedParties.map(
        (p) => p.color
      );
      chartRef.current.update("none"); // No animation
    }

    return () => {
      // Cleanup on unmount only
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [partiesKey, type]); // Only update when data or type actually changes

  return (
    <div className={`${type === "pie" ? "h-64" : "h-80"} w-full`}>
      <canvas ref={canvasRef} />
    </div>
  );
};
export { ElectionChart };
