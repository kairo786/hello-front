"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  { 
    q: "Is Hello free to use?", 
    a: "Yes, it's completely free with no hidden charges. Enjoy unlimited video chats!" 
  },
  { 
    q: "Can I video chat without signing up?", 
    a: "Absolutely! No registration required. Just click and start chatting instantly." 
  },
  { 
    q: "Is it secure?", 
    a: "Yes, we use end-to-end encrypted connections ensuring your conversations remain private and secure." 
  },
  { 
    q: "How many languages are supported?", 
    a: "We support 50+ languages with real-time translation for seamless cross-language communication." 
  },
  { 
    q: "Is there a mobile app?", 
    a: "Our platform is fully responsive and works perfectly on all mobile devices through your browser." 
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState(null);

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Frequently Asked Questions
        </motion.h2>
        <motion.p 
          className="text-center text-gray-400 mb-12 text-lg"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Everything you need to know about Hello
        </motion.p>

        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full text-left p-6 flex justify-between items-center hover:bg-slate-700/50 transition-colors duration-200"
              >
                <span className="font-semibold text-lg text-white pr-4">{item.q}</span>
                <motion.span
                  animate={{ rotate: open === i ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-cyan-400 text-xl"
                >
                  ▼
                </motion.span>
              </button>
              
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0 text-gray-300 border-t border-slate-700">
                      {item.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}