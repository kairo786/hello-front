// "use client"
import "./globals.css";
import Script from "next/script";
import { ButtonProvider } from "@/components/pages/context/buttoncontext";
import { OfferProvider } from "@/components/pages/context/offercontext";
import SocketProviderWrapper from "@/components/pages/context/SocketProviderWrapper";
import ClientScripts from "@/components/clientscript";
// import { ClerkProvider } from "@clerk/clerk-react";
import { ClerkProvider } from "@clerk/nextjs";


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta
          name="google-site-verification"
          content="8ce5GFljmMLPoKxn3lBTKEmoSZPYKAjhh0Vyecr-zZA"
        />
      </head>

      <body>
        {/* Scripts same as pehle */}
        <Script
          src="https://fundingchoicesmessages.google.com/i/pub-7982479296670505?ers=1"
          strategy="afterInteractive"
        />
        <Script
          id="funding-iframe-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function signalGooglefcPresent() {
                  if (!window.frames['googlefcPresent']) {
                    if (document.body) {
                      const iframe = document.createElement('iframe');
                      iframe.style = 'width: 0; height: 0; border: none; z-index: -1000; left: -1000px; top: -1000px;';
                      iframe.style.display = 'none';
                      iframe.name = 'googlefcPresent';
                      document.body.appendChild(iframe);
                    } else {
                      setTimeout(signalGooglefcPresent, 0);
                    }
                  }
                }
                signalGooglefcPresent();
              })();
            `,
          }}
        />
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7982479296670505"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Script
          async
          custom-element="amp-ad"
          src="https://cdn.ampproject.org/v0/amp-ad-0.1.js"
          strategy="afterInteractive"
        />

        {/* 🔐 Clerk client provider yahan se start */}
        <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
          <OfferProvider>
            <ButtonProvider>
              <SocketProviderWrapper>
                <ClientScripts />
                {children}
              </SocketProviderWrapper>
            </ButtonProvider>
          </OfferProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
