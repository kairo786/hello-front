"use client";
import { useState, useEffect, useRef } from "react";
import { IoIosSend } from "react-icons/io";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';


export default function Chatbot() {
  const [messages, setMessages] = useState([
    { role: "bot", content: "Hey!! how can i help you?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [dots, setDots] = useState(".");
  const bottomRef = useRef(null);

  // auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // dots animation
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "." : prev + "."));
    }, 500);
    return () => clearInterval(interval); // cleanup
  }, [loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setLoading(true);
    setDots("."); // reset dots
    setMessages((prev) => [...prev, { role: "bot", content: "Thinking" }]);

    try {
      const res = await fetch("https://hello-bot-7i7d.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      setLoading(false);

      // replace last "Thinking" with reply
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "bot", content: data.reply },
      ]);
    } catch (err) {
      setLoading(false);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "bot", content: "Sorry, I couldn't connect to the server." },
      ]);
    }
  };

  return (
    <div className="relative mx-auto w-[350px] h-[650px] bg-white rounded-[4rem] shadow-2xl overflow-hidden p-3 border-[10px] border-gray-900">
      <div className="flex flex-col h-full bg-transparent rounded-3xl p-2">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gray-100 rounded-t-3xl">
          <h1 className="text-xl font-bold text-green-800">
            🤖 Hello chat Assistant
          </h1>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-white">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex mb-2 ${m.role === "user" ? "justify-end" : "justify-start"
                }`}
            >
              <div
                className={`py-2 px-4 rounded-lg max-w-[80%] ${m.role === "user"
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-800 rounded-bl-none"
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

        {/* Input */}
        <div className="p-4 flex bg-white rounded-b-3xl items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow border border-gray-300 p-2 rounded-full outline-none focus:border-blue-500 text-black pl-6"
            placeholder="Type a message..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}  disabled={loading}
            className={`${loading ? "bg-gray-700 h-12 w-12 flex items-center justify-center" : "bg-gray-800 p-2"
              } text-white rounded-full hover:bg-black transition-colors`}
          >
            {!loading && <IoIosSend className="text-cyan-400 text-2xl" />}
            {loading && (
              <DotLottieReact
                src="https://lottie.host/1ccc6686-787f-4547-afe5-dfd82ea0dc2f/hLioqtJaEq.lottie"
                loop
                autoplay
                className="h-20 w-20" // yaha height aur width set karo
              />
            )}
          </button>

        </div>
      </div>
    </div>
  );
}
