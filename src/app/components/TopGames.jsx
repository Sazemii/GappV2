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
function MiniLineChart({ data }) {
  const chartRef = useRef(null);

  // Calculate min and max from the data for relative scaling
  const values = data.map((d) => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue;

  // Handle case when all values are the same (range = 0)
  let yMin, yMax;
  if (range === 0) {
    // If all values are the same, create a range around that value
    if (maxValue === 0) {
      yMin = 0;
      yMax = 1;
    } else {
      yMin = Math.max(0, maxValue * 0.9);
      yMax = maxValue * 1.1;
    }
  } else {
    // Add padding to prevent chart from touching edges (10% padding on top and bottom)
    const padding = range * 0.1;
    yMin = Math.max(0, minValue - padding);
    yMax = maxValue + padding;
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 4,
        bottom: 4,
        left: 2,
        right: 2,
      },
    },
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
        min: yMin,
        max: yMax,
        grid: {
          display: false,
        },
      },
    },
    elements: {
      line: {
        borderWidth: 2,
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

      // Violet gradient
      const gradient = ctx.createLinearGradient(
        chartArea.left,
        0,
        chartArea.right,
        0
      );
      gradient.addColorStop(0, "#A78BFA");
      gradient.addColorStop(1, "#C084FC");

      // Fill gradient (vertical, fading down)
      const fillGradient = ctx.createLinearGradient(
        0,
        chartArea.top,
        0,
        chartArea.bottom
      );
      fillGradient.addColorStop(0, "rgba(167, 139, 250, 0.3)");
      fillGradient.addColorStop(1, "rgba(192, 132, 252, 0)");

      chart.data.datasets[0].borderColor = gradient;
      chart.data.datasets[0].backgroundColor = fillGradient;
      chart.update("none");
    };

    // Run after chart is fully rendered
    setTimeout(updateGradient, 0);

    // Force update on window resize or visibility change
    const handleResize = () => setTimeout(updateGradient, 0);
    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleResize);
    };
  }, [data]);

  return (
    <div className="w-20 xs:w-32 sm:w-32 h-10 rounded-lg overflow-hidden relative">
      <Line
        key={data.map((d) => d.value).join(",")}
        ref={chartRef}
        data={{
          labels: data.map((_, i) => ""),
          datasets: [
            {
              data: data.map((d) => d.value),
              borderColor: "#8B5CF6",
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

export default function TopGames({
  showAll: controlledShowAll,
  onToggle,
  hideButton = false,
  onGameClick,
}) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [internalShowAll, setInternalShowAll] = useState(false);

  // Use controlled or internal state
  const isControlled = controlledShowAll !== undefined;
  const showAll = isControlled ? controlledShowAll : internalShowAll;
  const toggleShowAll = () => {
    if (isControlled && onToggle) {
      onToggle();
    } else {
      setInternalShowAll(!internalShowAll);
    }
  };

  useEffect(() => {
    async function fetchGames() {
      try {
        const response = await fetch("/api/steam/top-games");
        if (!response.ok) throw new Error("Failed to fetch games");
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
          Top Games By Current Players
        </h2>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full table-fixed">
            <thead>
              <tr className="text-[#A1A1A1] text-xs font-['Inter'] border-b border-[#2A2A2A]">
                <th
                  className="text-left py-2 px-2 font-medium"
                  style={{ width: "3%" }}
                >
                  #
                </th>
                <th
                  className="text-left py-2 px-2 font-medium"
                  style={{ width: "40%" }}
                >
                  Name
                </th>
                <th
                  className="text-right py-2 px-2 font-medium"
                  style={{ width: "12%" }}
                >
                  Current
                </th>
                <th
                  className="text-left py-2 px-2 font-medium"
                  style={{ width: "28%" }}
                >
                  Last 48h
                </th>
                <th
                  className="text-right py-2 px-2 font-medium"
                  style={{ width: "17%" }}
                >
                  Peak
                </th>
              </tr>
            </thead>
            <tbody className="">
              {displayedGames.map((game, index) => (
                <tr
                  key={game.appid}
                  onClick={() => onGameClick?.(game)}
                  className="text-white text-xs font-['Inter'] border-b border-[#2A2A2A] hover:bg-[#252525] transition-colors cursor-pointer"
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
                      />
                    ) : (
                      <div className="w-full h-12 bg-[#252525] rounded-lg"></div>
                    )}
                  </td>
                  <td className="py-3 px-2 text-right font-mono text-xs">
                    {formatNumber(game.peakPlayers)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-2">
          {displayedGames.map((game, index) => (
            <div
              key={game.appid}
              onClick={() => onGameClick?.(game)}
              className="flex items-center gap-2 bg-[#252525] rounded-lg p-2.5 cursor-pointer hover:bg-[#2a2a2a] transition-colors"
            >
              <span className="text-[#A1A1A1] font-mono text-[10px] w-4 flex-shrink-0">
                {index + 1}
              </span>
              {game.headerImage && (
                <img
                  src={game.headerImage}
                  alt={game.name}
                  className="w-12 h-12 object-cover rounded flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white font-['Inter'] text-xs truncate mb-0.5">
                  {game.name}
                </p>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="text-[#A1A1A1]">Current:</span>
                  <span className="text-[#dfb0ff] font-mono">
                    {formatNumber(game.currentPlayers)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="text-[#A1A1A1]">Peak:</span>
                  <span className="text-white font-mono">
                    {formatNumber(game.peakPlayers)}
                  </span>
                </div>
              </div>
              {game.last48Hours && game.last48Hours.length > 0 && (
                <div className="flex-shrink-0">
                  <MiniLineChart
                    key={`${game.appid}-${showAll}`}
                    data={game.last48Hours}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Show More / Show Less */}
        {games.length > 3 && !hideButton && (
          <div className="mt-3 flex justify-center">
            <button
              onClick={toggleShowAll}
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
