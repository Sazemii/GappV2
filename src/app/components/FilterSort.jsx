"use client";

import { useState } from "react";
import {
  SlidersHorizontal,
  ArrowUpDown,
  Gamepad2,
  Calendar,
  Star,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";

const genres = [
  { id: 4, name: "Action" },
  { id: 51, name: "Indie" },
  { id: 3, name: "Adventure" },
  { id: 5, name: "RPG" },
  { id: 10, name: "Strategy" },
  { id: 2, name: "Shooter" },
  { id: 40, name: "Casual" },
  { id: 14, name: "Simulation" },
  { id: 7, name: "Puzzle" },
  { id: 11, name: "Arcade" },
  { id: 83, name: "Platformer" },
  { id: 1, name: "Racing" },
  { id: 15, name: "Sports" },
  { id: 6, name: "Fighting" },
  { id: 19, name: "Family" },
];

const platforms = [
  { id: 4, name: "PC" },
  { id: 18, name: "PlayStation 4" },
  { id: 187, name: "PlayStation 5" },
  { id: 1, name: "Xbox One" },
  { id: 186, name: "Xbox Series S/X" },
  { id: 7, name: "Nintendo Switch" },
  { id: 3, name: "iOS" },
  { id: 21, name: "Android" },
];

const sortOptions = [
  { value: "-rating", label: "Rating (High to Low)" },
  { value: "rating", label: "Rating (Low to High)" },
  { value: "-released", label: "Release Date (Newest)" },
  { value: "released", label: "Release Date (Oldest)" },
  { value: "-added", label: "Popularity (Most Added)" },
  { value: "added", label: "Popularity (Least Added)" },
  { value: "name", label: "Name (A-Z)" },
  { value: "-name", label: "Name (Z-A)" },
  { value: "-metacritic", label: "Metacritic (High to Low)" },
];

export default function FilterSort({
  filters,
  setFilters,
  sortBy,
  setSortBy,
  onClearFilters,
}) {
  const [genreExpanded, setGenreExpanded] = useState(true);
  const [platformExpanded, setPlatformExpanded] = useState(true);
  const [sortExpanded, setSortExpanded] = useState(true);

  const hasActiveFilters =
    filters.genres.length > 0 ||
    filters.platforms.length > 0 ||
    sortBy !== "-rating";

  const toggleGenre = (genreId) => {
    setFilters((prev) => ({
      ...prev,
      genres: prev.genres.includes(genreId)
        ? prev.genres.filter((id) => id !== genreId)
        : [...prev.genres, genreId],
    }));
  };

  const togglePlatform = (platformId) => {
    setFilters((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platformId)
        ? prev.platforms.filter((id) => id !== platformId)
        : [...prev.platforms, platformId],
    }));
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-white">
          <SlidersHorizontal className="w-4 h-4 text-purple-400" />
          <h3 className="font-semibold text-sm">Filters & Sort</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1 text-[11px] text-[#888] hover:text-white transition-colors bg-[#1a1a1a] px-2 py-1 rounded-lg"
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      {/* Sort Section */}
      <div className="border-t border-[#1f1f1f] pt-4">
        <button
          onClick={() => setSortExpanded(!sortExpanded)}
          className="flex items-center justify-between w-full text-white mb-3"
        >
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-medium">Sort By</span>
          </div>
          {sortExpanded ? (
            <ChevronUp className="w-4 h-4 text-[#888]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#888]" />
          )}
        </button>
        {sortExpanded && (
          <div className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSortBy(option.value)}
                className={`w-full text-left text-[11px] px-3 py-2 rounded-lg transition-all ${
                  sortBy === option.value
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                    : "text-[#888] hover:bg-[#1a1a1a] hover:text-white"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Genre Section */}
      <div className="border-t border-[#1f1f1f] pt-4">
        <button
          onClick={() => setGenreExpanded(!genreExpanded)}
          className="flex items-center justify-between w-full text-white mb-3"
        >
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-medium">Genres</span>
            {filters.genres.length > 0 && (
              <span className="bg-purple-500/20 text-purple-300 text-[10px] px-1.5 py-0.5 rounded-full">
                {filters.genres.length}
              </span>
            )}
          </div>
          {genreExpanded ? (
            <ChevronUp className="w-4 h-4 text-[#888]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#888]" />
          )}
        </button>
        {genreExpanded && (
          <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto custom-scrollbar">
            {genres.map((genre) => (
              <button
                key={genre.id}
                onClick={() => toggleGenre(genre.id)}
                className={`text-[10px] px-2.5 py-1.5 rounded-lg transition-all ${
                  filters.genres.includes(genre.id)
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                    : "bg-[#1a1a1a] text-[#888] hover:bg-[#222] hover:text-white border border-transparent"
                }`}
              >
                {genre.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Platform Section */}
      <div className="border-t border-[#1f1f1f] pt-4">
        <button
          onClick={() => setPlatformExpanded(!platformExpanded)}
          className="flex items-center justify-between w-full text-white mb-3"
        >
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-medium">Platforms</span>
            {filters.platforms.length > 0 && (
              <span className="bg-purple-500/20 text-purple-300 text-[10px] px-1.5 py-0.5 rounded-full">
                {filters.platforms.length}
              </span>
            )}
          </div>
          {platformExpanded ? (
            <ChevronUp className="w-4 h-4 text-[#888]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#888]" />
          )}
        </button>
        {platformExpanded && (
          <div className="space-y-1 max-h-40 overflow-y-auto custom-scrollbar">
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => togglePlatform(platform.id)}
                className={`w-full text-left text-[11px] px-3 py-2 rounded-lg transition-all ${
                  filters.platforms.includes(platform.id)
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                    : "text-[#888] hover:bg-[#1a1a1a] hover:text-white"
                }`}
              >
                {platform.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

