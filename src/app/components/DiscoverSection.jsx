"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Gamepad2,
  Compass,
  X,
  Check,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Loader2,
  Sparkles,
  Target,
  Layers,
  ExternalLink,
  Star,
} from "lucide-react";

// Local storage keys
const STORAGE_KEYS = {
  likedGames: "discover_liked_games",
  selectedGenres: "discover_selected_genres",
  recommendations: "discover_recommendations",
  onboardingComplete: "discover_onboarding_complete",
};

// Genre definitions with slugs for RAWG API
const GENRES = [
  { id: 4, name: "Action", slug: "action", icon: "⚔️" },
  { id: 5, name: "RPG", slug: "role-playing-games-rpg", icon: "🧙" },
  { id: 2, name: "Shooter", slug: "shooter", icon: "🎯" },
  { id: 3, name: "Adventure", slug: "adventure", icon: "🗺️" },
  { id: 51, name: "Indie", slug: "indie", icon: "💎" },
  { id: 10, name: "Strategy", slug: "strategy", icon: "♟️" },
  { id: 14, name: "Simulation", slug: "simulation", icon: "🎮" },
  { id: 7, name: "Puzzle", slug: "puzzle", icon: "🧩" },
  { id: 1, name: "Racing", slug: "racing", icon: "🏎️" },
  { id: 15, name: "Sports", slug: "sports", icon: "⚽" },
  { id: 6, name: "Fighting", slug: "fighting", icon: "🥊" },
  { id: 83, name: "Platformer", slug: "platformer", icon: "🦘" },
  { id: 59, name: "Massively Multiplayer", slug: "massively-multiplayer", icon: "🌐" },
  { id: 11, name: "Arcade", slug: "arcade", icon: "👾" },
];

// Game Selection Card
function GameSelectCard({ game, isSelected, onToggle, delay = 0 }) {
  return (
    <div
      onClick={() => onToggle(game)}
      className="group relative cursor-pointer"
      style={{
        animation: `slideUp 0.4s ease-out ${delay}ms both`,
      }}
    >
      <div
        className={`relative overflow-hidden rounded-xl border-2 transition-all duration-200 ${
          isSelected
            ? "border-white/40 ring-2 ring-white/20"
            : "border-[#2a2a2a] hover:border-[#3a3a3a]"
        }`}
      >
        {/* Image */}
        <div className="relative aspect-[460/215] overflow-hidden">
          <img
            src={game.headerImage || game.background_image}
            alt={game.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/460x215/1a1a1a/333?text=No+Image";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Selection indicator */}
          <div
            className={`absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${
              isSelected
                ? "bg-white text-black scale-100"
                : "bg-black/50 text-white/50 scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100"
            }`}
          >
            <Check className="w-4 h-4" strokeWidth={3} />
          </div>
        </div>

        {/* Info */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h4 className="text-white text-sm font-semibold truncate">
            {game.name}
          </h4>
          {game.currentPlayers && (
            <p className="text-white/50 text-xs mt-0.5">
              {game.currentPlayers.toLocaleString()} playing now
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Genre Selection Card
function GenreCard({ genre, isSelected, onToggle, delay = 0 }) {
  return (
    <button
      onClick={() => onToggle(genre)}
      className={`relative px-5 py-3.5 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${
        isSelected
          ? "border-white/40 bg-white/5 ring-2 ring-white/10"
          : "border-[#2a2a2a] bg-[#1a1a1a] hover:border-[#3a3a3a] hover:bg-[#1f1f1f]"
      }`}
      style={{
        animation: `slideUp 0.3s ease-out ${delay}ms both`,
      }}
    >
      <span className="text-xl">{genre.icon}</span>
      <span className={`font-medium transition-colors ${isSelected ? "text-white" : "text-[#999]"}`}>
        {genre.name}
      </span>
      {isSelected && (
        <Check className="w-4 h-4 text-white ml-auto" strokeWidth={3} />
      )}
    </button>
  );
}

// Recommendation Card
function RecommendationCard({ game, onRemove, priority = "normal" }) {
  const handleClick = () => {
    if (game.slug) {
      window.open(`https://rawg.io/games/${game.slug}`, "_blank");
    } else if (game.appid) {
      window.open(`https://store.steampowered.com/app/${game.appid}`, "_blank");
    }
  };

  return (
    <div
      className="group relative bg-[#161616] rounded-xl overflow-hidden border border-[#252525] hover:border-[#3a3a3a] transition-all duration-200"
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={game.background_image || game.headerImage}
          alt={game.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/640x360/1a1a1a/333?text=No+Image";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-transparent to-transparent" />
        
        {/* Priority badge */}
        {priority === "high" && (
          <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs font-medium text-white/80 flex items-center gap-1.5">
            <Star className="w-3 h-3" />
            Top Pick
          </div>
        )}

        {/* Remove button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(game.id || game.appid);
          }}
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white/50 hover:text-white hover:bg-black/80 transition-colors opacity-0 group-hover:opacity-100"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4">
        <h4 className="text-white font-semibold truncate mb-2">{game.name}</h4>
        
        {/* Genres */}
        {game.genres && game.genres.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {game.genres.slice(0, 3).map((g) => (
              <span
                key={g.id}
                className="text-xs px-2 py-0.5 bg-[#252525] text-[#888] rounded"
              >
                {g.name}
              </span>
            ))}
          </div>
        )}

        {/* Rating & Action */}
        <div className="flex items-center justify-between mt-3">
          {game.rating && (
            <div className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-400" fill="currentColor" />
              <span className="text-white/70 text-sm">{game.rating.toFixed(1)}</span>
            </div>
          )}
          <button
            onClick={handleClick}
            className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors"
          >
            View
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Step indicator
function StepIndicator({ currentStep, totalSteps }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div
          key={i}
          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
            i < currentStep
              ? "bg-white/40"
              : i === currentStep
              ? "bg-white/80"
              : "bg-[#2a2a2a]"
          }`}
        />
      ))}
    </div>
  );
}

// Main DiscoverSection Component
export default function DiscoverSection() {
  const [step, setStep] = useState(0); // 0: welcome, 1: pick games, 2: pick genres, 3: recommendations
  const [games, setGames] = useState([]);
  const [selectedGames, setSelectedGames] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const [error, setError] = useState(null);

  const MIN_GAMES = 3;
  const MIN_GENRES = 2;

  // Load saved data from localStorage
  useEffect(() => {
    const savedGames = localStorage.getItem(STORAGE_KEYS.likedGames);
    const savedGenres = localStorage.getItem(STORAGE_KEYS.selectedGenres);
    const savedRecs = localStorage.getItem(STORAGE_KEYS.recommendations);
    const onboardingComplete = localStorage.getItem(STORAGE_KEYS.onboardingComplete);

    if (savedGames) setSelectedGames(JSON.parse(savedGames));
    if (savedGenres) setSelectedGenres(JSON.parse(savedGenres));
    if (savedRecs) setRecommendations(JSON.parse(savedRecs));

    if (onboardingComplete === "true" && savedRecs) {
      setStep(3);
    }
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    if (selectedGames.length > 0) {
      localStorage.setItem(STORAGE_KEYS.likedGames, JSON.stringify(selectedGames));
    }
  }, [selectedGames]);

  useEffect(() => {
    if (selectedGenres.length > 0) {
      localStorage.setItem(STORAGE_KEYS.selectedGenres, JSON.stringify(selectedGenres));
    }
  }, [selectedGenres]);

  useEffect(() => {
    if (recommendations.length > 0) {
      localStorage.setItem(STORAGE_KEYS.recommendations, JSON.stringify(recommendations));
    }
  }, [recommendations]);

  // Fetch popular Steam games for selection
  const fetchGames = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/steam/top-games");
      const data = await response.json();

      if (!data.success || !data.games) {
        throw new Error("Failed to fetch games");
      }

      // Take top 24 popular games for selection
      setGames(data.games.slice(0, 24));
    } catch (err) {
      console.error("Error fetching games:", err);
      setError("Failed to load games. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch recommendations based on selections
  const fetchRecommendations = useCallback(async () => {
    setLoadingRecs(true);
    try {
      // Build genre slugs from selected genres
      const genreSlugs = selectedGenres.map((g) => g.slug).join(",");
      
      // Use RAWG API to get games matching genres
      const response = await fetch(
        `/api/rawg/games?genres=${genreSlugs}&ordering=-rating&page_size=20`
      );
      const data = await response.json();

      if (data.results) {
        // Filter out any games already selected
        const selectedIds = selectedGames.map((g) => g.name.toLowerCase());
        const filtered = data.results.filter(
          (g) => !selectedIds.includes(g.name.toLowerCase())
        );

        // Mark top picks (games with high ratings that match multiple selected genres)
        const withPriority = filtered.map((game, idx) => ({
          ...game,
          priority: idx < 4 ? "high" : "normal",
        }));

        setRecommendations(withPriority);
        localStorage.setItem(STORAGE_KEYS.onboardingComplete, "true");
      }
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setError("Failed to load recommendations.");
    } finally {
      setLoadingRecs(false);
    }
  }, [selectedGames, selectedGenres]);

  // Start discovery process
  const startDiscovery = async () => {
    await fetchGames();
    setStep(1);
  };

  // Toggle game selection
  const toggleGame = (game) => {
    setSelectedGames((prev) => {
      const exists = prev.find((g) => g.appid === game.appid);
      if (exists) {
        return prev.filter((g) => g.appid !== game.appid);
      }
      return [...prev, game];
    });
  };

  // Toggle genre selection
  const toggleGenre = (genre) => {
    setSelectedGenres((prev) => {
      const exists = prev.find((g) => g.id === genre.id);
      if (exists) {
        return prev.filter((g) => g.id !== genre.id);
      }
      return [...prev, genre];
    });
  };

  // Remove recommendation
  const removeRecommendation = (id) => {
    const updated = recommendations.filter((r) => (r.id || r.appid) !== id);
    setRecommendations(updated);
    localStorage.setItem(STORAGE_KEYS.recommendations, JSON.stringify(updated));
  };

  // Navigate to next step
  const nextStep = async () => {
    if (step === 2) {
      setStep(3);
      await fetchRecommendations();
    } else {
      setStep((s) => s + 1);
    }
  };

  // Navigate to previous step
  const prevStep = () => {
    setStep((s) => Math.max(0, s - 1));
  };

  // Reset all data
  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEYS.likedGames);
    localStorage.removeItem(STORAGE_KEYS.selectedGenres);
    localStorage.removeItem(STORAGE_KEYS.recommendations);
    localStorage.removeItem(STORAGE_KEYS.onboardingComplete);
    setSelectedGames([]);
    setSelectedGenres([]);
    setRecommendations([]);
    setGames([]);
    setStep(0);
  };

  // Refresh recommendations
  const refreshRecommendations = async () => {
    await fetchRecommendations();
  };

  // Render step content
  const renderStep = () => {
    switch (step) {
      // Welcome screen
      case 0:
        return (
          <div className="text-center max-w-lg mx-auto py-12">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-white/5 blur-2xl rounded-full" />
                <div className="relative bg-[#1a1a1a] p-6 rounded-2xl border border-[#2a2a2a]">
                  <Compass className="w-14 h-14 text-[#666]" strokeWidth={1.5} />
                </div>
              </div>
            </div>

            <h2 className="text-white text-3xl font-bold mb-4 tracking-tight">
              Find Your Next Game
            </h2>
            <p className="text-[#777] text-base mb-10 leading-relaxed">
              Tell us what you like and we'll recommend games tailored to your taste.
              It only takes a minute.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <div className="flex items-center gap-3 text-[#555]">
                <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center">
                  <Target className="w-4 h-4" />
                </div>
                <span className="text-sm">Pick 3+ games</span>
              </div>
              <div className="hidden sm:block w-8 h-px bg-[#2a2a2a]" />
              <div className="flex items-center gap-3 text-[#555]">
                <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <span className="text-sm">Choose 2+ genres</span>
              </div>
              <div className="hidden sm:block w-8 h-px bg-[#2a2a2a]" />
              <div className="flex items-center gap-3 text-[#555]">
                <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-sm">Get recommendations</span>
              </div>
            </div>

            <button
              onClick={startDiscovery}
              className="bg-white text-black font-semibold px-8 py-4 rounded-xl hover:bg-white/90 transition-all duration-200 flex items-center gap-2 mx-auto group"
            >
              Get Started
              <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        );

      // Pick games
      case 1:
        if (loading) {
          return (
            <div className="text-center py-24">
              <Loader2 className="w-10 h-10 text-[#444] animate-spin mx-auto mb-4" />
              <p className="text-[#666]">Loading popular games...</p>
            </div>
          );
        }

        if (error) {
          return (
            <div className="text-center py-24">
              <p className="text-red-400/80 mb-4">{error}</p>
              <button
                onClick={fetchGames}
                className="text-[#666] hover:text-white text-sm transition-colors"
              >
                Try again
              </button>
            </div>
          );
        }

        return (
          <div>
            <StepIndicator currentStep={1} totalSteps={3} />

            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-white text-2xl font-bold mb-2">
                  Pick games you enjoy
                </h2>
                <p className="text-[#666] text-sm">
                  Select at least {MIN_GAMES} games. These help us understand your preferences.
                </p>
              </div>
              <div className="text-right">
                <div
                  className={`text-2xl font-bold ${
                    selectedGames.length >= MIN_GAMES ? "text-white" : "text-[#444]"
                  }`}
                >
                  {selectedGames.length}
                  <span className="text-[#444]">/{MIN_GAMES}</span>
                </div>
                <p className="text-[#555] text-xs mt-1">minimum</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
              {games.map((game, idx) => (
                <GameSelectCard
                  key={game.appid}
                  game={game}
                  isSelected={selectedGames.some((g) => g.appid === game.appid)}
                  onToggle={toggleGame}
                  delay={idx * 30}
                />
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#1f1f1f]">
              <button
                onClick={prevStep}
                className="flex items-center gap-2 text-[#555] hover:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={nextStep}
                disabled={selectedGames.length < MIN_GAMES}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  selectedGames.length >= MIN_GAMES
                    ? "bg-white text-black hover:bg-white/90"
                    : "bg-[#252525] text-[#555] cursor-not-allowed"
                }`}
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        );

      // Pick genres
      case 2:
        return (
          <div>
            <StepIndicator currentStep={2} totalSteps={3} />

            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-white text-2xl font-bold mb-2">
                  Choose your favorite genres
                </h2>
                <p className="text-[#666] text-sm">
                  Select at least {MIN_GENRES} genres that appeal to you.
                </p>
              </div>
              <div className="text-right">
                <div
                  className={`text-2xl font-bold ${
                    selectedGenres.length >= MIN_GENRES ? "text-white" : "text-[#444]"
                  }`}
                >
                  {selectedGenres.length}
                  <span className="text-[#444]">/{MIN_GENRES}</span>
                </div>
                <p className="text-[#555] text-xs mt-1">minimum</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5 mb-8">
              {GENRES.map((genre, idx) => (
                <GenreCard
                  key={genre.id}
                  genre={genre}
                  isSelected={selectedGenres.some((g) => g.id === genre.id)}
                  onToggle={toggleGenre}
                  delay={idx * 40}
                />
              ))}
            </div>

            {/* Selected games reminder */}
            <div className="bg-[#161616] rounded-xl p-4 mb-6 border border-[#1f1f1f]">
              <p className="text-[#555] text-xs uppercase tracking-wider mb-3">
                Your selected games ({selectedGames.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedGames.map((game) => (
                  <div
                    key={game.appid}
                    className="flex items-center gap-2 bg-[#1f1f1f] rounded-lg px-3 py-1.5"
                  >
                    <img
                      src={game.headerImage}
                      alt=""
                      className="w-6 h-4 rounded object-cover"
                    />
                    <span className="text-white/70 text-xs truncate max-w-[120px]">
                      {game.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#1f1f1f]">
              <button
                onClick={prevStep}
                className="flex items-center gap-2 text-[#555] hover:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={nextStep}
                disabled={selectedGenres.length < MIN_GENRES}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  selectedGenres.length >= MIN_GENRES
                    ? "bg-white text-black hover:bg-white/90"
                    : "bg-[#252525] text-[#555] cursor-not-allowed"
                }`}
              >
                Get Recommendations
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </div>
        );

      // Recommendations
      case 3:
        if (loadingRecs) {
          return (
            <div className="text-center py-24">
              <Loader2 className="w-10 h-10 text-[#444] animate-spin mx-auto mb-4" />
              <p className="text-[#666]">Finding games for you...</p>
            </div>
          );
        }

        return (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-white text-2xl font-bold mb-2 flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-[#555]" />
                  Your Recommendations
                </h2>
                <p className="text-[#666] text-sm">
                  Based on your {selectedGames.length} games and {selectedGenres.length} genres
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={refreshRecommendations}
                  className="flex items-center gap-2 bg-[#1a1a1a] text-[#888] font-medium px-4 py-2.5 rounded-xl hover:bg-[#252525] hover:text-white transition-all text-sm border border-[#252525]"
                >
                  <RotateCcw className="w-4 h-4" />
                  Refresh
                </button>
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 bg-[#1a1a1a] text-[#888] font-medium px-4 py-2.5 rounded-xl hover:bg-[#252525] hover:text-white transition-all text-sm border border-[#252525]"
                >
                  <Target className="w-4 h-4" />
                  Edit Preferences
                </button>
              </div>
            </div>

            {/* Selection summary */}
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedGenres.map((genre) => (
                <span
                  key={genre.id}
                  className="text-xs px-3 py-1.5 bg-[#1a1a1a] text-[#777] rounded-full border border-[#252525]"
                >
                  {genre.icon} {genre.name}
                </span>
              ))}
            </div>

            {recommendations.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {recommendations.map((game, idx) => (
                  <div
                    key={game.id}
                    style={{ animation: `slideUp 0.4s ease-out ${idx * 50}ms both` }}
                  >
                    <RecommendationCard
                      game={game}
                      onRemove={removeRecommendation}
                      priority={game.priority}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-[#161616] rounded-xl border border-[#1f1f1f]">
                <Gamepad2 className="w-12 h-12 text-[#333] mx-auto mb-3" />
                <p className="text-[#666]">No recommendations found</p>
                <button
                  onClick={refreshRecommendations}
                  className="mt-4 text-[#666] hover:text-white text-sm font-medium transition-colors"
                >
                  Try refreshing
                </button>
              </div>
            )}

            {/* Reset option */}
            <div className="mt-10 pt-6 border-t border-[#1f1f1f]">
              <button
                onClick={resetAllData}
                className="flex items-center gap-2 text-[#444] hover:text-red-400/70 text-sm transition-colors mx-auto"
              >
                <RotateCcw className="w-4 h-4" />
                Start Over
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <style jsx global>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      <div className="bg-[#111] rounded-2xl p-6 sm:p-10 border border-[#1f1f1f] min-h-[500px]">
        {renderStep()}
      </div>
    </div>
  );
}
