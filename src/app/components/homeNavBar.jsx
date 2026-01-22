"use client";

import Link from "next/link";

export default function HomeNavBar() {
  const navItems = ["Discover", "Charts"];

  return (
    <nav className="bg-[#D9D9D9] rounded-[30px] px-6 sm:px-8 py-3 flex items-center justify-between h-fit w-[30rem] max-w-[800px] z-50">
      <span className="font-['ADLaM_Display'] text-[18px] sm:text-[22px] text-black font-normal">
        GAPP
      </span>

      {/* Nav Items */}
      <div className="flex gap-6 lg:gap-8 items-center">
        {navItems.map((item) => (
          <Link
            key={item}
            href={item === "Discover" ? "/app" : "/app#charts"}
            className="font-['Inter'] text-[14px] text-black hover:text-gray-600 transition-colors"
          >
            {item}
          </Link>
        ))}
      </div>
    </nav>
  );
}
