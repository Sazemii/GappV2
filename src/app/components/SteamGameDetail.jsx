"use client";

import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Star,
  Calendar,
  Users,
  Monitor,
  ExternalLink,
  Clock,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Building2,
  Loader2,
  Globe,
  Palette,
  TrendingUp,
  Play,
  ThumbsUp,
  ThumbsDown,
  Tag,
  ShoppingCart,
  Cpu,
} from "lucide-react";
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
  Filler,
);

// Player history chart component
function PlayerHistoryChart({ data }) {
  const chartRef = useRef(null);

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-40 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
        <p className="text-white/40 text-sm">No player history data</p>
      </div>
    );
  }

  const values = data.map((d) => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue;

  let yMin, yMax;
  if (range === 0) {
    yMin = Math.max(0, maxValue * 0.9);
    yMax = maxValue * 1.1 || 1;
  } else {
    const padding = range * 0.1;
    yMin = Math.max(0, minValue - padding);
    yMax = maxValue + padding;
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: "#1a1a1a",
        titleColor: "#fff",
        bodyColor: "#a78bfa",
        borderColor: "#333",
        borderWidth: 1,
        callbacks: {
          label: (context) => `${context.parsed.y.toLocaleString()} players`,
        },
      },
    },
    scales: {
      x: { display: false },
      y: { display: false, min: yMin, max: yMax },
    },
    elements: {
      line: { borderWidth: 2, tension: 0.4 },
      point: { radius: 0, hoverRadius: 4 },
    },
  };

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    const ctx = chart.ctx;
    const chartArea = chart.chartArea;
    if (!ctx || !chartArea) return;

    const gradient = ctx.createLinearGradient(
      0,
      chartArea.top,
      0,
      chartArea.bottom,
    );
    gradient.addColorStop(0, "rgba(167, 139, 250, 0.4)");
    gradient.addColorStop(1, "rgba(167, 139, 250, 0)");

    chart.data.datasets[0].borderColor = "#a78bfa";
    chart.data.datasets[0].backgroundColor = gradient;
    chart.update("none");
  }, [data]);

  return (
    <div className="w-full h-40 rounded-2xl overflow-hidden">
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
  return num?.toLocaleString() || "0";
}

function getReviewColor(desc) {
  const lower = desc?.toLowerCase() || "";
  if (lower.includes("overwhelmingly positive")) return "text-emerald-400";
  if (lower.includes("very positive")) return "text-emerald-400";
  if (lower.includes("positive")) return "text-green-400";
  if (lower.includes("mostly positive")) return "text-lime-400";
  if (lower.includes("mixed")) return "text-yellow-400";
  if (lower.includes("mostly negative")) return "text-orange-400";
  if (lower.includes("negative")) return "text-red-400";
  return "text-white/60";
}

function getMetacriticColor(score) {
  if (score >= 75)
    return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
  if (score >= 50)
    return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
  return "bg-red-500/20 text-red-400 border-red-500/30";
}

export default function SteamGameDetail({ game, onClose }) {
  const containerRef = useRef(null);
  const [gameDetails, setGameDetails] = useState(null);
  const [currentScreenshot, setCurrentScreenshot] = useState(0);
  const [showTrailer, setShowTrailer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (game?.appid) {
      fetchGameDetails();
      document.body.style.overflow = "hidden";

      if (containerRef.current) {
        containerRef.current.scrollTop = 0;
      }
      window.scrollTo(0, 0);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [game]);

  const fetchGameDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/steam/game/${game.appid}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch game details");
      }

      setGameDetails(data.game);
    } catch (err) {
      console.error("Error fetching Steam game details:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const nextScreenshot = () => {
    if (gameDetails?.screenshots) {
      setCurrentScreenshot((prev) =>
        prev === gameDetails.screenshots.length - 1 ? 0 : prev + 1,
      );
    }
  };

  const prevScreenshot = () => {
    if (gameDetails?.screenshots) {
      setCurrentScreenshot((prev) =>
        prev === 0 ? gameDetails.screenshots.length - 1 : prev - 1,
      );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "TBA";
    return dateString;
  };

  // Strip HTML tags from description
  const stripHtml = (html) => {
    if (!html) return "";
    return html
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"');
  };

  if (!game) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-[#0a0a0a] overflow-y-auto"
    >
      {/* Full Screen Background Image */}
      <div className="fixed inset-0 z-0">
        {gameDetails ? (
          <img
            src={gameDetails.background || gameDetails.headerImage}
            alt={gameDetails.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-[#0a0a0a]" />
        )}
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/20  to-[#0a0a0a]/0" />
        <div className="absolute bottom-0 left-0 right-0 h-[60%] bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a] to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-8">
          {/* Back Button with Steam Badge */}
          <div className="flex items-center justify-between mb-12">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back to Charts</span>
            </button>

            {/* Steam Badge */}
            <div className="flex items-center gap-2 bg-gradient-to-r from-[#1b2838] to-[#171a21] px-4 py-2 rounded-xl border border-[#2a475e]">
              <span className="text-[#bbbbbb] text-sm font-medium">
                Data from Steam
              </span>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                <p className="text-white/60 text-sm">Loading game...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <p className="text-white text-lg mb-4">{error}</p>
                <button
                  onClick={onClose}
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Go back
                </button>
              </div>
            </div>
          ) : gameDetails ? (
            <>
              {/* Hero Section */}
              <div className="mb-8 lg:mb-16">
                <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-4 lg:mb-8 leading-tight">
                  {gameDetails.name}
                </h1>

                {/* Quick Stats */}
                <div className="flex flex-wrap items-center gap-2 lg:gap-4 mb-6 lg:mb-10">
                  {/* Current Players */}
                  {gameDetails.playerStats?.currentPlayers > 0 && (
                    <div className="flex items-center gap-1.5 lg:gap-2 bg-white/5 px-3 py-2 lg:px-5 lg:py-3 rounded-xl lg:rounded-2xl border border-white/10">
                      <Users className="w-4 h-4 lg:w-6 lg:h-6 text-white/70" />
                      <span className="font-bold text-sm lg:text-xl text-white">
                        {formatNumber(gameDetails.playerStats.currentPlayers)}
                      </span>
                      <span className="text-white/40 text-xs lg:text-sm hidden sm:inline">
                        playing
                      </span>
                    </div>
                  )}

                  {/* Review Score */}
                  {gameDetails.reviews && (
                    <div className="flex items-center gap-1.5 lg:gap-2 bg-white/5 px-3 py-2 lg:px-5 lg:py-3 rounded-xl lg:rounded-2xl border border-white/10">
                      <Star
                        className={`w-4 h-4 lg:w-6 lg:h-6 ${getReviewColor(
                          gameDetails.reviews.reviewScoreDesc,
                        )} fill-current`}
                      />
                      <span
                        className={`font-bold text-sm lg:text-xl ${getReviewColor(
                          gameDetails.reviews.reviewScoreDesc,
                        )}`}
                      >
                        {gameDetails.reviews.reviewScoreDesc}
                      </span>
                    </div>
                  )}

                  {/* Metacritic */}
                  {gameDetails.metacritic && (
                    <div
                      className={`px-3 py-2 lg:px-5 lg:py-3 rounded-xl lg:rounded-2xl border ${getMetacriticColor(
                        gameDetails.metacritic.score,
                      )}`}
                    >
                      <span className="font-bold text-sm lg:text-xl">
                        {gameDetails.metacritic.score}
                      </span>
                      <span className="text-white/40 text-xs lg:text-sm ml-1 lg:ml-2">
                        Metacritic
                      </span>
                    </div>
                  )}

                  {/* Price */}
                  {gameDetails.price ? (
                    <div className="flex items-center gap-1.5 lg:gap-2 bg-white/5 px-3 py-2 lg:px-5 lg:py-3 rounded-xl lg:rounded-2xl border border-white/10">
                      {gameDetails.price.discountPercent > 0 && (
                        <span className="bg-green-500 text-white text-xs lg:text-sm font-bold px-1.5 py-0.5 lg:px-2 lg:py-1 rounded">
                          -{gameDetails.price.discountPercent}%
                        </span>
                      )}
                      <span className="text-white font-bold text-sm lg:text-xl">
                        {gameDetails.price.finalFormatted ||
                          `$${(gameDetails.price.final / 100).toFixed(2)}`}
                      </span>
                    </div>
                  ) : gameDetails.isFree ? (
                    <div className="bg-green-500/20 text-green-400 px-3 py-2 lg:px-5 lg:py-3 rounded-xl lg:rounded-2xl text-sm lg:text-lg font-bold border border-green-500/30">
                      Free to Play
                    </div>
                  ) : null}

                  {/* Release Date */}
                  {gameDetails.releaseDate && (
                    <div className="flex items-center gap-1.5 lg:gap-2 bg-white/5 px-3 py-2 lg:px-5 lg:py-3 rounded-xl lg:rounded-2xl border border-white/10 text-white/80">
                      <Calendar className="w-4 h-4 lg:w-5 lg:h-5" />
                      <span className="font-medium text-xs lg:text-base">
                        {gameDetails.releaseDate.comingSoon
                          ? "Coming Soon"
                          : formatDate(gameDetails.releaseDate.date)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Genres */}
                {gameDetails.genres && gameDetails.genres.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 lg:gap-3 mb-6 lg:mb-10">
                    {gameDetails.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="text-xs lg:text-sm text-purple-300 bg-purple-500/15 px-2.5 py-1.5 lg:px-5 lg:py-2.5 rounded-full border border-purple-500/25 font-medium"
                      >
                        {genre.description}
                      </span>
                    ))}
                  </div>
                )}

                {/* Description */}
                {gameDetails.shortDescription && (
                  <p className="text-white/70 text-sm lg:text-lg leading-relaxed max-w-3xl">
                    {stripHtml(gameDetails.shortDescription)}
                  </p>
                )}
              </div>

              {/* Player Stats Section */}
              {gameDetails.playerStats && (
                <div className="mb-8 lg:mb-16">
                  <h3 className="text-white font-semibold text-base lg:text-xl mb-4 lg:mb-6 flex items-center gap-2 lg:gap-3">
                    <TrendingUp className="w-4 h-4 lg:w-6 lg:h-6 text-white/60" />
                    Live Player Statistics
                  </h3>
                  <div className="bg-white/5 rounded-xl lg:rounded-3xl p-4 lg:p-6 border border-white/10">
                    <div className="grid grid-cols-3 gap-2 lg:gap-6 mb-4 lg:mb-6">
                      <div className="text-center">
                        <p className="text-white/40 text-[10px] lg:text-sm mb-1 lg:mb-2">
                          Current
                        </p>
                        <p className="text-base lg:text-2xl font-bold text-white">
                          {formatNumber(gameDetails.playerStats.currentPlayers)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-white/40 text-[10px] lg:text-sm mb-1 lg:mb-2">
                          24h Peak
                        </p>
                        <p className="text-base lg:text-2xl font-bold text-white/80">
                          {formatNumber(gameDetails.playerStats.peakPlayers24h)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-white/40 text-[10px] lg:text-sm mb-1 lg:mb-2">
                          All-Time
                        </p>
                        <p className="text-base lg:text-2xl font-bold text-white/60">
                          {formatNumber(gameDetails.playerStats.allTimePeak)}
                        </p>
                      </div>
                    </div>

                    {gameDetails.playerStats.playerHistory?.length > 0 && (
                      <div>
                        <p className="text-white/40 text-xs lg:text-sm mb-2 lg:mb-3">
                          Player History (7 Days)
                        </p>
                        <PlayerHistoryChart
                          data={gameDetails.playerStats.playerHistory}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Screenshots/Media Gallery */}
              {(gameDetails.movies?.length > 0 ||
                gameDetails.screenshots?.length > 0) && (
                <div className="mb-8 lg:mb-16">
                  <div className="flex items-center justify-between mb-4 lg:mb-6">
                    <h3 className="text-white font-semibold text-base lg:text-xl flex items-center gap-2 lg:gap-3">
                      <Palette className="w-4 h-4 lg:w-6 lg:h-6 text-purple-400" />
                      {showTrailer ? "Trailer" : "Screenshots"}
                    </h3>
                    {gameDetails.movies?.length > 0 && (
                      <button
                        onClick={() => setShowTrailer(!showTrailer)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                          showTrailer
                            ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                            : "bg-white/5 text-white/70 hover:text-white border border-white/10"
                        }`}
                      >
                        <Play className="w-4 h-4" />
                        {showTrailer ? "View Screenshots" : "Watch Trailer"}
                      </button>
                    )}
                  </div>

                  {/* Trailer */}
                  {showTrailer && gameDetails.movies?.length > 0 && (
                    <div className="rounded-3xl overflow-hidden bg-black border border-white/5">
                      <video
                        controls
                        autoPlay
                        className="w-full max-h-[500px]"
                        poster={gameDetails.movies[0].thumbnail}
                      >
                        <source
                          src={
                            gameDetails.movies[0].mp4?.max ||
                            gameDetails.movies[0].mp4?.[480]
                          }
                          type="video/mp4"
                        />
                      </video>
                    </div>
                  )}

                  {/* Screenshots */}
                  {!showTrailer && gameDetails.screenshots?.length > 0 && (
                    <div className="relative group">
                      <div className="relative rounded-xl lg:rounded-3xl overflow-hidden bg-black/20 border border-white/5">
                        <img
                          src={
                            gameDetails.screenshots[currentScreenshot]
                              ?.path_full
                          }
                          alt={`Screenshot ${currentScreenshot + 1}`}
                          className="w-full h-[200px] sm:h-[300px] lg:h-[500px] object-cover"
                        />

                        {gameDetails.screenshots.length > 1 && (
                          <>
                            <button
                              onClick={prevScreenshot}
                              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 p-3 rounded-full text-white/70 hover:text-white hover:bg-black/70 transition-all border border-white/10 opacity-0 group-hover:opacity-100"
                            >
                              <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                              onClick={nextScreenshot}
                              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 p-3 rounded-full text-white/70 hover:text-white hover:bg-black/70 transition-all border border-white/10 opacity-0 group-hover:opacity-100"
                            >
                              <ChevronRight className="w-6 h-6" />
                            </button>

                            {/* Dot indicators */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                              {gameDetails.screenshots
                                .slice(0, 10)
                                .map((_, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => setCurrentScreenshot(idx)}
                                    className={`h-2 rounded-full transition-all ${
                                      idx === currentScreenshot
                                        ? "bg-purple-400 w-8"
                                        : "bg-white/30 w-2 hover:bg-white/50"
                                    }`}
                                  />
                                ))}
                            </div>
                          </>
                        )}
                      </div>

                      {/* Thumbnail Strip */}
                      {gameDetails.screenshots.length > 1 && (
                        <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                          {gameDetails.screenshots
                            .slice(0, 8)
                            .map((screenshot, idx) => (
                              <button
                                key={idx}
                                onClick={() => setCurrentScreenshot(idx)}
                                className={`relative flex-shrink-0 rounded-lg overflow-hidden transition-all ${
                                  idx === currentScreenshot
                                    ? "ring-2 ring-purple-400 ring-offset-2 ring-offset-[#0a0a0a]"
                                    : "opacity-60 hover:opacity-100"
                                }`}
                              >
                                <img
                                  src={screenshot.path_thumbnail}
                                  alt={`Thumbnail ${idx + 1}`}
                                  className="w-24 h-14 object-cover"
                                />
                              </button>
                            ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Game Details Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12">
                {/* Left Column - Main Info */}
                <div className="lg:col-span-2 space-y-6 lg:space-y-10">
                  {/* User Reviews */}
                  {gameDetails.reviews &&
                    gameDetails.reviews.totalReviews > 0 && (
                      <div>
                        <h3 className="text-white text-base lg:text-xl font-semibold mb-3 lg:mb-5">
                          User Reviews
                        </h3>
                        <div className="space-y-3 lg:space-y-4">
                          <div className="flex items-center justify-between mb-2">
                            <span
                              className={`font-bold text-sm lg:text-lg ${getReviewColor(
                                gameDetails.reviews.reviewScoreDesc,
                              )}`}
                            >
                              {gameDetails.reviews.reviewScoreDesc}
                            </span>
                            <span className="text-white/60 text-xs lg:text-base">
                              {gameDetails.reviews.totalReviews.toLocaleString()}{" "}
                              reviews
                            </span>
                          </div>
                          <div className="flex items-center gap-3 lg:gap-4">
                            <div className="flex items-center gap-1.5 lg:gap-2">
                              <ThumbsUp className="w-4 h-4 lg:w-5 lg:h-5 text-green-400" />
                              <span className="text-green-400 font-medium text-sm lg:text-base">
                                {gameDetails.reviews.totalPositive.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 lg:gap-2">
                              <ThumbsDown className="w-4 h-4 lg:w-5 lg:h-5 text-red-400" />
                              <span className="text-red-400 font-medium text-sm lg:text-base">
                                {gameDetails.reviews.totalNegative.toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-green-500"
                              style={{
                                width: `${
                                  (gameDetails.reviews.totalPositive /
                                    gameDetails.reviews.totalReviews) *
                                  100
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                  {/* Features/Categories */}
                  {gameDetails.categories &&
                    gameDetails.categories.length > 0 && (
                      <div>
                        <h3 className="text-white text-base lg:text-xl font-semibold mb-3 lg:mb-5">
                          Features
                        </h3>
                        <div className="flex flex-wrap gap-1.5 lg:gap-2">
                          {gameDetails.categories.slice(0, 12).map((cat) => (
                            <span
                              key={cat.id}
                              className="text-[10px] lg:text-xs text-white/50 bg-white/[0.04] px-2 py-1 lg:px-3 lg:py-1.5 rounded border border-white/5 hover:text-white/70 hover:bg-white/[0.08] transition-all"
                            >
                              {cat.description}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Achievements */}
                  {gameDetails.achievements &&
                    gameDetails.achievements.total > 0 && (
                      <div>
                        <h3 className="text-white text-base lg:text-xl font-semibold mb-3 lg:mb-5 flex items-center gap-2">
                          <Trophy className="w-4 h-4 lg:w-5 lg:h-5 text-yellow-400" />
                          Achievements ({gameDetails.achievements.total})
                        </h3>
                        {gameDetails.achievements.highlighted?.length > 0 && (
                          <div className="flex flex-wrap gap-2 lg:gap-3">
                            {gameDetails.achievements.highlighted
                              .slice(0, 6)
                              .map((achievement, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-2 lg:gap-3 bg-white/5 px-2.5 py-2 lg:px-4 lg:py-3 rounded-lg lg:rounded-xl border border-white/10"
                                >
                                  <img
                                    src={achievement.path}
                                    alt={achievement.name}
                                    className="w-7 h-7 lg:w-10 lg:h-10 rounded-md lg:rounded-lg"
                                  />
                                  <span className="text-xs lg:text-sm text-white/80">
                                    {achievement.name}
                                  </span>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    )}

                  {/* System Requirements */}
                  {gameDetails.pcRequirements?.minimum && (
                    <div>
                      <h3 className="text-white text-base lg:text-xl font-semibold mb-3 lg:mb-5 flex items-center gap-2">
                        <Cpu className="w-4 h-4 lg:w-5 lg:h-5 text-blue-400" />
                        System Requirements
                      </h3>
                      <div className="bg-white/5 rounded-lg lg:rounded-xl p-3 lg:p-5 border border-white/10">
                        <div
                          className="text-white/70 text-xs lg:text-sm leading-relaxed [&_strong]:text-white [&_br]:mb-1"
                          dangerouslySetInnerHTML={{
                            __html: gameDetails.pcRequirements.minimum,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-4 lg:space-y-8">
                  {/* Info Card */}
                  <div className="bg-white/5 rounded-lg lg:rounded-xl p-4 lg:p-6 space-y-4 lg:space-y-5">
                    {gameDetails.developers?.length > 0 && (
                      <div className="flex items-start gap-3 lg:gap-4">
                        <Building2 className="w-4 h-4 lg:w-5 lg:h-5 text-white/40 mt-0.5" />
                        <div>
                          <p className="text-[10px] lg:text-xs text-white/40 uppercase tracking-wide mb-0.5 lg:mb-1">
                            Developer
                          </p>
                          <p className="text-white text-sm lg:text-base">
                            {gameDetails.developers.join(", ")}
                          </p>
                        </div>
                      </div>
                    )}

                    {gameDetails.publishers?.length > 0 && (
                      <div className="flex items-start gap-3 lg:gap-4">
                        <Globe className="w-4 h-4 lg:w-5 lg:h-5 text-white/40 mt-0.5" />
                        <div>
                          <p className="text-[10px] lg:text-xs text-white/40 uppercase tracking-wide mb-0.5 lg:mb-1">
                            Publisher
                          </p>
                          <p className="text-white text-sm lg:text-base">
                            {gameDetails.publishers.join(", ")}
                          </p>
                        </div>
                      </div>
                    )}

                    {gameDetails.releaseDate && (
                      <div className="flex items-start gap-3 lg:gap-4">
                        <Calendar className="w-4 h-4 lg:w-5 lg:h-5 text-white/40 mt-0.5" />
                        <div>
                          <p className="text-[10px] lg:text-xs text-white/40 uppercase tracking-wide mb-0.5 lg:mb-1">
                            Release Date
                          </p>
                          <p className="text-white text-sm lg:text-base">
                            {gameDetails.releaseDate.comingSoon
                              ? "Coming Soon"
                              : formatDate(gameDetails.releaseDate.date)}
                          </p>
                        </div>
                      </div>
                    )}

                    {gameDetails.recommendations > 0 && (
                      <div className="flex items-start gap-3 lg:gap-4">
                        <Users className="w-4 h-4 lg:w-5 lg:h-5 text-white/40 mt-0.5" />
                        <div>
                          <p className="text-[10px] lg:text-xs text-white/40 uppercase tracking-wide mb-0.5 lg:mb-1">
                            Recommendations
                          </p>
                          <p className="text-white text-sm lg:text-base">
                            {gameDetails.recommendations.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Platforms */}
                    <div className="flex items-start gap-3 lg:gap-4">
                      <Monitor className="w-4 h-4 lg:w-5 lg:h-5 text-white/40 mt-0.5" />
                      <div>
                        <p className="text-[10px] lg:text-xs text-white/40 uppercase tracking-wide mb-0.5 lg:mb-1">
                          Platforms
                        </p>
                        <div className="flex gap-1.5 lg:gap-2 flex-wrap">
                          {gameDetails.platforms?.windows && (
                            <span className="text-[10px] lg:text-xs bg-white/10 px-1.5 py-0.5 lg:px-2 lg:py-1 rounded text-white/70">
                              Windows
                            </span>
                          )}
                          {gameDetails.platforms?.mac && (
                            <span className="text-[10px] lg:text-xs bg-white/10 px-1.5 py-0.5 lg:px-2 lg:py-1 rounded text-white/70">
                              Mac
                            </span>
                          )}
                          {gameDetails.platforms?.linux && (
                            <span className="text-[10px] lg:text-xs bg-white/10 px-1.5 py-0.5 lg:px-2 lg:py-1 rounded text-white/70">
                              Linux
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <a
                    href={gameDetails.storeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#1b2838] to-[#2a475e] hover:from-[#2a475e] hover:to-[#3d6a8a] text-white py-2.5 lg:py-3 rounded-lg transition-all border border-[#3d6a8a] text-sm lg:text-base"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>View on Steam</span>
                  </a>

                  {gameDetails.website && (
                    <a
                      href={gameDetails.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-white/10 hover:bg-white/15 text-white py-2.5 lg:py-3 rounded-lg transition-colors text-sm lg:text-base"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Official Website</span>
                    </a>
                  )}

                  {gameDetails.metacritic?.url && (
                    <a
                      href={gameDetails.metacritic.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-white/10 hover:bg-white/15 text-white py-2.5 lg:py-3 rounded-lg transition-colors text-sm lg:text-base"
                    >
                      <Star className="w-4 h-4" />
                      <span>View on Metacritic</span>
                    </a>
                  )}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
