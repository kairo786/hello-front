"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import FeatureSection from "../components/FeatureSection";
import FAQSection from "../components/FAQSection";
import Footer from "../components/Footer";
import Slider from "@/components/slider";
import Navbar from "@/components/Navbar";
import GoogleAd from "@/components/adcomponet";
import Chatbot from "@/components/chatbot";
import { useSocket } from "./context/SocketContext";

export default function Home() {
  const socket = useSocket();
  const router = useRouter();
  const [onlineuser, setonlineuser] = useState(1);
  const [openbot, setopenbot] = useState(false);


  useEffect(() => {
    if(!socket){return ;}
    socket.on("usersUpdate", (count) => {
      setonlineuser(count - 1);
    });
  }, [socket]);


  return (
    <div className="min-h-screen text-white bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <Navbar />

      {/* Hero Section with Animated Background */}
      <div className="relative overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 animate-pulse"></div>
        
        {/* Particle Effect */}
        <div className="absolute inset-0 opacity-30">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full"
              animate={{
                x: [0, 100, 0],
                y: [0, 50, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 z-0 object-cover w-full h-full blur-sm opacity-40"
        >
          <source src="/guestures.mp4" type="video/mp4" />
        </video>

        <div className="container relative z-10 px-4 py-16 mx-auto">
          <Slider className="shadow-2xl rounded-2xl shadow-blue-500/20" />
        </div>
      </div>

      {/* Main Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative py-20 bg-gradient-to-b from-slate-800/50 to-slate-900/80"
      >
        {/* Retro Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        
        <div className="container relative z-10 px-4 mx-auto text-center">
          <motion.h2 
            className="mb-6 text-6xl font-bold text-transparent md:text-7xl bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            Universal Any-Language Video Chat
          </motion.h2>
          
          <motion.div 
            className="mb-8 text-xl leading-relaxed text-gray-300 md:text-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="mb-4 italic font-light">&quot;Break language barriers. Connect with anyone, anywhere in any language&quot;</div>
            <p className="text-lg text-cyan-200">Private, secure, and built for meaningful one-to-one conversations</p>
          </motion.div>

          <div className="flex flex-col items-center justify-center gap-6 p-6 md:gap-8">

            {/* Online users badge */}
            <div className="p-3 font-semibold text-center text-white border-2 border-green-600 shadow-lg bg-gradient-to-r rounded-circle w-70 md:w-70 from-green-400 to-emerald-500 md:rounded-full ">
              🩷 {onlineuser} Users Online
            </div>

            {/* Buttons wrapper */}
            <div className="flex flex-col gap-5 md:flex-row md:gap-6">
              <motion.button
                onClick={() => router.push("/chat")}
                className="relative px-12 py-4 text-lg font-semibold transition-all duration-300 rounded-full shadow-2xl group md:mr-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-cyan-500/25 hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 ">Start Chatting with friends</span>
                <div className="absolute inset-0 transition-opacity duration-300 rounded-full opacity-0 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:opacity-100"></div>
              </motion.button>

              <motion.button
                onClick={() => router.push("/randomchat")}
                className="relative px-12 py-4 text-lg font-semibold transition-all duration-300 rounded-full shadow-2xl group md:mr-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-cyan-500/25 hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">Start Random Video Chat</span>
                <div className="absolute inset-0 transition-opacity duration-300 rounded-full opacity-0 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:opacity-100"></div>
              </motion.button>

              
            </div>

          </div>

          {/* Animated Stats */}
          <motion.div 
            className="grid max-w-2xl grid-cols-3 gap-8 mx-auto mt-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {[
              { number: "10K+", label: "Active Users" },
              { number: "50+", label: "Languages" },
              { number: "24/7", label: "Available" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-cyan-400">{stat.number}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <FeatureSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Chatbot */}
      <div className={`fixed bottom-20 right-6 z-50 transition-all duration-300 ${openbot ? 'scale-100' : 'scale-0 origin-bottom-right'}`}>
        <div className="relative">
          <Chatbot />
          <button 
            onClick={() => setopenbot(false)}
            className="absolute flex items-center justify-center w-6 h-6 text-xs text-white transition-colors bg-red-500 rounded-full -top-2 -right-2 hover:bg-red-600"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Floating Chatbot Trigger */}
      {!openbot && (
        <motion.div 
          className="fixed z-40 bottom-6 right-6"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <button 
            onClick={() => setopenbot(true)}
            className="p-4 transition-all duration-300 rounded-full shadow-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-purple-500/25"
          >
            <img src="/robot.gif" alt="Chat Assistant" className="w-12 h-12" />
          </button>
        </motion.div>
      )}

      <Footer />
    </div>
  );
}