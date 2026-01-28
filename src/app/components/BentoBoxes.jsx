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

      // Create gradient for magenta line
      const magentaGradient = ctx.createLinearGradient(
        chartArea.left,
        0,
        chartArea.right,
        0,
      );
      magentaGradient.addColorStop(0, "#D946EF");
      magentaGradient.addColorStop(1, "#A855F7");

      // Create gradient for cyan line
      const cyanGradient = ctx.createLinearGradient(
        chartArea.left,
        0,
        chartArea.right,
        0,
      );
      cyanGradient.addColorStop(0, "#06B6D4");
      cyanGradient.addColorStop(1, "#3B82F6");

      // Create fill gradient
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

  // Secondary line data (slightly offset)
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

// Icons as SVG components - smaller on mobile
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
              className={`bg-[#1B1B1B] rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-5 md:p-7 flex flex-col h-[180px] sm:h-[200px] md:flex-[65] transition-all duration-700 delay-100 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              {/* Chart Area */}
              <div className="flex-1 mb-2 sm:mb-3 md:mb-4">
                <BentoChart />
              </div>

              {/* Label */}
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-white mb-1">
                  <TrendingIcon />
                  <h3 className="font-['Inter'] font-semibold text-sm sm:text-base md:text-lg">
                    Live
                  </h3>
                </div>
                <p className="font-['Inter'] text-[#9CA3AF] text-[10px] sm:text-xs md:text-sm leading-relaxed">
                  Real time game data analytics
                </p>
              </div>
            </div>

            {/* Precise - 35% of column height */}
            <div
              className={`bg-[#1B1B1B] rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-5 md:p-7 flex flex-col justify-end h-[120px] sm:h-[140px] md:flex-[35] transition-all duration-700 delay-200 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <div className="flex items-center gap-1.5 sm:gap-2 text-white mb-1">
                <TargetIcon />
                <h3 className="font-['Inter'] font-semibold text-sm sm:text-base md:text-lg">
                  Precise
                </h3>
              </div>
              <p className="font-['Inter'] text-[#9CA3AF] text-[10px] sm:text-xs md:text-sm leading-relaxed">
                Accurate player counts and historical data
              </p>
            </div>
          </div>

          {/* Column 2: Intelligent (45%) + Aggregated (55%) */}
          <div className="flex flex-col gap-3 sm:gap-4 md:gap-5 w-full md:w-[42%]">
            {/* Intelligent - 45% of column height */}
            <div
              className={`bg-[#1B1B1B] rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-5 md:p-7 flex flex-col justify-end h-[120px] sm:h-[140px] md:flex-[45] transition-all duration-700 delay-300 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <div className="flex items-center gap-1.5 sm:gap-2 text-white mb-1">
                <LightbulbIcon />
                <h3 className="font-['Inter'] font-semibold text-sm sm:text-base md:text-lg">
                  Intelligent
                </h3>
              </div>
              <p className="font-['Inter'] text-[#9CA3AF] text-[10px] sm:text-xs md:text-sm leading-relaxed">
                Recommendations tailored to your taste
              </p>
            </div>

            {/* Aggregated - 55% of column height */}
            <div
              className={`bg-[#1B1B1B] rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-5 md:p-7 flex flex-col justify-end h-[140px] sm:h-[160px] md:flex-[55] transition-all duration-700 delay-[400ms] ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <div className="flex items-center gap-1.5 sm:gap-2 text-white mb-1">
                <DatabaseIcon />
                <h3 className="font-['Inter'] font-semibold text-sm sm:text-base md:text-lg">
                  Aggregated
                </h3>
              </div>
              <p className="font-['Inter'] text-[#9CA3AF] text-[10px] sm:text-xs md:text-sm leading-relaxed">
                Cumulative data collected from Steam via scheduled updates
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
