"use client"
import React, { useRef, useState, useEffect } from 'react';

const VideoLayout = (localVideoRef) => {
    // Local Video के लिए ref
    // const localVideoRef = useRef(null);
    // Local Video की पोजीशन को ट्रैक करने के लिए state
    const [position, setPosition] = useState({ x: 0, y: 0 });
    // Dragging state
    const [isDragging, setIsDragging] = useState(false);
    // Drag start position
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });

    // Dragging Logic
    useEffect(() => {
        const videoElement = localVideoRef.current;
        if (!videoElement) return;

        // Check if we are on a mobile size (less than 'md' breakpoint, which is 768px in Tailwind)
        const isMobile = window.innerWidth < 768;
        if (!isMobile) return; // Only apply dragging logic on mobile

        const handleMouseDown = (e) => {
            setIsDragging(true);
            setStartPos({
                x: e.clientX - position.x,
                y: e.clientY - position.y
            });
            e.preventDefault(); // Prevents image dragging and other defaults
        };

        const handleMouseMove = (e) => {
            if (!isDragging) return;
            setPosition({
                x: e.clientX - startPos.x,
                y: e.clientY - startPos.y
            });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };
        
        // Touch events for mobile
        const handleTouchStart = (e) => {
            const touch = e.touches[0];
            setIsDragging(true);
            setStartPos({
                x: touch.clientX - position.x,
                y: touch.clientY - position.y
            });
        };

        const handleTouchMove = (e) => {
            if (!isDragging) return;
            const touch = e.touches[0];
            setPosition({
                x: touch.clientX - startPos.x,
                y: touch.clientY - startPos.y
            });
            e.preventDefault(); // Important for touch move
        };
        
        const handleTouchEnd = () => {
            setIsDragging(false);
        };

        // Event Listeners add/remove
        videoElement.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        
        videoElement.addEventListener('touchstart', handleTouchStart);
        window.addEventListener('touchmove', handleTouchMove);
        window.addEventListener('touchend', handleTouchEnd);


        return () => {
            videoElement.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            
            videoElement.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isDragging, position, startPos]);

    // Apply the position via style only on mobile, otherwise use default
    const videoStyle = {
        transform: window.innerWidth < 768 && position.x !== 0 && position.y !== 0 
            ? `translate(${position.x}px, ${position.y}px)`
            : '',
        cursor: window.innerWidth < 768 ? 'move' : 'default', // Change cursor on mobile
        // Add transition for smoother movement (optional)
        transition: isDragging ? 'none' : 'transform 0.1s ease-out',
        zIndex: 50 // Ensure it stays on top of the other video and gradient
    };

// ---
// अब आपका JSX कोड
// ---

    return (
        <div className="relative flex flex-row gap-2 group h-[50vh] md:h-[70vh]">
            {/* Left Video */}
            <video
              src="/girl.mp4"
              className="object-cover w-full md:w-8/12 h-full rounded-r-3xl rounded-l-4xl"
              autoPlay
              muted
              loop
              preload="auto"
              playsInline
            />

            {/* Right Local Video (Modified with style and classes) */}
            <video
              ref={localVideoRef}
              muted
              autoPlay
              playsInline
              // 'md:relative' और 'md:object-cover' PC (बड़ी) स्क्रीन के लिए
              // 'absolute' और 'right-1 w-4/12 bottom-2' मोबाइल के लिए
              className="absolute md:relative md:object-cover right-1 w-4/12 md:w-4/12 h-1/4 md:h-full md:bottom-0 bottom-2 border-2 border-gray-800 rounded-xl md:rounded-r-4xl md:rounded-l-3xl"
              style={videoStyle}
            />

            {/* Overlay Gradient */}
            <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:opacity-100"></div>

            {/* Overlay Info */}
            <div className="absolute px-4 py-2 border top-4 left-4 bg-black/70 backdrop-blur-md rounded-xl border-purple-500/30 z-10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-white">Welcome to Hello</span>
              </div>
            </div>
        </div>
    );
};

export default VideoLayout; // इसे सही ढंग से एक्सपोर्ट करना न भूलें