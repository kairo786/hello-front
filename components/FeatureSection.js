"use client";
import { motion } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function FeatureSection() {
  const features = [
    {
      icon: "https://lottie.host/164cd1dd-500b-4971-ae99-991112ad1bb6/OBb8j99Ik4.lottie",
      title: "High-Quality Video & Audio Calls",
      description:
        "Enjoy seamless real-time conversations with crystal clear video and audio.",
    },
    {
      icon: "https://lottie.host/5dd57e3e-89d7-486b-9945-3b9f4aedb0c1/hRr7XUT6g6.lottie",
      title: "Face Detection with Emojis",
      description:
        "Smart emotion recognition adds fun by showing emojis based on your expressions (visible only to you).",
    },
    {
      icon: "https://lottie.host/280a2266-7bc0-4f0a-acad-a4ba89b89c06/OpD5OMSedI.lottie",
      title: "Direct Messaging (DMs)",
      description:
        "Chat instantly with friends alongside your video or audio calls.",
    },
    {
      icon: "https://lottie.host/9f11f0ca-8a2f-41e6-b1b4-136dfaa87a5a/F2umAnLIQU.lottie",
      title: "Multi-Language Support",
      description:
        "Switch your call experience to your favorite language with built-in translation support.",
    },
    {
      icon: "/oggy-c.gif", // आपका GIF पाथ
      title: "Random Video Call & Chat!",
      description:
        "Every random call could lead you to someone special — ready to find out?",
    },
    // {
    //   icon: "https://lottie.host/a014608e-3361-46cb-ba2e-2abda77b850d/mGvAa7vLUQ.lottie", // आपका GIF पाथ
    //   title: "Random Video Call & Chat!",
    //   description:
    //     "Every random call could lead you to someone special — ready to find out?",
    // },
    {
      icon: "https://lottie.host/7aad089d-585d-4f99-869d-eda7ee898f58/SYoiUoDP9L.lottie",
      title: "Interactive Chatbot",
      description:
        "Get instant answers, guidance, and even humor with our smart AI chatbot.",
    },
    {
      icon: "https://lottie.host/626c24f5-5f10-4286-bf52-7cff1c9cf1fe/0H6pZrKbNx.lottie",
      title: "Cross-Device Friendly",
      description:
        "Optimized for mobile, tablet, and desktop browsers.",
    },
    {
      icon: "https://lottie.host/dd8de437-742c-40ea-8594-a39cef464a45/2SJZKXKnaF.lottie",
      title: "Privacy & Security",
      description:
        "Your conversations are encrypted to keep you safe and secure.",
    },
    {
      icon: "https://lottie.host/63c0d911-9ce4-4afc-bb8b-50718ab34a90/vBlsuhW4Ta.lottie",
      title: "Fast & Reliable",
      description:
        "Quick connections with minimal latency, powered by modern web technologies.",
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
      {/* Background glow effect */}
      <div className="absolute inset-32 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>

      <div className="container relative z-10 px-4 mx-auto">
        <motion.h2
          className="mb-4 text-4xl font-bold text-center text-transparent md:text-5xl bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Why Choose Hello?
        </motion.h2>

        <motion.p
          className="mb-12 text-lg text-center text-gray-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Experience the future of cross-language communication
        </motion.p>

        <motion.div
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              variants={item}
              className="relative p-6 transition-all duration-300 border group bg-slate-800/50 backdrop-blur-sm rounded-2xl border-slate-700 hover:border-cyan-500/50 hover:scale-105"
            >
              {/* Conditional rendering based on icon type */}
              {feature.icon.endsWith(".lottie") ? (
                <DotLottieReact
                  src={feature.icon}
                  loop
                  autoplay
                  className="w-32 h-32 mx-auto "
                />
              ) : (
                <img
                  src={feature.icon}
                  alt={feature.title}
                  className="w-56 h-36 mx-auto "
                />
              )}

              <h3 className="mt-4 mb-2 text-xl font-semibold text-center text-white">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-center">{feature.description}</p>

              {/* Hover Overlay Effect */}
              <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl group-hover:opacity-100"></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
