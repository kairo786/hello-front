/* eslint-disable react-hooks/exhaustive-deps */
// components/ChatUI.jsx
"use client";
import { useState, useEffect, useRef } from 'react';
// import { useSocket } from '../context/SocketContext';

const RandomChatUI = ({ socket, partnerid }) => {
    const [messages, setMessages] = useState([
        // { id: 1, text: "Hello! 👋", sender: 'other', timestamp: new Date() },
        // { id: 2, text: "Hi there! How can I help you?", sender: 'me', timestamp: new Date() },
    ]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);
    //   const socket = useSocket();


    // Scroll to bottom when new messages arrive
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Socket event listeners for real-time messages
    useEffect(() => {
        if (!socket) return;

        socket.on('random-message', (message) => {
            console.log('msg-recive', message);
            setMessages(prev => [...prev, {
                id: Date.now(),
                text: message,
                sender: 'other',
                timestamp: new Date()
            }]);
        });

        return () => {
            socket.off('random-message');
        };
    }, [socket]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const messageData = {
            id: Date.now(),
            text: newMessage,
            sender: 'me',
            timestamp: new Date()
        };

        // Add message to local state
        setMessages(prev => [...prev, messageData]);

        // Send message via socket
        if (socket) {
            socket.emit('random-message', {
                text: newMessage,
                toid: partnerid // You'll need to set this dynamically
            });
        }

        setNewMessage('');
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    return (
        <div className="z-50 w-full">

            {/* Chat Window */}
            <div className="flex flex-col bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 border border-indigo-600/40 shadow-2xl rounded-2xl backdrop-blur-md ">
                {/* Chat Header */}
                <div className="py-2  md:py-1 rounded-t-2xl bg-gradient-to-b from-slate-700/60 to-slate-800/70">
                </div>
                {/* Messages Container */}
                <div className="p-4 md:pb-0 space-y-4 overflow-y-auto bg-gradient-to-b from-slate-800/60 to-slate-900/80 h-80 min-h-[35vh] max-h-[30vh] md:min-h-[29vh] md:max-h-max md:h-[20vh]">

                    {/* If no messages → show placeholder */}
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center text-gray-300">
                            <div className="text-4xl mb-2 animate-pulse">💗</div>
                            <p className="text-lg font-semibold text-indigo-400">Start your chat here</p>
                            <p className="text-sm opacity-70">Say hello to begin the conversation...</p>
                        </div>
                    ) : (
                        messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${message.sender === 'me'
                                            ? 'bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 text-white shadow-lg rounded-br-none'
                                            : 'bg-gradient-to-br from-teal-200 via-emerald-200 to-lime-200 text-emerald-900 shadow-md border border-emerald-300 rounded-bl-none'
                                        }`}
                                >
                                    <p className="text-sm break-words whitespace-pre-wrap">{message.text}</p>
                                    <p
                                        className={`text-xs mt-1 ${message.sender === 'me' ? 'text-blue-200' : 'text-emerald-700'
                                            }`}
                                    >
                                        {formatTime(message.timestamp)}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}

                    <div ref={messagesEndRef} />
                </div>


                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-3 md:p-2 border-t border-gray-700  rounded-b-2xl">
                    <div className="flex items-center space-x-3">
                        {/* Input Box */}
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 px-4 py-2 max-w-[80%] md:max-w-[to-90% text-white placeholder-gray-300 rounded-full 
                 bg-gradient-to-r from-indigo-900 via-blue-900 to-purple-900
                 border border-indigo-600/40 shadow-inner 
                 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                        />

                        {/* Send Button */}
                        <button
                            type="submit"
                            disabled={!newMessage.trim()}
                            className="p-3 text-white transition-all duration-300 rounded-full 
                 bg-gradient-to-br from-fuchsia-500 via-pink-500 to-purple-600 
                 hover:scale-110 hover:shadow-[0_0_15px_rgba(236,72,153,0.8)] 
                 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default RandomChatUI;