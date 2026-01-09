"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Loader2,
  ChevronDown,
  ChevronUp,
  Gamepad2,
  SlidersHorizontal,
  Search,
  Star,
  Clock,
  TrendingUp,
  Award,
  SortAsc,
  Swords,
  Target,
  Crosshair,
  Zap,
  Ghost,
  Puzzle,
  Car,
  Monitor,
} from "lucide-react";
import Image from "next/image";
import GameCharts from "../components/GameCharts";
import TopGames from "../components/TopGames";
import TrendingGames from "../components/TrendingGames";
import PeakRecords from "../components/PeakRecords";
import GameCard from "../components/GameCard";
import FilterSort from "../components/FilterSort";

const PAGE_SIZE = 12;

export default function AppPage() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState("Home");
  const [searchValue, setSearchValue] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [genreExpanded, setGenreExpanded] = useState(false);
  const [platformExpanded, setPlatformExpanded] = useState(false);
  const [chartsExpanded, setChartsExpanded] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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

  // Handle scroll for sticky header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        setShowHeader(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down
        setShowHeader(false);
      } else {
        // Scrolling up
        setShowHeader(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div className="min-h-screen bg-[#111111] flex flex-col items-center pt-5 pb-10">
      {/* Navigation Bar */}
      <nav
        className={`sticky top-5 bg-[#1B1B1B] rounded-[30px] px-4 sm:px-6 py-2 flex items-center gap-4 sm:gap-8 lg:gap-12 h-fit mx-4 z-50 transition-transform duration-300 ease-in-out ${
          showHeader ? "translate-y-0" : "-translate-y-20"
        }`}
      >
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

        {/* Search Bar */}
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
          <div className="flex gap-8 max-w-[1400px] mx-auto px-4">
            {/* Left Sidebar*/}
            <aside className="hidden lg:block w-64 flex-shrink-0 ">
              <div className="sticky top-5 space-y-7 pl-[1rem]">
                {/* Sort By Section */}
                <div>
                  <h3 className="text-sm uppercase tracking-wider text-[#f0f0f0] text-[1.12rem] font-bold mb-3">
                    Sort By
                  </h3>
                  <div className="space-y-1">
                    {[
                      {
                        value: "-rating",
                        label: "Rating",
                        sublabel: "High to Low",
                        icon: Star,
                      },
                      {
                        value: "-released",
                        label: "Release Date",
                        sublabel: "Newest",
                        icon: Clock,
                      },
                      {
                        value: "-added",
                        label: "Popularity",
                        sublabel: "Most Added",
                        icon: TrendingUp,
                      },
                      {
                        value: "-metacritic",
                        label: "Metacritic",
                        sublabel: "High to Low",
                        icon: Award,
                      },
                      {
                        value: "name",
                        label: "Name",
                        sublabel: "A-Z",
                        icon: SortAsc,
                      },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSortBy(option.value)}
                        className={`group flex items-center gap-3 py-2 transition-all duration-200 w-full ${
                          sortBy === option.value ? "text-white" : "text-[#888]"
                        }`}
                      >
                        <span
                          className={`flex items-center justify-center w-7 h-7 rounded transition-all duration-200 ${
                            sortBy === option.value
                              ? "bg-white text-black"
                              : "bg-[#333] text-white group-hover:bg-white group-hover:text-black"
                          }`}
                        >
                          <option.icon className="w-4 h-4" />
                        </span>
                        <span
                          className={`text-[15px] transition-all duration-200 ${
                            sortBy === option.value
                              ? "font-medium scale-105 origin-left"
                              : "group-hover:scale-105 group-hover:text-white origin-left"
                          }`}
                        >
                          {option.label}
                          <span className="text-[#666] ml-1">
                            ({option.sublabel})
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Genres Section */}
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-[#f0f0f0] text-[1.12rem] font-bold mb-3">
                    Genres
                    {filters.genres.length > 0 && (
                      <span className="ml-2 text-white">
                        {filters.genres.length}
                      </span>
                    )}
                  </h3>
                  <div className="space-y-1">
                    {(() => {
                      const allGenres = [
                        { id: 4, name: "Action", icon: Swords },
                        { id: 10, name: "Strategy", icon: Target },
                        { id: 2, name: "Shooter", icon: Crosshair },
                        { id: 51, name: "Indie", icon: Star },
                        { id: 3, name: "Adventure", icon: Zap },
                        { id: 5, name: "RPG", icon: Ghost },
                        { id: 7, name: "Puzzle", icon: Puzzle },
                        { id: 11, name: "Arcade", icon: Gamepad2 },
                        { id: 83, name: "Platformer", icon: Gamepad2 },
                        { id: 1, name: "Racing", icon: Car },
                      ];
                      const visibleGenres = genreExpanded
                        ? allGenres
                        : allGenres.slice(0, 3);
                      return (
                        <>
                          {visibleGenres.map((genre) => (
                            <button
                              key={genre.id}
                              onClick={() => {
                                setFilters((prev) => ({
                                  ...prev,
                                  genres: prev.genres.includes(genre.id)
                                    ? prev.genres.filter(
                                        (id) => id !== genre.id
                                      )
                                    : [...prev.genres, genre.id],
                                }));
                              }}
                              className={`group flex items-center gap-3 py-2 transition-all duration-200 w-full ${
                                filters.genres.includes(genre.id)
                                  ? "text-white"
                                  : "text-[#888]"
                              }`}
                            >
                              <span
                                className={`flex items-center justify-center w-7 h-7 rounded transition-all duration-200 ${
                                  filters.genres.includes(genre.id)
                                    ? "bg-white text-black"
                                    : "bg-[#333] text-white group-hover:bg-white group-hover:text-black"
                                }`}
                              >
                                <genre.icon className="w-4 h-4" />
                              </span>
                              <span
                                className={`text-[15px] transition-all duration-200 ${
                                  filters.genres.includes(genre.id)
                                    ? "font-medium scale-105 origin-left"
                                    : "group-hover:scale-105 group-hover:text-white origin-left"
                                }`}
                              >
                                {genre.name}
                              </span>
                            </button>
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
                                Show {allGenres.length - 3} more
                              </>
                            )}
                          </button>
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* Platforms Section */}
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-[#f0f0f0] text-[1.12rem] font-bold mb-3 ">
                    Platforms
                    {filters.platforms.length > 0 && (
                      <span className="ml-2 text-white">
                        {filters.platforms.length}
                      </span>
                    )}
                  </h3>
                  <div className="space-y-1">
                    {(() => {
                      const allPlatforms = [
                        { id: 4, name: "PC", icon: Monitor },
                        { id: 187, name: "PlayStation 5", icon: Gamepad2 },
                        { id: 18, name: "PlayStation 4", icon: Gamepad2 },
                        { id: 186, name: "Xbox Series X", icon: Gamepad2 },
                        { id: 1, name: "Xbox One", icon: Gamepad2 },
                        { id: 7, name: "Nintendo Switch", icon: Gamepad2 },
                      ];
                      const visiblePlatforms = platformExpanded
                        ? allPlatforms
                        : allPlatforms.slice(0, 2);
                      return (
                        <>
                          {visiblePlatforms.map((platform) => (
                            <button
                              key={platform.id}
                              onClick={() => {
                                setFilters((prev) => ({
                                  ...prev,
                                  platforms: prev.platforms.includes(
                                    platform.id
                                  )
                                    ? prev.platforms.filter(
                                        (id) => id !== platform.id
                                      )
                                    : [...prev.platforms, platform.id],
                                }));
                              }}
                              className={`group flex items-center gap-3 py-2 transition-all duration-200 w-full ${
                                filters.platforms.includes(platform.id)
                                  ? "text-white"
                                  : "text-[#888]"
                              }`}
                            >
                              <span
                                className={`flex items-center justify-center w-7 h-7 rounded transition-all duration-200 ${
                                  filters.platforms.includes(platform.id)
                                    ? "bg-white text-black"
                                    : "bg-[#333] text-white group-hover:bg-white group-hover:text-black"
                                }`}
                              >
                                <platform.icon className="w-4 h-4" />
                              </span>
                              <span
                                className={`text-[15px] transition-all duration-200 ${
                                  filters.platforms.includes(platform.id)
                                    ? "font-medium scale-105 origin-left"
                                    : "group-hover:scale-105 group-hover:text-white origin-left"
                                }`}
                              >
                                {platform.name}
                              </span>
                            </button>
                          ))}
                          <button
                            onClick={() =>
                              setPlatformExpanded(!platformExpanded)
                            }
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
                                Show {allPlatforms.length - 2} more
                              </>
                            )}
                          </button>
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* Clear Filters */}
                {(filters.genres.length > 0 ||
                  filters.platforms.length > 0) && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-2 text-[15px] text-[#777] hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
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
              <div className="mb-8">
                {/* Desktop: Two separate tables with shared button */}
                <div className="hidden md:block">
                  <div className="grid grid-cols-2 gap-4">
                    <TopGames
                      showAll={chartsExpanded}
                      onToggle={() => setChartsExpanded(!chartsExpanded)}
                      hideButton
                    />
                    <TrendingGames
                      showAll={chartsExpanded}
                      onToggle={() => setChartsExpanded(!chartsExpanded)}
                      hideButton
                    />
                  </div>
                  {/* Shared button in the middle */}
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={() => setChartsExpanded(!chartsExpanded)}
                      className="flex items-center gap-2 text-[#A1A1A1] hover:text-white transition-all text-sm font-['Inter'] px-5 py-2 rounded-xl bg-[#1B1B1B] hover:bg-[#252525] border border-[#2A2A2A] hover:border-[#3A3A3A]"
                    >
                      {chartsExpanded ? (
                        <>
                          <ChevronUp className="w-4 h-4" />
                          Show Less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4" />
                          Show Top 10
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Mobile: GameCharts with separate buttons */}
                <div className="md:hidden">
                  <GameCharts />
                </div>
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
        ) : activeNav === "Charts" ? (
          <div className="w-full max-w-5xl mx-auto px-4">
            <div className="mb-8">
              <h1 className="font-['Inter'] text-3xl font-bold text-white mb-2">
                Steam Charts
              </h1>
              <p className="text-[#A1A1A1] text-sm">
                Real-time player statistics and all-time peak records
              </p>
            </div>
            <div className="space-y-8">
              <TopGames showAll={true} hideButton />
              <TrendingGames showAll={true} hideButton />
              <PeakRecords showAll={true} hideButton />
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
