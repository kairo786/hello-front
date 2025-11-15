// app/robots.js
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      crawlDelay: 20, // Crawl-Delay को यहाँ set किया जाता है, पर यह मॉडर्न SEO में Ignore होता है
    },
    sitemap: 'https://www.hellotalk.in/sitemap.xml',
  }
}