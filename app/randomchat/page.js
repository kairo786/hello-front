/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import React from 'react'
import { useSocket } from '../context/SocketContext'
import { useEffect,useState } from 'react'

const page = () => {

    const [onlineuser, setonlineuser] = useState(1);
    const socket = useSocket();
    
   useEffect(() => {
    socket.on("usersUpdate", (count) => {
      setonlineuser(count - 1);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <div>
      this is random page.
    </div>
  )
}

export default page
