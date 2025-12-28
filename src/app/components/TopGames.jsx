"use client";

import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

// Mini bar chart component for the table cell
function MiniBarChart({ value, maxValue }) {
  const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;

  return (
    <div className="w-full h-6 bg-[#252525] rounded-md overflow-hidden relative">
      <div
        className="h-full rounded-md transition-all duration-500"
        style={{
          width: `${percentage}%`,
          background:
            "linear-gradient(90deg, #06D7F6 0%, #4807EA 50%, #FD4895 100%)",
        }}
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

  const displayedGames = showAll ? games : games.slice(0, 3);
  const maxLast30Days = Math.max(...games.map((g) => g.last30Days), 1);

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="bg-[#1B1B1B] rounded-2xl p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-[#252525] rounded w-64 mb-6"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-[#252525] rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="bg-[#1B1B1B] rounded-2xl p-6">
          <p className="text-red-400">Error loading games: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <div className="bg-[#1B1B1B] rounded-2xl p-4 sm:p-6">
        <h2 className="font-['Inter'] text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">
          Top Games By Current Players
        </h2>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[#A1A1A1] text-sm font-['Inter'] border-b border-[#2A2A2A]">
                <th className="text-left py-3 px-2 font-medium">#</th>
                <th className="text-left py-3 px-2 font-medium">Name</th>
                <th className="text-right py-3 px-2 font-medium">
                  Current Players
                </th>
                <th className="text-left py-3 px-2 font-medium w-32">
                  Last 30 Days
                </th>
                <th className="text-right py-3 px-2 font-medium">
                  Peak Players
                </th>
                <th className="text-right py-3 px-2 font-medium">
                  Hours Played
                </th>
              </tr>
            </thead>
            <tbody>
              {displayedGames.map((game, index) => (
                <tr
                  key={game.appid}
                  className="text-white text-sm font-['Inter'] border-b border-[#2A2A2A] hover:bg-[#252525] transition-colors"
                >
                  <td className="py-3 px-2 text-[#A1A1A1]">{index + 1}</td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-3">
                      {game.headerImage && (
                        <img
                          src={game.headerImage}
                          alt={game.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                      )}
                      <span className="truncate max-w-[200px]">
                        {game.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-right font-mono text-[#06D7F6]">
                    {formatNumber(game.currentPlayers)}
                  </td>
                  <td className="py-3 px-2 w-32">
                    <MiniBarChart
                      value={game.last30Days}
                      maxValue={maxLast30Days}
                    />
                  </td>
                  <td className="py-3 px-2 text-right font-mono">
                    {formatNumber(game.peakPlayers)}
                  </td>
                  <td className="py-3 px-2 text-right font-mono text-[#A1A1A1]">
                    {formatNumber(game.hoursPlayed)}K
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {displayedGames.map((game, index) => (
            <div
              key={game.appid}
              className="bg-[#252525] rounded-xl p-4 space-y-3"
            >
              <div className="flex items-center gap-3">
                <span className="text-[#A1A1A1] font-mono text-sm w-5">
                  {index + 1}
                </span>
                {game.headerImage && (
                  <img
                    src={game.headerImage}
                    alt={game.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                )}
                <span className="text-white font-['Inter'] text-sm truncate flex-1">
                  {game.name}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <p className="text-[#A1A1A1]">Current</p>
                  <p className="text-[#06D7F6] font-mono">
                    {formatNumber(game.currentPlayers)}
                  </p>
                </div>
                <div>
                  <p className="text-[#A1A1A1]">Peak</p>
                  <p className="text-white font-mono">
                    {formatNumber(game.peakPlayers)}
                  </p>
                </div>
                <div>
                  <p className="text-[#A1A1A1]">Hours</p>
                  <p className="text-[#A1A1A1] font-mono">
                    {formatNumber(game.hoursPlayed)}K
                  </p>
                </div>
              </div>

              <div>
                <p className="text-[#A1A1A1] text-xs mb-1">Last 30 Days</p>
                <MiniBarChart
                  value={game.last30Days}
                  maxValue={maxLast30Days}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Show More / Show Less */}
        {games.length > 5 && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="flex items-center gap-2 text-[#A1A1A1] hover:text-white transition-colors text-sm font-['Inter'] px-4 py-2 rounded-lg bg-[#252525] hover:bg-[#2A2A2A]"
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
