"use client"
import { useState, useRef} from 'react';
import { FiSmile, FiPaperclip, FiMic, FiSend } from 'react-icons/fi';
import EmojiPicker from 'emoji-picker-react';
import { useEffect } from 'react';
import { useSocket } from './pages/context/SocketContext';
import { RxCrossCircled } from "react-icons/rx";

const ChatInput = ({ senderemail, receiveremail, handleopenchat, receiversocketid, replyTo ,setReplyTo}) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef(null);
  const audioRef = useRef();
  // const [played, setPlayed] = useState(false);
  const socket = useSocket();


  useEffect(() => {
    console.log("replyto :", replyTo);
  }, [replyTo])
  
   
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
      if(replyTo){setReplyTo(null)};
      console.log('Message sent:', message);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/send-message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderEmail: senderemail,
          receiverEmail: receiveremail,
          message: message,
          // replyid:replyTo.id,
        })
      });
      setTimeout(() => {
        socket.emit("open-chat", receiversocketid);
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
    <div className='bg-gray-900 border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700'>
      {replyTo?.text && (
        <div className="flex items-center justify-between h-12 px-3 py-2 mt-2 ml-20 mr-2 bg-gray-400 border-l-4 border-green-500 md:ml-28 rounded-t-md">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-green-800">
              {replyTo.mail}
            </span>
            <span className="ml-2 text-sm text-gray-200 text-start">
              {replyTo.text}
            </span>
          </div>
          <button
            onClick={() => setReplyTo(null)}
            className="ml-3 font-bold text-white transition hover:text-red-500"
          >
           <RxCrossCircled />
          </button>
        </div>
      )}

      <div className={`relative p-3  bottom-0`}>
        {/* Emoji Picker (shown when activated) */}
        {showEmojiPicker && (
          <div className="absolute left-0 z-10 bottom-16">
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

        <div className="flex items-center px-2 pl-5 rounded-full shadow-sm dark:bg-gray-700">
          {/* Emoji Button */}
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 text-gray-500 transition-colors hover:text-amber-500 dark:hover:text-amber-400"
          >
            <FiSmile className="w-5 h-5" />
          </button>

          {/* Attachment Button */}
          <button
            onClick={handleFileClick}
            className="p-2 text-gray-500 transition-colors hover:text-blue-500 dark:hover:text-blue-400"
          >
            <FiPaperclip className="w-5 h-5" />
          </button>

          {/* Text Input */}
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message"
            className="flex-1 px-3 py-2 mx-2 ml-4 text-white placeholder-gray-400 bg-transparent border-0 resize-none focus:ring-0 max-h-32 dark:text-white"
            rows="1"
          />

          {/* Send/Record Button */}
          {message.trim() ? (
            <button
              onClick={handleSend}
              className="p-2 text-blue-500 transition-colors hover:text-blue-600 dark:hover:text-blue-300"
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
          <div className="flex items-center justify-center mt-2 text-sm text-center text-red-500">
            <span className="w-3 h-3 mr-2 bg-red-500 rounded-full animate-pulse"></span>
            Recording... Press to stop
          </div>
        )}
      </div>
    </div>

  );
};

export default ChatInput;