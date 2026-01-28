"use client";

import { useEffect, useRef, useState } from "react";

function Step({ number, title, description, isLast }) {
  return (
    <div className="relative flex gap-3 sm:gap-4 md:gap-6">
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-4 sm:left-5 md:left-6 top-10 sm:top-12 md:top-14 w-px h-[calc(100%-0.5rem)] bg-gradient-to-b from-[#6B21A8]/50 to-transparent" />
      )}

      {/* Step number circle - darker solid purple, no gradient */}
      <div className="relative z-10 flex-shrink-0">
        <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-[#581C87] flex items-center justify-center shadow-lg shadow-purple-900/20">
          <span className="font-['Inter'] font-bold text-white text-xs sm:text-sm md:text-base">
            {number}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 pb-6 sm:pb-10 md:pb-14">
        <h3 className="font-['Inter'] font-semibold text-white text-sm sm:text-base md:text-xl mb-1 sm:mb-2">
          {title}
        </h3>
        <p className="font-['Inter'] text-[#9CA3AF] text-xs sm:text-sm md:text-base leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

export default function HowItWorks() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const steps = [
    {
      number: "1",
      title: "Data Collection",
      description:
        "Our system automatically fetches player counts and game data from Steam's API through scheduled cron jobs running every hour.",
    },
    {
      number: "2",
      title: "Processing & Storage",
      description:
        "Raw data is processed, cleaned, and stored in our database. We track historical trends, calculate changes, and identify trending games.",
    },
    {
      number: "3",
      title: "Real-Time Analytics",
      description:
        "Access live player counts, 48-hour trends, peak records, and discover what games are gaining momentum right now.",
    },
    {
      number: "4",
      title: "Search & Discover",
      description:
        "Search across millions of games from multiple platforms. Filter, sort, and find your next favorite game with our powerful discovery engine.",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-12 sm:py-20 md:py-32 px-4 sm:px-8 bg-[#0D0D0D] overflow-hidden"
    >
      {/* Animated background gradient orbs */}
      <div className="absolute top-0 left-1/4 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-purple-900/20 rounded-full blur-3xl animate-blob-1" />
      <div className="absolute bottom-0 right-1/4 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-purple-800/15 rounded-full blur-3xl animate-blob-2" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-64 md:w-80 h-48 sm:h-64 md:h-80 bg-fuchsia-900/10 rounded-full blur-3xl animate-blob-3" />

      {/* Grid pattern overlay with moving light effect */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
      
      {/* Moving light lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-px h-20 bg-gradient-to-b from-transparent via-purple-500/30 to-transparent animate-light-line-1" />
        <div className="absolute w-20 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent animate-light-line-2" />
        <div className="absolute w-px h-16 bg-gradient-to-b from-transparent via-fuchsia-500/25 to-transparent animate-light-line-3" />
      </div>

      <div className="relative max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-16 md:mb-24">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 mb-4 sm:mb-6">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="font-['Inter'] text-[10px] sm:text-xs md:text-sm text-white/70">
              Always Running
            </span>
          </div>
          <h2 className="font-['Inter'] text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-3 sm:mb-4 md:mb-6">
            How It Works
          </h2>
          <p className="font-['Inter'] text-xs sm:text-sm md:text-lg text-[#9CA3AF] max-w-2xl mx-auto">
            From raw Steam data to actionable insights — here's the magic behind
            the scenes.
          </p>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-start">
          {/* Steps */}
          <div className="order-2 lg:order-1">
            {steps.map((step, index) => (
              <Step
                key={step.number}
                number={step.number}
                title={step.title}
                description={step.description}
                isLast={index === steps.length - 1}
              />
            ))}
          </div>

          {/* Visual illustration */}
          <div className="order-1 lg:order-2 relative h-[200px] sm:h-[280px] md:h-[380px] lg:sticky lg:top-32">
            {/* Main card */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1B1B1B] to-[#141414] rounded-xl sm:rounded-2xl md:rounded-3xl border border-white/5 overflow-hidden">
              {/* Terminal-like header */}
              <div className="flex items-center gap-1.5 sm:gap-2 p-2 sm:p-3 md:p-4 border-b border-white/5">
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full bg-red-500/70" />
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500/70" />
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full bg-green-500/70" />
                <span className="ml-1 sm:ml-2 font-mono text-[8px] sm:text-[10px] md:text-xs text-white/40">
                  data-pipeline.js
                </span>
              </div>

              {/* Code content */}
              <div className="p-3 sm:p-4 md:p-6 font-mono text-[8px] sm:text-[10px] md:text-xs leading-relaxed">
                <div className="text-[#6B7280]">
                  {"// Scheduled cron job"}
                </div>
                <div className="mt-1 sm:mt-2">
                  <span className="text-fuchsia-400">async function</span>
                  <span className="text-white"> collectSteamData</span>
                  <span className="text-[#9CA3AF]">() {"{"}</span>
                </div>
                <div className="ml-2 sm:ml-4 mt-0.5 sm:mt-1">
                  <span className="text-[#6B7280]">const</span>
                  <span className="text-cyan-400"> games</span>
                  <span className="text-[#9CA3AF]"> = </span>
                  <span className="text-fuchsia-400">await</span>
                  <span className="text-white"> fetchTopGames</span>
                  <span className="text-[#9CA3AF]">();</span>
                </div>
                <div className="ml-2 sm:ml-4 mt-0.5 sm:mt-1">
                  <span className="text-[#6B7280]">const</span>
                  <span className="text-cyan-400"> trends</span>
                  <span className="text-[#9CA3AF]"> = </span>
                  <span className="text-white">calculateTrends</span>
                  <span className="text-[#9CA3AF]">(games);</span>
                </div>
                <div className="ml-2 sm:ml-4 mt-0.5 sm:mt-1">
                  <span className="text-fuchsia-400">await</span>
                  <span className="text-white"> db</span>
                  <span className="text-[#9CA3AF]">.</span>
                  <span className="text-white">save</span>
                  <span className="text-[#9CA3AF]">(trends);</span>
                </div>
                <div className="text-[#9CA3AF]">{"}"}</div>

                {/* Animated cursor */}
                <div className="mt-2 sm:mt-4 flex items-center gap-1">
                  <span className="text-green-400">▶</span>
                  <span className="text-white/50">Running...</span>
                  <span className="w-1.5 h-3 sm:w-2 sm:h-4 bg-white/70 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA - darker solid purple button */}
        <div className="mt-10 sm:mt-16 md:mt-24 text-center">
          <a
            href="/app"
            className="group inline-flex items-center gap-2 font-['Inter'] font-medium text-xs sm:text-sm md:text-base px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-[#581C87] hover:bg-[#6B21A8] text-white rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-900/30"
          >
            Start Exploring
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes blob-1 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -20px) scale(1.05);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.95);
          }
        }
        @keyframes blob-2 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(-25px, 15px) scale(0.95);
          }
          66% {
            transform: translate(15px, -25px) scale(1.05);
          }
        }
        @keyframes blob-3 {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1);
          }
        }
        @keyframes light-line-1 {
          0% {
            top: -80px;
            left: 20%;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            top: 100%;
            left: 20%;
            opacity: 0;
          }
        }
        @keyframes light-line-2 {
          0% {
            top: 30%;
            left: -80px;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            top: 30%;
            left: 100%;
            opacity: 0;
          }
        }
        @keyframes light-line-3 {
          0% {
            top: -64px;
            right: 25%;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            top: 100%;
            right: 25%;
            opacity: 0;
          }
        }
        .animate-blob-1 {
          animation: blob-1 8s ease-in-out infinite;
        }
        .animate-blob-2 {
          animation: blob-2 10s ease-in-out infinite;
        }
        .animate-blob-3 {
          animation: blob-3 6s ease-in-out infinite;
        }
        .animate-light-line-1 {
          animation: light-line-1 6s linear infinite;
        }
        .animate-light-line-2 {
          animation: light-line-2 8s linear infinite;
          animation-delay: 2s;
        }
        .animate-light-line-3 {
          animation: light-line-3 7s linear infinite;
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
}
