"use client";

import { Star, Users, Calendar } from "lucide-react";

export default function GameCard({ game, onClick }) {
  const formatDate = (dateString) => {
    if (!dateString) return "TBA";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getPlatformIcons = (platforms) => {
    if (!platforms) return [];
    const platformNames = platforms.map((p) => p.platform.slug);
    const icons = [];
    
    if (platformNames.some((p) => p.includes("pc"))) icons.push("PC");
    if (platformNames.some((p) => p.includes("playstation"))) icons.push("PS");
    if (platformNames.some((p) => p.includes("xbox"))) icons.push("XB");
    if (platformNames.some((p) => p.includes("nintendo") || p.includes("switch"))) icons.push("NS");
    
    return icons;
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return "text-emerald-400";
    if (rating >= 3) return "text-yellow-400";
    if (rating >= 2) return "text-orange-400";
    return "text-red-400";
  };

  return (
    <div
      onClick={() => onClick(game)}
      className="group relative bg-[#1a1a1a] rounded-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/10 border border-[#2a2a2a] hover:border-purple-500/30"
    >
      {/* Game Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={game.background_image || "/placeholder-game.jpg"}
          alt={game.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent" />
        
        {/* Platform Tags */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          {getPlatformIcons(game.platforms).map((platform) => (
            <span
              key={platform}
              className="bg-black/60 backdrop-blur-sm text-[10px] text-white/90 px-2 py-0.5 rounded font-medium"
            >
              {platform}
            </span>
          ))}
        </div>

        {/* Rating Badge */}
        {game.rating > 0 && (
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
            <Star className={`w-3.5 h-3.5 ${getRatingColor(game.rating)} fill-current`} />
            <span className={`text-xs font-semibold ${getRatingColor(game.rating)}`}>
              {game.rating.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {/* Game Info */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className="font-semibold text-white text-sm leading-tight line-clamp-2 group-hover:text-purple-300 transition-colors">
          {game.name}
        </h3>

        {/* Genres */}
        {game.genres && game.genres.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {game.genres.slice(0, 3).map((genre) => (
              <span
                key={genre.id}
                className="text-[10px] text-purple-300/80 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20"
              >
                {genre.name}
              </span>
            ))}
          </div>
        )}

        {/* Meta Info */}
        <div className="flex items-center justify-between text-[11px] text-[#888] pt-1">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(game.released)}</span>
          </div>
          {game.added > 0 && (
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{game.added.toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-t from-purple-500/5 to-transparent" />
    </div>
  );
}

