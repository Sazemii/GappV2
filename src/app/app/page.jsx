"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import HomeSection from "../components/HomeSection";
import ChartsSection from "../components/ChartsSection";
import DiscoverSection from "../components/DiscoverSection";
import SteamGameDetail from "../components/SteamGameDetail";
import NavBar from "../components/NavBar";
export default function AppPage() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState("Home");
  const [searchValue, setSearchValue] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Steam game detail modal state
  const [selectedSteamGame, setSelectedSteamGame] = useState(null);

  // Filter and sort state for Home section
  const [filters, setFilters] = useState({
    genres: [],
    platforms: [],
  });
  const [sortBy, setSortBy] = useState("-added");

  const navItems = ["Home", "Charts", "Discover"];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Debounce search query from nav search bar
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchValue);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchValue]);

  // Handle scroll for sticky header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        setShowHeader(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down
        setShowHeader(false);
      } else {
        // Scrolling up
        setShowHeader(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Handle click on RAWG game (navigate to detail page)
  const handleRawgGameClick = (game) => {
    router.push(`/app/${game.id}`);
  };

  // Handle click on Steam game (open modal with Steam details)
  const handleSteamGameClick = (game) => {
    setSelectedSteamGame(game);
  };

  // Close Steam game modal
  const closeSteamGameModal = () => {
    setSelectedSteamGame(null);
    // Scroll to top when closing modal
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-[#111111] flex flex-col items-center pt-5 pb-10">
      

      <NavBar 
      navItems={navItems}
      searchValue={searchValue}
      mobileMenuOpen={mobileMenuOpen}
      showHeader={showHeader}
      activeNav={activeNav}
      setActiveNav={setActiveNav}
      setSearchValue={setSearchValue}
      setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Main Content Area */}
      <section className="w-full mt-8 sm:mt-14">
        {activeNav === "Home" ? (
          <HomeSection
            debouncedQuery={debouncedQuery}
            filters={filters}
            setFilters={setFilters}
            sortBy={sortBy}
            setSortBy={setSortBy}
            onGameClick={handleRawgGameClick}
            onSteamGameClick={handleSteamGameClick}
          />
        ) : activeNav === "Charts" ? (
          <ChartsSection onGameClick={handleSteamGameClick} />
        ) : (
          <DiscoverSection />
        )}
      </section>

      {/* Steam Game Detail Modal */}
      {selectedSteamGame && (
        <SteamGameDetail
          game={selectedSteamGame}
          onClose={closeSteamGameModal}
        />
      )}
    </div>
  );
}
