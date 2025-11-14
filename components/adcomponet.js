"use client";

import { useEffect, useRef } from "react";

export default function GoogleAd({ slot }) {
  const adRef = useRef(null);

  // Load script only once
  useEffect(() => {
    const scriptId = "adsense-script";
    if (document.getElementById(scriptId)) return;

    const script = document.createElement("script");
    script.id = scriptId;
    script.async = true;
    script.src =
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7982479296670505";
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);
  }, []);

  // Render ad
  useEffect(() => {
    if (!adRef.current) return;

    // Already rendered? skip
    if (adRef.current.getAttribute("data-adsbygoogle-status") === "done") {
      return;
    }

    const pushAd = () => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("Ad push error:", e);
      }
    };

    // Wait until script has loaded
    if (window.adsbygoogle && window.adsbygoogle.loaded) {
      pushAd();
    } else {
      // Poll until script loads
      const interval = setInterval(() => {
        if (window.adsbygoogle && window.adsbygoogle.loaded) {
          pushAd();
          clearInterval(interval);
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [slot]);

  return (
    <ins
      ref={adRef}
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client="ca-pub-7982479296670505"
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  );
}
