"use client";
import { useState, useEffect, useRef } from "react";
import { IoIosSend } from "react-icons/io";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { role: "bot", content: "Hello! 👋 I'm your Hello Chat Assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [dots, setDots] = useState(".");
  const bottomRef = useRef(null);

  // Auto scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Dots animation for "Thinking..."
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "." : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, [loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setDots(".");
    setMessages((prev) => [...prev, { role: "bot", content: "Thinking" }]);

    try {
      const res = await fetch("https://hello-bot-7i7d.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      setLoading(false);

      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "bot", content: data.reply },
      ]);
    } catch (err) {
      setLoading(false);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "bot", content: "⚠️ Sorry, I couldn't connect to the server." },
      ]);
    }
  };

  return (
    <div className="relative mx-auto w-[360px] h-[650px] bg-white rounded-[3rem] shadow-2xl overflow-hidden border-[10px] border-gray-900">
      <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-gray-100 rounded-3xl">

        {/* Header */}
        <div className="flex items-center justify-center py-4 bg-gray-200 rounded-t-3xl shadow-md">
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            🤖 Hello Chat Assistant
          </h1>
        </div>

        {/* Messages Section */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`py-2 px-4 rounded-2xl max-w-[85%] whitespace-pre-wrap break-words leading-relaxed text-[15px] shadow-sm ${
                  m.role === "user"
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-900 rounded-bl-none border border-gray-400"
                }`}
              >
                {m.role === "bot" && i === messages.length - 1 && loading
                  ? `Thinking${dots}`
                  : m.content}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input Section */}
        <div className="p-4 bg-white rounded-b-3xl border-t border-gray-200 flex items-center gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            className="flex-grow border border-gray-300 p-3 rounded-full outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-400 text-gray-800 text-[15px] pl-5 transition-all"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className={`${
              loading
                ? "bg-gray-700 h-12 w-12 flex items-center justify-center"
                : "bg-blue-600 hover:bg-blue-700 p-3"
            } text-white rounded-full transition-all duration-200 shadow-md`}
          >
            {!loading && <IoIosSend className="text-white text-2xl" />}
            {loading && (
              <DotLottieReact
                src="https://lottie.host/1ccc6686-787f-4547-afe5-dfd82ea0dc2f/hLioqtJaEq.lottie"
                loop
                autoplay
                className="h-10 w-10"
              />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
