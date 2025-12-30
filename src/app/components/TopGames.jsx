"use client";

import { useState, useEffect } from "react";
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
  const gradientPlugin = {
    id: "gradientPlugin",
    beforeDraw: (chart) => {
      const ctx = chart.ctx;
      const chartArea = chart.chartArea;
      if (!chartArea) return;

      const dataset = chart.data.datasets[0];
      const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
      gradient.addColorStop(0, "#FD4895");
      gradient.addColorStop(0.5, "#4807EA");
      gradient.addColorStop(1, "#06D7F6");
      dataset.borderColor = gradient;

      const fillGradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
      fillGradient.addColorStop(0, "rgba(253, 72, 149, 0.2)");
      fillGradient.addColorStop(0.5, "rgba(72, 7, 234, 0.15)");
      fillGradient.addColorStop(1, "rgba(6, 215, 246, 0.1)");
      dataset.backgroundColor = fillGradient;
    },
  };

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
        borderWidth: 2,
        tension: 0.4,
      },
      point: {
        radius: 0,
        hoverRadius: 3,
      },
    },
    onHover: (event, activeElements) => {
      event.native.target.style.cursor = activeElements.length > 0 ? "pointer" : "default";
    },
  };

  return (
    <div className="w-full h-12 bg-[#252525] rounded-lg overflow-hidden relative p-1">
      <Line
        data={{
          labels: data.map((_, i) => ""),
          datasets: [
            {
              data: data.map((d) => d.value),
              borderColor: "#06D7F6", // Fallback, will be overridden by plugin
              backgroundColor: "rgba(6, 215, 246, 0.1)", // Fallback, will be overridden by plugin
              fill: true,
              pointRadius: 0,
              pointHoverRadius: 3,
              pointHoverBackgroundColor: "#06D7F6",
              pointHoverBorderColor: "#06D7F6",
            },
          ],
        }}
        options={options}
        plugins={[gradientPlugin]}
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

export default function TopGames() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);

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
  const maxLast48Hours = Math.max(
    ...games.flatMap((g) => (g.last48Hours || []).map((d) => d.value)),
    1
  );

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="bg-[#1B1B1B] rounded-xl p-3 sm:p-4">
          <div className="animate-pulse">
            <div className="h-5 bg-[#252525] rounded w-48 mb-4"></div>
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-10 bg-[#252525] rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="bg-[#1B1B1B] rounded-xl p-3 sm:p-4">
          <p className="text-red-400 text-sm">Error loading games: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="bg-[#1B1B1B] rounded-xl p-3 sm:p-4">
        <h2 className="font-['Inter'] text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
          Top Games By Current Players
        </h2>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[#A1A1A1] text-xs font-['Inter'] border-b border-[#2A2A2A]">
                <th className="text-left py-2 px-2 font-medium">#</th>
                <th className="text-left py-2 px-2 font-medium">Name</th>
                <th className="text-right py-2 px-2 font-medium">
                  Current
                </th>
                <th className="text-left py-2 px-2 font-medium w-24">
                  Last 48h
                </th>
                <th className="text-right py-2 px-2 font-medium">
                  Peak
                </th>
              </tr>
            </thead>
            <tbody>
              {displayedGames.map((game, index) => (
                <tr
                  key={game.appid}
                  className="text-white text-xs font-['Inter'] border-b border-[#2A2A2A] hover:bg-[#252525] transition-colors"
                >
                  <td className="py-2 px-2 text-[#A1A1A1]">{index + 1}</td>
                  <td className="py-2 px-2">
                    <div className="flex items-center gap-2">
                      {game.headerImage && (
                        <img
                          src={game.headerImage}
                          alt={game.name}
                          className="w-8 h-8 object-cover rounded"
                        />
                      )}
                      <span className="truncate max-w-[180px] text-xs">
                        {game.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-2 px-2 text-right font-mono text-[#06D7F6] text-xs">
                    {formatNumber(game.currentPlayers)}
                  </td>
                  <td className="py-2 px-2 w-24">
                    {game.last48Hours && game.last48Hours.length > 0 ? (
                      <MiniLineChart
                        data={game.last48Hours}
                        maxValue={maxLast48Hours}
                      />
                    ) : (
                      <div className="w-full h-12 bg-[#252525] rounded-lg"></div>
                    )}
                  </td>
                  <td className="py-2 px-2 text-right font-mono text-xs">
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
                    className="w-10 h-10 object-cover rounded"
                  />
                )}
                <span className="text-white font-['Inter'] text-xs truncate flex-1">
                  {game.name}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-[#A1A1A1] text-[10px]">Current</p>
                  <p className="text-[#06D7F6] font-mono text-xs">
                    {formatNumber(game.currentPlayers)}
                  </p>
                </div>
                <div>
                  <p className="text-[#A1A1A1] text-[10px]">Peak</p>
                  <p className="text-white font-mono text-xs">
                    {formatNumber(game.peakPlayers)}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-[#A1A1A1] text-[10px] mb-1">Last 48 Hours</p>
                {game.last48Hours && game.last48Hours.length > 0 ? (
                  <MiniLineChart
                    data={game.last48Hours}
                    maxValue={maxLast48Hours}
                  />
                ) : (
                  <div className="w-full h-12 bg-[#252525] rounded-lg"></div>
                )}
              </div>
            </div>
          ))}
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
