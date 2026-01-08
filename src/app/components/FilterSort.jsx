"use client";

import { useState } from "react";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Gamepad2,
  Calendar,
  Star,
  ChevronDown,
  ChevronUp,
  X,
  TrendingUp,
  Clock,
  Users,
  SortAsc,
  Award,
  Swords,
  Target,
  Crosshair,
  Puzzle,
  Car,
  Dumbbell,
  Ghost,
  Zap,
  Monitor,
  Smartphone,
} from "lucide-react";

const genres = [
  { id: 4, name: "Action", icon: Swords },
  { id: 10, name: "Strategy", icon: Target },
  { id: 2, name: "Shooter", icon: Crosshair },
  { id: 51, name: "Indie", icon: Star },
  { id: 3, name: "Adventure", icon: Zap },
  { id: 5, name: "RPG", icon: Ghost },
  { id: 40, name: "Casual", icon: Gamepad2 },
  { id: 14, name: "Simulation", icon: Monitor },
  { id: 7, name: "Puzzle", icon: Puzzle },
  { id: 11, name: "Arcade", icon: Gamepad2 },
  { id: 83, name: "Platformer", icon: Gamepad2 },
  { id: 1, name: "Racing", icon: Car },
  { id: 15, name: "Sports", icon: Dumbbell },
  { id: 6, name: "Fighting", icon: Swords },
  { id: 19, name: "Family", icon: Users },
];

const platforms = [
  { id: 4, name: "PC", icon: Monitor },
  { id: 187, name: "PlayStation 5", icon: Gamepad2 },
  { id: 18, name: "PlayStation 4", icon: Gamepad2 },
  { id: 186, name: "Xbox Series S/X", icon: Gamepad2 },
  { id: 1, name: "Xbox One", icon: Gamepad2 },
  { id: 7, name: "Nintendo Switch", icon: Gamepad2 },
  { id: 3, name: "iOS", icon: Smartphone },
  { id: 21, name: "Android", icon: Smartphone },
];

const sortOptions = [
  { value: "-rating", label: "Rating", sublabel: "High to Low", icon: Star },
  { value: "rating", label: "Rating", sublabel: "Low to High", icon: Star },
  {
    value: "-released",
    label: "Release Date",
    sublabel: "Newest",
    icon: Clock,
  },
  { value: "released", label: "Release Date", sublabel: "Oldest", icon: Clock },
  {
    value: "-added",
    label: "Popularity",
    sublabel: "Most Added",
    icon: TrendingUp,
  },
  {
    value: "added",
    label: "Popularity",
    sublabel: "Least Added",
    icon: TrendingUp,
  },
  { value: "name", label: "Name", sublabel: "A-Z", icon: SortAsc },
  { value: "-name", label: "Name", sublabel: "Z-A", icon: SortAsc },
  {
    value: "-metacritic",
    label: "Metacritic",
    sublabel: "High to Low",
    icon: Award,
  },
];

// Reusable filter item component with hover effect
function FilterItem({ icon: Icon, label, sublabel, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`group flex items-center gap-3 py-2 transition-all duration-200 ${
        isActive ? "text-white" : "text-[#888]"
      }`}
    >
      <span
        className={`flex items-center justify-center w-7 h-7 rounded transition-all duration-200 ${
          isActive
            ? "bg-white text-black"
            : "bg-[#333] text-white group-hover:bg-white group-hover:text-black"
        }`}
      >
        <Icon className="w-4 h-4" />
      </span>
      <span
        className={`text-[15px] transition-all duration-200 ${
          isActive
            ? "font-medium scale-105 origin-left"
            : "group-hover:scale-105 group-hover:text-white origin-left"
        }`}
      >
        {label}
        {sublabel && <span className="text-[#666] ml-1">({sublabel})</span>}
      </span>
    </button>
  );
}

export default function FilterSort({
  filters,
  setFilters,
  sortBy,
  setSortBy,
  onClearFilters,
}) {
  const [genreExpanded, setGenreExpanded] = useState(false);
  const [platformExpanded, setPlatformExpanded] = useState(false);

  // Show first 3 genres initially
  const initialGenres = genres.slice(0, 3);
  const remainingGenres = genres.slice(3);

  // Show first 2 platforms initially
  const initialPlatforms = platforms.slice(0, 2);
  const remainingPlatforms = platforms.slice(2);

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
    <div className="space-y-7">
      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="flex items-center gap-2 text-[15px] text-[#777] hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
          Clear all filters
        </button>
      )}

      {/* Sort Section */}
      <div>
        <h3 className="text-sm uppercase tracking-wider text-[#999] font-semibold mb-4">
          Sort By
        </h3>
        <div className="space-y-1">
          {sortOptions.map((option) => (
            <FilterItem
              key={option.value}
              icon={option.icon}
              label={option.label}
              sublabel={option.sublabel}
              isActive={sortBy === option.value}
              onClick={() => setSortBy(option.value)}
            />
          ))}
        </div>
      </div>

      {/* Genre Section */}
      <div>
        <h3 className="text-sm uppercase tracking-wider text-[#999] font-semibold mb-4">
          Genres
          {filters.genres.length > 0 && (
            <span className="ml-2 text-white">{filters.genres.length}</span>
          )}
        </h3>
        <div className="space-y-1">
          {initialGenres.map((genre) => (
            <FilterItem
              key={genre.id}
              icon={genre.icon}
              label={genre.name}
              isActive={filters.genres.includes(genre.id)}
              onClick={() => toggleGenre(genre.id)}
            />
          ))}

          {genreExpanded &&
            remainingGenres.map((genre) => (
              <FilterItem
                key={genre.id}
                icon={genre.icon}
                label={genre.name}
                isActive={filters.genres.includes(genre.id)}
                onClick={() => toggleGenre(genre.id)}
              />
            ))}

          <button
            onClick={() => setGenreExpanded(!genreExpanded)}
            className="flex items-center gap-1.5 text-sm text-[#666] hover:text-white transition-colors mt-2"
          >
            {genreExpanded ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                Show less
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                Show {remainingGenres.length} more
              </>
            )}
          </button>
        </div>
      </div>

      {/* Platform Section */}
      <div>
        <h3 className="text-sm uppercase tracking-wider text-[#999] font-semibold mb-4">
          Platforms
          {filters.platforms.length > 0 && (
            <span className="ml-2 text-white">{filters.platforms.length}</span>
          )}
        </h3>
        <div className="space-y-1">
          {initialPlatforms.map((platform) => (
            <FilterItem
              key={platform.id}
              icon={platform.icon}
              label={platform.name}
              isActive={filters.platforms.includes(platform.id)}
              onClick={() => togglePlatform(platform.id)}
            />
          ))}

          {platformExpanded &&
            remainingPlatforms.map((platform) => (
              <FilterItem
                key={platform.id}
                icon={platform.icon}
                label={platform.name}
                isActive={filters.platforms.includes(platform.id)}
                onClick={() => togglePlatform(platform.id)}
              />
            ))}

          <button
            onClick={() => setPlatformExpanded(!platformExpanded)}
            className="flex items-center gap-1.5 text-sm text-[#666] hover:text-white transition-colors mt-2"
          >
            {platformExpanded ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                Show less
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                Show {remainingPlatforms.length} more
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
