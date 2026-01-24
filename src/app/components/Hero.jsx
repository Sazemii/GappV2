"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center text-center px-4">
      {/* Content */}
      <div className="relative z-10">
        {/* Main Heading */}
        <h1 className="font-['Inter'] text-4xl sm:text-5xl lg:text-6xl font-bold text-black max-w-4xl leading-tight">
          Your Personal Game Discovery Engine
        </h1>

        {/* Subheading */}
        <p className="font-['Inter'] text-base sm:text-lg text-gray-600 mt-6 max-w-2xl">
          Search across millions of games from Steam, Epic, and beyond, all in
          one place.
        </p>

        {/* Buttons */}
        <div className="flex flex-row gap-4 mt-8 justify-center">
          <Link
            href="/app"
            className="font-['Inter'] text-sm sm:text-base px-6 sm:px-8 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
          >
            Start Exploring
          </Link>
          <Link
            href="/app#charts"
            className="font-['Inter'] text-sm sm:text-base px-6 sm:px-8 py-3 bg-white text-black border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
          >
            View Charts
          </Link>
        </div>
      </div>
    </section>
  );
}
