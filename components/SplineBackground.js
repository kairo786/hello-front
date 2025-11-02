// components/SplineBackground.js

export default function SplineBackground() {
  return (
    <div className="relative hidden h-screen overflow-hidden md:block">
      <iframe
        src="https://my.spline.design/cutecomputerfollowcursor-CJSVMphXRTYr7F3TdIlLm8Wa/"
        frameBorder="0"
        width="1200"
        height="1200"
        style={{
          transform: "scale(0.6)",
          transformOrigin: "top center",
          pointerEvents: "auto",
        }}
        // OPTIMIZATION: iframe के loading attribute का उपयोग करें
        loading="lazy" 
      />

      {/* TEXT OVERLAY */}
      <div className="absolute z-20 text-center transform -translate-x-1/2 bottom-32 left-1/2">
        <h2 className="text-2xl text-gray-300">No chat selected</h2>
        <p className="mt-1 text-sm text-gray-500">
          Click on a user to start chatting
        </p>
      </div>
    </div>
  );
}