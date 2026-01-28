"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center text-center px-4 pointer-events-none">
      {/* Content */}
      <div className="relative z-10">
        {/* Main Heading */}
        <h1 className="font-['Inter'] text-3xl min-[370px]:text-[2.15rem] min-[414px]:text-[2.3rem] sm:text-5xl lg:text-6xl md:text-[3.5rem] font-bold text-black max-w-4xl leading-tight">
          Your Personal Game Discovery Engine.
        </h1>

        {/* Subheading */}
        <p className="font-['Inter'] text-sm sm:text-lg text-black mt-3 sm:mt-6 max-w-2xl mx-auto text-center">
          Search across millions of games from Steam, Epic, and beyond, all in
          one place.
        </p>

        {/* Buttons with subtle hover interactions */}
        <div className="flex flex-row gap-2 sm:gap-4 mt-5 sm:mt-8 justify-center items-center">
          <Link
            href="/app"
            className="font-['Inter'] font-medium text-xs sm:text-base px-3 sm:px-8 py-2 sm:py-3 bg-black text-white rounded-full transition-all duration-300 hover:bg-gray-800 hover:scale-[1.02] pointer-events-auto"
          >
            Start Exploring
          </Link>
          <Link
            href="/app#charts"
            className="font-['Inter'] font-medium text-xs sm:text-base px-3 sm:px-8 py-2 sm:py-3 bg-white text-black border-2 border-black rounded-full transition-all duration-300 hover:bg-gray-100 hover:scale-[1.02] pointer-events-auto"
          >
            View Charts
          </Link>
        </div>
      </div>
    </section>
  );
}
