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
    if (score >= 75) return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    if (score >= 50) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
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
                    <Star className={`w-4 h-4 ${getRatingColor(details.rating)} fill-current`} />
                    <span className={`font-semibold ${getRatingColor(details.rating)}`}>
                      {details.rating.toFixed(1)}
                    </span>
                    <span className="text-white/50 text-sm">/ 5</span>
                  </div>
                )}

                {/* Metacritic */}
                {details.metacritic && (
                  <div className={`px-3 py-1.5 rounded-lg border ${getMetacriticColor(details.metacritic)}`}>
                    <span className="font-semibold text-sm">{details.metacritic}</span>
                    <span className="text-white/50 text-xs ml-1">Metacritic</span>
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
                  <Palette className="w-4 h-4 text-purple-400" />
                  Screenshots
                </h3>
                <div className="relative rounded-xl overflow-hidden">
                  <img
                    src={screenshots[currentScreenshot]?.image}
                    alt={`Screenshot ${currentScreenshot + 1}`}
                    className="w-full h-48 md:h-72 object-cover"
                  />
                  {screenshots.length > 1 && (
                    <>
                      <button
                        onClick={prevScreenshot}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 p-2 rounded-full text-white/70 hover:text-white hover:bg-black/80 transition-all"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextScreenshot}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 p-2 rounded-full text-white/70 hover:text-white hover:bg-black/80 transition-all"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {screenshots.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentScreenshot(idx)}
                            className={`w-2 h-2 rounded-full transition-all ${
                              idx === currentScreenshot
                                ? "bg-purple-400 w-6"
                                : "bg-white/40 hover:bg-white/60"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Description */}
                {gameDetails?.description_raw && (
                  <div>
                    <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <Tag className="w-4 h-4 text-purple-400" />
                      About
                    </h3>
                    <p className="text-[#888] text-sm leading-relaxed line-clamp-6">
                      {gameDetails.description_raw}
                    </p>
                  </div>
                )}

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
                          className="text-xs text-purple-300/90 bg-purple-500/15 px-3 py-1.5 rounded-lg border border-purple-500/20"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {gameDetails?.tags && gameDetails.tags.length > 0 && (
                  <div>
                    <h3 className="text-white font-semibold mb-3">Popular Tags</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {gameDetails.tags.slice(0, 8).map((tag) => (
                        <span
                          key={tag.id}
                          className="text-[10px] text-[#888] bg-[#1f1f1f] px-2 py-1 rounded border border-[#2a2a2a]"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Details Card */}
                <div className="bg-[#1a1a1a] rounded-xl p-4 space-y-4 border border-[#2a2a2a]">
                  {/* Release Date */}
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-500/10 p-2 rounded-lg">
                      <Calendar className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-[#666] uppercase tracking-wide">Release Date</p>
                      <p className="text-white text-sm">{formatDate(details.released)}</p>
                    </div>
                  </div>

                  {/* Added by Users */}
                  {details.added > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-500/10 p-2 rounded-lg">
                        <Users className="w-4 h-4 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-[10px] text-[#666] uppercase tracking-wide">Added by</p>
                        <p className="text-white text-sm">{details.added.toLocaleString()} users</p>
                      </div>
                    </div>
                  )}

                  {/* Developers */}
                  {gameDetails?.developers && gameDetails.developers.length > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-500/10 p-2 rounded-lg">
                        <Building2 className="w-4 h-4 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-[10px] text-[#666] uppercase tracking-wide">Developer</p>
                        <p className="text-white text-sm">
                          {gameDetails.developers.map((d) => d.name).join(", ")}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Achievements */}
                  {gameDetails?.achievements_count > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-500/10 p-2 rounded-lg">
                        <Trophy className="w-4 h-4 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-[10px] text-[#666] uppercase tracking-wide">Achievements</p>
                        <p className="text-white text-sm">{gameDetails.achievements_count}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Platforms */}
                {details.platforms && details.platforms.length > 0 && (
                  <div>
                    <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-purple-400" />
                      Platforms
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {details.platforms.map((p) => (
                        <span
                          key={p.platform.id}
                          className="text-xs text-white/70 bg-[#1f1f1f] px-3 py-1.5 rounded-lg border border-[#2a2a2a]"
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
                    className="inline-flex items-center gap-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 px-4 py-2.5 rounded-xl transition-colors border border-purple-500/20"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="text-sm font-medium">Visit Website</span>
                  </a>
                )}
              </div>
            </div>

            {/* Rating Breakdown */}
            {gameDetails?.ratings && gameDetails.ratings.length > 0 && (
              <div>
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Star className="w-4 h-4 text-purple-400" />
                  Rating Breakdown
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {gameDetails.ratings.map((rating) => (
                    <div
                      key={rating.id}
                      className="bg-[#1a1a1a] rounded-xl p-4 border border-[#2a2a2a] text-center"
                    >
                      <p className="text-lg font-bold text-white mb-1">
                        {rating.percent.toFixed(0)}%
                      </p>
                      <p className="text-[11px] text-[#888] capitalize">{rating.title}</p>
                      <p className="text-[10px] text-[#555] mt-1">{rating.count} votes</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

