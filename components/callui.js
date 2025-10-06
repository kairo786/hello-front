"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { PhoneCall, PhoneOff, Mic, Video, Volume2 } from "lucide-react";
import { useRouter } from "next/navigation";
// import { useSocket } from "../context/SocketContext";

export default function CallUIPage({ role,setRole ,socket = null ,image =null , username=null ,fromid =null,toid=null}) {
  // const [role, setRole] = useState(""); // 'caller' or 'receiver'
  const dragX = useMotionValue(0);
  const route = useRouter();
  const callerRef = useRef(null);
  const receiverRef = useRef(null);

  // useEffect(() => {
  //   setRole(roler);
  // }, [roler]);


  useEffect(() => {
    // const handlenotanswer = () => {
    //   alert("did not answered to the call");
    //   window.location.href = '/chat'
    //   setRole("");
    // }
    const handledecline = () => {
      alert("Call Declined");
      console.log("call decline");
      setRole(" ");
      // route.push("/chat");
    }
    const handleanswer = () => {
      route.push("/call");
    }
    const handlemisscall =() => {
      alert("missed call");
      // route.push("/chat");
      setRole("");
    }
    
    socket.on("miss-call",handlemisscall);
    // socket.on("not-answered",handlenotanswer);
    socket.on("call-answered",handleanswer);
    socket.on("call-decline",handledecline);
    return () => {
    socket.off("miss-call",handlemisscall);
    // socket.off("not-answered",handleanswer);
    socket.off("call-answered",handleanswer);
    socket.off("call-decline",handledecline);
  };
  }, [socket,route])
  
// Handle audio based on role 
  useEffect(() => {
    if (!role) return;
    const playAudio = () => {
      if (role === "caller") {
        receiverRef.current?.pause();
        callerRef.current?.play().catch(error => {
          console.log("Caller audio play failed:", error);
        });
      } else if (role === "receiver") {
        callerRef.current?.pause();
        receiverRef.current?.play().catch(error => {
          console.log("Receiver audio play failed:", error);
        });
      }
    };

    // Try to play immediately
    playAudio();

    // Fallback for browsers that require user interaction
    const handleInteraction = () => {
      window.removeEventListener("click", handleInteraction);
      playAudio();
    };
    window.addEventListener("click", handleInteraction);
    return () => {
      window.removeEventListener("click", handleInteraction);
    };
  }, [role]);

  const backgroundColor = useTransform(
    dragX,
    [-150, 0, 150],
    ["#dc2626", "#1e293b", "#16a34a"]
  );

  const handleDragEnd = (_, info) => {
    const offset = info.offset.x;
    if (offset > 100) {
      handleAcceptCall();
    } else if (offset < -100) {
      handleDeclineCall();
    }
  };

  const handleAcceptCall = () => {
    socket.emit("call-answered",fromid);
    callerRef.current?.pause();
    receiverRef.current?.pause();
  };

  const handleDeclineCall = () => {
    callerRef.current?.pause();
    receiverRef.current?.pause();
    alert("❌ Call Declined");
    setRole("");
    socket.emit("call-decline",fromid);
    // window.location.href = '/chat'
    // route.push("/chat");
  };

  const handleEndCall = () => {
    callerRef.current?.pause();
    receiverRef.current?.pause();
    alert("📞 Call Ended");
    setRole("");
    socket.emit("miss-call",toid);
    // route.push("/chat");
  };

  return (
    <motion.div
      className="relative flex flex-col items-center justify-center h-screen text-white"
      style={{ backgroundColor }}
    >
      {/* Audio Elements */}
      <audio ref={callerRef} loop preload="auto">
        <source src="/caller.mp3" type="audio/mp3" />
      </audio>
      <audio ref={receiverRef} loop preload="auto">
        <source src="/reciever.mp3" type="audio/mp3" />
      </audio>

      {/* Top-right icons */}
      <div className="absolute flex gap-3 top-4 right-4">
        <IconButton icon={<Mic />} />
        <IconButton icon={<Volume2 />} />
        <IconButton icon={<Video />} />
      </div>

      {/* Avatar */}
      <motion.div
        className="overflow-hidden border-4 border-blue-400 rounded-full shadow-2xl w-44 h-44"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <img
          src={image}
          alt="User"
          className="object-cover w-full h-full"
        />
      </motion.div>

      {/* Username & Status */}
      <div className="mt-6 text-center">
        <h1 className="text-2xl font-bold tracking-wide">
          {role === "caller" ? `Calling... to ${username}` : `Incoming Call...  from ${username}`}
        </h1>
        {role === "receiver" ? (
          <p className="mt-1 text-gray-300">Swipe to Accept or Decline</p>
        ) : (
          <motion.div
            className="mt-4 text-sm text-green-300"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {role === "caller" ? "Ringing..." : "Connecting..."}
          </motion.div>
        )}
      </div>

      {/* Receiver Swipe Action */}
      {role === "receiver" && (
        <div className="flex justify-center w-full px-8 mt-14">
          <motion.div
            className="flex items-center justify-center w-24 h-24 text-green-600 bg-white rounded-full shadow-lg cursor-pointer"
            drag="x"
            dragConstraints={{ left: -150, right: 150 }}
            dragElastic={0.3}
            onDragEnd={handleDragEnd}
            style={{ x: dragX }}
            whileTap={{ scale: 0.9 }}
          >
            <PhoneCall className="w-8 h-8" />
          </motion.div>
        </div>
      )}

      {/* Caller Controls */}
      {role === "caller" && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleEndCall}
          className="flex items-center gap-2 px-6 py-3 mt-16 text-white transition bg-red-600 rounded-full hover:bg-red-700"
        >
          <PhoneOff className="w-5 h-5" />
          End Call
        </motion.button>
      )}
    </motion.div>
  );
}

function IconButton({ icon, label }) {
  return (
    <motion.div
      whileTap={{ scale: 0.9 }}
      className="flex flex-col items-center text-center cursor-pointer"
    >
      <div className="flex items-center justify-center transition bg-gray-800 rounded-full w-14 h-14 hover:bg-gray-700">
        {icon}
      </div>
      {label && <p className="mt-1 text-xs text-gray-400">{label}</p>}
    </motion.div>
  );
}