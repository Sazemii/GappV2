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

      {/* Content layer */}
      <main className="relative z-10">
        {/* First section with LED background */}
        <div className="flex min-h-screen flex-col p-8">
          {/* Navigation */}
          <div className="w-full flex justify-center relative">
            <HomeNavBar />
          </div>

          {/* Hero Section - centered */}
          <div className="flex-1 flex items-center justify-center relative pt-20 min-[440px]:pt-0 sm:pt-23 md:pt-[8rem]">
            <Hero />
          </div>
        </div>

        {/* Bento Boxes Section */}
        <div className="relative">
          <BentoBoxes />
        </div>

        {/* How It Works Section */}
        <div className="relative">
          <HowItWorks />
        </div>
      </main>

      {/* Spline Robot - on top, configure pass-through in Spline editor */}
      <div className="absolute inset-0 h-screen z-20">
        <SplineRobot />
      </div>
    </div>
  );
}
