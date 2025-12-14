import LedMatrix from "./components/LedMatrix";

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
        <div className="flex min-h-screen flex-col items-center justify-center p-8">
          {/* <div className="rounded-2xl bg-white/80 backdrop-blur-sm p-12 shadow-xl">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              LED Matrix Effect
            </h1>
            <p className="text-gray-600 max-w-md">
              A canvas-based LED matrix animation with random accent colors and
              a fade overlay effect. The effect is more visible at the bottom
              and fades towards the top.
            </p>
          </div> */}
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
