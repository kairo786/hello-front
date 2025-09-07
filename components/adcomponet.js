// components/GoogleAd.js
"use client";
import { useEffect, useRef } from "react";

export default function GoogleAd({ slot }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const pushAd = () => {
       try {
      if (typeof window !== "undefined") {
        // Prevent multiple pushes
        if (!ref.current.hasAttribute("data-adsbygoogle-status")) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          console.log("Ad loaded for slot:", slot);
        }
      }
    } catch (e) {
      console.error("Ad push error:", e);
    }
    };

    if (ref.current.offsetWidth > 0) {
      pushAd();
      return;
    }

    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.contentRect.width > 0) {
            pushAd();
            ro.disconnect();
            break;
          }
        }
      });
      ro.observe(ref.current);
    } else {
      const id = setInterval(() => {
        if (ref.current && ref.current.offsetWidth > 0) {
          pushAd();
          clearInterval(id);
        }
      }, 300);
    }

    return () => ro?.disconnect();
  }, [slot]);

  return (
    <ins
      ref={ref}
      className="adsbygoogle"
      style={{ display: "block", minHeight: "50px", textAlign: "center" }}
      data-ad-client="ca-pub-7982479296670505"
      // data-ad-client="ca-pub-3940256099942544"
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
