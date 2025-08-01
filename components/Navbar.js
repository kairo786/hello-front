"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";

const links = [
  { name: "Home", href: "/" },
  { name: "Chat", href: "/chat" },
  { name: "About", href: "/about" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Optional: Sync with system preference
  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  return (
    <nav className={`w-full h-20 z-50 bg-white/70 dark:bg-gray-900/80 backdrop-blur shadow-md px-6 py-4 transition-colors duration-300`}>
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex gap-2 text-2xl font-bold">
          <Image src="/helloicon.png" alt="Hello" width={50} height={50} className="dark:invert" />
          <h1 className="text-3xl font-serif font-bold text-green-800 dark:text-green-300 mt-2">Hello</h1>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 items-center">
          {links.map((link) => (
            <motion.div
              key={link.name}
              whileHover={{ scale: 1.1 }}
              className="relative group"
            >
              <Link 
                href={link.href} 
                className="text-gray-800 dark:text-gray-200 font-medium"
              >
                {link.name}
              </Link>
              <motion.span
                layoutId="underline"
                className="absolute left-0 bottom-0 h-0.5 bg-blue-500 dark:bg-blue-400 w-full scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"
              />
            </motion.div>
          ))}
          <button 
            onClick={() => setDarkMode(!darkMode)} 
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          <UserButton appearance={{ variables: { colorPrimary: darkMode ? '#4ade80' : '#166534' }}} />
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-4">
          <button 
            onClick={() => setDarkMode(!darkMode)} 
            className="p-1 text-gray-800 dark:text-gray-200"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="focus:outline-none text-gray-800 dark:text-gray-200"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={`flex flex-col md:hidden px-4 pt-4 pb-2 bg-white dark:bg-gray-800 overflow-hidden transition-colors duration-300`}
          >
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="py-2 text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}