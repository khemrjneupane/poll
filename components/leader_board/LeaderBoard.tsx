"use client";

import { useMemo } from "react";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/leader_board/Cart";
import Image from "next/image";
import { useNominees } from "@/app/hooks/useNominees";
import Link from "next/link";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement
);

export default function LeaderBoard() {
  const { data, isLoading, error } = useNominees(1, "desc");

  // 🎯 Limit to top 7 nominees by votes
  const nominees = useMemo(() => {
    return data?.nominees?.length
      ? [...data.nominees].sort((a, b) => b.votes - a.votes).slice(0, 7)
      : [];
  }, [data?.nominees]);
  const topNominees = nominees.filter((nominee) => nominee.isApproved);
  // 🎨 Predefined color palette for up to 7 nominees
  const chartColors = [
    "#2563eb", // blue
    "#dc2626", // red
    "#16a34a", // green
    "#d97706", // amber
    "#9333ea", // purple
    "#0891b2", // cyan
    "#ea580c", // orange
  ];

  // 🥧 Pie Chart Data (Top 7 nominees)
  const pieData = useMemo(() => {
    if (!topNominees.length) return { labels: [], datasets: [] };

    return {
      labels: topNominees.map((n) => `${n.name} ${n.surname}`),
      datasets: [
        {
          label: "Votes",
          data: topNominees.map((n) => n.votes),
          backgroundColor: chartColors.slice(0, topNominees.length),
          borderColor: "#ffffff",
          borderWidth: 2,
        },
      ],
    };
  }, [topNominees]);

  // 📊 Bar Chart Data (Top 7 nominees, matching colors)
  const barData = useMemo(() => {
    if (!topNominees.length) return { labels: [], datasets: [] };

    return {
      labels: topNominees.map((n) => `${n.name} ${n.surname}`),
      datasets: [
        {
          label: "Votes",
          data: topNominees.map((n) => n.votes),
          backgroundColor: chartColors.slice(0, topNominees.length),
          borderRadius: 6,
        },
      ],
    };
  }, [topNominees]);

  if (isLoading) return <p className="text-center">Loading nominees...</p>;
  if (error) return <p className="text-center text-red-500">{error.message}</p>;
  if (!data?.nominees?.length)
    return <p className="text-center">No nominees found.</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      <h1 className="text-3xl font-bold text-center mb-6 text-slate-100">
        🏆 Leaderboard
      </h1>

      {/* Charts Section */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <Card className="shadow-lg border border-gray-100">
          <CardHeader>
            <CardTitle className="text-lg text-center">
              Top 7 Nominees (Pie Chart)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full flex justify-center">
              <Pie
                data={pieData}
                options={{
                  plugins: {
                    legend: { position: "bottom" },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card className="shadow-lg border border-gray-100">
          <CardHeader>
            <CardTitle className="text-lg text-center">
              Votes Distribution (Bar Chart)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Bar
              data={barData}
              options={{
                plugins: {
                  legend: { display: false },
                  tooltip: { enabled: true },
                },
                scales: {
                  x: {
                    ticks: {
                      color: "#4b5563",
                      font: { size: 12 },
                    },
                  },
                  y: {
                    beginAtZero: true,
                    ticks: {
                      stepSize: 1,
                      color: "#4b5563",
                    },
                  },
                },
              }}
            />
          </CardContent>
        </Card>
      </div>

      {/* Top Nominees List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topNominees.map((nominee, idx) => (
          <Link href={`nominees/${nominee._id}`} key={nominee._id}>
            <Card
              key={nominee._id}
              className="flex flex-col items-center text-center p-4 shadow-md hover:shadow-xl border border-gray-100 transition-all"
            >
              <div className="relative mb-3">
                <Image
                  src={nominee.avatar?.url || "/placeholder.png"}
                  alt={`${nominee.name} ${nominee.surname}`}
                  width={120}
                  height={120}
                  className="h-34 w-34 rounded-full object-cover border-4"
                  style={{
                    borderColor: chartColors[idx % chartColors.length],
                  }}
                />
              </div>
              <CardHeader className="p-0">
                <CardTitle className="text-xl font-semibold">
                  {nominee.name} {nominee.surname}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <p className="text-gray-500 text-sm">
                  {nominee.group === "party"
                    ? `Party: ${nominee.party}`
                    : "Independent"}
                </p>
                <p className="text-gray-600 text-sm">
                  Province: {nominee.province}
                </p>
                <p className="font-medium text-gray-800">
                  Votes: {nominee.votes}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
