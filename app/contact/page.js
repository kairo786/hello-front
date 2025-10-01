'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(null);
  const { isLoaded, user } = useUser();

    
  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, inputemail: email, message, email:user.primaryEmailAddress.emailAddress}),
      });

      if (res.ok) {
        setStatus('success');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  }

  return (
    <section className="bg-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-gray-50 shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Contact Us
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Have questions? Fill out the form and we’ll get back to you as soon as possible.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full border text-black border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Gajodhar Singh"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full border text-black border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="B_jogi@gmail.com"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              required
              rows="3"
              className="w-full text-black border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Write your message..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg shadow hover:bg-indigo-700 transition"
          >
            {status === 'sending' ? 'Sending...' : 'Send Message'}
          </button>

          {/* Status messages */}
          {status === 'success' && (
            <p className="text-green-600 text-center mt-4">
              ✅ Message sent successfully!
            </p>
          )}
          {status === 'error' && (
            <p className="text-red-600 text-center mt-4">
              ❌ Oops! Something went wrong.
            </p>
          )}
        </form>

        {/* Extra Section */}
        <div className="mt-10 border-t pt-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Other ways to reach us</h2>
          <ul className="space-y-2 text-gray-600 flex flex-row justify-between">
            <li>
            <a href="https://www.instagram.com/ankit_kumarkairo/" className="hover:text-green-300">
             <img
                  href = "https://www.instagram.com/ankit_kumarkairo/"
                  src= '/images/instagram.png'
                  alt= 'admin-insta'
                  className="w-12 h-12"
                />
            Instagram</a>
            </li>
            <li>
            <a href="#" className="hover:text-green-300"><img
                  href = "https://www.instagram.com/ankit_kumarkairo/"
                  src= '/images/twitter.png'
                  alt= 'admin-twitter'
                  className="w-12 h-12"
                />Twitter</a>
            </li>
            <li>
              <a href="https://www.linkedin.com/in/ankit-kumar-kero-b86764281" className="hover:text-green-300"><img
                  href = "https://www.instagram.com/ankit_kumarkairo/"
                  src= '/images/linkedin.png'
                  alt= 'admin-linkdin'
                  className="w-12 h-12"
                />Linkdin</a>
            </li>
          </ul>
      </div>

    </div>
    </section>
  );
}
