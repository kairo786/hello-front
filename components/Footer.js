"use client"
import GoogleAd from "./adcomponet";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(30deg,_transparent_45%,_#fff_45%,_#fff_55%,_transparent_55%)] bg-[size:10px_10px]"></div>
      </div>

      <div className="container relative z-10 px-4 py-12 mx-auto">
        {/* <GoogleAd slot="3590375461" /> */}

        <div className="grid items-center grid-cols-1 gap-8 md:grid-cols-3">
          {/* Social Links */}
          <div className="text-center md:text-left">
            <h3 className="mb-4 text-xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text">
              Follow Us
            </h3>
            <div className="flex justify-center gap-6 md:justify-start">
              {[
                { name: "Instagram", href: "https://www.instagram.com/ankit_kumarkairo/", icon: "📷" },
                { name: "Twitter", href: "#", icon: "🐦" },
                { name: "LinkedIn", href: "https://www.linkedin.com/in/ankit-kumar-kero-b86764281", icon: "💼" }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="flex items-center gap-2 text-gray-400 transition-colors duration-300 group hover:text-cyan-400"
                >
                  <span className="text-lg">{social.icon}</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    {social.name}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h3 className="mb-4 text-xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
              Quick Links
            </h3>
            <div className="flex flex-wrap justify-center gap-6">
              {[
                { name: "About", href: "/about" },
                { name: "Terms", href: "#" },
                { name: "Privacy", href: "/privacy-policy.html" }
              ].map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="px-3 py-1 text-gray-400 transition-colors duration-300 rounded-lg hover:text-purple-400 hover:bg-slate-700/50"
                >
                  {link.name}
                </a>
              ))}

              <motion.button
                onClick={() => {
                  navigator.share({
                    title: "Hello websight",
                    text: "Check out my website!",
                    url: "https://hello-front-or8v.vercel.app/"
                  })
                }}
                className="px-3 py-1 text-gray-400 transition-colors duration-300 rounded-lg hover:text-purple-400 hover:bg-slate-700/50"
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 ">Share this web</span>
              </motion.button>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right">
            <div className="mb-2 text-sm text-gray-500">© 2025 Hello Inc.</div>
            <div className="text-xs text-gray-600">
              Breaking language barriers, connecting hearts
            </div>
          </div>
        </div>

        {/* Bottom Border */}
        <div className="pt-8 mt-8 text-center border-t border-slate-700">
          <p className="text-sm text-gray-500">
            Made with ❤️ for global communication
          </p>
        </div>
      </div>
    </footer>
  );
}