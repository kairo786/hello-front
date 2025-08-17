/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import { chairsTableParasol } from '@lucide/lab';
import React from 'react';
import ChatInput from '@/components/chatinput';
import { MdOutlineEmojiEmotions, MdOutlineReply } from "react-icons/md";
import { HiOutlineReply } from "react-icons/hi";
import { IoMdCopy } from "react-icons/io";
import { IoReturnUpForwardOutline } from "react-icons/io5";
import { RiDeleteBinLine } from "react-icons/ri";
import { PiCopyrightBold } from "react-icons/pi";
import { FaAngleDown } from "react-icons/fa6";
import { useEffect, useState, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useSocket } from '../context/SocketContext';
import { GrEdit } from "react-icons/gr";
import Swal from "sweetalert2";
import { Lavishly_Yours } from "next/font/google";
import Link from 'next/link';

// Font import karo
const lavishlyYours = Lavishly_Yours({
  weight: "400",
  subsets: ["latin"],
  // variable: "--font-lavishly-yours",
});

const Openchat = ({ senderEmail, receiverEmail, receiversocketid ,receiverimg,receivername }) => {

  useEffect(() => {
    handleopenChat();
    // console.log('senderemail :', senderEmail);
    // console.log('receiver email :', receiverEmail);
  }, [])

  const [currentChat, setCurrentChat] = useState([]);
  const [openId, setOpenId] = useState(null); // kaunsa item open hai
  const socket = useSocket();
  const audioRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [copied, setcopied] = useState(false);


  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [currentChat]); // jab messages update ho

  const handleopenChat = () => {
    if (!senderEmail || !receiverEmail) {
      console.error("Emails not set yet");
      alert('Emails not set yet')
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/get-messages?sender=${senderEmail}&receiver=${receiverEmail}`)
      .then(res => res.json())
      .then(data => {
        setCurrentChat(data.messages); // state में messages save
      })
      .catch(err => console.error(err));
  }

  useEffect(() => {
    socket.on("open-chat", () => {
      handleopenChat();
      setTimeout(() => {
        audioRef.current.play();
      }, 200);
      // console.log('chat-open');
    })
    return () => {
      socket.off("open-chat")
    }
  }, [])

  const handleok = (A) => {
    // console.log(A);
    alert(A);
  }

  const ap = (msgid) => {
  let selectedOption = null;

    Swal.fire({
      title: '<span style="font-size:18px; font-weight:600;">Delete message?</span>',
      html: `
        <p style="color:#e0e0e0; font-size:14px; margin-top:4px;">
          You can delete messages for everyone or just for yourself.
        </p>
        <div style="text-align:left; margin-top:12px;">
          <label style="display:flex; align-items:center; gap:8px; margin:6px 0; cursor:pointer; color:#fff;">
            <input type="radio" name="deleteOption" value="me" style="transform:scale(1.1); cursor:pointer;">
            Delete for me
          </label>
          <label style="display:flex; align-items:center; gap:8px; margin:6px 0; cursor:pointer; color:#fff;">
            <input type="radio" name="deleteOption" value="everyone" style="transform:scale(1.1); cursor:pointer;">
            Delete for everyone
          </label>
        </div>
      `,
      background: "#2a2a2a", // Gray background
      color: "#fff",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "whatsapp-popup",
        confirmButton: "whatsapp-confirm",
        cancelButton: "whatsapp-cancel",
      },
      didOpen: () => {
        const confirmBtn = Swal.getConfirmButton();
        confirmBtn.disabled = true;

        document.querySelectorAll('input[name="deleteOption"]').forEach((radio) => {
          radio.addEventListener("change", (e) => {
            selectedOption = e.target.value;
            confirmBtn.disabled = false;
          });
        });
      },
      preConfirm: () => {
        if (!selectedOption) {
          Swal.showValidationMessage("Please select an option");
        }
        return selectedOption;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        handledelete(msgid,result.value ,false);
      }
    });
  }


  const handledelete = (msgid , kisko ,conf) => {
    let a = true;
    if(conf){
      a = confirm('\t \t Delete message ? \n This has no effect on your receipt chats') ;
    }
 
   if(a){ toast('👍 msg deleted')
    // Delete message
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/delete-message`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        senderEmail: senderEmail,
        receiverEmail: receiverEmail,
        messageId: msgid,
        kisko:kisko,
      })

    });
    // console.log(msgid);
    setTimeout(() => {
      socket.emit("open-chat", receiversocketid);
      handleopenChat();
    }, 400);
  }
  }

  const handleedit = (msgid) => {
    const newtext = prompt("Enter new message :");
    // Edit message
    // console.log(msgid);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/edit-message`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        senderEmail: senderEmail,
        receiverEmail: receiverEmail,
        messageId: msgid,
        newText: newtext,
      })
    });
    setTimeout(() => {
      socket.emit("open-chat", receiversocketid);
      handleopenChat();
    }, 400);
    toast('msg edited');
  }


  return (
   <div
  className="relative h-screen bg-[url('/wp-bg.png')] bg-cover bg-center w-full"
  onClick={() => { if (openId) setOpenId(null) }}
>
  <nav className='top-0 w-full flex flex-row justify-start gap-5 items-center bg-gray-500'>
    <span><img
                  src={receiverimg}
                  alt={receivername}
                  className="w-10 h-10 m-2 ml-4 rounded-full object-cover bg-gray-600"
                /></span>
    <span className='text-white font-bold '>{receivername}</span>
  </nav>
  {/* Chat Messages Area */}
  <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick={true} rtl={false} pauseOnFocusLoss draggable theme="light" />
  {currentChat.length > 0 ? (
    <div ref={chatContainerRef} className="flex flex-col space-y-3 p-4 pb-20 h-[calc(100vh-80px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300/50 scrollbar-track-transparent">
      {currentChat.map((msg, i) => (
        <div
          key={i}
          className={`
            flex 
            ${msg.sender === senderEmail ? "justify-end mr-6" : "justify-start ml-6"}
            animate-fade-in
          `}
        >
          <div className='flex items-center gap-2 group'>
            {/* Message Actions Dropdown Trigger */}
            <div className={`relative ${msg.sender === senderEmail ? "order-first" : "order-last"}`}>
              <span
                className={`text-white/70 hidden ${msg.deleted ? 'hidden' : "group-hover:flex items-center gap-1"} border border-gray-400/50 rounded-full p-1 cursor-pointer hover:bg-gray-600/30 transition-all`}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenId(prev => prev === msg._id ? null : msg._id);
                }}
              >
                <MdOutlineEmojiEmotions className="text-sm" />
                <FaAngleDown className="text-xs" />
              </span>

              {/* Dropdown Menu - Positioned differently for last 2 messages */}
              {openId === msg._id && (
                <div
                  className={`
                    absolute ${i >= currentChat.length - 2 ? 'bottom-full mb-1' : 'top-full mt-1'} 
                    bg-gray-700/95 backdrop-blur-sm flex flex-col text-white rounded-md shadow-lg z-50 w-60 border border-gray-600 overflow-hidden
                    ${msg.sender === senderEmail ? "right-0" : "left-0"}
                  `}
                  onClick={(e) => { e.stopPropagation(), setOpenId(null) }}
                >
                  <span className="px-3 py-2 hover:bg-gray-600/80 cursor-pointer flex items-center gap-2">
                    <HiOutlineReply className="text-base" /> Reply
                  </span>

                  <span className="px-3 py-2 hover:bg-gray-600/80 cursor-pointer flex items-center gap-2" onClick={() => { toast(`msg copied to clipboard : ${msg.text}`),navigator.clipboard.writeText(msg.text), setcopied(true), setTimeout(() => { setcopied(false); }, 2000); }}>
                    {copied ? <span className='flex flex-row gap-2'> <PiCopyrightBold className='text-base text-cyan-400' /> copied</span> : <span className='flex flex-row gap-2'><IoMdCopy className="text-base" /> Copy</span>}
                  </span>
                  <span className="px-3 py-2 hover:bg-gray-600/80 cursor-pointer flex items-center gap-2">
                    <IoReturnUpForwardOutline className="text-base" /> Forward
                  </span>
                  {msg.sender === senderEmail && <span onClick={() => { handleedit(msg._id) }} className="px-3 py-2 hover:bg-gray-600/80 cursor-pointer flex items-center gap-2">
                    <GrEdit className="text-base text-cyan-400" /> Edit
                  </span>}
                  {msg.sender === senderEmail && <span onClick={() => ap(msg._id)} className="px-3 py-2 hover:bg-red-500/80 cursor-pointer flex items-center gap-2 text-red-300">
                    <RiDeleteBinLine className="text-base" /> Delete
                  </span>}
                  {msg.sender !== senderEmail && <span onClick={() => handledelete(msg._id, "me", true)} className="px-3 py-2 hover:bg-red-500/80 cursor-pointer flex items-center gap-2 text-red-300">
                    <RiDeleteBinLine className="text-base" /> Delete for me
                  </span>}
                </div>
              )}
            </div>

            {/* Message Bubble */}
            <div className={`
              max-w-xs md:max-w-md lg:max-w-lg rounded-2xl p-3 shadow-md transition-all duration-200
              ${msg.sender === senderEmail
                  ? "bg-emerald-700 text-white rounded-tr-none"
                  : "bg-gray-700 text-white rounded-tl-none"
                }
              hover:shadow-lg hover:-translate-y-0.5
            `}>
              {!msg.deleted && <p className={'text-sm break-words'}> {msg.text} </p>}
              {msg.deleted && <span className={lavishlyYours.className} style={{ fontSize: "1.5rem" }}>
                {msg.text} 💖
              </span>}

              <div className={`flex items-center mt-1 text-xs ${msg.sender === senderEmail ? "justify-end text-emerald-200" : "justify-start text-gray-300"}`}>
                <span>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {msg.sender === senderEmail && (
                  <span className="ml-1">
                    {msg.status === 'read' ? '✓✓' : msg.status === 'delivered' ? '✓' : ''}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-full bg-gray-900/20 rounded-lg border border-dashed border-gray-600/30 animate-pulse">
      <svg className="w-12 h-12 text-gray-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
      <p className="mt-2 text-gray-300 font-medium">No messages yet</p>
      <p className="text-sm text-gray-400/70">Start a conversation!</p>
    </div>
  )}

  {/* Fixed Input at Bottom */}
  {senderEmail && receiverEmail &&
    <div className="fixed bottom-0 md:w-9/12 w-full pb-0 pt-4 bg-gradient-to-t from-gray-900/80 to-transparent">

      <ChatInput senderemail={senderEmail} receiveremail={receiverEmail} handleopenchat={handleopenChat} receiversocketid={receiversocketid} />
      <audio ref={audioRef} src="/text-send.mp3" />
    </div>
  }
</div>
  );
}

export default Openchat
