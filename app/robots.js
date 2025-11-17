// app/robots.js
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://www.hellotalk.in/sitemap.xml',
  }
}