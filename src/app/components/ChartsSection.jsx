"use client";

import TopGames from "./TopGames";
import TrendingGames from "./TrendingGames";
import PeakRecords from "./PeakRecords";

export default function ChartsSection({ onGameClick }) {
  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <div className="mb-8">
        <h1 className="font-['Inter'] text-3xl font-bold text-white mb-2">
          Steam Charts
        </h1>
        <p className="text-[#A1A1A1] text-sm">
          Real-time player statistics and all-time peak records. Click on any
          game to view detailed Steam information.
        </p>
      </div>
      <div className="space-y-8">
        <TopGames showAll={true} hideButton onGameClick={onGameClick} />
        <TrendingGames showAll={true} hideButton onGameClick={onGameClick} />
        <PeakRecords showAll={true} hideButton onGameClick={onGameClick} />
      </div>
    </div>
  );
}
