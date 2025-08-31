"use client";
import { useState } from "react";

const faqs = [
  { q: "Is Hello free to use?", a: "Yes, it's completely free with no hidden charges." },
  { q: "Can I video chat without signing up?", a: "Absolutely, no go and sign in/up!" },
  { q: "Is it secure?", a: "Yes, we use encrypted connections for safety." },
];

export default function FAQSection() {
  const [open, setOpen] = useState(null);

  return (
    <section className="px-6 md:px-20 py-12 bg-blue-50">
      <h2 className="text-3xl font-bold text-center mb-10 text-blue-800">FAQs</h2>
      <div className="space-y-4">
        {faqs.map((item, i) => (
          <div key={i} className="bg-white p-5 rounded-xl shadow-md">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full text-left font-semibold text-lg"
            >
              {item.q}
            </button>
            {open === i && <p className="mt-2 text-gray-600">{item.a}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
