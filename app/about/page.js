import Footer from "@/components/Footer";
export default function About() {
  return (
    <>
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col items-center py-12 px-4">
      <div className="max-w-5xl w-full text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-4">About Our Project</h1>
        <p className="text-lg md:text-xl text-gray-700">
          Our project is an <span className="font-semibold">Advanced Video Calling Platform</span> that
          combines cutting-edge technologies to make communication easier, smarter, and
          barrier-free.
        </p>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl">
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:scale-105 transition">
          <img
            src="/images/ank.jpg"
            alt="Video Call"
            className="rounded-xl mb-4"
          />
          <h2 className="text-xl font-semibold text-blue-700 mb-2">High Quality Audio & Video Calls</h2>
          <p className="text-gray-600">Enjoy seamless video and audio calls with low latency and crystal-clear quality.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 hover:scale-105 transition">
          <img
            src="/images/ank.jpg"
            alt="Face Detection"
            className="rounded-xl mb-4"
          />
          <h2 className="text-xl font-semibold text-blue-700 mb-2">Face Detection</h2>
          <p className="text-gray-600">Smart face detection for enhanced interaction and security during calls.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 hover:scale-105 transition">
          <img
            src="/images/ank.jpg"
            alt="Multi Language"
            className="rounded-xl mb-4"
          />
          <h2 className="text-xl font-semibold text-blue-700 mb-2">Multi-Language Support</h2>
          <p className="text-gray-600">Real-time translation lets you listen in your preferred language without barriers.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 hover:scale-105 transition">
          <img
            src="/images/ank.jpg"
            alt="DM Chats"
            className="rounded-xl mb-4"
          />
          <h2 className="text-xl font-semibold text-blue-700 mb-2">Direct Messaging</h2>
          <p className="text-gray-600">Stay connected with private DM chats alongside your video calls.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 hover:scale-105 transition">
          <img
            src="/images/ank.jpg"
            alt="Team"
            className="rounded-xl mb-4"
          />
          <h2 className="text-xl font-semibold text-blue-700 mb-2">Meet the Team</h2>
          <p className="text-gray-600">A passionate group of developers and designers building the future of communication.</p>
        </div>
      </div>

    </div>
    <Footer className= "h-20"/>
    </>
  );
}
