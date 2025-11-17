// import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)','/',"/animations(.*)","/sitemap.xml","/robots.txt","/ads.txt","/vercel.json","/privacy-policy.html","/googlec821796f76465828.html"])

// export default clerkMiddleware(async (auth, req) => {
//   if (!isPublicRoute(req)) {
//     await auth.protect()
//   }
// })
// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     // Always run for API routes
//     '/(api|trpc)(.*)',
//   ],
// };

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)', 
  '/sign-up(.*)', 
  '/',
  
  // SEO और वेरिफिकेशन फ़ाइलें
  '/robots.txt',          // सुधार: आगे स्लैश जोड़ा गया
  '/sitemap.xml',
  '/ads.txt',
  '/privacy-policy.html',
  '/googlec821796f76465828.html',

  // स्टैटिक एसेट्स और इंटरनल फ़ाइलें
  '/animations(.*)',
  '/vercel.json',
  
  // अन्य सभी फ़ाइलें जो public/ फ़ोल्डर में रूट पर हैं
  // यदि कोई अन्य public/ फ़ाइल है जो बिना लॉगिन के क्रॉल होनी चाहिए:
  // '/[^/\\.]+\\.(?:mp3|mp4|gif|png|svg|ico)$', 
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Next.js internals को छोड़ दें, लेकिन ClerkMiddleware को API और Trpc पर चलने दें
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};