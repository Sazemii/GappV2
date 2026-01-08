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
  Palette,
  Loader2,
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
    <div className="min-h-screen bg-[#111111] relative">
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
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-8">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-12 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Games</span>
          </button>

          {/* Hero Section */}
          <div className="mb-16">
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight">
              {gameDetails.name}
            </h1>

            {/* Quick Stats */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              {gameDetails.rating > 0 && (
                <div className="flex items-center gap-2 bg-white/5 px-5 py-3 rounded-2xl border border-white/10">
                  <Star
                    className={`w-6 h-6 ${getRatingColor(
                      gameDetails.rating
                    )} fill-current`}
                  />
                  <span
                    className={`font-bold text-xl ${getRatingColor(
                      gameDetails.rating
                    )}`}
                  >
                    {gameDetails.rating.toFixed(1)}
                  </span>
                  <span className="text-white/40 text-sm">/ 5</span>
                </div>
              )}

              {gameDetails.metacritic && (
                <div
                  className={`px-5 py-3 rounded-2xl border backdrop-blur-md ${getMetacriticColor(
                    gameDetails.metacritic
                  )}`}
                >
                  <span className="font-bold text-xl">
                    {gameDetails.metacritic}
                  </span>
                  <span className="text-white/40 text-sm ml-2">Metacritic</span>
                </div>
              )}

              {gameDetails.playtime > 0 && (
                <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 text-white/80">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">
                    {gameDetails.playtime}h avg playtime
                  </span>
                </div>
              )}

              {gameDetails.released && (
                <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 text-white/80">
                  <Calendar className="w-5 h-5" />
                  <span className="font-medium">
                    {formatDate(gameDetails.released)}
                  </span>
                </div>
              )}
            </div>

            {/* Genres */}
            {gameDetails.genres && gameDetails.genres.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-10">
                {gameDetails.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="text-sm text-purple-300 bg-purple-500/15 backdrop-blur-md px-5 py-2.5 rounded-full border border-purple-500/25 font-medium"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            {gameDetails.description_raw && (
              <p className="text-white/70 text-lg leading-relaxed max-w-3xl">
                {gameDetails.description_raw.slice(0, 600)}
                {gameDetails.description_raw.length > 600 && "..."}
              </p>
            )}
          </div>

          {/* Screenshots Gallery */}
          {screenshots.length > 0 && (
            <div className="mb-16">
              <h3 className="text-white font-semibold text-xl mb-6 flex items-center gap-3">
                <Palette className="w-6 h-6 text-purple-400" />
                Screenshots
              </h3>
              <div className="relative rounded-3xl overflow-hidden bg-black/20 backdrop-blur-sm border border-white/5">
                <img
                  src={screenshots[currentScreenshot]?.image}
                  alt={`Screenshot ${currentScreenshot + 1}`}
                  className="w-full h-[300px] lg:h-[500px] object-cover"
                />
                {screenshots.length > 1 && (
                  <>
                    <button
                      onClick={prevScreenshot}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-md p-3 rounded-full text-white/70 hover:text-white hover:bg-black/70 transition-all border border-white/10"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextScreenshot}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-md p-3 rounded-full text-white/70 hover:text-white hover:bg-black/70 transition-all border border-white/10"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {screenshots.slice(0, 10).map((_, idx) => (
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
            </div>
          )}

          {/* Info Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Details Card */}
            <div className="bg-white/5 rounded-3xl p-8 space-y-6 border border-white/10">
              <h3 className="text-white font-semibold text-xl">Game Details</h3>

              {gameDetails.developers && gameDetails.developers.length > 0 && (
                <div className="flex items-center gap-4">
                  <div className="bg-purple-500/15 p-3 rounded-xl">
                    <Building2 className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wider mb-1">
                      Developer
                    </p>
                    <p className="text-white font-medium">
                      {gameDetails.developers.map((d) => d.name).join(", ")}
                    </p>
                  </div>
                </div>
              )}

              {gameDetails.publishers && gameDetails.publishers.length > 0 && (
                <div className="flex items-center gap-4">
                  <div className="bg-purple-500/15 p-3 rounded-xl">
                    <Building2 className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wider mb-1">
                      Publisher
                    </p>
                    <p className="text-white font-medium">
                      {gameDetails.publishers.map((p) => p.name).join(", ")}
                    </p>
                  </div>
                </div>
              )}

              {gameDetails.added > 0 && (
                <div className="flex items-center gap-4">
                  <div className="bg-purple-500/15 p-3 rounded-xl">
                    <Users className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wider mb-1">
                      Added by
                    </p>
                    <p className="text-white font-medium">
                      {gameDetails.added.toLocaleString()} users
                    </p>
                  </div>
                </div>
              )}

              {gameDetails.achievements_count > 0 && (
                <div className="flex items-center gap-4">
                  <div className="bg-purple-500/15 p-3 rounded-xl">
                    <Trophy className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wider mb-1">
                      Achievements
                    </p>
                    <p className="text-white font-medium">
                      {gameDetails.achievements_count}
                    </p>
                  </div>
                </div>
              )}

              {gameDetails.website && (
                <a
                  href={gameDetails.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 px-6 py-4 rounded-2xl transition-colors border border-purple-500/25 mt-4"
                >
                  <ExternalLink className="w-5 h-5" />
                  <span className="font-medium">Visit Official Website</span>
                </a>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Platforms */}
              {gameDetails.platforms && gameDetails.platforms.length > 0 && (
                <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
                  <h3 className="text-white font-semibold text-xl mb-6 flex items-center gap-3">
                    <Monitor className="w-6 h-6 text-purple-400" />
                    Available On
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {gameDetails.platforms.map((p) => (
                      <span
                        key={p.platform.id}
                        className="text-sm text-white/80 bg-white/5 px-5 py-2.5 rounded-xl border border-white/10"
                      >
                        {p.platform.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {gameDetails.tags && gameDetails.tags.length > 0 && (
                <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
                  <h3 className="text-white font-semibold text-xl mb-6">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {gameDetails.tags.slice(0, 15).map((tag) => (
                      <span
                        key={tag.id}
                        className="text-xs text-white/50 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Rating Breakdown */}
              {gameDetails.ratings && gameDetails.ratings.length > 0 && (
                <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
                  <h3 className="text-white font-semibold text-xl mb-6 flex items-center gap-3">
                    <Star className="w-6 h-6 text-purple-400" />
                    Ratings
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {gameDetails.ratings.map((rating) => (
                      <div
                        key={rating.id}
                        className="bg-white/5 rounded-2xl p-5 text-center border border-white/5"
                      >
                        <p className="text-2xl font-bold text-white mb-1">
                          {rating.percent.toFixed(0)}%
                        </p>
                        <p className="text-sm text-white/50 capitalize">
                          {rating.title}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
