'use client';
import { useEffect, useRef, useState } from 'react';
import { useUser } from '@clerk/nextjs';
// import nodemailer from 'nodemailer';


export default function NudityDetector({ videoRef }) {
    const canvasRef = useRef(null);
    const [nsfwScore, setNsfwScore] = useState('');
    const { isLoaded, user } = useUser(); //user.primaryEmailAddress.emailAddress

    useEffect(() => {
        if (!videoRef?.current) return;

        let interval;

        interval = setInterval(async () => {
            try {
                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(videoRef.current, 0, 0, 224, 224);

                // Convert to base64
                const base64 = canvas.toDataURL('image/jpeg');

                // Send to backend
                const res = await fetch('/api/moderate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ imageBase64: base64 }),
                });

                const data = await res.json();
                console.log(data);

                if (!data.nudity) {
                    console.warn('No nudity data:', data);
                    return;
                }

                const score =
                    (data.nudity?.sexual_activity || 0) +
                    (data.nudity?.sexual_display || 0) +
                    (data.nudity?.erotica || 0) +
                    (data.nudity?.suggestive || 0);

                setNsfwScore(score.toFixed(2));

                if (score > 0.85) {
                    videoRef.current.style.filter = 'blur(10px)';
                    console.warn('⚠️ Nudity detected!');
                    alert('⚠️ Nudity detected!');
                       await fetch(`${process.env.NEXT_PUBLIC_API_URL}/send-email`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            mail :user.primaryEmailAddress.emailAddress,
                        })
                    });
                } else {
                    videoRef.current.style.filter = 'none';
                }
            } catch (err) {
                console.error('Error detecting:', err);
            }
        }, 10000); // हर 10 सेकंड पर

        return () => clearInterval(interval);
    }, [videoRef]);

    return (
        <>
            <p className="text-sm text-gray-700">NSFW Score: {nsfwScore}</p>
            <canvas ref={canvasRef} width="224" height="224" style={{ display: 'none' }} />
        </>
    );
}
