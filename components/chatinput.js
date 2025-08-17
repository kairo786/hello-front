"use client"
import { useState, useRef } from 'react';
import { FiSmile, FiPaperclip, FiMic, FiSend } from 'react-icons/fi';
import EmojiPicker from 'emoji-picker-react';
import { useEffect } from 'react';
import { useSocket } from '@/app/context/SocketContext';

const ChatInput = ({ senderemail, receiveremail ,handleopenchat ,receiversocketid}) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef(null);
  const audioRef = useRef();
  // const [played, setPlayed] = useState(false);
  const socket = useSocket();

  const handleEmojiClick = (emojiData) => {
    setMessage(prev => prev + emojiData.emoji);
  };

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    // Handle file upload logic here
    console.log('Files selected:', files);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Add voice recording logic here
  };

  const handleSend = () => {
    if (message.trim()) {
      // Send message logic
      console.log('Message sent:', message);
      fetch("http://localhost:3001/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderEmail: senderemail,
          receiverEmail: receiveremail,
          message :message,
        })
      });
      setTimeout(() => {
        socket.emit("open-chat",receiversocketid);
        handleopenchat();
      }, 400);

      setTimeout(() => {
         audioRef.current.play();
      }, 450);

      setMessage('');
      setShowEmojiPicker(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
// useEffect(() => {
//  console.log('sender email1',senderemail)
//  console.log('receiver email2',receiveremail)
// }, [senderemail,receiveremail])

  return (
    <div className="relative bg-gray-900 dark:bg-gray-800 p-3 border-t border-gray-200 dark:border-gray-700">
      {/* Emoji Picker (shown when activated) */}
      {showEmojiPicker && (
        <div className="absolute bottom-16 left-0 z-10">
          <EmojiPicker onEmojiClick={handleEmojiClick} width={300} height={350} />
        </div>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        multiple
      />

      <div className="flex items-center dark:bg-gray-700 rounded-full px-2 pl-5 shadow-sm">
        {/* Emoji Button */}
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="p-2 text-gray-500 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
        >
          <FiSmile className="w-5 h-5" />
        </button>

        {/* Attachment Button */}
        <button
          onClick={handleFileClick}
          className="p-2 text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
        >
          <FiPaperclip className="w-5 h-5" />
        </button>

        {/* Text Input */}
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message"
          className="ml-4 flex-1 border-0 bg-transparent resize-none focus:ring-0 max-h-32 mx-2 py-2 px-3 text-white dark:text-white placeholder-gray-400"
          rows="1"
        />

        {/* Send/Record Button */}
        {message.trim() ? (
          <button
            onClick={handleSend}
            className="p-2 text-blue-500 hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
          >
            <FiSend className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={toggleRecording}
            className={`p-2 ${isRecording ? 'text-red-500 animate-pulse' : 'text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'} transition-colors`}
          >
            <FiMic className="w-5 h-5" />
          <audio ref={audioRef} src="/text-receive.mp3" />
          </button>

        )}
      </div>

      {/* Recording indicator */}
      {isRecording && (
        <div className="mt-2 text-center text-sm text-red-500 flex items-center justify-center">
          <span className="w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></span>
          Recording... Press to stop
        </div>
      )}
    </div>
  );
};

export default ChatInput;