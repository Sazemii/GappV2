import LedMatrix from "./components/LedMatrix";
import SplineRobot from "./components/SplineRobot";
import HomeNavBar from "./components/homeNavBar";
import Hero from "./components/Hero";

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

      {/* Content on top */}
      <main className="relative z-10">
        {/* First section with LED background */}
        <div className="flex min-h-screen flex-col p-8">
          {/* Navigation */}
          <div className=" w-full flex justify-center ">
            <HomeNavBar />
          </div>

          {/* Hero Section - centered */}
          <div className="flex-1 flex items-center justify-center">
            <Hero />
          </div>
        </div>

        {/* Additional content sections with white background */}
        <div className="bg-white min-h-screen p-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              More Content
            </h2>
            <p className="text-gray-600">
              This section has a clean white background. Scroll to see the
              transition.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
