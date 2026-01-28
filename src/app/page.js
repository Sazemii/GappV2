import LedMatrix from "./components/LedMatrix";
import SplineRobot from "./components/SplineRobot";
import HomeNavBar from "./components/homeNavBar";
import Hero from "./components/Hero";
import BentoBoxes from "./components/BentoBoxes";
import HowItWorks from "./components/HowItWorks";

export default function Home() {
  return (
    <div className="relative bg-white">
      {/* LED Matrix Background - only covers first viewport */}
      <div className="absolute inset-0 z-0 h-screen">
        <LedMatrix
          shapeType="Square"
          size={8}
          gap={3}
          primaryColor="#919191"
          secondaryColor="rgb(229, 231, 235)"
          probability={5}
          animSpeed={85}
        />
      </div>

      {/* Spline Robot - Full viewport, ON TOP for cursor tracking */}
      <div className="absolute inset-0 h-screen z-20">
        <div style={{ width: "100%", height: "100%" }}>
          <SplineRobot />
        </div>
      </div>

      {/* Content - below Spline but interactive elements poke through */}
      <main className="relative z-10">
        {/* First section with LED background */}
        <div className="flex min-h-screen flex-col p-8">
          {/* Navigation */}
          <div className="w-full flex justify-center relative z-30">
            <HomeNavBar />
          </div>

          {/* Hero Section - centered */}
          <div className="flex-1 flex items-center justify-center relative z-30 pt-20 min-[440px]:pt-0 sm:pt-23 md:pt-[8rem] ">
            <Hero />
          </div>
        </div>

        {/* Bento Boxes Section */}
        <div className="relative z-30">
          <BentoBoxes />
        </div>

        {/* How It Works Section */}
        <div className="relative z-30">
          <HowItWorks />
        </div>
      </main>
    </div>
  );
}
