"use client";

import { Gamepad2, Compass, Sparkles } from "lucide-react";

export default function DiscoverSection() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="bg-gradient-to-br from-[#1a1a1a]/80 to-[#0f0f0f] rounded-3xl p-12 text-center border border-[#252525] relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 p-4 rounded-2xl border border-purple-500/20">
                <Compass className="w-10 h-10 text-purple-400" />
              </div>
              <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-yellow-400 animate-pulse" />
            </div>
          </div>

          <h2 className="text-white text-2xl font-bold mb-3">Discover</h2>
          <p className="text-white/50 text-sm max-w-md mx-auto mb-8">
            Personalized game recommendations, curated collections, and hidden
            gems coming soon...
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
              <Gamepad2 className="w-4 h-4 text-purple-400" />
              <span className="text-white/60 text-sm">AI Recommendations</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-white/60 text-sm">Curated Lists</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
              <Compass className="w-4 h-4 text-blue-400" />
              <span className="text-white/60 text-sm">Hidden Gems</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
