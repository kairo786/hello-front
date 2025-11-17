// app/sitemap.js

export default function sitemap() {
  return [
    {
      // मुख्य पृष्ठ (Homepage)
      url: 'https://www.hellotalk.in/',
      lastModified: new Date().toISOString(), // आज की तारीख या अंतिम अपडेट की तारीख
      priority: 1.0, // उच्च प्राथमिकता
    },
    {
      // About Page
      url: 'https://www.hellotalk.in/chat',
      lastModified: new Date().toISOString(),
      priority: 0.9,
    },
    {
      // Contact Page
      url: 'https://www.hellotalk.in/call',
      lastModified: new Date().toISOString(),
      priority: 0.9,
    },
    // Random Chat Page (यदि यह एक मुख्य लैंडिंग पेज है)
    {
      url: 'https://www.hellotalk.in/randomchat',
      lastModified: new Date().toISOString(),
      priority: 0.7,
    },
    // Chat Page
    {
      url: 'https://www.hellotalk.in/about',
      lastModified: new Date().toISOString(),
      priority: 0.7,
    },
    // Mic Page
    {
      url: 'https://www.hellotalk.in/contact',
      lastModified: new Date().toISOString(),
      priority: 0.8,
    },
    {
      url: 'https://www.hellotalk.in/chekmic',
      lastModified: new Date().toISOString(),
      priority: 0.7,
    },
    {
      url: 'https://www.hellotalk.in/context',
      lastModified: new Date().toISOString(),
      priority: 0.7,
    },
    {
      url: 'https://www.hellotalk.in/mic',
      lastModified: new Date().toISOString(),
      priority: 0.7,
    },
    {
      url: 'https://www.hellotalk.in/openchat',
      lastModified: new Date().toISOString(),
      priority: 0.7,
    },
    
    // *नोट:* आपको यहाँ अपनी सभी सार्वजनिक रूप से एक्सेस योग्य Pages को जोड़ना होगा।
  ]
}