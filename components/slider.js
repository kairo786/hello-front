"use client";
import React from "react";
import Image from "next/image";
import { motion ,useAnimation } from "framer-motion";
import { useRef,useEffect,usestate } from "react";
import Link from "next/link";

const images1 = [
  "https://i.ibb.co/s9mZHwBm/img-1.jpg",
  "https://i.ibb.co/PGjfDgGD/img2.jpg",
  "https://i.ibb.co/HLBzxsYd/img.jpg",
  "https://i.ibb.co/wr3xy5pS/img-4.jpg",
  "https://i.ibb.co/jv2j0yNs/img-5.jpg",
  "https://i.ibb.co/qfxswRg/prof.jpg",
  "https://i.ibb.co/XZX46J2K/img-9.jpg",
  "https://i.ibb.co/nZb5LQD/berline.jpg",
  "https://i.ibb.co/wNb8NC4G/img23.jpg",
  "https://i.ibb.co/VdDpvvr/img22.webp",
  "https://i.ibb.co/PG9snWwz/ank.jpg",
];
const images2 = [
  "https://i.ibb.co/rGwLwXy0/s2.jpg",
  "https://i.ibb.co/5WWTDMf0/s3.jpg",
  "https://i.ibb.co/tr9wXgB/br.jpg",
  "https://i.ibb.co/1JXxR0D7/s5.jpg",
  "https://i.ibb.co/ccj3WL5g/s6.jpg",
  "https://i.ibb.co/wZbXqRjp/s7.jpg",
  "https://i.ibb.co/G35vcmt8/s8.jpg",
  "https://i.ibb.co/bMthv7xT/s9.jpg",
  "https://i.ibb.co/M56fPS0C/s10.jpg",
  "https://i.ibb.co/7NNqmWRS/s11.jpg",
  "https://i.ibb.co/5h4mm6x9/s12.jpg",
  "https://i.ibb.co/spsSwr82/s13.jpg",
  "https://i.ibb.co/GfbzwYHr/s14.jpg",
  "https://i.ibb.co/2QZTzRy/s15.jpg",
  "https://i.ibb.co/GQXczwKT/s16.jpg",
  "https://i.ibb.co/PssktzDN/s17.jpg",
];

const Slider = () => {
     const controls1 = useAnimation()
     const controls2 = useAnimation()
  const containerRef1 = useRef(null)
  const containerRef2 = useRef(null)

  useEffect(() => {
    if (containerRef1.current) {
      controls1.start({
        x: [ -containerRef1.current.scrollWidth / 2,0],
        transition: { x: { repeat: Infinity, duration: 20, ease: 'linear' } }
      })
    }
  }, [controls1])
  useEffect(() => {
    if (containerRef2.current) {
      controls2.start({
        x: [0,-containerRef2.current.scrollWidth / 2 ],
        transition: { x: { repeat: Infinity, duration: 30, ease: 'linear' } }
      })
    }
  }, [controls2])
  return (
    <div className="flex flex-col gap-6 ">
<div className="relative overflow-hidden w-full mt-4">
        <motion.div
          ref={containerRef2}
          animate={controls2}
          transition={{ type: "spring" }}
          className="flex gap-4 space-x-6 w-max"
        >
          {images2.concat(images2).map((ima, index) => (
            <motion.div
              key={index}
              className="shrink-0 bg-white rounded-full shadow-xl overflow-hidden cursor-pointer transition-transform"
            >
              <img
                src={ima}
                alt='#'
                className="w-24 h-24 rounded-full object-cover bg-gray-600"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
   <div className="relative overflow-hidden w-full mb-2">
        <motion.div
          ref={containerRef1}
          animate={controls1}
          transition={{ type: "spring" }}
          className="flex gap-4 space-x-6 w-max"
        >
          {images1.concat(images1).map((ima, index) => (
            <motion.div
              key={index}
              className="shrink-0 bg-white rounded-full shadow-xl overflow-hidden cursor-pointer transition-transform"
            >
              <img
                src={ima}
                alt='#'
                className="w-24 h-24 rounded-full object-cover bg-gray-600 "
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Slider;
