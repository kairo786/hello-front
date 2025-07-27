// app/layout.js

import "./globals.css";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ButtonProvider } from "./context/buttoncontext";
import { OfferProvider } from "./context/offercontext";
import SocketProviderWrapper from "./context/SocketProviderWrapper";

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
          <Script
            src="https://cdn.lordicon.com/lordicon.js"
            strategy="beforeInteractive"
          />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <OfferProvider>
            <ButtonProvider>
              <SocketProviderWrapper>{children}</SocketProviderWrapper>
            </ButtonProvider>
          </OfferProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
