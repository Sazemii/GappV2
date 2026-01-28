"use client";

import Link from "next/link";

export default function HomeNavBar() {
  const navItems = [
    { name: "Discover", href: "/app" },
    { name: "Charts", href: "/app#charts" },
  ];

  return (
    <nav className="bg-[#D9D9D9] rounded-[30px] px-6 sm:px-8 py-3 flex items-center justify-between h-fit w-[30rem] max-w-[800px] z-50">
      <span className="font-['ADLaM_Display'] text-[18px] sm:text-[22px] text-black font-normal">
        GAPP
      </span>

      {/* Nav Items with hover effects */}
      <div className="flex gap-6 lg:gap-8 items-center">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="group relative font-['Inter'] text-[14px] text-black transition-colors"
          >
            <span className="relative z-10 group-hover:text-gray-600 transition-colors">
              {item.name}
            </span>
            {/* Underline animation */}
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black group-hover:w-full transition-all duration-300 ease-out" />
          </Link>
        ))}
      </div>
    </nav>
  );
}
