/* eslint-disable react-hooks/exhaustive-deps */
// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import { useSocket } from "../context/SocketContext";
// import { ToastContainer, toast } from 'react-toastify';



// const MICpage = ({micrequest = false ,toid =null}) => {
//   const recognitionRef = useRef(null);
//   const [message, setMessage] = useState("");
//   const [selectedLang, setSelectedLang] = useState("hi-IN");
//   const [listening, setListening] = useState(false);
//   const [show, setShow] = useState(true);
//   const[selectedLanguageName,setSelectedLanguageName] =useState('');
//   const socket = useSocket();

  
// const languages = [
//   { code: "en-US", name: "English (US)" },
//   { code: "hi-IN", name: "Hindi (India)" },
//   { code: "te-IN", name: "Telugu (India)" },   
//   { code: "ta-IN", name: "Tamil (India)" },      
//   { code: "fr-FR", name: "French" },
//   { code: "es-ES", name: "Spanish" },
//   { code: "de-DE", name: "German" },
//   { code: "ja-JP", name: "Japanese" },
// ];


// // Correct MICpage implementation
// // useEffect(() => {
// //   if(!socket){
// //    console.log('socket unavaiable')
// //    return;
// //   }
// //   const handleTtsStarted = (data) => {
// //     console.log('TTS started from:', data.toid);
// //     if (data.toid === toid) { // Check if it's coming from our target user
// //       setTtsActive(true);
// //       if (listening) {
// //         stopRecognition();
// //       }
// //     }
// //   };

// //   const handleTtsEnded = (data) => {
// //     console.log('TTS ended from:', data.toid);
// //     if (data.toid === toid) { // Check if it's coming from our target user
// //       setTtsActive(false);
// //       if (micrequest && !listening) {
// //         setTimeout(() => startRecognition(), 800);
// //       }
// //     }
// //   };

// //   socket.on("tts-started", handleTtsStarted);
// //   socket.on("tts-ended", handleTtsEnded);

// //   return () => {
// //     socket.off("tts-started", handleTtsStarted);
// //     socket.off("tts-ended", handleTtsEnded);
// //   };
// // }, [socket, toid, micrequest, listening]);


// useEffect(() => {
//  if(!micrequest){
//   if(recognitionRef){
//     recognitionRef.current = null;
//   console.log('recognisition stopped');
//   }
// }
// }, [micrequest])

//   //M-3 Add this effect to pause recognition when TTS is active
//   // useEffect(() => {
//   //   if (!micrequest) return;
    
//   //   const handleTTSStart = () => {
//   //     if (recognitionRef.current && listening) {
//   //       recognitionRef.current.stop();
//   //       console.log("🎤 Paused for TTS");
//   //     }
//   //   };

//   //   const handleTTSEnd = () => {
//   //     if (micrequest && recognitionRef.current && !listening) {
//   //       setTimeout(() => {
//   //         try {
//   //           recognitionRef.current.start();
//   //           console.log("🎤 Resumed after TTS");
//   //         } catch (error) {
//   //           console.warn("Resume error:", error);
//   //         }
//   //       }, 500);
//   //     }
//   //   };

//   //   window.speechSynthesis.addEventListener('start', handleTTSStart);
//   //   window.speechSynthesis.addEventListener('end', handleTTSEnd);

//   //   return () => {
//   //     window.speechSynthesis.removeEventListener('start', handleTTSStart);
//   //     window.speechSynthesis.removeEventListener('end', handleTTSEnd);
//   //   };
//   // }, [micrequest, listening]);

//   //M-3 Add this effect to handle micrequest changes
// // useEffect(() => {
// //   if (!micrequest && recognitionRef.current) {
// //     stopRecognition().then(() => {
// //       console.log('🎤 Recognition fully stopped');
// //       recognitionRef.current = null;
// //     });
// //   } else if (micrequest && !listening) {
// //     startRecognition();
// //   }
// // }, [micrequest]);

// useEffect(() => {
//   console.log("micrequest =",micrequest ," toid :",toid );
// }, [toid ,micrequest]);

//   // ✅ Save language to localStorage when it changes
//   const handleLanguageChange = (e) => {
//     const newLang = e.target.value;
//     setSelectedLang(newLang);
//     localStorage.setItem("selectedLang", newLang);
//     setShow(false);
//   };

// //   const startRecognition = () => {
// //     if (!("webkitSpeechRecognition" in window)) return;
// //     if (recognitionRef.current) return;

// //     const SpeechRecognition = window.webkitSpeechRecognition;
// //     const recognition = new SpeechRecognition();
// //     recognition.continuous = true;
// //     recognition.interimResults = false;
// //     recognition.lang = selectedLang;

// //     recognition.onresult = (event) => {
// //       let transcript = "";
// //       for (let i = event.resultIndex; i < event.results.length; i++) {
// //         transcript += event.results[i][0].transcript;
// //       }
// //     //   setMessage((prev) => prev + " " + transcript);
// //     setMessage(transcript);
// //     };

// //     recognition.onerror = (event) => {
// //       console.error("Speech recognition error: ", event.error);
// //     };

// //     recognition.onend = () => {
// //       if (listening) recognition.start();
// //     };

// //     recognitionRef.current = recognition;
// //     recognition.start();
// //     setListening(true);
// //   };

// //   const stopRecognition = () => {
// //     if (recognitionRef.current) {
// //       recognitionRef.current.stop();
// //       recognitionRef.current = null;
// //       setListening(false);
// //     }
// //   };


// const getTranslateCode = (langCode) => langCode?.split('-')[0] || 'en';
// useEffect(() => {
//   if (!socket || !message.trim() || !toid ) return;   // ✅ empty msg emit मत करो
//   const sourceLang = getTranslateCode(selectedLang);
//   socket.emit("sourcetext", { langcode: sourceLang, message ,toid });

// }, [message, socket, selectedLang]);



// // ✅ Load saved language from localStorage on first render
//   useEffect(() => {
//     const savedLang = localStorage.getItem("selectedLang");
//     if (savedLang) setSelectedLang(savedLang);
//     // if(!listening){
//     //   startRecognition();
//     // }
//   }, []);

// // useEffect(() => {
// //   if (listening) {
// //     console.log("🌐 Language changed → restarting recognition...");
// //     const langObj = languages.find(lang => lang.code === selectedLang);
// //     setSelectedLanguageName(langObj?.name || "Unknown");

// //     let isRestarting = true;

// //     const restartProcess = async () => {
// //       await stopRecognition();
// //       await new Promise(res => setTimeout(res, 800));
// //       if (isRestarting && listening) startRecognition();
// //     };

// //     restartProcess();
// //     return () => { isRestarting = false; };
// //   }
// // }, [selectedLang]);

// //deepseek code
// useEffect(() => {
//   if (listening && micrequest) {
//     console.log("🌐 Language changed → restarting recognition...");
//     const langObj = languages.find(lang => lang.code === selectedLang);
//     setSelectedLanguageName(langObj?.name || "Unknown");

//     // Flag to track if we should proceed with restart
//     let shouldRestart = true;

//     const restartProcess = async () => {
//       try {
//         // Stop current recognition and wait for it to fully stop
//         await stopRecognition();
        
//         // Additional delay to ensure complete shutdown
//         await new Promise(res => setTimeout(res, 1000));
        
//         // Only restart if no new language change occurred
//         if (shouldRestart && listening) {
//           startRecognition();
//         }
//       } catch (error) {
//         console.warn("Restart error:", error);
//       }
//     };

//     restartProcess();

//     return () => {
//       // Cancel pending restart if language changes again
//       shouldRestart = false;
//     };
//   }
// }, [selectedLang,micrequest]);


// //M-3 Wrap toast in a try-catch


// const safeToast = (msg, type = 'success') => {
//   try {
//     if (type === 'success') toast.success(msg);
//     else toast.error(msg);
//   } catch (e) {
//     console.log("Toast error:", e);
//   }
// };

// const startRecognition = () => {
//   if (!("webkitSpeechRecognition" in window)) return;
//   if(!micrequest){ 
//     console.log('mic-request is false');
//     return;
//   }
//  // Clean up previous instance
//     if (recognitionRef.current) {
//       try {
//         recognitionRef.current.stop();
//       } catch (e) {}
//       recognitionRef.current = null;
//     }

//   // toast.success('MIC START FOR SEND AUDIO TO TRANSLATE!!')
//   // Usage:M-3
// safeToast('MIC START FOR SEND AUDIO TO TRANSLATE!!');
 

//   const SpeechRecognition = window.webkitSpeechRecognition;
//   const recognition = new SpeechRecognition();
  
//   recognition.continuous = true;
//   recognition.interimResults = false;
//   recognition.lang = selectedLang;

// //M-2
//   //  recognition.onstart = () => {
//   //   console.log("🎤 User started speaking → TTS paused");
//   //   if (window.speechSynthesis.speaking) {
//   //     window.speechSynthesis.pause();  // ✅ TTS pause
//   //   }
//   // };

//   recognition.onresult = (event) => {
//     let transcript = "";
//     for (let i = event.resultIndex; i < event.results.length; i++) {
//       transcript += event.results[i][0].transcript;
//     }
//     setMessage(transcript);
//     console.log("trascript " , transcript);
//   };
// //M-2
//   // recognition.onend = () => {
//   //   console.log("🎤 User stopped speaking → TTS resumed");
//   //   if (window.speechSynthesis.paused) {
//   //     window.speechSynthesis.resume(); // ✅ TTS resume
//   //   }
//   //   if (listening) recognition.start(); // auto restart
//   // };

//   recognition.onerror = (event) => {
//     // Ignore "aborted" errors as they're expected during normal operation
//     if (event.error !== "aborted") {
//       safeToast({msg :`${error} accor RESTART MIC PAGE` ,type:error});
//       console.error("Speech recognition error:", event.error);
//     }
//   };

//  recognition.onend = () => {
//       if (listening && micrequest) {
//         setTimeout(() => {
//           try {
//             recognition.start();
//           } catch (error) {
//             console.warn("Auto-restart error:", error);
//           }
//         }, 300);
//       } else {
//         setListening(false);
//       }
//     };

//   recognitionRef.current = recognition;
  
//   try {
//     recognition.start();
//     setListening(true);
//   } catch (error) {
//     console.error("Start error:", error);
//     setListening(false);
//   }
// };


// // const stopRecognition = () => {
// //   return new Promise(resolve => {
// //     if (recognitionRef.current) {
// //       // Temporarily remove end handler to prevent auto-restart
// //       const originalOnEnd = recognitionRef.current.onend;
// //       recognitionRef.current.onend = () => {
// //         resolve();
// //         if (originalOnEnd) originalOnEnd();
// //       };
      
// //       try {
// //         recognitionRef.current.stop();
// //       } catch (error) {
// //         console.warn("Stop error:", error);
// //         resolve();
// //       }
// //     } else {
// //       resolve();
// //     }
// //   });
// // }; M-3


// //M-3 Modify stopRecognition to properly reset state
//   const stopRecognition = () => {
//     return new Promise(resolve => {
//       if (recognitionRef.current) {
//         const recognition = recognitionRef.current;
//         recognition.onend = () => {
//           setListening(false);
//           resolve();
//         };
        
//         try {
//           recognition.stop();
//         } catch (error) {
//           console.warn("Stop error:", error);
//           setListening(false);
//           resolve();
//         }
//       } else {
//         resolve();
//       }
//     });
//   };

// // Cleanup on unmount
// useEffect(() => {
//     return () => {
//       if (recognitionRef.current) {
//         stopRecognition();
//       }
//     };
//   }, []);
// //M-1
// // MICpage के अंदर (startRecognition और stopRecognition के बाद ही)
// // useEffect(() => {
// //   // window object पर functions expose करो
// //   window.pauseMic = async () => {
// //     await stopRecognition();
// //     console.log("🚫 MIC block because TTS is speaking...");
// //   };

// //   window.resumeMic = async () => {
// //     startRecognition();
// //     console.log("✅ speeaking allowed after TTS finished...");
// //   };
// // }, []);



//   return (
//     <div className="p-5 pt-0 pl-7 ">
//       {/* pt-0 pl-7 */}
//       {/* <h2 className="text-xl font-bold">🎤 Select Language in which you will speak 🗣️</h2> */}
//       {/* ✅ Language Dropdown */}
//       {show ? (
//         <span>
//           <span>your current speaking launguage : </span>
//           <select
//         value={selectedLang}
//         onChange={handleLanguageChange}
//         className="border p-2 mt-3"
//       >
//         {languages.map((lang) => (
//           <option key={lang.code} value={lang.code}>
//             {lang.name}
//           </option>
//         ))}
//       </select>
//         </span>
//       ) : (
//         <div className="text-2xl text-gray-800 bg-green-200">Speak in {selectedLanguageName} launguage !!</div>
//       )
//     }

//       {/* <div className="mt-5 flex gap-2">
//         {!listening ? (
//           <button onClick={startRecognition} className="bg-green-500 text-white p-2 rounded">
//             ▶️ Start Listening
//           </button>
//         ) : (
//           <button onClick={stopRecognition} className="bg-red-500 text-white p-2 rounded">
//             ⏹ Stop
//           </button>
//         )}
//       </div> */}

//       {/* <div className="mt-5 bg-blue-400 text-white p-3 text-lg rounded">
//         {message || "Start speaking..."}
//       </div> */}
//       <ToastContainer />
//     </div>
//   );
// };

// export default MICpage;