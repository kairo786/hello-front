"use client";
import { motion } from "framer-motion";
import { Mic, Video, PhoneOff, Camera } from "lucide-react";
import { useState } from "react";
import { useSocket } from "@/app/context/SocketContext";

export default function CallControls({ camerastream , data ,onCameraToggle}) {
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const socket = useSocket();
  // ✅ Camera toggle
const toggleCamera = () => {
    const videoTrack = camerastream
      ?.getTracks()
      ?.find((track) => track.kind === "video");

    if (videoTrack) {
      const newState = !videoTrack.enabled;
      videoTrack.enabled = newState;
      setCameraOn(newState);
      onCameraToggle(newState); // Call Page को नया स्टेट भेजें
    }
  };

  // ✅ Mic toggle
  const toggleMic = () => {
    const audioTrack = camerastream
      ?.getTracks()
      ?.find((track) => track.kind === "audio");

    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      console.log('mic band kia gya')
      setMicOn(audioTrack.enabled);
    }
  };

  // ✅ End call: stop all tracks
  const endCall = () => {
    // camerastream?.getTracks().forEach((track) => track.stop());
    socket.emit("end-call" ,data);
    // window.location.href = "/chat"; // ya navigate to home, custom page
  };

  return (
    <motion.div
      className="bg-gray-900 py-4 px-6 flex justify-center gap-6"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      {/* Toggle Camera */}
      <button
        onClick={toggleCamera}
        className={`p-3 rounded-full ${
          cameraOn ? "bg-gray-700 hover:bg-gray-600" : "bg-yellow-700"
        }`}
        title={cameraOn ? "Turn Off Camera" : "Turn On Camera"}
      >
        <Camera className="text-white" />
      </button>

      {/* Toggle Mic */}
      <button
        onClick={toggleMic}
        className={`p-3 rounded-full ${
          micOn ? "bg-green-800 hover:bg-green-600" : "bg-yellow-800"
        }`}
        title={micOn ? "Mute Mic" : "Unmute Mic"}
      >
        <Mic className="text-white" />
      </button>

      {/* Dummy Video Button (You can use this later for screen share or playback toggle) */}
      <button className="bg-gray-700 hover:bg-gray-600 p-3 rounded-full">
        <Video className="text-white" />
      </button>

      {/* End Call */}
      <button
        onClick={endCall}
        className="bg-red-600 hover:bg-red-700 p-3 rounded-full"
        title="End Call"
      >
        <PhoneOff className="text-white" />
      </button>
    </motion.div>
  );
}
