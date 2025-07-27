"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import FeatureSection from "../components/FeatureSection";
import FAQSection from "../components/FAQSection";
import Footer from "../components/Footer";
import Slider from "@/components/slider";
import Navbar from "@/components/Navbar";
export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 text-black">
      {/*Header */}
     < Navbar/>

      {/*middle */}

      <div className="relative overflow-hidden ">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover blur-md z-0"
        >
          <source src="\images\guestures.mp4" type="video/mp4" />
        </video>
        <Slider className='relative z-10 rounded-md' />
      </div>


      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center justify-center text-center py-20"
      >
        <h2 className="text-5xl font-bold text-green-900">#1 Live Chat Platform</h2>
        <p className="mt-4 text-lg text-gray-600">Talk to anyone, anytime — just one click away.</p>
        <button
          onClick={() => router.push("/chat")}
          className="mt-8 px-8 py-3 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700"
        >
          Start Chatting Now
        </button>
      </motion.section>

      <FeatureSection />
      <FAQSection />
      <Footer />
    </div>
  );
}
