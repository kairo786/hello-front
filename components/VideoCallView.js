"use client";
import { useRef, useState ,useEffect} from "react";
import { motion } from "framer-motion";
import CallControls from "./CallControls";
import TopBar from "./Topbar";
import { useButton } from "./pages/context/buttoncontext";


export default function VideoCallView() {
  const { clicked } = useButton();
  const localRef = useRef();
  const remoteRef = useRef();

  let localstream ;

  useEffect(() => {
   if (clicked) {
      console.log("✅ Button was clicked on Chat Page");
      alert("button was clicked")
      // action perform karo
    }
  }, [clicked]);
  
 useEffect(() => {
    async function getStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
      // eslint-disable-next-line react-hooks/exhaustive-deps
      localstream = stream;        // video element me stream set karo
        if (localRef.current) {
            
          localRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing media devices.", err);
      }
    }
  getStream();
  }, []);
  
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
      if (edge === "right") {
        const newWidth = Math.max(150, startWidth + (e.clientX - startX));
        setSize((prev) => ({ ...prev, width: newWidth }));
      } else if (edge === "bottom") {
        const newHeight = Math.max(100, startHeight + (e.clientY - startY));
        setSize((prev) => ({ ...prev, height: newHeight }));
      } else if (edge === "left") {
        const newWidth = Math.max(150, startWidth - (e.clientX - startX));
        setSize((prev) => ({ ...prev, width: newWidth }));
      } else if (edge === "top") {
        const newHeight = Math.max(100, startHeight - (e.clientY - startY));
        setSize((prev) => ({ ...prev, height: newHeight }));
      }
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
    if (!resizingEdge) {
      setIsSwapped((prev) => !prev);
    }
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
 <div className="absolute top-0 w-full z-10">
        <div>
         <TopBar/>
        </div>
      </div>
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
        className="absolute inset-0 w-full h-max-auto object-cover cursor-pointer z-0"
      />

      {/* Resizable small video */}
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
        muted
        playsInline
        className="w-full h-full object-cover"
        style={{ borderRadius: 10, border: "2px solid #333" }}
        />

        {/* 4 Edge Resizers */}
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
      </motion.div>

      {/* Bottom Controls */}
      <div className="absolute bottom-2 w-full z-10">
        <div>
         <CallControls/>
        </div>
      </div>
    </div>
  );
}
