/* eslint-disable react-hooks/exhaustive-deps */

"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSocket } from "../context/SocketContext";
import { ToastContainer, toast } from 'react-toastify';

const MICpage = ({ micrequest = false, toid = null ,clasName = "" }) => {
  const recognitionRef = useRef(null);
  const [message, setMessage] = useState("");
  const [selectedLang, setSelectedLang] = useState("ja-JP");
  const [listening, setListening] = useState(false);
  const [show, setShow] = useState(true);
  const socket = useSocket();
  const isMountedRef = useRef(true); // Track component mount state
  const restartTimeoutRef = useRef(null); // For tracking restart timeouts
  
  const languages = [
    // 🌏 International
  { code: "en-US", name: "English (US)" },
  { code: "en-GB", name: "English (UK)" },
  { code: "fr-FR", name: "French" },
  { code: "es-ES", name: "Spanish" },
  { code: "de-DE", name: "German" },
  { code: "it-IT", name: "Italian" },
  { code: "pt-PT", name: "Portuguese (Portugal)" },
  { code: "pt-BR", name: "Portuguese (Brazil)" },
  { code: "ru-RU", name: "Russian" },
  { code: "ja-JP", name: "Japanese" },
  { code: "ko-KR", name: "Korean" },
  { code: "zh-CN", name: "Chinese (Simplified)" },
  { code: "zh-TW", name: "Chinese (Traditional)" },

  // 🇮🇳 Indian Regional
  { code: "hi-IN", name: "Hindi" },
  { code: "bn-IN", name: "Bengali" },
  { code: "te-IN", name: "Telugu" },
  { code: "ta-IN", name: "Tamil" },
  { code: "ml-IN", name: "Malayalam" },
  { code: "kn-IN", name: "Kannada" },
  { code: "gu-IN", name: "Gujarati" },
  { code: "mr-IN", name: "Marathi" },
  // { code: "pa-IN", name: "Punjabi" },
  // { code: "or-IN", name: "Odia" },
  { code: "ur-IN", name: "Urdu" },
  // { code: "as-IN", name: "Assamese" }
  ];

  // Cleanup all resources
  useEffect(() => {
    return () => {
      isMountedRef.current = false; // Mark as unmounted
      stopRecognition();
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
    };
  }, []);

  // Language change handler
  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLang(newLang);
    localStorage.setItem("selectedLang", newLang);
    
    setTimeout(() => {
      setShow(false);
    }, 500);
    
    // Restart recognition if active
    if (listening && micrequest && !recognitionRef.current) {
      startRecognition();
      console.log('phle on nhi thi hangle change bala mene ki hai frecognisition start');
    }
    else{
      console.log('recognisition start nhi kia kyuki mic request is :',micrequest);
    }
  };
  
  // Handle micrequest changes
  useEffect(() => {
      if (micrequest && !listening) {
          startRecognition();
          console.log('recognisition start on first load micrequest changed');
        } else if (!micrequest && listening) {
            stopRecognition();
          }
        }, [micrequest]);

  // Load saved language
  useEffect(() => {
    const savedLang = localStorage.getItem("selectedLang");
    if (savedLang) setSelectedLang(savedLang);
    console.log('localstorage se lang laye :',savedLang);
  }, [micrequest]);

  const getTranslateCode = (langCode) => langCode?.split('-')[0] || 'en';
  
  // Emit translated message
  useEffect(() => {
    if (!socket || !message.trim() || !toid) return;
    const sourceLang = getTranslateCode(selectedLang);
    socket.emit("sourcetext", { langcode: sourceLang, message, toid });
  }, [message, socket, selectedLang, toid]);


  function checkLanguageSupport(langCode) {
  return new Promise((resolve) => {
    try {
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.lang = langCode;
      recognition.onstart = () => {
        recognition.stop();
        resolve(true); // Supported
      };
      recognition.onerror = (event) => {
        if (event.error === "language-not-supported" || event.error === "bad-grammar") {
          resolve(false); // Not supported
        } else {
          resolve(true); // Some other error but language might still work
        }
      };
      recognition.start();
    } catch (e) {
      resolve(false);
    }
  });
}


  // Start recognition
    const startRecognition = async() => {
    if (!("webkitSpeechRecognition" in window)) return;
    if (!micrequest || listening) return;

    // Clean up previous instance
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }

    const SpeechRecognition = window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = false;
    const savedLang = localStorage.getItem("selectedLang");
    if (savedLang) {
      recognition.lang = savedLang;
      console.log('recognisiton lang find',savedLang);
    }
    

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      console.log("script :",transcript);
      setMessage(transcript);
    };

    recognition.onerror = (event) => {
      if (event.error !== "aborted") {
        console.error("Speech recognition error:", event.error);
      }
    };

    recognition.onend = () => {
      if (listening && micrequest) {
        setTimeout(() => {
          try {
            recognition.start();
          } catch (error) {
            console.warn("Auto-restart error:", error);
          }
        }, 300);
      } else {
        setListening(false);
      }
    };

    recognitionRef.current = recognition;
    
    try {
      recognition.start();
      setListening(true);
      toast.success('🎤 MIC STARTED - SPEAK NOW');
    } catch (error) {
      console.error("Start error:", error);
      setListening(false);
    }
  };

  const stopRecognition = () => {
    return new Promise(resolve => {
      if (recognitionRef.current) {
        const recognition = recognitionRef.current;
        recognition.onend = () => {
          setListening(false);
          resolve();
        };
        
        try {
          recognition.stop();
        } catch (error) {
          console.warn("Stop error:", error);
          setListening(false);
          resolve();
        }
      } else {
        resolve();
      }
    });
  };

  return (
    <div className={`p-5 pt-0 pl-7 ${clasName}`}>
      {show ? (
        <span>
          <span>Your current speaking language: </span>
          <select
            value={selectedLang}
            onChange={handleLanguageChange}
            className="border p-2 mt-3 "
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code} className="bg-sky-200">
                {lang.name}
              </option>
            ))}
          </select>
        </span>
      ) : (
        <div className="text-2xl text-cyan-800 bg-cyan-200 p-2 rounded border-2 border-black pl-6 font-bold ">
          Speak in {selectedLang}
        </div>
      )}
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default MICpage;