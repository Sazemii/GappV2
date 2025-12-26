"use client";

import { useState } from "react";
import Image from "next/image";

export default function AppPage() {
  const [activeNav, setActiveNav] = useState("Home");
  const [searchValue, setSearchValue] = useState("");

  const navItems = ["Home", "Charts", "Discover"];

  return (
    <div className="min-h-screen bg-[#111111] flex justify-center pt-5">
      <nav className="bg-[#1B1B1B] rounded-[30px] px-6 py-2 flex items-center gap-12 h-fit">
        <span className="font-['ADLaM_Display'] text-[22px] text-white font-normal">
          GAPP
        </span>

        <div className="flex gap-6 items-center">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => setActiveNav(item)}
              className={`font-['Inter'] text-[14px] transition-colors ${
                activeNav === item ? "text-white" : "text-[#B2B2B2]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="bg-[#252525] rounded-[10px] px-2 py-1 flex items-center gap-2 w-[200px]">
          <Image
            src="/_Magnifyingglass.svg"
            alt="Search"
            width={26}
            height={26}
            className="flex-shrink-0"
          />

          <input
            type="text"
            placeholder="Search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="bg-transparent border-none outline-none font-['Inter'] text-[14px] text-[#A1A1A1] placeholder:text-[#A1A1A1] flex-1 min-w-0"
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
      </nav>
    </div>
  );
}
