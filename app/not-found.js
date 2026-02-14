//not-found.js
"use client"
import Link from 'next/link';
import { ChevronRight, Home, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();
  const handleQuickLinks = () => {
   router.push('/');
    setTimeout(() => {
      const footer = document.getElementById('footer');
      footer?.scrollIntoView({ behavior: 'smooth' });
    }, 500);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
        {/* Glowing 404 Text */}
        <div className="mb-8">
          <h1 className="text-9xl sm:text-[10rem] font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 drop-shadow-lg mb-4 animate-pulse">
            404
          </h1>
          <div className="flex items-center justify-center gap-2 text-purple-300 text-lg font-semibold mb-4">
            <div className="h-1 w-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
            <span>Page Not Found</span>
            <div className="h-1 w-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
          </div>
        </div>

        {/* Message */}
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Oops! Lost in the digital void?
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed mb-2">
            The page you&apos;re looking for has vanished into the digital abyss. 
          </p>
          <p className="text-base text-gray-400">
            Don&apos;t worry, let&apos;s get you back on track.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href="/">
            <button className="group relative px-8 py-4 font-semibold text-white rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-100 group-hover:opacity-0 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative flex items-center gap-2 justify-center">
                <Home size={20} />
                Back to Home
              </span>
            </button>
          </Link>

          <button onClick={()=>{alert('url invalide')}} className="group relative px-8 py-4 font-semibold text-white rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-purple-400">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            <span className="relative flex items-center gap-2 justify-center">
              <Search size={20} />
              Search
            </span>
          </button>
        </div>

        {/* Decorative cards */}
         {/* Decorative cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12">
          {[
            { icon: '🚀', title: 'Quick Links', desc: 'Navigate easily', action: handleQuickLinks },
            { icon: '✨', title: 'Help Center', desc: 'Get support', action: () => window.location.href = '/privacy-policy.html' },
            { icon: '💬', title: 'Contact Us', desc: 'Reach out', action: () => window.location.href = '/contact' }
          ].map((item, i) => (
            <button
              key={i}
              onClick={item.action}
              className="group relative p-4 rounded-lg border border-purple-500/30 bg-gradient-to-br from-purple-900/10 to-pink-900/10 backdrop-blur-sm hover:border-purple-400/60 transition-all duration-300 hover:bg-purple-900/20 cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-pink-600/0 to-blue-600/0 group-hover:from-purple-600/10 group-hover:via-pink-600/10 group-hover:to-blue-600/10 rounded-lg transition-all duration-300"></div>
              <div className="relative text-4xl mb-3">{item.icon}</div>
              <div className="text-white font-semibold text-sm">{item.title}</div>
              <div className="text-gray-400 text-sm mt-1">{item.desc}</div>
              <div className="flex items-center gap-1 text-purple-600 text-xs font-semibold mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Explore <ChevronRight size={14} />
              </div>
            </button>
          ))}
        </div>

        {/* Footer message */}
        <div className="mt-12 flex items-center justify-center gap-2 text-purple-300/60 text-sm">
          <ChevronRight size={16} />
          <span>Error code: 404 • Digital Dimension Lost</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}