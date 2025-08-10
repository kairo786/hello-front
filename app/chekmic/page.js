//chekmic/page.js
/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { useEffect, useState,useCallback } from 'react';
import { useSocket } from "../context/SocketContext";
// import { pauseMic, resumeMic } from "../mic/page";  // ✅ import functions

export default function TranslateToSpeech() {
  const [voices, setVoices] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [selectedLang, setSelectedLang] = useState('');
  const [filteredVoices, setFilteredVoices] = useState([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState('');
  const [text, setText] = useState('');
  const[sourcelangcode , setSourcelangcode] = useState('');
  const[targetlangcode , setTargetlangcode] = useState('');
  const socket = useSocket();



  const [translated, setTranslated] = useState('');
  const [isLoading, setIsLoading] = useState(false);



 useEffect(() => {
    if (!socket) return;

    const handletext = ({langcode,message}) => {
    console.log("lang-code: ",langcode,"msg received: ", message);    
    setText(message);
    setSourcelangcode(langcode);
    };

    socket.on("sourcetext", handletext);
    return () => {
      socket.off("sourcetext", handletext);
    };
  }, [socket]);

  useEffect(() => {
  if(text && sourcelangcode && targetlangcode){
    handleTranslate();
  }
  else{
    console.log('targetlandcode ',targetlangcode);
  }
  }, [text,targetlangcode,sourcelangcode])
  
 
const handleTranslate = async () => {
  if (!text.trim() || !sourcelangcode || !targetlangcode) {
    console.log('⏳ Waiting for valid text and language codes...');
    return;
  }

  setIsLoading(true);
  try {
    const res = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        source: sourcelangcode,
        target: targetlangcode
      }),
    });

    if (!res.ok) throw new Error('Translation failed');
    const data = await res.json();
    setTranslated(data.translated || '');
    console.log("translated in ",targetlangcode," : ",data.translated);
  } catch (err) {
    console.error("Translation error:", err.message);
  } finally {
    setIsLoading(false);
  }
};


  // Load voices on mount
  useEffect(() => {
    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      setVoices(allVoices);

      // Get unique languages
      const uniqueLangs = [...new Set(allVoices.map(v => v.lang))];
      setLanguages(uniqueLangs.sort());

      // Restore previous selections if any
    const storedLang = localStorage.getItem('lang');
    const getTranslateCode = (langCode) => langCode.split('-')[0];
    const targetLang = getTranslateCode(selectedLang);
    setTargetlangcode(targetLang);
      const storedVoice = localStorage.getItem('voice1');
      if (storedVoice) setSelectedVoiceURI(storedVoice);
      if (storedLang) setSelectedLang(storedLang);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);


  // When selectedLang changes, update filtered voices
useEffect(() => {
  const relatedVoices = voices.filter(v => v.lang === selectedLang);
  setFilteredVoices(relatedVoices);

  // Check if stored voice exists in new filtered list
  const storedVoice = localStorage.getItem('voice1');
  const voiceStillValid = storedVoice && 
                         relatedVoices.some(v => v.voiceURI === storedVoice);

  // Only reset if no valid voice found
  if (!voiceStillValid && relatedVoices.length > 0) {
    // Set to first available voice if current is invalid
    setSelectedVoiceURI('');
    // localStorage.setItem('voice1', relatedVoices[0].voiceURI);
  } else if (voiceStillValid) {
    // Keep the stored voice if it's still valid
    setSelectedVoiceURI(storedVoice);
  }

  if (selectedLang) localStorage.setItem('lang', selectedLang);
}, [selectedLang, voices]);

  // Save voice selection
  // useEffect(() => {
  //   if (selectedVoiceURI) {
  //     localStorage.setItem('voice1', selectedVoiceURI);
  //   }
  // }, [selectedVoiceURI]);

const speak = useCallback(() => {
  if (!translated) return;
  const utterance = new SpeechSynthesisUtterance(translated);
  const selectedVoice = voices.find(v => v.voiceURI === selectedVoiceURI);

  if (selectedVoice) {
    utterance.voice = selectedVoice;
    utterance.lang = selectedVoice.lang;
  }
  window.speechSynthesis.cancel();
// M-1
    // ✅ MIC को pause करो
    utterance.onstart = () =>{
if (window.pauseMic) window.pauseMic();
    }

  utterance.pitch = 1;
  utterance.rate = 1;
//M-1
    utterance.onend = () => {
    // ✅ TTS खत्म होते ही MIC resume
    if (window.resumeMic) window.resumeMic();
  };

//   utterance.onstart = () => alert("✅ बोलना शुरू");
//   utterance.onend = () => alert("🏁 बोलना पूरा");


  window.speechSynthesis.speak(utterance);
}, [translated, voices, selectedVoiceURI]);

useEffect(() => {
  if (translated && selectedVoiceURI) {
    speak();   // ✅ केवल तब बोलो जब translation और voice ready है
  }
}, [translated, selectedVoiceURI, speak]);


const getTranslateCode = (langCode) => langCode.split('-')[0];

useEffect(() => {
   const targetLang = getTranslateCode(selectedLang);
    setTargetlangcode(targetLang);
    if(text){
    handleTranslate();
    }
}, [selectedVoiceURI])




  return (
    <div className="p-6 space-y-4 pt-0">
      {/* Language Selection */}
      <div>
        <label className="block mb-1 font-semibold">🎧 Select/Change Language in which you want to listen:</label>
        <select
          value={selectedLang}
          onChange={(e) => setSelectedLang(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="">-- Select Language --</option>
          {languages.map((lang, idx) => (
            <option key={idx} value={lang}  className='bg-sky-200'>{lang}</option>
          ))}
        </select>
      </div>

      {/* Voice Selection */}
      <div>
        <label className="block font-medium mb-1">Select Voice:</label>
        <select
          value={selectedVoiceURI}
          onChange={(e) => {setSelectedVoiceURI(e.target.value),
            localStorage.setItem('voice1', e.target.value)}
          }
          className="border p-2 w-full "
        >
          <option value="">-- Select Voice --</option>
          {filteredVoices.map((voice, idx) => (
            <option key={idx} value={voice.voiceURI} className='bg-sky-200'>
              {voice.name} {voice.default ? "(default)" : ""}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
} 