"use client";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import CallControls from "@/components/CallControls";
import TopBar from "@/components/Topbar";
import { useButton } from "@/app/context/buttoncontext";
import { useSocket } from "../context/SocketContext";
import { useOffer } from "../context/offercontext";
import { useRouter } from "next/navigation";
import * as faceapi from 'face-api.js';

// Peer Connection Factory with scoped instances
const PeerConnection = (() => {
  const peerConnectionMap = new Map();

  const createPeerConnection = (key, localStream, remoteRef, socket, callState, incomingOffer) => {
    const config = {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    };
    const pc = new RTCPeerConnection(config);

    if (localStream) {
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });
    }

    pc.ontrack = (event) => {
      if (remoteRef?.current) {
        remoteRef.current.srcObject = event.streams[0];
        console.log("📺 Remote stream set:", event.streams[0]);
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        const to = key === "incoming" ? incomingOffer?.from : callState.to;
        const from = key === "incoming" ? incomingOffer?.to : callState.from;
        socket.emit("icecandidate", { from, to, candidate: event.candidate });
      }
    };

    peerConnectionMap.set(key, pc);
    return pc;
  };

  return {
    getInstance: (key, localStream, remoteRef, socket, callState, incomingOffer) => {
      if (!peerConnectionMap.has(key)) {
        return createPeerConnection(key, localStream, remoteRef, socket, callState, incomingOffer);
      }
      return peerConnectionMap.get(key);
    },
  };
})();

export default function Callpage() {
  const { callState } = useButton();
  const { incomingOffer } = useOffer();
  const socket = useSocket();
  const localRef = useRef();
  const remoteRef = useRef();
  const [tempofer, setTempofer] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const offerHandledRef = useRef(false);
  const route = useRouter();
  const [emoji, setEmoji] = useState('😐');
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const MODEL_URL = "https://justadudewhohacks.github.io/face-api.js/models";

  const emojiMap = {
    happy: "😁",
    sad: "😭",
    angry: "😡",
    surprised: "😮",
    disgusted: "🤢",
    fearful: "😨",
    neutral: "😐",
  };

  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
        ]);
        
        setModelsLoaded(true);
        console.log("model loded ");
      } catch (error) {
        console.error("Model loading failed:", error);
      }
    };
    loadModels();
  }, []);
  
   useEffect(() => {
    if (!modelsLoaded) return;

    const detectionOptions = new faceapi.TinyFaceDetectorOptions({
      inputSize: 320,       // Faster processing
      scoreThreshold: 0.2   // More sensitive detection
    });

    const interval = setInterval(async () => {
      if (!localRef.current || localRef.current.readyState < 4) return;

      try {
        const result = await faceapi
          .detectSingleFace(localRef.current, detectionOptions)
          .withFaceExpressions();

        if (result?.expressions) {
          // Boost expression sensitivity
          const boosted = {
            angry: result.expressions.angry * 1.5,
            happy: result.expressions.happy * 1.3,
            surprised: result.expressions.surprised * 1.4,
            neutral: result.expressions.neutral * 0.7,
            sad: result.expressions.sad,
            disgusted: result.expressions.disgusted,
            fearful: result.expressions.fearful
          };
          
          const maxEmotion = Object.keys(boosted).reduce((a, b) => 
            boosted[a] > boosted[b] ? a : b
          );
          
          setEmoji(emojiMap[maxEmotion]);
        }
      } catch (err) {
        console.error("Detection error:", err);
      }
    }, 300); // Faster checking interval

    return () => clearInterval(interval);
  }, [emojiMap, modelsLoaded]);

  useEffect(() => {
    console.log("socket id is : ", socket?.id);
  }, [socket?.id]);
  
  
  useEffect(() => {
    if (!socket) return;
    socket.on("connect", () => console.log("✅ Socket connected:", socket.id));
    socket.on("disconnect", () => console.log("❌ Socket disconnected", socket.id));
    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [socket]);

  //get user media
  useEffect(() => {
    if (!modelsLoaded) return;
    async function getStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (localRef.current) {
          localRef.current.srcObject = stream;
          setLocalStream(stream);
          if (callState.clicked) setTempofer(true);
        }
      } catch (err) {
        console.error("🎥 Media access error:", err);
      }
    }
    getStream();
  }, [callState.clicked, modelsLoaded]);

  useEffect(() => {
    if (!socket || !localStream || !callState.clicked) return;

    const startCall = async () => {
      const pc = PeerConnection.getInstance("outgoing", localStream, remoteRef, socket, callState, incomingOffer);
      const offer = await pc.createOffer();
      console.log("offer created ",offer);
      await pc.setLocalDescription(offer);
      socket.emit("offer", {
        from: callState.from,
        to: callState.to,
        offer: pc.localDescription,
      });
    };

    startCall();
  }, [callState, incomingOffer, localStream, socket, tempofer]);

  useEffect(() => {
    if (!incomingOffer || !localStream || offerHandledRef.current) return;

    offerHandledRef.current = true;

    const pc = PeerConnection.getInstance("incoming", localStream, remoteRef, socket, callState, incomingOffer);

    const handleIncomingOffer = async () => {
      const { from, to, offer } = incomingOffer;
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("answer", { from: to, to: from, answer: pc.localDescription });
    };

    handleIncomingOffer();
  }, [incomingOffer, localStream]);

useEffect(() => {
  if (!socket || !localStream || !remoteRef?.current || !callState.clicked) return;

  const pc = PeerConnection.getInstance("outgoing", localStream, remoteRef, socket, callState, incomingOffer);
  let pendingCandidates = [];

  // ⬇️ Answer received from receiver
  socket.on("answer", async ({ answer }) => {
    if (pc.signalingState !== "stable") {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
      console.log("✅ Answer applied (caller)");

      // 🧊 Apply buffered ICE
      for (const candidate of pendingCandidates) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
          console.log("📦 Buffered ICE added (caller)");
        } catch (err) {
          console.error("❌ ICE error (caller):", err);
        }
      }
      pendingCandidates = [];
    } else {
      console.warn("⚠️ Ignored answer: already stable (caller)");
    }
  });
 socket.on("end-call",()=>{
     pc.close();
     localStream?.getTracks().forEach((track) => track.stop());
     window.location.href = '/'
    //  route.push("/chat");
  })
  // ⬇️ ICE candidates from receiver
  socket.on("icecandidate", async ({ candidate }) => {
    if (pc.remoteDescription && pc.remoteDescription.type) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
        console.log("❄️ ICE added (caller)");
      } catch (err) {
        console.error("❌ ICE add failed (caller):", err);
      }
    } else {
      pendingCandidates.push(candidate);
      console.log("📦 ICE buffered (caller)");
    }
  });

  return () => {
    socket.off("answer");
    socket.off("icecandidate");
    socket.off("end-call"); // ✅ Important
  };
}, [localStream, callState.clicked]);

useEffect(() => {
  if (!socket || !localStream || !remoteRef?.current || !incomingOffer) return;

  const pc = PeerConnection.getInstance("incoming", localStream, remoteRef, socket, callState, incomingOffer);
  let pendingCandidates = [];

  // Receiver requests buffered ICE from backend
  socket.emit("request-icecandidates");
 
  // ⬇️ ICE candidates from caller
  socket.on("icecandidate", async ({ candidate }) => {
    if (pc.remoteDescription && pc.remoteDescription.type) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
        console.log("❄️ ICE added (receiver)");
      } catch (err) {
        console.error("❌ ICE add failed (receiver):", err);
      }
    } else {
      pendingCandidates.push(candidate);
      console.log("📦 ICE buffered (receiver)");
    }
  });
     socket.on("end-call",()=>{
     pc.close();
     localStream?.getTracks().forEach((track) => track.stop());
    //  route.push("/chat");
    window.location.href = '/'
     })
  return () => {
    socket.off("icecandidate");
    socket.off("end-call"); // ✅ Important
  };
}, [incomingOffer, localStream]);


  const [isSwapped, setIsSwapped] = useState(false);
  const [size, setSize] = useState({ width: 220, height: 150 });
  const [resizingEdge, setResizingEdge] = useState(null);

  const startResize = (edge, e) => {
    e.preventDefault();
    e.stopPropagation();
    setResizingEdge(edge);

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size.width;
    const startHeight = size.height;

    const doDrag = (e) => {
      if (edge === "right") setSize({ ...size, width: Math.max(150, startWidth + (e.clientX - startX)) });
      if (edge === "bottom") setSize({ ...size, height: Math.max(100, startHeight + (e.clientY - startY)) });
      if (edge === "left") setSize({ ...size, width: Math.max(150, startWidth - (e.clientX - startX)) });
      if (edge === "top") setSize({ ...size, height: Math.max(100, startHeight - (e.clientY - startY)) });
    };

    const stopDrag = () => {
      setResizingEdge(null);
      window.removeEventListener("mousemove", doDrag);
      window.removeEventListener("mouseup", stopDrag);
    };

    window.addEventListener("mousemove", doDrag);
    window.addEventListener("mouseup", stopDrag);
  };

  const handleSwap = () => {
    if (!resizingEdge) setIsSwapped((prev) => !prev);
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <div className="absolute top-0 w-full z-10">
        <TopBar />
      </div>

<div className="relative p-4 flex flex-col w-full h-full">
  <motion.video
    ref={localRef}
    autoPlay
    muted
    playsInline
    onClick={handleSwap}
    style={{ borderRadius: 10, border: "2px solid #333" }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
    className="absolute inset-0 w-full h-full object-cover cursor-pointer z-0"
  />

  {emoji && (
  <div
    className={`
      absolute bottom-20 z-50 
      bg-white/30 px-4 py-2 rounded-full animate-bounce
      text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 
      left-1/2 -translate-x-1/2 
      md:left-auto md:translate-x-0 md:right-10
      transition-all duration-300
    `}
  >
    {/* Adjust emoji count based on screen size */}
    <span className="block md:hidden">{emoji.repeat(4)}</span>
    <span className="hidden md:block lg:hidden">{emoji.repeat(6)}</span>
    <span className="hidden lg:block xl:hidden">{emoji.repeat(8)}</span>
    <span className="hidden xl:block">{emoji.repeat(10)}</span>
  </div>
)}

</div>


      <motion.div
        className="absolute top-16 right-4 z-10 rounded-lg border-2 border-white overflow-hidden group"
        style={{ width: size.width, height: size.height }}
        onClick={handleSwap}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <video
          ref={remoteRef}
          autoPlay
          // muted
          playsInline
          className="w-full h-full object-cover"
          style={{ borderRadius: 10, border: "2px solid #333" }}
        />
        <div onMouseDown={(e) => startResize("right", e)} className="absolute top-0 right-0 w-2 h-full cursor-ew-resize z-20" />
        <div onMouseDown={(e) => startResize("left", e)} className="absolute top-0 left-0 w-2 h-full cursor-ew-resize z-20" />
        <div onMouseDown={(e) => startResize("bottom", e)} className="absolute bottom-0 left-0 h-2 w-full cursor-ns-resize z-20" />
        <div onMouseDown={(e) => startResize("top", e)} className="absolute top-0 left-0 h-2 w-full cursor-ns-resize z-20" />
      </motion.div>

     {tempofer && <div className="absolute bottom-2 w-full z-10">
        <CallControls camerastream={localStream}  data={callState.to}/>
      </div>
}
{incomingOffer&&
<div className="absolute bottom-2 w-full z-10">
        <CallControls camerastream={localStream} data = {incomingOffer.from}/>
      </div>
}
    </div>
  );
}
