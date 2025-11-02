// "use client";
// import React, { useLayoutEffect } from "react";
// import Image from "next/image";
// import { motion ,useAnimation } from "framer-motion";
// import { useRef,useEffect,usestate } from "react";
// import Link from "next/link";

// const images1 = [
//   "https://i.ibb.co/s9mZHwBm/img-1.jpg",
//   "https://i.ibb.co/PGjfDgGD/img2.jpg",
//   "https://i.ibb.co/HLBzxsYd/img.jpg",
//   "https://i.ibb.co/wr3xy5pS/img-4.jpg",
//   "https://i.ibb.co/jv2j0yNs/img-5.jpg",
//   "https://i.ibb.co/qfxswRg/prof.jpg",
//   "https://i.ibb.co/XZX46J2K/img-9.jpg",
//   "https://i.ibb.co/nZb5LQD/berline.jpg",
//   "https://i.ibb.co/wNb8NC4G/img23.jpg",
//   "https://i.ibb.co/VdDpvvr/img22.webp",
//   "https://i.ibb.co/PG9snWwz/ank.jpg",
// ];
// const images2 = [
//   "https://i.ibb.co/rGwLwXy0/s2.jpg",
//   "https://i.ibb.co/5WWTDMf0/s3.jpg",
//   "https://i.ibb.co/tr9wXgB/br.jpg",
//   "https://i.ibb.co/1JXxR0D7/s5.jpg",
//   "https://i.ibb.co/ccj3WL5g/s6.jpg",
//   "https://i.ibb.co/wZbXqRjp/s7.jpg",
//   "https://i.ibb.co/fzMdBzSg/arvind.jpg",
//   "https://i.ibb.co/bMthv7xT/s9.jpg",
//   "https://i.ibb.co/M56fPS0C/s10.jpg",
//   "https://i.ibb.co/7NNqmWRS/s11.jpg",
//   "https://i.ibb.co/5h4mm6x9/s12.jpg",
//   "https://i.ibb.co/spsSwr82/s13.jpg",
//   "https://i.ibb.co/GfbzwYHr/s14.jpg",
//   "https://i.ibb.co/2QZTzRy/s15.jpg",
//   "https://i.ibb.co/GQXczwKT/s16.jpg",
//   "https://i.ibb.co/PssktzDN/s17.jpg",
// ];

// const Slider = () => {
//      const controls1 = useAnimation()
//      const controls2 = useAnimation()
//   const containerRef1 = useRef(null)
//   const containerRef2 = useRef(null)

//   useLayoutEffect(() => {
//     if (containerRef1.current) {
//       controls1.start({
//         x: [ -containerRef1.current.scrollWidth / 2,0],
//         transition: { x: { repeat: Infinity, duration: 20, ease: 'linear' } }
//       })
//     }
//   }, [controls1])
//   useLayoutEffect(() => {
//     if (containerRef2.current) {
//       controls2.start({
//         x: [0,-containerRef2.current.scrollWidth / 2 ],
//         transition: { x: { repeat: Infinity, duration: 30, ease: 'linear' } }
//       })
//     }
//   }, [controls2])
//   return (
//     <div className="flex flex-col gap-6 ">
// <div className="relative w-full mt-4 overflow-hidden">
//         <motion.div
//           ref={containerRef2}
//           animate={controls2}
//           transition={{ type: "spring" }}
//           className="flex gap-4 space-x-6 w-max"
//         >
//           {images2.concat(images2).map((ima, index) => (
//             <motion.div
//               key={index}
//               className="overflow-hidden transition-transform bg-white rounded-full shadow-xl cursor-pointer shrink-0"
//             >
//               <Image
//                 src={ima}
//                 alt='#'
//                 className="object-cover w-24 h-24 bg-gray-600 rounded-full"
//                 width={96}
//                 height={96}
//                 priority={true} // 💡 इसे ज़रूर जोड़ें
//               />
//             </motion.div>
//           ))}
//         </motion.div>
//       </div>
//    <div className="relative w-full mb-2 overflow-hidden">
//         <motion.div
//           ref={containerRef1}
//           animate={controls1}
//           transition={{ type: "spring" }}
//           className="flex gap-4 space-x-6 w-max"
//         >
//           {images1.concat(images1).map((ima, index) => (
//             <motion.div
//               key={index}
//               className="overflow-hidden transition-transform bg-white rounded-full shadow-xl cursor-pointer shrink-0"
//             >
//               <Image
//                 src={ima}
//                 alt='#'
//                 className="object-cover w-24 h-24 bg-gray-600 rounded-full "
//                 width={96}
//                 height={96}
//                 priority={true} // 💡 इसे ज़रूर जोड़ें
//               />
//             </motion.div>
//           ))}
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default Slider;

// components/Slider.js
"use client";
import React, { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link"; // Link का यहां उपयोग नहीं है, हटा सकते हैं

const images1 = [
  "/images/img-1.jpg",
  "/images/img2.jpeg",
  "/images/budda.jpg",
  "/images/img 4.jpeg",
  "/images/img 5.jpeg",
  "/images/prof.jpeg",
  "/images/img 9.jpeg",
  "/images/berline.jpeg",
  "/images/img23.jpeg",
  "/images/img22.webp",
  "/images/ank.jpg",
];
const images2 = [
  "/images/s2.jpeg",
  "/images/s3.jpeg",
  "/images/br.jpg",
  "/images/s5.jpeg",
  "/images/s6.jpeg",
  "/images/s7.jpeg",
  "/images/arvind..jpg",
  "/images/s9.jpeg",
  "/images/s10.jpeg",
  "/images/s11.jpeg",
  "/images/s12.jpeg",
  "/images/s13.jpeg",
  "/images/s14.jpeg",
  "/images/s15.jpeg",
  "/images/s16.jpeg",
  "/images/s17.jpeg",
];

const Slider = () => {
  
  // NOTE: Framer Motion से useAnimation को हटा दिया गया है।

  return (
    <div className="flex flex-col gap-6 ">
        
        {/* ROW 1: RIGHT-TO-LEFT (slide-to-left animation) */}
        <div className="relative w-full mt-4 overflow-hidden">
            {/* 💡 Animation applied here. Duration: 30s (Slow) */}
            <div
                className="flex gap-4 space-x-6 w-max"
                style={{
                    // CSS Animation Class Name:
                    animation: 'slide-to-left 28s linear infinite', 
                }}
            >
                {/* Content is doubled to create the infinite loop effect */}
                {images1.concat(images1).map((ima, index) => (
                    <div
                        key={index}
                        className="overflow-hidden transition-transform bg-white rounded-full shadow-xl cursor-pointer shrink-0 hover:scale-105"
                    >
                        <Image
                            src={ima}
                            alt={`User ${index}`}
                            className="object-cover w-24 h-24 bg-gray-600 rounded-full"
                            width={100}
                            height={100}
                            priority={true} // 🚀 CRITICAL: Fast loading for ATF
                            sizes="(max-width: 768px) 100px, 96px"
                        />
                    </div>
                ))}
            </div>
        </div>

        {/* ROW 2: LEFT-TO-RIGHT (slide-to-right animation) */}
        <div className="relative w-full mb-2 overflow-hidden">
            {/* 💡 Animation applied here. Duration: 20s (Faster) */}
            <div
                className="flex gap-4 space-x-6 w-max"
                style={{
                     // CSS Animation Class Name:
                    animation: 'slide-to-right 20s linear infinite', 
                }}
            >
                {/* Content is doubled to create the infinite loop effect */}
                {images2.concat(images2).map((ima, index) => (
                    <div
                        key={index}
                        className="overflow-hidden transition-transform bg-white rounded-full shadow-xl cursor-pointer shrink-0 hover:scale-105"
                    >
                        <Image
                            src={ima}
                            alt={`User ${index}`}
                            className="object-cover w-24 h-24 bg-gray-600 rounded-full "
                            width={100}
                            height={100}
                            priority={true} // 🚀 CRITICAL: Fast loading for ATF
                            sizes="(max-width: 768px) 100px, 96px"
                        />
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default Slider;