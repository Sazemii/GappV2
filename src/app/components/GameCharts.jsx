"use client";

import { useState, useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Filler
);

// Mini line chart component - smaller version
function MiniLineChart({ data, color = "violet" }) {
  const chartRef = useRef(null);

  const values = data.map((d) => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue;

  let yMin, yMax;
  if (range === 0) {
    if (maxValue === 0) {
      yMin = 0;
      yMax = 1;
    } else {
      yMin = Math.max(0, maxValue * 0.9);
      yMax = maxValue * 1.1;
    }
  } else {
    const padding = range * 0.1;
    yMin = Math.max(0, minValue - padding);
    yMax = maxValue + padding;
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: { top: 2, bottom: 2, left: 1, right: 1 },
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    scales: {
      x: { display: false, grid: { display: false } },
      y: { display: false, min: yMin, max: yMax, grid: { display: false } },
    },
    elements: {
      line: { borderWidth: 1.5, tension: 0.4 },
      point: { radius: 0, hoverRadius: 2 },
    },
  };

  const colors = {
    violet: { line: "#A78BFA", fill: "rgba(167, 139, 250, 0.2)" },
    green: { line: "#10B981", fill: "rgba(16, 185, 129, 0.2)" },
  };

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    const updateGradient = () => {
      const ctx = chart.ctx || (chart.canvas && chart.canvas.getContext("2d"));
      const chartArea = chart.chartArea;
      if (!ctx || !chartArea) return;

      const fillGradient = ctx.createLinearGradient(
        0,
        chartArea.top,
        0,
        chartArea.bottom
      );
      fillGradient.addColorStop(0, colors[color].fill);
      fillGradient.addColorStop(1, "transparent");

      chart.data.datasets[0].borderColor = colors[color].line;
      chart.data.datasets[0].backgroundColor = fillGradient;
      chart.update("none");
    };

    setTimeout(updateGradient, 0);
  }, [data, color]);

  return (
    <div className="w-16 h-6 sm:w-20 sm:h-7 rounded overflow-hidden">
      <Line
        ref={chartRef}
        data={{
          labels: data.map(() => ""),
          datasets: [{ data: data.map((d) => d.value), fill: true }],
        }}
        options={options}
      />
    </div>
  );
}

function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

function formatChange(change, changePercent) {
  const sign = change >= 0 ? "+" : "";
  const percentSign = changePercent >= 0 ? "+" : "";
  return {
    value: `${sign}${formatNumber(change)}`,
    percent: `${percentSign}${changePercent.toFixed(1)}%`,
    isPositive: change >= 0,
  };
}

export default function GameCharts({ onGameClick }) {
  const [topGames, setTopGames] = useState([]);
  const [trendingGames, setTrendingGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);
  // Separate states for mobile
  const [showAllTopMobile, setShowAllTopMobile] = useState(false);
  const [showAllTrendingMobile, setShowAllTrendingMobile] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [topRes, trendingRes] = await Promise.all([
          fetch("/api/steam/top-games"),
          fetch("/api/steam/trending-games"),
        ]);

        if (!topRes.ok || !trendingRes.ok)
          throw new Error("Failed to fetch games");

        const topData = await topRes.json();
        const trendingData = await trendingRes.json();

        setTopGames(topData.games || []);
        setTrendingGames(trendingData.games || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const displayedTopGames = showAll
    ? topGames.slice(0, 10)
    : topGames.slice(0, 3);
  const displayedTrendingGames = showAll
    ? trendingGames.slice(0, 10)
    : trendingGames.slice(0, 3);
  // Mobile uses separate states
  const displayedTopGamesMobile = showAllTopMobile
    ? topGames.slice(0, 10)
    : topGames.slice(0, 3);
  const displayedTrendingGamesMobile = showAllTrendingMobile
    ? trendingGames.slice(0, 10)
    : trendingGames.slice(0, 3);

  if (loading) {
    return (
      <div className="bg-[#1B1B1B] rounded-xl p-3 sm:p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-[#252525] rounded w-48"></div>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-10 bg-[#252525] rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#1B1B1B] rounded-xl p-3 sm:p-4">
        <p className="text-red-400 text-sm">Error loading games: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1B1B1B] rounded-xl p-3 sm:p-4">
      {/* Top Games Section */}
      <div className="mb-6">
        <h2 className="font-['Inter'] text-sm sm:text-base font-semibold text-white mb-2 sm:mb-3">
          Top Games By Current Players
        </h2>

        {/* Desktop Table */}
        <div className="hidden md:block">
          <table className="w-full">
            <thead>
              <tr className="text-[#A1A1A1] text-[10px] font-['Inter'] border-b border-[#2A2A2A]">
                <th className="text-left py-1.5 px-1 font-medium w-6">#</th>
                <th className="text-left py-1.5 px-1 font-medium">Name</th>
                <th className="text-right py-1.5 px-1 font-medium w-16">
                  Current
                </th>
                <th className="text-left py-1.5 px-1 font-medium w-20">48h</th>
                <th className="text-right py-1.5 px-1 font-medium w-14">
                  Peak
                </th>
              </tr>
            </thead>
            <tbody>
              {displayedTopGames.map((game, index) => (
                <tr
                  key={game.appid}
                  onClick={() => onGameClick?.(game)}
                  className="text-white text-[11px] font-['Inter'] border-b border-[#2A2A2A]/50 hover:bg-[#252525]/50 cursor-pointer"
                >
                  <td className="py-1.5 px-1 text-[#A1A1A1]">{index + 1}</td>
                  <td className="py-1.5 px-1">
                    <div className="flex items-center gap-2">
                      {game.headerImage && (
                        <img
                          src={game.headerImage}
                          alt={game.name}
                          className="w-8 h-8 object-cover rounded"
                        />
                      )}
                      <span className="truncate max-w-[120px]">
                        {game.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-1.5 px-1 text-right font-mono text-[#dfb0ff]">
                    {formatNumber(game.currentPlayers)}
                  </td>
                  <td className="py-1.5 px-1">
                    {game.last48Hours?.length > 0 ? (
                      <MiniLineChart data={game.last48Hours} color="violet" />
                    ) : (
                      <div className="w-16 h-6 bg-[#252525] rounded"></div>
                    )}
                  </td>
                  <td className="py-1.5 px-1 text-right font-mono">
                    {formatNumber(game.peakPlayers)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile - Compact rows with chart on right */}
        <div className="md:hidden space-y-1.5">
          {displayedTopGamesMobile.map((game, index) => (
            <div
              key={game.appid}
              onClick={() => onGameClick?.(game)}
              className="flex items-center gap-2 bg-[#252525]/50 rounded-lg p-2 cursor-pointer hover:bg-[#252525] transition-colors"
            >
              <span className="text-[#A1A1A1] font-mono text-[10px] w-4">
                {index + 1}
              </span>
              {game.headerImage && (
                <img
                  src={game.headerImage}
                  alt={game.name}
                  className="w-10 h-10 object-cover rounded"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white text-[11px] truncate">{game.name}</p>
                <p className="text-[#dfb0ff] font-mono text-[10px]">
                  {formatNumber(game.currentPlayers)}
                </p>
              </div>
              {game.last48Hours?.length > 0 && (
                <MiniLineChart data={game.last48Hours} color="violet" />
              )}
            </div>
          ))}
          {/* Mobile button for Top Games */}
          {topGames.length > 3 && (
            <div className="mt-2 flex justify-center">
              <button
                onClick={() => setShowAllTopMobile(!showAllTopMobile)}
                className="flex items-center gap-2 text-[#A1A1A1] hover:text-white transition-colors text-[11px] font-['Inter'] px-3 py-1.5 rounded-lg bg-[#252525] hover:bg-[#2A2A2A]"
              >
                {showAllTopMobile ? "Show Less" : "Show Top 10"}
                <svg
                  className={`w-3 h-3 ${showAllTopMobile ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-[#2A2A2A] my-4"></div>

      {/* Trending Games Section */}
      <div>
        <h2 className="font-['Inter'] text-sm sm:text-base font-semibold text-white mb-2 sm:mb-3">
          Trending Games (24h Change)
        </h2>

        {/* Desktop Table */}
        <div className="hidden md:block">
          <table className="w-full">
            <thead>
              <tr className="text-[#A1A1A1] text-[10px] font-['Inter'] border-b border-[#2A2A2A]">
                <th className="text-left py-1.5 px-1 font-medium w-6">#</th>
                <th className="text-left py-1.5 px-1 font-medium">Name</th>
                <th className="text-right py-1.5 px-1 font-medium w-16">
                  Current
                </th>
                <th className="text-left py-1.5 px-1 font-medium w-20">48h</th>
                <th className="text-right py-1.5 px-1 font-medium w-16">
                  Change
                </th>
              </tr>
            </thead>
            <tbody>
              {displayedTrendingGames.map((game, index) => {
                const changeData = formatChange(
                  game.change,
                  game.changePercent
                );
                return (
                  <tr
                    key={game.appid}
                    onClick={() => onGameClick?.(game)}
                    className="text-white text-[11px] font-['Inter'] border-b border-[#2A2A2A]/50 hover:bg-[#252525]/50 cursor-pointer"
                  >
                    <td className="py-1.5 px-1 text-[#A1A1A1]">{index + 1}</td>
                    <td className="py-1.5 px-1">
                      <div className="flex items-center gap-2">
                        {game.headerImage && (
                          <img
                            src={game.headerImage}
                            alt={game.name}
                            className="w-8 h-8 object-cover rounded"
                          />
                        )}
                        <span className="truncate max-w-[120px]">
                          {game.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-1.5 px-1 text-right font-mono text-[#dfb0ff]">
                      {formatNumber(game.currentPlayers)}
                    </td>
                    <td className="py-1.5 px-1">
                      {game.last48Hours?.length > 0 ? (
                        <MiniLineChart data={game.last48Hours} color="green" />
                      ) : (
                        <div className="w-16 h-6 bg-[#252525] rounded"></div>
                      )}
                    </td>
                    <td className="py-1.5 px-1 text-right">
                      <span
                        className={`font-mono ${
                          changeData.isPositive
                            ? "text-[#10B981]"
                            : "text-[#EF4444]"
                        }`}
                      >
                        {changeData.percent}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile - Compact rows with chart on right */}
        <div className="md:hidden space-y-1.5">
          {displayedTrendingGamesMobile.map((game, index) => {
            const changeData = formatChange(game.change, game.changePercent);
            return (
              <div
                key={game.appid}
                onClick={() => onGameClick?.(game)}
                className="flex items-center gap-2 bg-[#252525]/50 rounded-lg p-2 cursor-pointer hover:bg-[#252525] transition-colors"
              >
                <span className="text-[#A1A1A1] font-mono text-[10px] w-4">
                  {index + 1}
                </span>
                {game.headerImage && (
                  <img
                    src={game.headerImage}
                    alt={game.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-[11px] truncate">{game.name}</p>
                  <p
                    className={`font-mono text-[10px] ${
                      changeData.isPositive
                        ? "text-[#10B981]"
                        : "text-[#EF4444]"
                    }`}
                  >
                    {changeData.value} ({changeData.percent})
                  </p>
                </div>
                {game.last48Hours?.length > 0 && (
                  <MiniLineChart data={game.last48Hours} color="green" />
                )}
              </div>
            );
          })}
          {/* Mobile button for Trending Games */}
          {trendingGames.length > 3 && (
            <div className="mt-2 flex justify-center">
              <button
                onClick={() => setShowAllTrendingMobile(!showAllTrendingMobile)}
                className="flex items-center gap-2 text-[#A1A1A1] hover:text-white transition-colors text-[11px] font-['Inter'] px-3 py-1.5 rounded-lg bg-[#252525] hover:bg-[#2A2A2A]"
              >
                {showAllTrendingMobile ? "Show Less" : "Show Top 10"}
                <svg
                  className={`w-3 h-3 ${
                    showAllTrendingMobile ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Show More / Show Less Button */}
      {(topGames.length > 3 || trendingGames.length > 3) && (
        <div className="mt-4 hidden md:flex justify-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-2 text-[#A1A1A1] hover:text-white transition-colors text-xs font-['Inter'] px-4 py-2 rounded-lg bg-[#252525] hover:bg-[#2A2A2A]"
          >
            {showAll ? (
              <>
                Show Less
                <svg
                  className="w-3.5 h-3.5 rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </>
            ) : (
              <>
                Show Top 10
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
