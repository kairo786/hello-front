"use client";

import { useEffect, useRef } from "react";

export default function GoogleAd({ slot }) {
  const adRef = useRef(null);

  useEffect(() => {
    if (!adRef.current) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("Ad error:", e);
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
    />
  );
}