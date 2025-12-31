"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Loader2,
  ChevronDown,
  Gamepad2,
  SlidersHorizontal,
  Search,
} from "lucide-react";
import Image from "next/image";
import TopGames from "../components/TopGames";
import TrendingGames from "../components/TrendingGames";
import GameCard from "../components/GameCard";
import FilterSort from "../components/FilterSort";

const PAGE_SIZE = 12;

export default function AppPage() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState("Home");
  const [searchValue, setSearchValue] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Game search state
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [filters, setFilters] = useState({
    genres: [],
    platforms: [],
  });
  const [sortBy, setSortBy] = useState("-added");

  const navItems = ["Home", "Charts", "Discover"];

  // Debounce search query from nav search bar
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchValue);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchValue]);

  // Reset and fetch when filters/sort/search change
  useEffect(() => {
    if (activeNav === "Home") {
      setPage(1);
      setGames([]);
      setHasMore(true);
      fetchGames(1, true);
    }
  }, [debouncedQuery, filters, sortBy, activeNav]);

  const fetchGames = useCallback(
    async (pageNum, isReset = false) => {
      if (isReset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      try {
        const params = new URLSearchParams({
          page: pageNum.toString(),
          page_size: PAGE_SIZE.toString(),
          ordering: sortBy,
        });

        if (debouncedQuery) {
          params.append("search", debouncedQuery);
        }

        if (filters.genres.length > 0) {
          params.append("genres", filters.genres.join(","));
        }

        if (filters.platforms.length > 0) {
          params.append("platforms", filters.platforms.join(","));
        }

        const response = await fetch(`/api/rawg/games?${params.toString()}`);
        const data = await response.json();

        if (isReset) {
          setGames(data.results || []);
        } else {
          setGames((prev) => [...prev, ...(data.results || [])]);
        }

        setHasMore(data.next !== null);
      } catch (error) {
        console.error("Error fetching games:", error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [debouncedQuery, filters, sortBy]
  );

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchGames(nextPage, false);
    }
  };

  const clearFilters = () => {
    setFilters({ genres: [], platforms: [] });
    setSortBy("-added");
  };

  const handleGameClick = (game) => {
    router.push(`/app/${game.id}`);
  };

  return (
    <div className="min-h-screen bg-[#111111] flex flex-col items-center pt-5 pb-10">
      {/* Navigation Bar */}
      <nav className="bg-[#1B1B1B] rounded-[30px] px-4 sm:px-6 py-2 flex items-center gap-4 sm:gap-8 lg:gap-12 h-fit mx-4 relative z-50">
        <span className="font-['ADLaM_Display'] text-[18px] sm:text-[22px] text-white font-normal">
          GAPP
        </span>

        {/* Desktop Nav Items */}
        <div className="hidden sm:flex gap-4 lg:gap-6 items-center">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => setActiveNav(item)}
              className={`font-['Inter'] text-[14px] transition-colors ${
                activeNav === item ? "text-white" : "text-[#B2B2B2]"
              } hover:text-white`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Search Bar - Used for RAWG search */}
        <div className="bg-[#252525] rounded-[10px] px-2 py-1 flex items-center gap-2 w-[140px] sm:w-[180px] lg:w-[200px]">
          <Image
            src="/_Magnifyingglass.svg"
            alt="Search"
            width={26}
            height={26}
            className="flex-shrink-0 w-5 h-5 sm:w-[26px] sm:h-[26px]"
          />

          <input
            type="text"
            placeholder="Search games.."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="bg-transparent border-none outline-none font-['Inter'] text-[12px] sm:text-[14px] text-[#A1A1A1] placeholder:text-[#A1A1A1] flex-1 min-w-0"
          />

          {searchValue && (
            <button
              onClick={() => setSearchValue("")}
              className="flex items-center justify-center flex-shrink-0"
            >
              <Image src="/_Close.svg" alt="Clear" width={16} height={16} />
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="sm:hidden flex flex-col gap-1 p-1"
          aria-label="Toggle menu"
        >
          <span
            className={`block w-5 h-0.5 bg-white transition-transform ${
              mobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
            }`}
          ></span>
          <span
            className={`block w-5 h-0.5 bg-white transition-opacity ${
              mobileMenuOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`block w-5 h-0.5 bg-white transition-transform ${
              mobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
            }`}
          ></span>
        </button>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="sm:hidden absolute top-full left-0 right-0 mt-2 bg-[#1B1B1B] rounded-2xl py-3 px-4 flex flex-col gap-2 z-50">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => {
                  setActiveNav(item);
                  setMobileMenuOpen(false);
                }}
                className={`font-['Inter'] text-[14px] transition-colors text-left py-2 ${
                  activeNav === item ? "text-white" : "text-[#B2B2B2]"
                } hover:text-white`}
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <section className="w-full mt-8 sm:mt-14">
        {activeNav === "Home" ? (
          <div className="flex gap-6 max-w-7xl mx-auto px-4">
            {/* Left Sidebar*/}
            <aside className="hidden lg:block w-56 flex-shrink-0">
              <div className="sticky top-5 space-y-3">
                {/* Sort Dropdown */}
                <div className="bg-[#1a1a1a]/80 backdrop-blur-sm rounded-2xl border border-[#252525] overflow-hidden">
                  <div className="p-4 border-b border-[#252525]">
                    <h3 className="text-white/90 text-xs font-semibold uppercase tracking-wider">
                      Sort By
                    </h3>
                  </div>
                  <div className="p-2">
                    {[
                      { value: "-rating", label: "Rating ↓" },
                      { value: "-released", label: "Newest" },
                      { value: "-added", label: "Popular" },
                      { value: "-metacritic", label: "Metacritic" },
                      { value: "name", label: "A-Z" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSortBy(option.value)}
                        className={`w-full text-left text-xs px-3 py-2 rounded-lg transition-all ${
                          sortBy === option.value
                            ? "bg-purple-500/20 text-purple-300"
                            : "text-white/60 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Genres */}
                <div className="bg-[#1a1a1a]/80 backdrop-blur-sm rounded-2xl border border-[#252525] overflow-hidden">
                  <div className="p-4 border-b border-[#252525] flex items-center justify-between">
                    <h3 className="text-white/90 text-xs font-semibold uppercase tracking-wider">
                      Genres
                    </h3>
                    {filters.genres.length > 0 && (
                      <span className="text-[10px] bg-purple-500/30 text-purple-300 px-2 py-0.5 rounded-full">
                        {filters.genres.length}
                      </span>
                    )}
                  </div>
                  <div className="p-2 max-h-48 overflow-y-auto custom-scrollbar">
                    {[
                      { id: 4, name: "Action" },
                      { id: 51, name: "Indie" },
                      { id: 3, name: "Adventure" },
                      { id: 5, name: "RPG" },
                      { id: 10, name: "Strategy" },
                      { id: 2, name: "Shooter" },
                      { id: 7, name: "Puzzle" },
                      { id: 11, name: "Arcade" },
                      { id: 83, name: "Platformer" },
                      { id: 1, name: "Racing" },
                    ].map((genre) => (
                      <button
                        key={genre.id}
                        onClick={() => {
                          setFilters((prev) => ({
                            ...prev,
                            genres: prev.genres.includes(genre.id)
                              ? prev.genres.filter((id) => id !== genre.id)
                              : [...prev.genres, genre.id],
                          }));
                        }}
                        className={`w-full text-left text-xs px-3 py-2 rounded-lg transition-all ${
                          filters.genres.includes(genre.id)
                            ? "bg-purple-500/20 text-purple-300"
                            : "text-white/60 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {genre.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Platforms */}
                <div className="bg-[#1a1a1a]/80 backdrop-blur-sm rounded-2xl border border-[#252525] overflow-hidden">
                  <div className="p-4 border-b border-[#252525] flex items-center justify-between">
                    <h3 className="text-white/90 text-xs font-semibold uppercase tracking-wider">
                      Platforms
                    </h3>
                    {filters.platforms.length > 0 && (
                      <span className="text-[10px] bg-purple-500/30 text-purple-300 px-2 py-0.5 rounded-full">
                        {filters.platforms.length}
                      </span>
                    )}
                  </div>
                  <div className="p-2">
                    {[
                      { id: 4, name: "PC" },
                      { id: 187, name: "PlayStation 5" },
                      { id: 18, name: "PlayStation 4" },
                      { id: 186, name: "Xbox Series X" },
                      { id: 1, name: "Xbox One" },
                      { id: 7, name: "Nintendo Switch" },
                    ].map((platform) => (
                      <button
                        key={platform.id}
                        onClick={() => {
                          setFilters((prev) => ({
                            ...prev,
                            platforms: prev.platforms.includes(platform.id)
                              ? prev.platforms.filter(
                                  (id) => id !== platform.id
                                )
                              : [...prev.platforms, platform.id],
                          }));
                        }}
                        className={`w-full text-left text-xs px-3 py-2 rounded-lg transition-all ${
                          filters.platforms.includes(platform.id)
                            ? "bg-purple-500/20 text-purple-300"
                            : "text-white/60 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {platform.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                {(filters.genres.length > 0 ||
                  filters.platforms.length > 0) && (
                  <button
                    onClick={clearFilters}
                    className="w-full text-xs text-white/50 hover:text-white py-2 transition-colors"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </aside>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden fixed bottom-6 right-6 z-40 bg-purple-600 hover:bg-purple-500 text-white p-4 rounded-2xl shadow-lg shadow-purple-500/20 transition-colors"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>

            {/* Mobile Filters Overlay */}
            {showMobileFilters && (
              <div
                className="lg:hidden fixed inset-0 z-40 bg-black/70"
                onClick={() => setShowMobileFilters(false)}
              >
                <div
                  className="absolute bottom-0 left-0 right-0 bg-[#1a1a1a] rounded-t-3xl p-6 max-h-[75vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-white font-semibold text-lg">
                      Filters
                    </h3>
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="text-white/50 hover:text-white p-2"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <FilterSort
                    filters={filters}
                    setFilters={setFilters}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    onClearFilters={clearFilters}
                  />
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Charts Section */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6 mb-10">
                <TopGames />
                <TrendingGames />
              </div>

              {/* Games Section Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-purple-500/15 p-2.5 rounded-xl">
                  <Gamepad2 className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h2 className="font-semibold text-white text-lg">
                    {debouncedQuery
                      ? `Results for "${debouncedQuery}"`
                      : "Discover Games"}
                  </h2>
                  <p className="text-white/40 text-xs">
                    {debouncedQuery
                      ? `${games.length} games found`
                      : "Browse and filter games from RAWG"}
                  </p>
                </div>
              </div>

              {/* Games Grid */}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-[#1a1a1a] rounded-xl h-72 animate-pulse"
                    >
                      <div className="h-44 bg-[#252525] rounded-t-xl" />
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-[#252525] rounded w-3/4" />
                        <div className="h-3 bg-[#252525] rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : games.length === 0 ? (
                <div className="bg-[#1a1a1a]/50 rounded-2xl p-16 text-center border border-[#252525]">
                  <Gamepad2 className="w-12 h-12 text-white/10 mx-auto mb-4" />
                  <p className="text-white/50 text-sm">No games found</p>
                  <p className="text-white/30 text-xs mt-1">
                    Try adjusting your search or filters
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {games.map((game) => (
                      <GameCard
                        key={game.id}
                        game={game}
                        onClick={handleGameClick}
                      />
                    ))}
                  </div>

                  {/* Load More */}
                  {hasMore && (
                    <div className="mt-10 flex justify-center">
                      <button
                        onClick={loadMore}
                        disabled={loadingMore}
                        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white px-8 py-3 rounded-xl transition-all border border-white/10 disabled:opacity-50"
                      >
                        {loadingMore ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4" />
                            Load More
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="w-full max-w-6xl mx-auto px-4">
            <div className="bg-[#1a1a1a]/50 rounded-2xl p-12 text-center border border-[#252525]">
              <h2 className="text-white text-xl font-semibold mb-2">
                {activeNav}
              </h2>
              <p className="text-white/40 text-sm">Coming soon...</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
