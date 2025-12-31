"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, X, Loader2, ChevronDown, Gamepad2 } from "lucide-react";
import GameCard from "./GameCard";
import FilterSort from "./FilterSort";
import GameDetail from "./GameDetail";

const PAGE_SIZE = 12;

export default function GameSearch() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedGame, setSelectedGame] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState({
    genres: [],
    platforms: [],
  });
  const [sortBy, setSortBy] = useState("-rating");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset and fetch when filters/sort/search change
  useEffect(() => {
    setPage(1);
    setGames([]);
    setHasMore(true);
    fetchGames(1, true);
  }, [debouncedQuery, filters, sortBy]);

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

        const response = await fetch(
          `/api/rawg/games?${params.toString()}`
        );
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
    setSortBy("-rating");
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-purple-500/20 p-2 rounded-xl">
            <Gamepad2 className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="font-semibold text-white text-lg">Discover Games</h2>
            <p className="text-[#888] text-xs">
              Explore thousands of games from RAWG database
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <div className="bg-[#1B1B1B] rounded-xl px-4 py-3 flex items-center gap-3 border border-[#2a2a2a] focus-within:border-purple-500/50 transition-colors">
            <Search className="w-4 h-4 text-[#888]" />
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-white placeholder:text-[#666] flex-1"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="text-[#888] hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden flex items-center gap-2 bg-[#1B1B1B] px-4 py-3 rounded-xl text-white text-sm border border-[#2a2a2a]"
        >
          Filters
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              showFilters ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex gap-6">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <FilterSort
            filters={filters}
            setFilters={setFilters}
            sortBy={sortBy}
            setSortBy={setSortBy}
            onClearFilters={clearFilters}
          />
        </div>

        {/* Mobile Filters Dropdown */}
        {showFilters && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setShowFilters(false)}>
            <div 
              className="absolute left-4 right-4 top-32 max-h-[60vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
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

        {/* Games Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
            <div className="bg-[#1B1B1B] rounded-xl p-12 text-center">
              <Gamepad2 className="w-12 h-12 text-[#333] mx-auto mb-4" />
              <p className="text-[#888] text-sm">No games found</p>
              <p className="text-[#666] text-xs mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {games.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    onClick={setSelectedGame}
                  />
                ))}
              </div>

              {/* Load More */}
              {hasMore && (
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="flex items-center gap-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 px-6 py-3 rounded-xl transition-colors border border-purple-500/20 disabled:opacity-50"
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        Load More Games
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Game Detail Modal */}
      {selectedGame && (
        <GameDetail game={selectedGame} onClose={() => setSelectedGame(null)} />
      )}
    </div>
  );
}

