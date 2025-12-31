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

// Mini line chart component for the table cell
function MiniLineChart({ data, maxValue }) {
  const chartRef = useRef(null);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    scales: {
      x: {
        display: false,
        grid: {
          display: false,
        },
      },
      y: {
        display: false,
        min: 0,
        max: maxValue,
        grid: {
          display: false,
        },
      },
    },
    elements: {
      line: {
        borderWidth: 3,
        tension: 0.4,
      },
      point: {
        radius: 0,
        hoverRadius: 3,
      },
    },
  };

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    const updateGradient = () => {
      const ctx = chart.ctx || (chart.canvas && chart.canvas.getContext("2d"));
      const chartArea = chart.chartArea;

      if (!ctx || !chartArea) return;

      // Green gradient for trending up, red for trending down
      const gradient = ctx.createLinearGradient(
        chartArea.left,
        0,
        chartArea.right,
        0
      );
      gradient.addColorStop(0, "#34D399");
      gradient.addColorStop(1, "#10B981");

      // Fill gradient (vertical, fading down)
      const fillGradient = ctx.createLinearGradient(
        0,
        chartArea.top,
        0,
        chartArea.bottom
      );
      fillGradient.addColorStop(0, "rgba(52, 211, 153, 0.3)");
      fillGradient.addColorStop(1, "rgba(16, 185, 129, 0)");

      chart.data.datasets[0].borderColor = gradient;
      chart.data.datasets[0].backgroundColor = fillGradient;
      chart.update("none");
    };

    // Run after chart is fully rendered
    setTimeout(updateGradient, 0);
  }, [data]);

  return (
    <div className="w-32 h-10 rounded-lg overflow-hidden relative">
      <Line
        key={data.map((d) => d.value).join(",")}
        ref={chartRef}
        data={{
          labels: data.map((_, i) => ""),
          datasets: [
            {
              data: data.map((d) => d.value),
              borderColor: "#10B981",
              backgroundColor: "transparent",
              fill: true,
            },
          ],
        }}
        options={options}
      />
    </div>
  );
}

function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
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

export default function TrendingGames() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    async function fetchGames() {
      try {
        const response = await fetch("/api/steam/trending-games");
        if (!response.ok) throw new Error("Failed to fetch trending games");
        const data = await response.json();
        setGames(data.games || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchGames();
  }, []);

  const displayedGames = showAll ? games.slice(0, 10) : games.slice(0, 3);
  const maxLast48Hours = Math.max(
    ...games.flatMap((g) => (g.last48Hours || []).map((d) => d.value)),
    1
  );

  if (loading) {
    return (
      <div className="w-full">
        <div className="bg-[#1B1B1B] rounded-xl p-3 sm:p-4">
          <div className="animate-pulse">
            <div className="h-5 bg-[#252525] rounded w-48 mb-4"></div>
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-[#252525] rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="bg-[#1B1B1B] rounded-xl p-3 sm:p-4">
          <p className="text-red-400 text-sm">Error loading games: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="bg-[#1B1B1B] rounded-xl p-3 sm:p-4">
        <h2 className="font-['Inter'] text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
          Trending Games (24h Change)
        </h2>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[#A1A1A1] text-xs font-['Inter'] border-b border-[#2A2A2A]">
                <th className="text-left py-2 px-2 font-medium">#</th>
                <th className="text-left py-2 px-2 font-medium">Name</th>
                <th className="text-right py-2 px-2 font-medium">Current</th>
                <th className="text-left py-2 px-2 font-medium w-24">
                  Last 48h
                </th>
                <th className="text-left py-2 font-medium text-[11px]">
                  24h Change
                </th>
              </tr>
            </thead>
            <tbody className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {displayedGames.map((game, index) => {
                const changeData = formatChange(
                  game.change,
                  game.changePercent
                );
                return (
                  <tr
                    key={game.appid}
                    className="text-white text-xs font-['Inter'] border-b border-[#2A2A2A] hover:bg-[#252525] transition-colors"
                  >
                    <td className="py-3 px-2 text-[#A1A1A1]">{index + 1}</td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-3">
                        {game.headerImage && (
                          <img
                            src={game.headerImage}
                            alt={game.name}
                            className="w-14 h-14 object-cover rounded"
                          />
                        )}
                        <span className="truncate max-w-[180px] text-xs">
                          {game.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-right font-mono text-[#dfb0ff] text-xs">
                      {formatNumber(game.currentPlayers)}
                    </td>
                    <td className="py-3 px-2 w-24">
                      {game.last48Hours && game.last48Hours.length > 0 ? (
                        <MiniLineChart
                          key={`${game.appid}-${showAll}`}
                          data={game.last48Hours}
                          maxValue={maxLast48Hours}
                        />
                      ) : (
                        <div className="w-full h-12 bg-[#252525] rounded-lg"></div>
                      )}
                    </td>
                    <td className="py-3 px-2 text-right">
                      <div className="flex flex-col items-end">
                        <span
                          className={`font-mono text-xs ${
                            changeData.isPositive
                              ? "text-[#10B981]"
                              : "text-[#EF4444]"
                          }`}
                        >
                          {changeData.value}
                        </span>
                        <span
                          className={`font-mono text-[10px] ${
                            changeData.isPositive
                              ? "text-[#10B981]"
                              : "text-[#EF4444]"
                          }`}
                        >
                          {changeData.percent}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-2">
          {displayedGames.map((game, index) => {
            const changeData = formatChange(game.change, game.changePercent);
            return (
              <div
                key={game.appid}
                className="bg-[#252525] rounded-lg p-3 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[#A1A1A1] font-mono text-xs w-4">
                    {index + 1}
                  </span>
                  {game.headerImage && (
                    <img
                      src={game.headerImage}
                      alt={game.name}
                      className="w-14 h-14 object-cover rounded"
                    />
                  )}
                  <span className="text-white font-['Inter'] text-xs truncate flex-1">
                    {game.name}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-[#A1A1A1] text-[10px]">Current</p>
                    <p className="text-[#dfb0ff] font-mono text-xs">
                      {formatNumber(game.currentPlayers)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#A1A1A1] text-[10px]">24h Change</p>
                    <p
                      className={`font-mono text-xs ${
                        changeData.isPositive
                          ? "text-[#10B981]"
                          : "text-[#EF4444]"
                      }`}
                    >
                      {changeData.value} ({changeData.percent})
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-[#A1A1A1] text-[10px] mb-1">
                    Last 48 Hours
                  </p>
                  {game.last48Hours && game.last48Hours.length > 0 ? (
                    <MiniLineChart
                      key={`${game.appid}-${showAll}`}
                      data={game.last48Hours}
                      maxValue={maxLast48Hours}
                    />
                  ) : (
                    <div className="w-full h-12 bg-[#252525] rounded-lg"></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Show More / Show Less */}
        {games.length > 3 && (
          <div className="mt-3 flex justify-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="flex items-center gap-2 text-[#A1A1A1] hover:text-white transition-colors text-xs font-['Inter'] px-3 py-1.5 rounded-lg bg-[#252525] hover:bg-[#2A2A2A]"
            >
              {showAll ? (
                <>
                  Show Less
                  <svg
                    className="w-4 h-4 rotate-180"
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
                    className="w-4 h-4"
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
    </div>
  );
}
