"use client";

import Link from "next/link";

export default function HomeNavBar() {
  const navItems = [
    { name: "Discover", href: "/app" },
    { name: "Charts", href: "/app#charts" },
  ];

  return (
    <nav className="bg-[#D9D9D9] rounded-[30px] px-6 sm:px-8 py-3 flex items-center justify-between h-fit w-[30rem] max-w-[800px] z-50 relative pointer-events-auto">
      <span className="font-['ADLaM_Display'] text-[18px] sm:text-[22px] text-black font-normal pointer-events-auto">
        GAPP
      </span>

      {/* Nav Items with subtle underline animation */}
      <div className="flex gap-6 lg:gap-8 items-center pointer-events-auto">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="group relative font-['Inter'] text-[14px] text-black transition-colors hover:text-gray-600 pointer-events-auto"
          >
            <span>{item.name}</span>
            {/* Subtle underline animation like /app navbar */}
            <span className="absolute -bottom-0.5 left-0 w-0 h-[1.5px] bg-black group-hover:w-full transition-all duration-300 ease-out" />
          </Link>
        ))}
      </div>
    </nav>
  );
}
