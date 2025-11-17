// app/robots.js

export default function robots() {
  return {
    // यह नियम सभी क्रॉलर (Google, Bing, आदि) के लिए है
    rules: {
      userAgent: '*',
      // 'Allow: /' का मतलब है कि पूरी साइट क्रॉल के लिए खुली है
      allow: '/', 
      // Crawl-Delay को आधुनिक SEO में अक्सर नज़रअंदाज़ किया जाता है, पर इसे यहाँ जोड़ा जा सकता है:
      // crawlDelay: 20, 
    },
    // Google को sitemap का स्थान बताता है
    sitemap: 'https://www.hellotalk.in/sitemap.xml',
  }
}