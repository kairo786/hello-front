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
import { RiAnchorLine } from "react-icons/ri";
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
            let pc = peerConnectionMap.get(key);
            
            // नया चेक: अगर PC मौजूद है लेकिन CLOSED है, तो उसे हटाएं।
            if (pc && pc.signalingState === 'closed') {
                console.log(`Removing closed PC instance for key: ${key}`);
                peerConnectionMap.delete(key);
                pc = null;
            }
            
            // अगर PC मौजूद नहीं है (या अभी-अभी हटाया गया है), तो नया बनाएँ।
            if (!pc) {
                return createPeerConnection(key, localStream, remoteRef, socket, callState, incomingOffer);
            }
            
            // अगर PC चालू है, तो पुराना वाला लौटाएँ।
            return pc;
        },
        
        // ✨ नया फ़ंक्शन: कॉल कटने पर pc को Map से हटाने के लिए
        removeInstance: (key) => {
            if (peerConnectionMap.has(key)) {
                peerConnectionMap.delete(key);
                console.log(`Successfully removed PC instance for key: ${key}`);
            }
        }
    }
})();

export default function Callpage({ Randompage }) {
  const { callState, setCallState } = useButton();
  const { incomingOffer, setIncomingOffer } = useOffer();
  const socket = useSocket();
  const localRef = useRef();
  const remoteRef = useRef();
  const [tempofer, setTempofer] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [showVideo, setShowVideo] = useState(true);
  const { user } = useUser();
  const offerHandledRef = useRef(false);
  const route = useRouter();
  const [swapvideo, setswapvideo] = useState(false);
  const [emoji, setEmoji] = useState('😐');
  const [selectedlang, setSelectedLang] = useState('😐');
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [showlang, setShowolang] = useState(false);
  const [showmiclang, setShowmicolang] = useState(false);
  const [micrequest, setmicrequest] = useState(false);
  const [micrequeaccepted, setmicrequestaccepted] = useState(false);
  const [showgivemic, setshowgivemic] = useState(false);
  const [onmicpage, setonmicpage] = useState(true);
  const [selectedvoiceLang, setSelectedvoiceLang] = useState('');
  const [selectedVoiceURI, setSelectedVoiceURI] = useState('');



  const [toid, settoid] = useState('');
  const [isremotemute, setisremotemute] = useState(false);

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
    if (savedLang) { setSelectedLang(savedLang) };
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
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true, echoCancellation: true });
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
      console.log('call-end receive');
    // 2. कनेक्शन बंद करें
    if (pc && pc.signalingState !== 'closed') {
        pc.close();
    }
    
    // 3. लोकल स्ट्रीम को बंद करें
    localStream?.getTracks().forEach((track) => track.stop());
    localRef.current = null;
    setLocalStream(null);
    
    // 4. ✨ PeerConnection को Map से हटाएँ
    PeerConnection.removeInstance("outgoing", localStream, remoteRef, socket, callState, incomingOffer); 
    
    // 5. नेविगेट करें
    if(Randompage){
      setIncomingOffer(null);
      setCallState({ ...callState, to: null, from: null })
      //  window.location.href = '/randomchat'
      }
      else{
        route.replace("/chat")
      // window.location.href = '/chat'
      }
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
      console.log('call-end receive2');
// 2. कनेक्शन बंद करें
    if (pc && pc.signalingState !== 'closed') {
        pc.close();
    }
    
    // 3. लोकल स्ट्रीम को बंद करें
    localStream?.getTracks().forEach((track) => track.stop());
    localRef.current = null;
    setLocalStream(null);

    // 4. ✨ PeerConnection को Map से हटाएँ
    PeerConnection.removeInstance("incoming", localStream, remoteRef, socket, callState, incomingOffer); 
    
    // 5. नेविगेट करें
    if(Randompage){
      setIncomingOffer(null);
      setCallState({ ...callState, to: null, from: null })
      //  window.location.href = '/randomchat'
      }
      else{
         route.replace("/chat")
      // window.location.href = '/chat'
      }      
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
    if (!selectedvoiceLang) {
      alert('select translating language first.')
      return;
    }
    if (!selectedVoiceURI) {
      alert('select translate-voice first.')
      return;
    }
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
      else {
        socket.emit("mic-request-accepted", toid);
        alert('your friend is translating your voice you are allow to change your launguage 😀!!');
      }
      setShowolang(true);
    }
    );
    socket.on("mic-request-accepted", () => {
      setisremotemute(true);
      setmicrequestaccepted(true);
      if (!listenintranslang) {
        setListenintranslang(true);
      }
      console.log('remote video muted🚫')
      toast.success('mic request accepted')

    })
    socket.on("mic-request-stopped", () => {
      setisremotemute(false);
      setListenintranslang(false);
      setmicrequestaccepted(false);
      console.log('remote video on 📖');
      toast('mic-request-stopped ', {
        icon: '🚫',
      });
    })

    socket.on("cancle-mic", () => {
      console.log('friend want original material');
      setmicrequest(false);
      setshowgivemic(false);
      setShowmicolang(false);
      window.confirm('friend want original material');
      socket.emit("mic-request-stopped", toid);
    });


    socket.on("give-mic", () => {
      toast.success('mic 🎤 received');
      setonmicpage(false);
      setTimeout(() => {
        setonmicpage(true)
        setshowgivemic(true);
      }, 100);
    })

    return () => {
      socket.off("translatelang-request");
      socket.off("mic-request-accepted");
      socket.off("cancle-mic");
      socket.off("give-mic");
    };
  }, [socket, showmiclang]);


  const handleLanguageClick = () => {
    console.log('Language icon clicked'); // Debug log
    setShowolang(true);
    toast.info(
      <div className="pt-3 pb-2 pl-1 pr-2 text-center">
        <b className="pr-12 text-lg text-blue-500">Important Note</b>
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
    <div className={`${(Randompage) ? "h-[50vh] md:h-[60vh]" : " h-screen relative"} w-full overflow-hidden bg-black`}>
      {/* topbar */}
      <div className="fixed top-0 left-0 right-0 z-50"> {/* Changed to fixed and added z-50 */}
        <div className={`flex items-center justify-between px-6 py-3 ${Randompage ? "" : "bg-gray-900"}  h-15`}>
          <h2 className="text-xl font-semibold text-white">Hello Video Room</h2>
          <span className="text-sm text-green-400">🔴 Live</span>
          <div className="flex items-center">
            <div className="relative mr-12 group">
              <lord-icon
                src={(!showlang) ? 'https://cdn.lordicon.com/jdgfsfzr.json' : "https://cdn.lordicon.com/ehcxqqor.json"}
                onClick={(!showlang) ? handleLanguageClick : () => { setShowolang(false) }}
                trigger="hover"
                state="hover-conversation-alt"
                colors={(!showlang) ? "primary:#3080e8,secondary:#08a88a" : "primary:#d59f80,secondary:#08a88a"}
                className="w-10 h-10 cursor-pointer md:w-12 md:h-12"
              />
              {!showlang && (

                <div className="absolute z-20 px-3 py-2 mr-2 text-sm text-white transition-opacity duration-200 transform -translate-y-1/2 bg-gray-700 rounded opacity-0 right-full top-1/2 group-hover:opacity-100 whitespace-nowrap">
                  {!listenintranslang && <span>Listen in your favorite language</span>}
                  {listenintranslang && <span>Listen in Original language</span>}
                  <div className="absolute w-0 h-0 -translate-y-1/2 border-t-4 border-b-4 border-r-4 top-1/2 left-full border-t-transparent border-b-transparent border-r-gray-700"></div>
                </div>
              )}

              {showlang && (
                <div className="absolute z-20 px-3 py-2 mr-2 text-sm text-white transition-opacity duration-200 transform -translate-y-1/2 bg-gray-700 rounded opacity-0 right-full top-1/2 group-hover:opacity-100 whitespace-nowrap">
                  Close Lang page
                  <div className="absolute w-0 h-0 -translate-y-1/2 border-t-4 border-b-4 border-r-4 top-1/2 left-full border-t-transparent border-b-transparent border-r-gray-700"></div>
                </div>
              )}
            </div>
            <div className="flex items-center justify-center object-cover text-center bg-gray-500 rounded-full w-11 h-11">
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
            className={` absolute ${Randompage ? "z-90 max-h-100 overflow-y-scroll":"overflow-hidden"} bg-white border border-gray-100 shadow-2xl z-60 top-16 right-4 w-72 dark:bg-gray-800 rounded-xl dark:border-gray-700 `}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600">
              <h3 className="flex items-center gap-2 font-semibold text-white">
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
                className="text-lg text-white transition-colors hover:text-gray-200"
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
                className="p-4 pb-0 mb-3 pl-7"
              >
                <span className="font-semibold">Select your spoken launguage</span>
                <button
                  onClick={() => {
                    setShowmicolang(!showmiclang)
                    if (isremotemute) {
                      setshowgivemic(true);
                    }
                    if (micrequest && socket) {
                      if (showmiclang) {
                        socket.emit("mic-request-stopped", toid);
                      }
                      else { socket.emit("mic-request-accepted", toid); }
                    }
                  }}
                  className="relative text-[#16c79e] border-2 border-black rounded px-1 mt-3 inline cursor-pointer text-lg font-bold before:bg-teal-600 hover:rounded-b-none before:absolute before:-bottom-0 before:-left-0  before:block before:h-[2px] before:w-full before:origin-bottom-right before:scale-x-0 before:transition before:duration-300 before:ease-in-out hover:before:origin-bottom-left hover:before:scale-x-100">
                  {!showmiclang && <span> SHOW LANG</span>}
                  {showmiclang && <span className="text-red-500">STOP sending</span>}
                </button>
              </motion.div>
              {showmiclang && <MICpage micrequest={false} toid={toid} />}
              <TranslateToSpeech selectedLang={selectedvoiceLang} setSelectedLang={setSelectedvoiceLang} selectedVoiceURI={selectedVoiceURI} setSelectedVoiceURI={setSelectedVoiceURI} />
            </div>


            {/* Footer */}
            <motion.div
              className="flex justify-end px-4 py-3 border-t border-gray-200 bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-4 py-2 ${!listenintranslang ? 'text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2bg-blue-600 hover:bg-blue-700' : 'text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-1 mr-4'}  rounded-lg transition-colors`}
              >
                {!listenintranslang && <div onClick={handletransconfirm}>Activate translating</div>}
                {listenintranslang && <div onClick={() => {
                  setListenintranslang(false), setShowolang(false)
                  if (socket) {
                    socket.emit("cancle-mic", toid);
                  }
                }}>Listen in original launguage
                </div>}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`${Randompage?"flex flex-row w-full h-full":"w-full h-full"}`}>
        {/* remote video    */}
        <div className={`relative flex flex-col w-full h-full ${Randompage ? "pb-0 rounded-xl border-2 border-t-teal-200 border-l-emerald-400 border-r-lime-200 border-b-teal-200":"p-4"}`}>

          {/* Listening animation with lower z-index */}
          {!showlang && showmiclang && (
            <>
              <span><ToastContainer /></span>
              {/* MICpage with higher z-index and proper positioning */}
              {onmicpage &&
                <MICpage
                  micrequest={micrequest}
                  toid={toid}
                  clasName={` ${Randompage ? "bottom-20 hidden":"top-52"} absolute z-20  right-10`}
                />
              }

              <span className="absolute top-20 md:right-10 right-2 z-40 text-orange-400 text-sm md:text-2xl flex items-center ">
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

          {!showlang && isremotemute && <TranslateToSpeech selectedLang={selectedvoiceLang} setSelectedLang={setSelectedvoiceLang} selectedVoiceURI={selectedVoiceURI} setSelectedVoiceURI={setSelectedVoiceURI} className="absolute z-10" />}
          {/* translating animation */}
          {isremotemute && (

            <span className="absolute z-70 flex flex-row items-center text-sm font-medium top-25 md:right-10 right-2 text-cyan-300 md:text-2xl dark:text-cyan-200 ">
              <span>Translating</span>
              <DotLottieReact
                src="https://lottie.host/20edb9ee-c915-47aa-9234-d6fbb3fa43dd/gubUz3v5LG.lottie"
                loop
                autoplay
                className="inline w-22 h-22"
              />
            </span>

          )}

          {/* show give-mic */}
          {micrequest && micrequeaccepted && showgivemic &&
            <span className={`absolute ${Randompage ? "top-100":"top-120"} md:right-16 z-70 text-2xl right-10`}>
              <DotLottieReact
                src="https://lottie.host/85109f00-b8e9-4906-906f-08ab53a24640/1WHg00htly.lottie"
                loop
                onClick={() => {
                  socket.emit("give-mic", toid);
                  setshowgivemic(false);
                }}
                autoplay
                className="w-12 h-12 ml-2"
                title="Give mic"
              />
            </span>}

          {/* remote video */}
          <motion.video
            ref={remoteRef}
            muted={isremotemute}
            autoPlay
            playsInline
            onDoubleClick={Randompage ? undefined : handleSwap}
            style={{ borderRadius: 10, border: "2px solid #333" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={`
          ${Randompage?"w-full h-full object-cover cursor-pointer mr-0 z-30":(swapvideo)?"top-20 left-8 z-10 absolute object-cover cursor-pointer":"inset-0 w-full h-full z-0 absolute object-cover cursor-pointer"}    
    `}
            width={(swapvideo && !Randompage )? size.width : undefined}
            height={(swapvideo && !Randompage )? size.height : undefined}
          />

          {emoji && (
            <div
              className={`
      absolute bottom-20 z-50 
      bg-white/30 px-4 py-2 rounded-full animate-bounce
      ${Randompage ? "text sm:text-lg md:text-2xl lg:text-2xl xl:text-2xl" : "text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl"} 
      left-1/2 -translate-x-1/2 
      md:left-auto md:translate-x-0 md:right-10
      transition-all duration-300
    `}
            >
              {/* Emoji count based on screen size */}
              {Randompage ? (
                <>
                  <span className="block md:hidden">{emoji.repeat(1)}</span>
                  <span className="hidden md:block lg:hidden">{emoji.repeat(2)}</span>
                  <span className="hidden lg:block xl:hidden">{emoji.repeat(3)}</span>
                  <span className="hidden xl:block">{emoji.repeat(4)}</span>
                </>
              ) : (
                <>
                  <span className="block md:hidden">{emoji.repeat(4)}</span>
                  <span className="hidden md:block lg:hidden">{emoji.repeat(6)}</span>
                  <span className="hidden lg:block xl:hidden">{emoji.repeat(8)}</span>
                  <span className="hidden xl:block">{emoji.repeat(10)}</span>
                </>
              )}
            </div>
          )}


        </div>


        {/* local video */}
        <motion.div
          className={`
      rounded-lg border-2 border-white overflow-hidden group
      ${Randompage?" inset-0 hidden sm:block sm:w-full sm:h-full z-0 border-2 border-t-blue-500 border-r-indigo-500 border-b-purple-500 border-l-indigo-500"
        : (swapvideo 
          ? "inset-0 w-full h-full z-0 absolute" //bada video
          : "top-20 left-8 z-10 absolute")}  //chota video
    `}
          style={{
            width: (!swapvideo && !Randompage) ? size.width : undefined,
            height: (!swapvideo && !Randompage) ? size.height : undefined
          }}
          onDoubleClick={Randompage ? undefined : handleSwap}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <video
            ref={localRef}
            muted
            autoPlay
            playsInline
            className={`${Randompage ? "object-cover w-full h-full" :"object-cover w-full min-h-max"}`}
            style={{ borderRadius: 10, border: "2px solid #333" }}
          />

          {/* Resize handles sirf chhoti video par */}
          {!swapvideo && (
            <>
              <div
                onMouseDown={(e) => startResize("right", e)}
                className="absolute top-0 right-0 z-20 w-2 h-full cursor-ew-resize"
              />
              <div
                onMouseDown={(e) => startResize("left", e)}
                className="absolute top-0 left-0 z-20 w-2 h-full cursor-ew-resize"
              />
              <div
                onMouseDown={(e) => startResize("bottom", e)}
                className="absolute bottom-0 left-0 z-20 w-full h-2 cursor-ns-resize"
              />
              <div
                onMouseDown={(e) => startResize("top", e)}
                className="absolute top-0 left-0 z-20 w-full h-2 cursor-ns-resize"
              />
            </>
          )}
        </motion.div>
      </div>


      {(tempofer && !Randompage) && <div className="absolute z-10 w-full bottom-2">
        <CallControls camerastream={localStream} data={callState.to} onCameraToggle={handleCameraToggle} />
      </div>
      }
      {(incomingOffer && !Randompage) &&
        <div className="absolute z-10 w-full bottom-2">
          <CallControls camerastream={localStream} data={incomingOffer.from} onCameraToggle={handleCameraToggle} />
        </div>
      }
    </div>
  );
}