"use client";
import Script from "next/script";
import { useEffect } from "react";

export default function ClientScripts() {
  useEffect(() => {
    // Run only once after script is loaded
    if (window.adsbygoogle && !window.adsbygoogle.loaded) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        window.adsbygoogle.loaded = true; // custom flag to prevent duplicate calls
        console.log("📢 Ads initialized successfully!");
      } catch (e) {
        console.error("⚠️ Ads initialization failed:", e);
      }
    }
  }, []);

  return (
    <>
      <Script 
        src="https://cdn.lordicon.com/lordicon.js" 
        strategy="lazyOnload" 
        onLoad={() => console.log("✅ Lordicon script loaded")}
      />

      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7982479296670505"
        crossOrigin="anonymous"
        strategy="afterInteractive"
        onLoad={() => console.log("✅ Google Ads script loaded")}
      />
    </>
  );
}
