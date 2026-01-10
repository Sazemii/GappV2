"use client";

import { useState, useEffect } from "react";
import {
  X,
  Star,
  Calendar,
  Users,
  Monitor,
  Tag,
  ExternalLink,
  Clock,
  Gamepad2,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Building2,
  Palette,
  Globe,
  TrendingUp,
  Heart,
  Sparkles,
} from "lucide-react";

export default function GameDetail({ game, onClose }) {
  const [gameDetails, setGameDetails] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [currentScreenshot, setCurrentScreenshot] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (game) {
      fetchGameDetails();
      fetchScreenshots();
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [game]);

  const fetchGameDetails = async () => {
    try {
      const response = await fetch(`/api/rawg/games/${game.id}`);
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
      const response = await fetch(`/api/rawg/games/${game.id}/screenshots`);
      const data = await response.json();
      setScreenshots(data.results || []);
    } catch (error) {
      console.error("Error fetching screenshots:", error);
    }
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

  const details = gameDetails || game;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-[#0f0f0f] rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl border border-[#2a2a2a]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-sm p-2 rounded-full text-white/70 hover:text-white hover:bg-black/80 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto max-h-[90vh] custom-scrollbar">
          {/* Hero Section */}
          <div className="relative h-72 md:h-96">
            {/* Background Image */}
            <img
              src={details.background_image || "/placeholder-game.jpg"}
              alt={details.name}
              className="w-full h-full object-cover"
            />
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f0f]/80 via-transparent to-[#0f0f0f]/80" />

            {/* Title and Quick Info */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-3 drop-shadow-lg">
                {details.name}
              </h1>

              <div className="flex flex-wrap items-center gap-3">
                {/* Rating */}
                {details.rating > 0 && (
                  <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                    <Star
                      className={`w-4 h-4 ${getRatingColor(
                        details.rating
                      )} fill-current`}
                    />
                    <span
                      className={`font-semibold ${getRatingColor(
                        details.rating
                      )}`}
                    >
                      {details.rating.toFixed(1)}
                    </span>
                    <span className="text-white/50 text-sm">/ 5</span>
                  </div>
                )}

                {/* Metacritic */}
                {details.metacritic && (
                  <div
                    className={`px-3 py-1.5 rounded-lg border ${getMetacriticColor(
                      details.metacritic
                    )}`}
                  >
                    <span className="font-semibold text-sm">
                      {details.metacritic}
                    </span>
                    <span className="text-white/50 text-xs ml-1">
                      Metacritic
                    </span>
                  </div>
                )}

                {/* Playtime */}
                {details.playtime > 0 && (
                  <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-lg text-white/70">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{details.playtime}h avg</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 space-y-8">
            {/* Screenshots Gallery */}
            {screenshots.length > 0 && (
              <div className="relative">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                    <Palette className="w-4 h-4 text-purple-400" />
                  </div>
                  <span>Screenshots</span>
                  <span className="text-xs text-white/40 font-normal ml-auto">
                    {currentScreenshot + 1} / {screenshots.length}
                  </span>
                </h3>
                <div className="relative group rounded-xl overflow-hidden border border-white/10">
                  <img
                    src={screenshots[currentScreenshot]?.image}
                    alt={`Screenshot ${currentScreenshot + 1}`}
                    className="w-full h-48 md:h-72 object-cover transition-transform duration-300"
                  />
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {screenshots.length > 1 && (
                    <>
                      <button
                        onClick={prevScreenshot}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-sm p-2 rounded-full text-white/70 hover:text-white hover:bg-white/20 hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextScreenshot}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-sm p-2 rounded-full text-white/70 hover:text-white hover:bg-white/20 hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        {screenshots.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentScreenshot(idx)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              idx === currentScreenshot
                                ? "bg-gradient-to-r from-purple-400 to-pink-400 w-6 shadow-md shadow-purple-500/50"
                                : "bg-white/40 w-1.5 hover:bg-white/60"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Thumbnail Strip */}
                {screenshots.length > 1 && (
                  <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                    {screenshots.slice(0, 6).map((screenshot, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentScreenshot(idx)}
                        className={`relative flex-shrink-0 rounded-md overflow-hidden transition-all duration-200 ${
                          idx === currentScreenshot
                            ? "ring-2 ring-purple-400 ring-offset-1 ring-offset-[#0f0f0f] scale-105"
                            : "opacity-50 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={screenshot.image}
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-16 h-10 object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Stats Cards Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {details.rating > 0 && (
                <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-4 border border-white/10 hover:border-yellow-500/30 transition-all">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <Star
                      className={`w-4 h-4 mb-2 ${getRatingColor(
                        details.rating
                      )} fill-current`}
                    />
                    <div className="flex items-baseline gap-0.5">
                      <span
                        className={`text-xl font-bold ${getRatingColor(
                          details.rating
                        )}`}
                      >
                        {details.rating.toFixed(1)}
                      </span>
                      <span className="text-white/40 text-xs">/5</span>
                    </div>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">
                      Rating
                    </p>
                  </div>
                </div>
              )}

              {details.metacritic && (
                <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-4 border border-white/10 hover:border-emerald-500/30 transition-all">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <TrendingUp className="w-4 h-4 mb-2 text-emerald-400" />
                    <span
                      className={`text-xl font-bold ${
                        details.metacritic >= 75
                          ? "text-emerald-400"
                          : details.metacritic >= 50
                          ? "text-yellow-400"
                          : "text-red-400"
                      }`}
                    >
                      {details.metacritic}
                    </span>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">
                      Metacritic
                    </p>
                  </div>
                </div>
              )}

              {details.playtime > 0 && (
                <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-4 border border-white/10 hover:border-blue-500/30 transition-all">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <Clock className="w-4 h-4 mb-2 text-blue-400" />
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-xl font-bold text-blue-400">
                        {details.playtime}
                      </span>
                      <span className="text-white/40 text-xs">hrs</span>
                    </div>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">
                      Playtime
                    </p>
                  </div>
                </div>
              )}

              {details.added > 0 && (
                <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-4 border border-white/10 hover:border-pink-500/30 transition-all">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <Heart className="w-4 h-4 mb-2 text-pink-400" />
                    <span className="text-xl font-bold text-pink-400">
                      {details.added >= 1000000
                        ? (details.added / 1000000).toFixed(1) + "M"
                        : details.added >= 1000
                        ? (details.added / 1000).toFixed(0) + "K"
                        : details.added.toLocaleString()}
                    </span>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">
                      Players
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-5">
                {/* Description */}
                {gameDetails?.description_raw && (
                  <div className="rounded-xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-5 border border-white/10">
                    <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <Tag className="w-4 h-4 text-purple-400" />
                      About
                    </h3>
                    <p className="text-white/50 text-sm leading-relaxed line-clamp-6">
                      {gameDetails.description_raw}
                    </p>
                  </div>
                )}

                {/* Developer & Publisher */}
                <div className="space-y-3">
                  {gameDetails?.developers &&
                    gameDetails.developers.length > 0 && (
                      <div className="group flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 hover:border-purple-500/30 transition-all">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                          <Building2 className="w-4 h-4 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-[10px] text-white/40 uppercase tracking-wide">
                            Developer
                          </p>
                          <p className="text-white text-sm font-medium">
                            {gameDetails.developers
                              .map((d) => d.name)
                              .join(", ")}
                          </p>
                        </div>
                      </div>
                    )}

                  {gameDetails?.publishers &&
                    gameDetails.publishers.length > 0 && (
                      <div className="group flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 hover:border-blue-500/30 transition-all">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
                          <Globe className="w-4 h-4 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-[10px] text-white/40 uppercase tracking-wide">
                            Publisher
                          </p>
                          <p className="text-white text-sm font-medium">
                            {gameDetails.publishers
                              .map((p) => p.name)
                              .join(", ")}
                          </p>
                        </div>
                      </div>
                    )}
                </div>

                {/* Genres */}
                {details.genres && details.genres.length > 0 && (
                  <div>
                    <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <Gamepad2 className="w-4 h-4 text-purple-400" />
                      Genres
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {details.genres.map((genre) => (
                        <span
                          key={genre.id}
                          className="text-xs text-purple-300/90 bg-purple-500/15 px-3 py-1.5 rounded-full border border-purple-500/20 hover:bg-purple-500/25 transition-colors"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-5">
                {/* Quick Details Card */}
                <div className="rounded-xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-5 border border-white/10 space-y-4">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    Details
                  </h3>

                  {/* Release Date */}
                  <div className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
                    <Calendar className="w-4 h-4 text-purple-400" />
                    <div>
                      <p className="text-[10px] text-white/40 uppercase tracking-wide">
                        Release Date
                      </p>
                      <p className="text-white text-sm">
                        {formatDate(details.released)}
                      </p>
                    </div>
                  </div>

                  {/* Achievements */}
                  {gameDetails?.achievements_count > 0 && (
                    <div className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
                      <Trophy className="w-4 h-4 text-yellow-400" />
                      <div>
                        <p className="text-[10px] text-white/40 uppercase tracking-wide">
                          Achievements
                        </p>
                        <p className="text-white text-sm">
                          {gameDetails.achievements_count}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Platforms */}
                {details.platforms && details.platforms.length > 0 && (
                  <div>
                    <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-blue-400" />
                      Platforms
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {details.platforms.map((p) => (
                        <span
                          key={p.platform.id}
                          className="text-xs text-white/60 bg-white/[0.05] px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all"
                        >
                          {p.platform.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Website Link */}
                {gameDetails?.website && (
                  <a
                    href={gameDetails.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 text-purple-300 px-4 py-3 rounded-xl transition-all border border-purple-500/20 hover:border-purple-500/40 group"
                  >
                    <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">
                      Visit Official Website
                    </span>
                  </a>
                )}

                {/* Tags */}
                {gameDetails?.tags && gameDetails.tags.length > 0 && (
                  <div>
                    <h3 className="text-white font-semibold mb-3">
                      Popular Tags
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {gameDetails.tags.slice(0, 10).map((tag) => (
                        <span
                          key={tag.id}
                          className="text-[10px] text-white/40 bg-white/[0.04] px-2 py-1 rounded border border-white/5 hover:text-white/60 hover:bg-white/[0.08] transition-all"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Rating Breakdown */}
            {gameDetails?.ratings && gameDetails.ratings.length > 0 && (
              <div className="rounded-xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-5 border border-white/10">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  Community Ratings
                </h3>
                <div className="space-y-3">
                  {gameDetails.ratings.map((rating) => {
                    const colors = {
                      exceptional: {
                        bg: "from-emerald-500",
                        text: "text-emerald-400",
                      },
                      recommended: {
                        bg: "from-blue-500",
                        text: "text-blue-400",
                      },
                      meh: { bg: "from-yellow-500", text: "text-yellow-400" },
                      skip: { bg: "from-red-500", text: "text-red-400" },
                    };
                    const color = colors[rating.title] || {
                      bg: "from-purple-500",
                      text: "text-purple-400",
                    };

                    return (
                      <div key={rating.id}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white/70 capitalize text-sm">
                            {rating.title}
                          </span>
                          <span className={`${color.text} font-bold text-sm`}>
                            {rating.percent.toFixed(0)}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${color.bg} to-transparent`}
                            style={{ width: `${rating.percent}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-white/30 mt-0.5">
                          {rating.count.toLocaleString()} votes
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
