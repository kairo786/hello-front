import Link from "next/link";

export const metadata = {
  title: "Hello Blog - Video Communication, WebRTC & AI",
  description:
    "Learn WebRTC, video communication, AI, privacy and real-time technologies. Build modern video chat platforms.",
};

const posts = [
  {
    slug: "webrtc-complete-guide",
    title: "Complete Guide to WebRTC and Real-Time Video Communication",
    desc: "Learn how modern video chat apps like Zoom and Omegle work.",
  },
  {
    slug: "future-of-video-chat",
    title: "Future of Random Video Chat Platforms in AI Era",
    desc: "Explore the future of AI powered video communication.",
  },
  {
    slug: "build-video-chat-app",
    title: "How to Build Your Own Video Chat App using WebRTC",
    desc: "Step-by-step roadmap to create a scalable video chat platform.",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen px-6 py-12 text-white bg-slate-950">
      <div className="max-w-5xl mx-auto">
        <h1 className="mb-6 text-5xl font-bold">
          Video Communication & WebRTC Blog
        </h1>

        <p className="mb-10 text-lg text-gray-300">
          Learn about real-time video communication, WebRTC, AI, privacy,
          communication systems and how modern video chat platforms are built.
          This blog is created by communication engineering students and
          developers.
        </p>

        {/* CTA for your app */}
        <div className="p-6 mb-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl">
          <h2 className="mb-2 text-2xl font-semibold">
            Try our Random Video Chat Platform
          </h2>
          <p className="mb-4">
            Experience real-time communication with people worldwide.
          </p>
          <Link
            href="/video-call"
            className="px-6 py-3 font-semibold text-black bg-white rounded-lg"
          >
            Start Video Chat
          </Link>
        </div>

        {/* Blog list */}
        <div className="grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <div className="p-6 transition bg-slate-900 rounded-xl hover:bg-slate-800">
                <h2 className="mb-2 text-xl font-bold">{post.title}</h2>
                <p className="text-gray-400">{post.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}