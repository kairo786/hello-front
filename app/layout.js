// app/layout.js

import "./globals.css";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ButtonProvider } from "./context/buttoncontext";
import { OfferProvider } from "./context/offercontext";
import SocketProviderWrapper from "./context/SocketProviderWrapper";
import ClientScripts from "@/components/clientscript";

export const metadata = {
  title: "Hello",
  description:
    "Where people connect each other & Bringing you closer, wherever you are!!",
};

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      authorizedParties={['https://hello-front-or8v-git-main-ankit-keros-projects.vercel.app']}
      allowedRedirectOrigins={['https://hello-front-or8v-git-main-ankit-keros-projects.vercel.app']}>
      <html lang="en">
        <head>
        <meta name="google-site-verification" content="8ce5GFljmMLPoKxn3lBTKEmoSZPYKAjhh0Vyecr-zZA" />
          <Script
            src="https://checkout.razorpay.com/v1/checkout.js"
            strategy="afterInteractive"
          />
          <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7982479296670505"
            crossorigin="anonymous"></script>
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >

          <OfferProvider>
            <ButtonProvider>
              <SocketProviderWrapper>
                <ClientScripts />
                {children}

              </SocketProviderWrapper>
            </ButtonProvider>
          </OfferProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
