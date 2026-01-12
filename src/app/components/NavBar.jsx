"use client";

import Image from "next/image";

export default function NavBar({navItems, searchValue, mobileMenuOpen, showHeader, activeNav, setActiveNav, setSearchValue, setMobileMenuOpen}){
    
    return (<nav
        className={`sticky top-5 bg-[#1B1B1B] rounded-[30px] px-4 sm:px-6 py-2 flex items-center gap-4 sm:gap-8 lg:gap-12 h-fit mx-4 z-50 transition-transform duration-300 ease-in-out ${
          showHeader ? "translate-y-0" : "-translate-y-20"
        }`}
      >
        <span className="font-['ADLaM_Display'] text-[18px] sm:text-[22px] text-white font-normal">
          GAPP
        </span>

        {/* Desktop Nav Items */}
        <div className="hidden sm:flex gap-4 lg:gap-6 items-center">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => setActiveNav(item)}
              className={`font-['Inter'] text-[14px] transition-colors ${
                activeNav === item ? "text-white" : "text-[#B2B2B2]"
              } hover:text-white`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="bg-[#252525] rounded-[10px] px-2 py-1 flex items-center gap-2 w-[140px] sm:w-[180px] lg:w-[200px]">
          <Image
            src="/_Magnifyingglass.svg"
            alt="Search"
            width={26}
            height={26}
            className="flex-shrink-0 w-5 h-5 sm:w-[26px] sm:h-[26px]"
          />

          <input
            type="text"
            placeholder="Search games.."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="bg-transparent border-none outline-none font-['Inter'] text-[12px] sm:text-[14px] text-[#A1A1A1] placeholder:text-[#A1A1A1] flex-1 min-w-0"
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
        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="sm:hidden flex flex-col gap-1 p-1"
          aria-label="Toggle menu"
        >
          <span
            className={`block w-5 h-0.5 bg-white transition-transform ${
              mobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
            }`}
          ></span>
          <span
            className={`block w-5 h-0.5 bg-white transition-opacity ${
              mobileMenuOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`block w-5 h-0.5 bg-white transition-transform ${
              mobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
            }`}
          ></span>
        </button>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="sm:hidden absolute top-full left-0 right-0 mt-2 bg-[#1B1B1B] rounded-2xl py-3 px-4 flex flex-col gap-2 z-50">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => {
                  setActiveNav(item);
                  setMobileMenuOpen(false);
                }}
                className={`font-['Inter'] text-[14px] transition-colors text-left py-2 ${
                  activeNav === item ? "text-white" : "text-[#B2B2B2]"
                } hover:text-white`}
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </nav>)

}