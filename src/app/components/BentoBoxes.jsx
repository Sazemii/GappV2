"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useRef, useEffect, useState } from "react";
import { Star, Users, Calendar } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Filler,
);

// Static demo data for the bento chart
const demoChartData = [
  { value: 12 },
  { value: 14 },
  { value: 18 },
  { value: 22 },
  { value: 19 },
  { value: 16 },
  { value: 20 },
  { value: 24 },
  { value: 21 },
  { value: 18 },
  { value: 16 },
  { value: 19 },
];

// Demo games data (similar to RAWG API structure)
const demoGames = [
  {
    id: 1,
    name: "Elden Ring",
    background_image:
      "https://media.rawg.io/media/games/5ec/5ecac5cb026ec26a56efcc546364e348.jpg",
    rating: 4.5,
    genres: [
      { id: 1, name: "RPG" },
      { id: 2, name: "Action" },
    ],
    platforms: ["PC", "PS"],
    released: "2022-02-25",
    added: 15420,
  },
  {
    id: 2,
    name: "Cyberpunk 2077",
    background_image:
      "https://media.rawg.io/media/games/26d/26d4437715bee60138dab4a7c8c59c92.jpg",
    rating: 4.1,
    genres: [
      { id: 1, name: "RPG" },
      { id: 3, name: "Shooter" },
    ],
    platforms: ["PC", "XB"],
    released: "2020-12-10",
    added: 12850,
  },
  {
    id: 3,
    name: "Baldur's Gate 3",
    background_image:
      "https://media.rawg.io/media/games/699/69907ecf13f172e9e144069769c3be73.jpg",
    rating: 4.8,
    genres: [
      { id: 1, name: "RPG" },
      { id: 4, name: "Strategy" },
    ],
    platforms: ["PC", "PS"],
    released: "2023-08-03",
    added: 18200,
  },
];

function BentoChart() {
  const chartRef = useRef(null);

  const values = demoChartData.map((d) => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const padding = (maxValue - minValue) * 0.15;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: { top: 4, bottom: 4, left: 2, right: 2 },
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    scales: {
      x: { display: false, grid: { display: false } },
      y: {
        display: true,
        min: minValue - padding,
        max: maxValue + padding,
        grid: { display: false },
        ticks: {
          color: "#6B7280",
          font: { size: 9, family: "Inter" },
          padding: 4,
          callback: function (value) {
            return "€ " + Math.round(value);
          },
        },
        border: { display: false },
      },
    },
    elements: {
      line: { borderWidth: 2, tension: 0.4 },
      point: { radius: 0, hoverRadius: 0 },
    },
  };

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    const updateGradient = () => {
      const ctx = chart.ctx || (chart.canvas && chart.canvas.getContext("2d"));
      const chartArea = chart.chartArea;
      if (!ctx || !chartArea) return;

      const magentaGradient = ctx.createLinearGradient(
        chartArea.left,
        0,
        chartArea.right,
        0,
      );
      magentaGradient.addColorStop(0, "#D946EF");
      magentaGradient.addColorStop(1, "#A855F7");

      const cyanGradient = ctx.createLinearGradient(
        chartArea.left,
        0,
        chartArea.right,
        0,
      );
      cyanGradient.addColorStop(0, "#06B6D4");
      cyanGradient.addColorStop(1, "#3B82F6");

      const fillGradient = ctx.createLinearGradient(
        0,
        chartArea.top,
        0,
        chartArea.bottom,
      );
      fillGradient.addColorStop(0, "rgba(168, 85, 247, 0.15)");
      fillGradient.addColorStop(1, "transparent");

      chart.data.datasets[0].borderColor = magentaGradient;
      chart.data.datasets[0].backgroundColor = fillGradient;
      chart.data.datasets[1].borderColor = cyanGradient;
      chart.update("none");
    };

    setTimeout(updateGradient, 0);
  }, []);

  const secondaryData = demoChartData.map((d) => ({
    value: d.value - 3 + Math.random() * 2,
  }));

  return (
    <div className="w-full h-full">
      <Line
        ref={chartRef}
        data={{
          labels: demoChartData.map(() => ""),
          datasets: [
            {
              data: demoChartData.map((d) => d.value),
              fill: true,
              borderColor: "#D946EF",
            },
            {
              data: secondaryData.map((d) => d.value),
              fill: false,
              borderColor: "#06B6D4",
              borderWidth: 2,
              tension: 0.4,
            },
          ],
        }}
        options={options}
      />
    </div>
  );
}

// Mini Game Card - mirrors the actual GameCard structure
function MiniGameCard({ game }) {
  const getRatingColor = (rating) => {
    if (rating >= 4) return "text-emerald-400";
    if (rating >= 3) return "text-yellow-400";
    return "text-orange-400";
  };

  return (
    <div className="bg-[#1a1a1a] rounded-lg overflow-hidden border border-[#2a2a2a] w-[72px] sm:w-[80px] flex-shrink-0">
      {/* Game Image */}
      <div className="relative h-12 sm:h-14 overflow-hidden">
        <img
          src={game.background_image}
          alt={game.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent" />

        {/* Platform Tags */}
        <div className="absolute top-1 left-1 flex gap-0.5">
          {game.platforms.slice(0, 2).map((platform) => (
            <span
              key={platform}
              className="bg-black/60 backdrop-blur-sm text-[5px] text-white/90 px-1 py-0.5 rounded font-medium"
            >
              {platform}
            </span>
          ))}
        </div>

        {/* Rating Badge */}
        {game.rating > 0 && (
          <div className="absolute top-1 right-1 bg-black/60 backdrop-blur-sm rounded px-1 py-0.5 flex items-center gap-0.5">
            <Star
              className={`w-2 h-2 ${getRatingColor(game.rating)} fill-current`}
            />
            <span
              className={`text-[6px] font-semibold ${getRatingColor(game.rating)}`}
            >
              {game.rating.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {/* Game Info */}
      <div className="p-1.5 space-y-0.5">
        <h3 className="font-semibold text-white text-[7px] leading-tight line-clamp-1">
          {game.name}
        </h3>

        {/* Genres */}
        <div className="flex flex-wrap gap-0.5">
          {game.genres.slice(0, 2).map((genre) => (
            <span
              key={genre.id}
              className="text-[5px] text-purple-300/80 bg-purple-500/10 px-1 py-0.5 rounded-full border border-purple-500/20"
            >
              {genre.name}
            </span>
          ))}
        </div>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-[5px] text-[#888]">
          <div className="flex items-center gap-0.5">
            <Calendar className="w-1.5 h-1.5" />
            <span>{new Date(game.released).getFullYear()}</span>
          </div>
          <div className="flex items-center gap-0.5">
            <Users className="w-1.5 h-1.5" />
            <span>{(game.added / 1000).toFixed(1)}K</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Intelligent section with game cards grid + blur overlay - centered horizontally
function IntelligentShowcase() {
  return (
    <div className="relative w-full h-full overflow-hidden flex justify-center">
      {/* Game cards - centered */}
      <div className="flex gap-2 justify-center">
        {demoGames.map((game) => (
          <MiniGameCard key={game.id} game={game} />
        ))}
      </div>

      {/* Blur overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1B1B1B] via-[#1B1B1B]/50 to-transparent pointer-events-none" />
      <div className="absolute inset-0 backdrop-blur-[0.5px] pointer-events-none" />
    </div>
  );
}

// Precise section - animated stats with visual flair
function PreciseShowcase() {
  const [counts, setCounts] = useState({ current: 0, peak: 0, tracked: 0 });
  const [isAnimating, setIsAnimating] = useState(false);

  const targetCounts = { current: 847523, peak: 1234567, tracked: 85432 };

  useEffect(() => {
    if (isAnimating) {
      const duration = 1500;
      const steps = 60;
      const interval = duration / steps;
      let step = 0;

      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        const easeOut = 1 - Math.pow(1 - progress, 3);

        setCounts({
          current: Math.round(targetCounts.current * easeOut),
          peak: Math.round(targetCounts.peak * easeOut),
          tracked: Math.round(targetCounts.tracked * easeOut),
        });

        if (step >= steps) {
          clearInterval(timer);
        }
      }, interval);

      return () => clearInterval(timer);
    }
  }, [isAnimating]);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(2) + "M";
    if (num >= 1000) return (num / 1000).toFixed(0) + "K";
    return num.toString();
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Stats display */}
      <div className="relative grid grid-cols-3 gap-2 sm:gap-4 w-full px-2">
        {/* Current Players */}
        <div className="text-center p-2 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20">
          <div className="text-emerald-400 font-mono text-xs sm:text-lg md:text-xl font-bold tabular-nums">
            {formatNumber(counts.current)}
          </div>
          <div className="text-[7px] sm:text-[9px] text-emerald-400/60 uppercase tracking-wider mt-0.5 flex items-center justify-center gap-1">
            <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
            Live
          </div>
        </div>

        {/* Peak Players */}
        <div className="text-center p-2 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20">
          <div className="text-purple-400 font-mono text-xs sm:text-lg md:text-xl font-bold tabular-nums">
            {formatNumber(counts.peak)}
          </div>
          <div className="text-[7px] sm:text-[9px] text-purple-400/60 uppercase tracking-wider mt-0.5">
            Peak Today
          </div>
        </div>

        {/* Games Tracked - now green */}
        <div className="text-center p-2 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20">
          <div className="text-emerald-400 font-mono text-xs sm:text-lg md:text-xl font-bold tabular-nums">
            {formatNumber(counts.tracked)}
          </div>
          <div className="text-[7px] sm:text-[9px] text-emerald-400/60 uppercase tracking-wider mt-0.5">
            Games
          </div>
        </div>
      </div>

      {/* Strong dark fade from left side */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1B1B1B]/80 via-[#1B1B1B]/30 to-transparent pointer-events-none" />
    </div>
  );
}

// Aggregated section - original design with Steam→arrows→database pulse
function AggregatedShowcase() {
  const [pulseIndex, setPulseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseIndex((prev) => (prev + 1) % 4);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full flex items-center justify-center gap-3 sm:gap-4">
      {/* Steam icon */}
      <div className="relative">
        <div
          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#1b2838] to-[#2a475e] flex items-center justify-center transition-all duration-300 ${pulseIndex === 0 ? "scale-110 shadow-lg shadow-blue-500/30" : ""}`}
        >
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 text-white"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385l4.005-7.245c-.075-.015-.15-.03-.225-.045-.51-.09-.99-.27-1.44-.54l-3.72 2.46c-.15-.12-.3-.255-.435-.39l3.735-2.475c-.255-.345-.45-.735-.585-1.155-.135-.42-.195-.855-.195-1.305 0-.45.06-.885.18-1.305.12-.42.3-.81.54-1.17l-3.9 2.58c-.33-.135-.66-.24-1.005-.315l3.945-2.61c.315-.285.69-.51 1.11-.675l5.79-10.485C18.3.825 15.255 0 12 0zm0 7.5c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5z" />
          </svg>
        </div>
        <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-400 animate-pulse" />
      </div>

      {/* Animated arrows */}
      <div className="flex flex-col gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`flex items-center gap-1 transition-all duration-300 ${pulseIndex === i + 1 ? "opacity-100 translate-x-1" : "opacity-40"}`}
          >
            <div className="w-4 sm:w-6 h-0.5 bg-gradient-to-r from-purple-400 to-transparent rounded" />
            <svg
              className="w-2 h-2 text-purple-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        ))}
      </div>

      {/* Database icon */}
      <div
        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center transition-all duration-300 ${pulseIndex === 3 ? "scale-110 shadow-lg shadow-purple-500/30" : ""}`}
      >
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
        </svg>
      </div>
    </div>
  );
}

// Icons
function TrendingIcon() {
  return (
    <svg
      className="w-3.5 h-3.5 md:w-4 md:h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

function LightbulbIcon() {
  return (
    <svg
      className="w-3.5 h-3.5 md:w-4 md:h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg
      className="w-3.5 h-3.5 md:w-4 md:h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function DatabaseIcon() {
  return (
    <svg
      className="w-3.5 h-3.5 md:w-4 md:h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  );
}

export default function BentoBoxes() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-10 sm:py-16 md:py-24 px-4 sm:px-8 bg-white"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div
          className={`text-center mb-6 sm:mb-10 md:mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="font-['Inter'] text-xl sm:text-2xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
            Why GAPP?
          </h2>
          <p className="font-['Inter'] text-xs sm:text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Discover games smarter with real-time analytics and intelligent
            recommendations.
          </p>
        </div>

        {/* Bento Grid - 2 columns layout */}
        <div className="flex flex-col md:flex-row gap-3 sm:gap-4 md:gap-5 h-auto md:h-[420px]">
          {/* Column 1: Live (65%) + Precise (35%) */}
          <div className="flex flex-col gap-3 sm:gap-4 md:gap-5 w-full md:w-[58%]">
            {/* Live - 65% of column height */}
            <div
              className={`bg-[#1B1B1B] rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-5 md:p-6 flex flex-col h-[180px] sm:h-[200px] md:flex-[65] transition-all duration-700 delay-100 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              {/* Chart Area - constrained height */}
              <div className="flex-1 mb-2 sm:mb-3 min-h-0 max-h-[100px] sm:max-h-[120px] md:max-h-none">
                <BentoChart />
              </div>

              {/* Label */}
              <div className="flex-shrink-0">
                <div className="flex items-center gap-1.5 sm:gap-2 text-white mb-0.5">
                  <TrendingIcon />
                  <h3 className="font-['Inter'] font-semibold text-sm sm:text-base md:text-lg">
                    Live
                  </h3>
                </div>
                <p className="font-['Inter'] text-[#9CA3AF] text-[10px] sm:text-xs md:text-sm leading-snug line-clamp-1">
                  Real time game data analytics
                </p>
              </div>
            </div>

            {/* Precise - 35% of column height */}
            <div
              className={`bg-[#1B1B1B] rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-5 md:p-6 flex flex-col h-[140px] sm:h-[160px] md:flex-[35] transition-all duration-700 delay-200 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              {/* Stats visualization */}
              <div className="flex-1 flex items-center min-h-0">
                <PreciseShowcase />
              </div>

              <div className="flex-shrink-0">
                <div className="flex items-center gap-1.5 sm:gap-2 text-white mb-0.5">
                  <TargetIcon />
                  <h3 className="font-['Inter'] font-semibold text-sm sm:text-base md:text-lg">
                    Precise
                  </h3>
                </div>
                <p className="font-['Inter'] text-[#9CA3AF] text-[10px] sm:text-xs md:text-sm leading-snug line-clamp-1">
                  Accurate player counts and historical data
                </p>
              </div>
            </div>
          </div>

          {/* Column 2: Intelligent (45%) + Aggregated (55%) */}
          <div className="flex flex-col gap-3 sm:gap-4 md:gap-5 w-full md:w-[42%]">
            {/* Intelligent - 45% of column height */}
            <div
              className={`bg-[#1B1B1B] rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-5 md:p-6 flex flex-col h-[180px] sm:h-[200px] md:flex-[45] transition-all duration-700 delay-300 overflow-hidden ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              {/* Game cards showcase - centered */}
              <div className="flex-1 flex items-center min-h-0">
                <IntelligentShowcase />
              </div>

              <div className="relative z-10 flex-shrink-0">
                <div className="flex items-center gap-1.5 sm:gap-2 text-white mb-0.5">
                  <LightbulbIcon />
                  <h3 className="font-['Inter'] font-semibold text-sm sm:text-base md:text-lg">
                    Intelligent
                  </h3>
                </div>
                <p className="font-['Inter'] text-[#9CA3AF] text-[10px] sm:text-xs md:text-sm leading-snug line-clamp-1">
                  Recommendations tailored to your taste
                </p>
              </div>
            </div>

            {/* Aggregated - 55% of column height */}
            <div
              className={`bg-[#1B1B1B] rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-5 md:p-6 flex flex-col h-[160px] sm:h-[180px] md:flex-[55] transition-all duration-700 delay-[400ms] ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              {/* Data aggregation visualization - original design */}
              <div className="flex-1 flex items-center min-h-0">
                <AggregatedShowcase />
              </div>

              <div className="flex-shrink-0">
                <div className="flex items-center gap-1.5 sm:gap-2 text-white mb-0.5">
                  <DatabaseIcon />
                  <h3 className="font-['Inter'] font-semibold text-sm sm:text-base md:text-lg">
                    Aggregated
                  </h3>
                </div>
                <p className="font-['Inter'] text-[#9CA3AF] text-[10px] sm:text-xs md:text-sm leading-snug line-clamp-1">
                  Cumulative data collected from Steam via scheduled updates
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
