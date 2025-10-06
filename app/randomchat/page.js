// app/video-call/page.js
"use client";
import RandomChatUI from '@/components/randomchatui';
import { useState, useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useButton } from '../context/buttoncontext';
import { useOffer } from '../context/offercontext';
import Callpage from '../call/page';

export default function VideoCallPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [time, setTime] = useState(0);
  const localVideoRef = useRef(null);
  const [oncall, setoncall] = useState(false);
  const { callState, setCallState } = useButton();
  const { incomingOffer, setIncomingOffer } = useOffer();
  const [partnerid, setpartnerid] = useState();
  const socket = useSocket();

  // Initialize media stream
  useEffect(() => {
    const initializeMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };

    initializeMedia();
  }, [oncall , isConnected ,isSearching]);

  // Timer effect
  useEffect(() => {
    let interval;
    if (isCallActive) {
      interval = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  const handlestart = () => {
    if (!socket) {
      alert('socket not found')
      console.log("Socket value on start:", socket);
      return
    };
    setIsSearching(true);
    socket.emit("random-searching", socket.id);
    // alert('request sent for random' + socket.id);
  }

  const handleNext = () => {
    handlestop();
    setTimeout(() => {
      handlestart();
    }, 1000);
    // alert('handle next clicked');
  }

  const handlestop = () => {  
        // alert('stoped');
        setTimeout(() => {
        setIsConnected(false);
        setIsSearching(false); 
        }, 200);
        if(socket){
          if(!isSearching){
          socket.emit("end-call" ,partnerid);
          }
          else{
            socket.emit("remove-random-search");
          }
          socket.emit("random-stopped",partnerid);
        }
  }

  useEffect(() => {
     if(!socket) return;

    const stopper = () => {
      // alert('stoped');
        setIsConnected(false);
        setIsSearching(false);
    }
    // socket.on("end-call",stopper);
    socket.on("random-stopped",stopper);
    return () => {
    socket.off("random-stopped",stopper);
    }
  }, [socket])
  

  useEffect(() => {
    const MatchedHandler = ({ role, partnerId }) => {
      console.log("Matched as:", role, "with partner:", partnerId);

      if (role === "you-caller") {

        // alert("role : " + role + " partnerid : " + partnerId);   // Caller → WebRTC offer बनाकर partner को भेजे
        setCallState({ clicked: true, from: socket.id, to: partnerId });
        setpartnerid(partnerId);
        setIsConnected(true);
        setIsSearching(false);

      } else if (role === "you-receiver") {

        // alert("role : " + role + " partnerid : " + partnerId);     // Receiver → Offer accept करे
        setpartnerid(partnerId);

      }
    }
    socket.on("matched", MatchedHandler);
    return () => {
      socket.off("matched", MatchedHandler);
    };
  }, [setCallState, socket]);

  useEffect(() => {
    if (!socket) return;
    const offerHandler = ({ from, to, offer }) => {
      setIncomingOffer({ from, to, offer });
      console.log("📞 Offer received from:", from);
      setIsConnected(true);
      setIsSearching(false);
    };

    socket.on("offer", offerHandler);

    return () => {
      socket.off("offer", offerHandler);
    };
  }, [setIncomingOffer, socket])



  return (
    <div className="relative h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-blue-950">
      {/* Animated background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 h-full rounded-full left-1/4 w-96 bg-purple-500/20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 h-full delay-1000 rounded-full right-1/4 w-96 bg-blue-500/20 blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 flex flex-col h-screen p-2 md:p-1">
        {/* Top Section - Video Display */}
        <div className={`w-full`}>
          <div className="relative border shadow-2xl rounded-2xl bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-sm border-purple-500/20">
            {(!isConnected && !isSearching) ? (
              <div className="relative flex flex-row gap-2 group h-[50vh] md:h-[70vh]">
                {/* Left Video */}
                <video
                  src="/girl.mp4"
                  className="object-cover w-8/12 h-full rounded-r-3xl rounded-l-4xl"
                  autoPlay
                  muted
                  loop
                />

                {/* Right Local Video */}
                <video
                  ref={localVideoRef}
                  muted
                  autoPlay
                  playsInline
                  className="object-cover w-4/12 h-full border-2 border-gray-800 rounded-r-4xl rounded-l-3xl"
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:opacity-100"></div>

                {/* Overlay Info */}
                <div className="absolute px-4 py-2 border top-4 left-4 bg-black/70 backdrop-blur-md rounded-xl border-purple-500/30">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-white">249,109 Users Online</span>
                  </div>
                </div>
              </div>
            ) : (!isConnected && isSearching) ? (
              <div className="w-full h-[50vh] md:h-[60vh] flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative">
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]"></div>
                </div>

                <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-6 p-4">
                  {/* Upper animation row */}
                  <div className="flex flex-wrap justify-center  items-center gap-2 md:gap-10">
                    <DotLottieReact
                      src="https://lottie.host/7e234d81-14cb-4553-9835-5b3a22c85061/NA1HknCbGB.lottie"
                      loop
                      autoplay
                      className="w-32 h-40 sm:w-28 sm:h-28 md:w-56 md:h-60"
                    />

                    <DotLottieReact
                      src="https://lottie.host/a851827f-12a6-4726-a7db-a55e0bbf602b/C3bEo89h1e.lottie"
                      loop
                      autoplay
                      className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32"
                    />

                    <div className="flex flex-col items-center">
                      <DotLottieReact
                        src="https://lottie.host/ef02e47e-e1dc-49df-b403-d1b4e57283ad/DpDRdQT7P5.lottie"
                        loop
                        autoplay
                        className="w-32 h-24 sm:w-52 sm:h-40 md:w-72 md:h-48 mt-5"
                      />
                      <h3 className="mt-2 text-lg sm:text-2xl md:text-3xl font-bold text-fuchsia-400">
                        Connecting ...
                      </h3>
                    </div>
                  </div>

                  {/* Bottom text */}
                  <p className="text-rose-400 text-xl sm:text-3xl md:text-4xl font-bold mt-4">
                    Adding you in video room
                  </p>
                </div>

              </div>
            ) : (
              <div className="relative">
                <Callpage className="object-contain" Randompage={true} />
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section - Controls and Chat */}
        <div className="flex flex-row justify-between h-[10vh] md:h-[40vh] gap-4 pt-2 md:flex-row">
          {/* Left Side - Control Buttons (60%) */}
          <div className=" w-[30%] md:w-[60%] flex flex-col justify-start gap-4">
            {/* Main Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                className={`group relative h-16 md:h-24 rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 ${oncall
                  ? "bg-gradient-to-br from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500"
                  : "bg-gradient-to-br from-purple-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600"
                  }`}
                onClick={() => {
                  if (!isConnected && !isSearching) {
                    handlestart();
                  } else if (isSearching) {
                    alert('we are finding for you speacial. patience required.');
                  } else {
                    handleNext();
                  }
                }}
              >
                <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-white/10 group-hover:opacity-100"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <span className="relative flex flex-col items-center justify-center h-full">
                  {(!isConnected && !isSearching) ? (
                    <div>
                      <svg className="w-10 h-10 mb-2 text-white md:w-12 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                      </svg>
                      <span className="text-sm font-bold text-white md:text-base">START</span>
                    </div>
                  ) : (isSearching) ? (
                    <div
                      // onClick={handleSearch}
                      className="relative flex flex-col ml-3 md:ml-0 items-center justify-center h-16 transition-all duration-300 transform shadow-2xl cursor-pointer group md:h-24 rounded-2xl hover:scale-105 active:scale-95 bg-gradient-to-br from-pink-600 to-orange-500 hover:from-pink-500 hover:to-orange-400"  >
                      <svg
                        className="w-10 h-10 mb-2 text-white md:w-12 md:h-12 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.6 3.6a7.5 7.5 0 0013.05 13.05z" />
                      </svg>
                      <span className="text-xs font-bold text-white md:text-base">SEARCHING</span>
                    </div>
                  ) : (
                    <div>
                      <svg className="w-10 h-10 mb-2 text-white md:w-12 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-bold text-white md:text-base">NEXT</span>
                    </div>
                  )}
                </span>
              </button>

              <button
                className={`relative h-16 transition-all ml-2 md:ml-0 duration-300 transform shadow-2xl group md:h-24 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 hover:scale-105 active:scale-95
                  ${(!isConnected && !isSearching) ? " pointer-events-none select-none" : ""}`}
                onClick={handlestop}
              >
                <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-white/10 group-hover:opacity-100"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <span className="relative flex flex-col items-center justify-center h-full">
                  <svg className="w-10 h-10 mb-2 text-white md:w-12 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-sm font-bold text-white md:text-base">STOP</span>
                </span>
              </button>
            </div>
          </div>

          {/* Right Side - Chat Section (40%) */}
          <div className="w-[60%] md:w-[40%] flex flex-col flex-1 ">
            {(!isConnected && !isSearching) ? (
              <div className="relative"> <div className="relative p-4 mb-2 overflow-hidden text-white bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl"> <div className="absolute top-0 right-0 w-32 h-24 translate-x-16 -translate-y-16 rounded-full bg-white/10"></div> <div className="absolute bottom-0 left-0 w-24 h-16 -translate-x-12 translate-y-12 rounded-full bg-white/10"></div> <div className="relative z-10"> {/* <Award className="w-12 h-12 mb-6" /> */} <h3 className="mb-2 ml-4 text-2xl font-bold">Chat Window</h3> <p className="mb-3 ml-4 text-blue-100 "> Your amazing conversations skills will appear here once you connect with someone special! </p> <div className="p-1 pl-4 mx-2 bg-white/20 backdrop-blur-sm rounded-xl"> <div className="mb-1 text-sm text-blue-100">Ready to connect</div> <div className="font-semibold">&quot;Click START to begin talking with someone new!&quot;</div> </div> </div> </div> </div>
            ) : (
              <div
                className={`h-full border shadow-2xl rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm border-purple-500/20 
                  ${isSearching ? "blur-sm pointer-events-none select-none" : ""}`}
              >
                <RandomChatUI socket={socket} partnerid={partnerid} className="" />
              </div>

            )}
          </div>
        </div>
      </div>
    </div>
  );
}


