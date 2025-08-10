/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useRef, useState, useEffect } from "react";
import { UserButton } from "@clerk/nextjs";
import { useUser } from "@clerk/clerk-react";
import CallControls from "@/components/CallControls";
import TranslateToSpeech from "../chekmic/page";
import MICpage from "../mic/page";
import { ToastContainer, toast } from 'react-toastify';
import { motion, AnimatePresence } from "framer-motion";
import 'react-toastify/dist/ReactToastify.css';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
// import TopBar from "@/components/Topbar";
import { useButton } from "@/app/context/buttoncontext";
import { useSocket } from "../context/SocketContext";
import { useOffer } from "../context/offercontext";
import { useRouter } from "next/navigation";
// import * as faceapi from 'face-api.js';

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
  const [showVideo, setShowVideo] = useState(true);
  const { user } = useUser();
  const offerHandledRef = useRef(false);
  const route = useRouter();
  const [swapvideo,setswapvideo] = useState(false);
  const [emoji, setEmoji] = useState('😐');
  const [selectedlang, setSelectedLang] = useState('😐');
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [showlang, setShowolang] = useState(false);
  const [showmiclang, setShowmicolang] = useState(false);
  const [micrequest, setmicrequest] = useState(false);
  const [micrequeaccepted,setmicrequestaccepted] =useState(false);
  const [showgivemic,setshowgivemic] =useState(false);
  const [onmicpage,setonmicpage] =useState(true);

  
  const [toid, settoid] = useState('');
  const[isremotemute ,setisremotemute] = useState(false);

  //M-3 In your call page component:
  // const [ttsStatus, setTtsStatus] = useState({});
  const [listenintranslang, setListenintranslang] = useState(false);
const MODEL_URL = "https://justadudewhohacks.github.io/face-api.js/models";
const [faceapi, setFaceApi] = useState(null);

const emojiMap = {
  happy: "😁",
  sad: "😭",
  angry: "😡",
  surprised: "😮",
  disgusted: "🤢",
  fearful: "😨",
  neutral: "😐",
};

// load face api models (browser only)
useEffect(() => {
  if (typeof window === "undefined") return;

  let faceapi = null;
  let mounted = true;

  const load = async () => {
    try {
      const fa = await import('@vladmandic/face-api');
      faceapi = fa;
      // optional: faceapi.env.setOptions({ ... }) if needed
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]);
      if (!mounted) return;
      setModelsLoaded(true);
      setFaceApi(faceapi);
      console.log("✅ face-api (vladmandic) models loaded");
    } catch (err) {
      console.error("face-api load err", err);
    }
  };
  load();
  return () => { mounted = false; };
}, []);


// detecting face using loaded faceapi
useEffect(() => {
  if (!modelsLoaded || !faceapi) return;

  const detectionOptions = new faceapi.TinyFaceDetectorOptions({
    inputSize: 320,
    scoreThreshold: 0.2,
  });

  const interval = setInterval(async () => {
    if (!localRef.current || localRef.current.readyState < 4) return;

    try {
      const result = await faceapi
        .detectSingleFace(localRef.current, detectionOptions)
        .withFaceExpressions();

      if (result?.expressions) {
        const boosted = {
          angry: result.expressions.angry * 1.5,
          happy: result.expressions.happy * 1.3,
          surprised: result.expressions.surprised * 1.4,
          neutral: result.expressions.neutral * 0.7,
          sad: result.expressions.sad,
          disgusted: result.expressions.disgusted,
          fearful: result.expressions.fearful,
        };

        const maxEmotion = Object.keys(boosted).reduce((a, b) =>
          boosted[a] > boosted[b] ? a : b
        );

        setEmoji(emojiMap[maxEmotion]);
      }
    } catch (err) {
      console.error("Detection error:", err);
    }
  }, 300);

  return () => clearInterval(interval);
}, [emojiMap, modelsLoaded, faceapi]);


  // Load lord-icon script
  useEffect(() => {
    const loadLordIconScript = async () => {
      const lottie = await import("lottie-web");
      const { defineElement } = await import("lord-icon-element");
      defineElement(lottie);
    };
    loadLordIconScript();
  }, []);


  useEffect(() => {
    console.log("socket id is : ", socket?.id);
  }, [socket?.id]);


useEffect(() => {
const savedLang = localStorage.getItem("selectedLang");
    if (savedLang) {setSelectedLang(savedLang)};
}, [showlang])


  useEffect(() => {
    if (!socket) return;
    socket.on("connect", () => console.log("✅ Socket connected:", socket.id));
    socket.on("disconnect", () => console.log("❌ Socket disconnected", socket.id));
    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [socket]);

   const handleCameraToggle = (isCameraOn) => {
    setShowVideo(isCameraOn);
  };

  //get user media
  useEffect(() => {
    if (!modelsLoaded) return;
    async function getStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true,echoCancellation:true });
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

//creating offer on callstate
  useEffect(() => {
    if (!socket || !localStream || !callState.clicked) return;

    const startCall = async () => {
      const pc = PeerConnection.getInstance("outgoing", localStream, remoteRef, socket, callState, incomingOffer);
      const offer = await pc.createOffer();
      console.log("offer created ", offer);
      await pc.setLocalDescription(offer);
      socket.emit("offer", {
        from: callState.from,
        to: callState.to,
        offer: pc.localDescription,
      });
    };

    startCall();
  }, [callState, incomingOffer, localStream, socket, tempofer]);

//creating answer on incomingoffer
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

  //handel answer ,ice-candidate,endcall for caller
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
    socket.on("end-call", () => {
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

  //handel answer ,ice-candidate,endcall for caller
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
    socket.on("end-call", () => {
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
  setswapvideo((prev) => !prev);
  console.log("video swapped swapvideo is ", !swapvideo);
}

  useEffect(() => {
    if (callState.clicked) {
      settoid(callState.to);
    } else if (incomingOffer) {
      settoid(incomingOffer.from);
    }
  }, [incomingOffer, callState])

  
  
  const handletransconfirm = () => {
    setListenintranslang(true);
    setShowolang(false);
    
    if (socket && toid) {
      socket.emit("translatelang-request", toid);
      console.log("todata :", toid);
    }
    else {
      console.log('no toid data ', toid);
    }
  };
  
// M-3 Socket handler for TTS status
  
// useEffect(() => {
//   if (!socket) return;
//   const handleTtsStarted = (data) => {
//     console.log('TTS status started for:', data.toid);
//     setTtsStatus(prev => ({...prev, [data.toid]: true}));
//   };
//   const handleTtsEnded = (data) => {
//     console.log('TTS status ended for:', data.toid);
//     setTtsStatus(prev => ({...prev, [data.toid]: false}));
//   };

//   socket.on("tts-started", handleTtsStarted);
//   socket.on("tts-ended", handleTtsEnded);

//   return () => {
//     socket.off("tts-started", handleTtsStarted);
//     socket.off("tts-ended", handleTtsEnded);
//   };
// }, [socket]);


  // listening translate-lang request
  useEffect(() => {
    if (!socket) return;
    socket.on("translatelang-request", () => {
      console.log("translated launguage request came");
      setmicrequest(true);
      if (!showmiclang) {
        alert('your friend wants to translate 🎧 your launguage please select your speaking launguage');
      }
      else{
        socket.emit("mic-request-accepted",toid);
        alert('your friend is translating your voice you are allow to change your launguage 😀!!');
      }
      setShowolang(true);
    }
    );
   socket.on("mic-request-accepted",()=>{
    setisremotemute(true);
    setmicrequestaccepted(true);
    if(!listenintranslang){
      setListenintranslang(true);
    }
    console.log('remote video muted🚫')
    toast.success('mic request accepted')

   })
    socket.on("mic-request-stopped",()=>{
      setisremotemute(false);
      setListenintranslang(false);
      setmicrequestaccepted(false);
      console.log('remote video on 📖');
    toast('mic-request-stopped ', {
  icon: '🚫',
});
   })

   socket.on("cancle-mic",()=>{
    console.log('friend want original material');
    setmicrequest(false);
    setshowgivemic(false);
    setShowmicolang(false);
 window.confirm('friend want original material');
 socket.emit("mic-request-stopped",toid);
   });


socket.on("give-mic",()=>{
   toast.success('mic 🎤 received');
   setonmicpage(false);
   setTimeout(() => {
    setonmicpage(true)
    setshowgivemic(true);
   }, 100);
})

    return () => {
      socket.off("translatelang-request");
      socket.off("mic-request-accepted") ;
      socket.off("cancle-mic");
      socket.off("give-mic");
    };
  }, [socket,showmiclang]);


  const handleLanguageClick = () => {
    console.log('Language icon clicked'); // Debug log
    setShowolang(true);
    toast.info(
      <div className="text-center pt-3 pr-2 pb-2 pl-1">
        <b className="text-lg pr-12 text-blue-500">Important Note</b>
        <p className="mt-1">For better experience speak clearly and at a normal speed in the selected language only.</p>
      </div>,
      {
        position: "bottom-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: {
          background: 'rgba(355, 355, 355, 0.12)',
          color: 'white',
          backdropFilter: 'blur(5px)',
          WebkitBackdropFilter: 'blur(5px)',
          border: '1px solid rgba(255, 255, 255, 0.38)',
          borderRadius: '12px',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.7)',
          padding: '16px'
        }
      }
    );
  };


  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* topbar */}
      <div className="fixed top-0 left-0 right-0 z-50"> {/* Changed to fixed and added z-50 */}
        <div className="flex justify-between items-center px-6 py-3 bg-gray-900 h-15">
          <h2 className="text-xl font-semibold text-white">Meeting with Kero Gang</h2>
          <span className="text-sm text-green-400">🔴 Live</span>
          <div className="flex items-center">
            <div className="relative group mr-12">
              <lord-icon
                src={(!showlang) ? 'https://cdn.lordicon.com/jdgfsfzr.json' : "https://cdn.lordicon.com/ehcxqqor.json"}
                onClick={(!showlang) ? handleLanguageClick : () => { setShowolang(false) }}
                trigger="hover"
                state="hover-conversation-alt"
                colors={(!showlang) ? "primary:#3080e8,secondary:#08a88a" : "primary:#d59f80,secondary:#08a88a"}
                className="w-10 h-10 md:w-12 md:h-12 cursor-pointer"
              />
              {!showlang && (

                <div className="absolute right-full top-1/2 transform -translate-y-1/2 mr-2 px-3 py-2 text-sm text-white bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20">
                  {!listenintranslang && <span>Listen in your favorite language</span>}
                  {listenintranslang && <span>Listen in Original language</span>}
                  <div className="absolute top-1/2 left-full -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent border-r-gray-700"></div>
                </div>
              )}

              {showlang && (
                <div className="absolute right-full top-1/2 transform -translate-y-1/2 mr-2 px-3 py-2 text-sm text-white bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20">
                  Close Lang page
                  <div className="absolute top-1/2 left-full -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent border-r-gray-700"></div>
                </div>
              )}
            </div>
            <div className="w-11 h-11 rounded-full object-cover bg-gray-500 flex items-center text-center justify-center">
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: {
                      width: "40px",
                      height: "40px",
                    },
                  },
                }}
              /></div>
          </div>
        </div>
      </div>
      <ToastContainer />

      {/* translation info page */}
      <AnimatePresence>
        {showlang && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="absolute z-50 top-16 right-4 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-3 flex justify-between items-center">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  🌐
                </motion.div>
                Language Selected
              </h3>
              <button
                onClick={() => setShowolang(false)}
                className="text-white hover:text-gray-200 transition-colors text-lg"
              >
                &times;
              </button>
            </div>

            {/* Content */}
                    <div className="flex flex-col">
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="mb-3 p-4 pl-7 pb-0"
              >
                <span className="font-semibold">Select your spoken launguage</span>
                <button
                  onClick={() => { setShowmicolang(!showmiclang)
                    if(isremotemute){
                      setshowgivemic(true);
                    }
                    if(micrequest && socket){
                      if(showmiclang){
                        socket.emit("mic-request-stopped",toid);}
                      else{socket.emit("mic-request-accepted",toid);}
                    }
                  }}
                  className="relative text-[#16c79e] border-2 border-black rounded px-1 mt-3 inline cursor-pointer text-lg font-bold before:bg-teal-600 hover:rounded-b-none before:absolute before:-bottom-0 before:-left-0  before:block before:h-[2px] before:w-full before:origin-bottom-right before:scale-x-0 before:transition before:duration-300 before:ease-in-out hover:before:origin-bottom-left hover:before:scale-x-100">
                  {!showmiclang && <span> SHOW LANG</span>}
                  {showmiclang && <span className="text-red-500">STOP LANG</span>}
                </button>
              </motion.div>
              {showmiclang && <MICpage micrequest={false} toid={toid} />}
              <TranslateToSpeech />
            </div>


            {/* Footer */}
            <motion.div
              className="bg-gray-50 dark:bg-gray-700 px-4 py-3 flex justify-end border-t border-gray-200 dark:border-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-4 py-2 ${!listenintranslang ? 'text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2bg-blue-600 hover:bg-blue-700' : 'text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-1 mr-4'}  rounded-lg transition-colors`}
              >
                 {!listenintranslang && <div onClick={handletransconfirm}>Confirm</div>}
                {listenintranslang && <div onClick={() => { setListenintranslang(false) , setShowolang(false)
                  if(socket){
                    socket.emit("cancle-mic",toid);
                  }
                 }}>Listen in original launguage
                 </div>}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* local and remote video    */}
      <div className="relative p-4 flex flex-col w-full h-full">

     {/* Listening animation with lower z-index */}
         {!showlang && showmiclang && (
  <>
  <span><ToastContainer/></span>
    {/* MICpage with higher z-index and proper positioning */}
    {onmicpage && 
    <MICpage 
      micrequest={micrequest} 
      toid={toid} 
      className="absolute top-52 right-10 z-20"
    />
    }
    
    <span className="absolute top-20 right-8 z-[50] text-orange-400 text-2xl flex items-center">
      <span>{selectedlang} Listening</span>
      <DotLottieReact
        src="https://lottie.host/85c325c0-c43f-468d-b113-0ea58002cecb/ElMgfLaPbF.lottie"
        loop
        autoplay
        className="w-12 h-12 ml-2"
      />
    </span>
  </>
 
)}
        {!showlang && isremotemute && <TranslateToSpeech className='absolute z-10' />}

        {/* translating animation */}
        {isremotemute && (

          <span className="absolute top-25 right-10 z-10 text-cyan-300 text-2xl dark:text-cyan-200 font-medium flex flex-row items-center ">
            <span>Translating</span>
            <DotLottieReact
              src="https://lottie.host/20edb9ee-c915-47aa-9234-d6fbb3fa43dd/gubUz3v5LG.lottie"
              loop
              autoplay
              className="w-22 h-22 inline"
            />
          </span>

        )}

      {/* show give-mic */}
      {micrequest && micrequeaccepted && showgivemic &&
          <span className="absolute top-120 right-17 z-[50] text-2xl ">
      <DotLottieReact
        src="https://lottie.host/85109f00-b8e9-4906-906f-08ab53a24640/1WHg00htly.lottie"
        loop
        onClick={()=>{
                socket.emit("give-mic",toid);
                setshowgivemic(false);
              }}
        autoplay
        className="w-12 h-12 ml-2"
        title="Give mic"
      />
    </span>}


        {/* {showVideo ? ( */}
        {/* <motion.video
          ref={localRef}
          muted
          autoPlay
          playsInline
          onDoubleClick={handleSwap}
          style={{ borderRadius: 10, border: "2px solid #333" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 w-full h-full object-cover cursor-pointer z-0"
        /> */}


         {/* Local video */}
  <motion.video
  ref={remoteRef}
      muted={isremotemute}
    autoPlay
    playsInline
    onDoubleClick={handleSwap}
    style={{ borderRadius: 10, border: "2px solid #333" }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
    className={`absolute object-cover cursor-pointer
      ${swapvideo
        ? "top-20 left-8 z-10" // chhoti position
        : "inset-0 w-full h-full z-0"}  
    `}
    width={swapvideo ? size.width : undefined}
    height={swapvideo ? size.height : undefined}
  />


      {/* // ) : (
      //   <img  */}
      {/* //     src={user?.imageUrl} 
      //     alt="Profile" 
      //     className="h-full w-full object-cover rounded-lg"
      //   />
      // )} */}

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

      {/* remote video pulling */}
      {/* <motion.div
        className="absolute top-20 left-8 z-10 rounded-lg border-2 border-white overflow-hidden group"
        style={{ width: size.width, height: size.height }}
        onDoubleClick={handleSwap}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <video
          ref={remoteRef}
          muted={isremotemute}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
          style={{ borderRadius: 10, border: "2px solid #333" }}
        />
        <div onMouseDown={(e) => startResize("right", e)} className="absolute top-0 right-0 w-2 h-full cursor-ew-resize z-20" />
        <div onMouseDown={(e) => startResize("left", e)} className="absolute top-0 left-0 w-2 h-full cursor-ew-resize z-20" />
        <div onMouseDown={(e) => startResize("bottom", e)} className="absolute bottom-0 left-0 h-2 w-full cursor-ns-resize z-20" />
        <div onMouseDown={(e) => startResize("top", e)} className="absolute top-0 left-0 h-2 w-full cursor-ns-resize z-20" />
      </motion.div> */}


      {/* Remote video */}
  <motion.div
    className={`
      absolute rounded-lg border-2 border-white overflow-hidden group
      ${swapvideo
        ? "inset-0 w-full h-full z-0" // bada video
        : "top-20 left-8 z-10"} // chhoti position
    `}
    style={{
      width: !swapvideo ? size.width : undefined,
      height: !swapvideo ? size.height : undefined
    }}
    onDoubleClick={handleSwap}
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
  >
    <video
      ref={localRef}
      muted
      autoPlay
      playsInline
      className="w-full h-full object-cover"
      style={{ borderRadius: 10, border: "2px solid #333" }}
    />

    {/* Resize handles sirf chhoti video par */}
    {!swapvideo && (
      <>
        <div
          onMouseDown={(e) => startResize("right", e)}
          className="absolute top-0 right-0 w-2 h-full cursor-ew-resize z-20"
        />
        <div
          onMouseDown={(e) => startResize("left", e)}
          className="absolute top-0 left-0 w-2 h-full cursor-ew-resize z-20"
        />
        <div
          onMouseDown={(e) => startResize("bottom", e)}
          className="absolute bottom-0 left-0 h-2 w-full cursor-ns-resize z-20"
        />
        <div
          onMouseDown={(e) => startResize("top", e)}
          className="absolute top-0 left-0 h-2 w-full cursor-ns-resize z-20"
        />
      </>
    )}
  </motion.div>

      {tempofer && <div className="absolute bottom-2 w-full z-10">
        <CallControls camerastream={localStream} data={callState.to} onCameraToggle={handleCameraToggle} />
      </div>
      }
      {incomingOffer &&
        <div className="absolute bottom-2 w-full z-10">
          <CallControls camerastream={localStream} data={incomingOffer.from} onCameraToggle={handleCameraToggle}/>
        </div>
      }
    </div>
  );
}
