"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
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
} from "lucide-react";

export default function GameDetailPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [gameDetails, setGameDetails] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [currentScreenshot, setCurrentScreenshot] = useState(0);
  const [loading, setLoading] = useState(true);

  const gameId = resolvedParams.slug;

  useEffect(() => {
    if (gameId) {
      fetchGameDetails();
      fetchScreenshots();
    }
  }, [gameId]);

  const fetchGameDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/rawg/games/${gameId}`);
      const data = await response.json();
      setGameDetails(data);
    } catch (error) {
      console.error("Error fetching game details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchScreenshots = async () => {
    try {
      const response = await fetch(`/api/rawg/games/${gameId}/screenshots`);
      const data = await response.json();
      setScreenshots(data.results || []);
    } catch (error) {
      console.error("Error fetching screenshots:", error);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "TBA";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return "text-emerald-400";
    if (rating >= 3) return "text-yellow-400";
    if (rating >= 2) return "text-orange-400";
    return "text-red-400";
  };

  const getMetacriticColor = (score) => {
    if (score >= 75)
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    if (score >= 50)
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    return "bg-red-500/20 text-red-400 border-red-500/30";
  };

  const nextScreenshot = () => {
    setCurrentScreenshot((prev) =>
      prev === screenshots.length - 1 ? 0 : prev + 1
    );
  };

  const prevScreenshot = () => {
    setCurrentScreenshot((prev) =>
      prev === 0 ? screenshots.length - 1 : prev - 1
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
          <p className="text-white/60 text-sm">Loading game...</p>
        </div>
      </div>
    );
  }

  if (!gameDetails) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-lg mb-4">Game not found</p>
          <button
            onClick={handleBack}
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative">
      {/* Full Screen Background Image */}
      <div className="fixed inset-0 z-0">
        <img
          src={gameDetails.background_image || "/placeholder-game.jpg"}
          alt={gameDetails.name}
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-[#0a0a0a]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/60" />
        {/* Extra fade to black at bottom for content area */}
        <div className="absolute bottom-0 left-0 right-0 h-[60%] bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a] to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-8">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 sm:mb-10 lg:mb-12 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Games</span>
          </button>

          {/* Hero Section */}
          <div className="mb-10 sm:mb-12 lg:mb-16">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 sm:mb-6 lg:mb-8 leading-tight">
              {gameDetails.name}
            </h1>

            {/* Quick Stats */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 lg:gap-4 mb-6 sm:mb-8 lg:mb-10">
              {gameDetails.rating > 0 && (
                <div className="flex items-center gap-1.5 lg:gap-2 bg-white/5 px-3 py-2 lg:px-5 lg:py-3 rounded-xl lg:rounded-2xl border border-white/10">
                  <Star
                    className={`w-4 h-4 lg:w-6 lg:h-6 ${getRatingColor(
                      gameDetails.rating
                    )} fill-current`}
                  />
                  <span
                    className={`font-bold text-sm lg:text-xl ${getRatingColor(
                      gameDetails.rating
                    )}`}
                  >
                    {gameDetails.rating.toFixed(1)}
                  </span>
                  <span className="text-white/40 text-xs lg:text-sm">/ 5</span>
                </div>
              )}

              {gameDetails.metacritic && (
                <div
                  className={`px-3 py-2 lg:px-5 lg:py-3 rounded-xl lg:rounded-2xl border ${getMetacriticColor(
                    gameDetails.metacritic
                  )}`}
                >
                  <span className="font-bold text-sm lg:text-xl">
                    {gameDetails.metacritic}
                  </span>
                  <span className="text-white/40 text-xs lg:text-sm ml-1 lg:ml-2">
                    Metacritic
                  </span>
                </div>
              )}

              {gameDetails.playtime > 0 && (
                <div className="flex items-center gap-1.5 lg:gap-2 bg-white/5 px-3 py-2 lg:px-5 lg:py-3 rounded-xl lg:rounded-2xl border border-white/10 text-white/80">
                  <Clock className="w-4 h-4 lg:w-5 lg:h-5" />
                  <span className="font-medium text-xs lg:text-base">
                    {gameDetails.playtime}h{" "}
                    <span className="hidden sm:inline">avg playtime</span>
                  </span>
                </div>
              )}

              {gameDetails.released && (
                <div className="flex items-center gap-1.5 lg:gap-2 bg-white/5 px-3 py-2 lg:px-5 lg:py-3 rounded-xl lg:rounded-2xl border border-white/10 text-white/80">
                  <Calendar className="w-4 h-4 lg:w-5 lg:h-5" />
                  <span className="font-medium text-xs lg:text-base">
                    {formatDate(gameDetails.released)}
                  </span>
                </div>
              )}
            </div>

            {/* Genres */}
            {gameDetails.genres && gameDetails.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 lg:gap-3 mb-6 lg:mb-10">
                {gameDetails.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="text-sm text-purple-300 bg-purple-500/15 px-4 py-2 lg:px-5 lg:py-2.5 rounded-full border border-purple-500/25 font-medium"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            {gameDetails.description_raw && (
              <p className="text-white/70 text-sm lg:text-lg leading-relaxed max-w-3xl">
                {gameDetails.description_raw.slice(0, 600)}
                {gameDetails.description_raw.length > 600 && "..."}
              </p>
            )}
          </div>

          {/* Screenshots Gallery */}
          {screenshots.length > 0 && (
            <div className="mb-10 sm:mb-12 lg:mb-16">
              <h3 className="text-white font-semibold text-lg lg:text-xl mb-5 lg:mb-6 flex items-center gap-3">
                <Palette className="w-5 h-5 lg:w-6 lg:h-6 text-purple-400" />
                Screenshots
              </h3>
              <div className="relative group">
                <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden bg-black/20 border border-white/5">
                  <img
                    src={screenshots[currentScreenshot]?.image}
                    alt={`Screenshot ${currentScreenshot + 1}`}
                    className="w-full h-[220px] sm:h-[300px] lg:h-[450px] xl:h-[500px] object-cover"
                  />

                  {screenshots.length > 1 && (
                    <>
                      <button
                        onClick={prevScreenshot}
                        className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 lg:p-3 rounded-full text-white/70 hover:text-white hover:bg-black/70 transition-all border border-white/10 opacity-0 group-hover:opacity-100"
                      >
                        <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6" />
                      </button>
                      <button
                        onClick={nextScreenshot}
                        className="absolute right-3 lg:right-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 lg:p-3 rounded-full text-white/70 hover:text-white hover:bg-black/70 transition-all border border-white/10 opacity-0 group-hover:opacity-100"
                      >
                        <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6" />
                      </button>

                      {/* Dot indicators */}
                      <div className="absolute bottom-3 lg:bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {screenshots.slice(0, 10).map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentScreenshot(idx)}
                            className={`h-2 rounded-full transition-all ${
                              idx === currentScreenshot
                                ? "bg-purple-400 w-6 lg:w-8"
                                : "bg-white/30 w-2 hover:bg-white/50"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Thumbnail Strip */}
                {screenshots.length > 1 && (
                  <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {screenshots.slice(0, 8).map((screenshot, idx) => (
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
                          src={screenshot.image}
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-20 h-12 lg:w-24 lg:h-14 object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Game Details Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-8 lg:space-y-10">
              {/* Ratings */}
              {gameDetails.ratings && gameDetails.ratings.length > 0 && (
                <div>
                  <h3 className="text-white text-lg lg:text-xl font-semibold mb-4 lg:mb-5">
                    Ratings
                  </h3>
                  <div className="space-y-4">
                    {gameDetails.ratings.map((rating) => {
                      const colors = {
                        exceptional: "bg-emerald-500",
                        recommended: "bg-blue-500",
                        meh: "bg-yellow-500",
                        skip: "bg-red-500",
                      };
                      const barColor = colors[rating.title] || "bg-white/50";

                      return (
                        <div key={rating.id}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white/80 capitalize text-sm lg:text-base">
                              {rating.title}
                            </span>
                            <span className="text-white/60 text-sm lg:text-base">
                              {rating.percent.toFixed(0)}%
                            </span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${barColor}`}
                              style={{ width: `${rating.percent}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Platforms */}
              {gameDetails.platforms && gameDetails.platforms.length > 0 && (
                <div>
                  <h3 className="text-white text-lg lg:text-xl font-semibold mb-4 lg:mb-5">
                    Platforms
                  </h3>
                  <div className="flex flex-wrap gap-2 lg:gap-3">
                    {gameDetails.platforms.map((p) => (
                      <span
                        key={p.platform.id}
                        className="text-sm text-white/70 bg-white/5 px-3 py-2 lg:px-4 lg:py-2 rounded-lg"
                      >
                        {p.platform.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {gameDetails.tags && gameDetails.tags.length > 0 && (
                <div>
                  <h3 className="text-white text-lg lg:text-xl font-semibold mb-4 lg:mb-5">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-1.5 lg:gap-2">
                    {gameDetails.tags.slice(0, 15).map((tag) => (
                      <span
                        key={tag.id}
                        className="text-xs lg:text-sm text-white/50 bg-white/5 px-2.5 py-1.5 lg:px-3 lg:py-1.5 rounded-lg"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6 lg:space-y-8">
              {/* Info Card */}
              <div className="bg-white/5 rounded-xl p-5 lg:p-6 space-y-4 lg:space-y-5">
                {gameDetails.developers &&
                  gameDetails.developers.length > 0 && (
                    <div className="flex items-start gap-3 lg:gap-4">
                      <Building2 className="w-5 h-5 text-white/40 mt-0.5" />
                      <div>
                        <p className="text-xs text-white/40 uppercase tracking-wide mb-1">
                          Developer
                        </p>
                        <p className="text-white text-sm lg:text-base">
                          {gameDetails.developers.map((d) => d.name).join(", ")}
                        </p>
                      </div>
                    </div>
                  )}

                {gameDetails.publishers &&
                  gameDetails.publishers.length > 0 && (
                    <div className="flex items-start gap-3 lg:gap-4">
                      <Globe className="w-5 h-5 text-white/40 mt-0.5" />
                      <div>
                        <p className="text-xs text-white/40 uppercase tracking-wide mb-1">
                          Publisher
                        </p>
                        <p className="text-white text-sm lg:text-base">
                          {gameDetails.publishers.map((p) => p.name).join(", ")}
                        </p>
                      </div>
                    </div>
                  )}

                {gameDetails.released && (
                  <div className="flex items-start gap-3 lg:gap-4">
                    <Calendar className="w-5 h-5 text-white/40 mt-0.5" />
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-wide mb-1">
                        Release Date
                      </p>
                      <p className="text-white text-sm lg:text-base">
                        {formatDate(gameDetails.released)}
                      </p>
                    </div>
                  </div>
                )}

                {gameDetails.added > 0 && (
                  <div className="flex items-start gap-3 lg:gap-4">
                    <Users className="w-5 h-5 text-white/40 mt-0.5" />
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-wide mb-1">
                        Added by
                      </p>
                      <p className="text-white text-sm lg:text-base">
                        {gameDetails.added.toLocaleString()} players
                      </p>
                    </div>
                  </div>
                )}

                {gameDetails.achievements_count > 0 && (
                  <div className="flex items-start gap-3 lg:gap-4">
                    <Trophy className="w-5 h-5 text-white/40 mt-0.5" />
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-wide mb-1">
                        Achievements
                      </p>
                      <p className="text-white text-sm lg:text-base">
                        {gameDetails.achievements_count}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Website Button */}
              {gameDetails.website && (
                <a
                  href={gameDetails.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-white/10 hover:bg-white/15 text-white py-3 rounded-lg transition-colors text-sm lg:text-base"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Official Website</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
