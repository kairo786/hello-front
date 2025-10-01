"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Roboto } from "next/font/google";
import Spline from '@splinetool/react-spline/next';
import { useButton } from "../context/buttoncontext";
import { useOffer } from "../context/offercontext";
import { useSocket } from "../context/SocketContext";
import Openchat from "../openchat/page";
import CallUIPage from "@/components/callui";
import { RiVideoOffLine } from "react-icons/ri";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal"],
  display: "swap",
});

const ChatPage = () => {
  const { callState, setCallState } = useButton();
  const { incomingOffer, setIncomingOffer } = useOffer();
  const socket = useSocket();
  const { isLoaded, user } = useUser();
  const route = useRouter();
  const [users, setUsers] = useState({});
  const [role, setRole] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [callto, setcallto] = useState({});
  const callTimeoutRef = useRef(null);
  const[dbdep,setdbdep] = useState(false);

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
    if (!user.primaryEmailAddress?.emailAddress) return;
    const loaduser =() => {
        fetch(
      `process.env.NEXT_PUBLIC_API_URL/get-users?email=${user.primaryEmailAddress.emailAddress}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
     )
      .then((res) => res.json())
      .then((data) => {
        console.log("data", data);
        setSelectedUser(null);
        setUsers((prevUsers) => {
          const newUsers = { ...prevUsers };

          data.forEach((userObj, index) => {
            // check agar email pehle se exist karta hai to skip
            const alreadyExists = Object.values(newUsers).some(
              (u) => u.email === userObj.email
            );

            if (!alreadyExists) {
              // ek unique key banate hain (abcd + index + timestamp)
              const uniqueKey = `abcde${index}${Date.now()}`;
              newUsers[uniqueKey] = userObj;
            }
          });
          return newUsers;
        });
      })
      .catch((err) => console.error("Error:", err)); 
    }
  document.addEventListener('visibilitychange', loaduser);
  loaduser();
  return () => {
      document.removeEventListener('visibilitychange', loaduser);
    };
  }, [user.primaryEmailAddress?.emailAddress]);

   // Handle visibility changes to maintain socket connection
  useEffect(() => {
    if (!socket) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // alert("Tab became visible, refreshing user list")
        console.log("Tab became visible, refreshing user list");
        socket.emit("request-user-list");
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [socket]);



  useEffect(() => {
    const handlePopState = () => {
      setSelectedUser(null);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);
  // Connect socket and listen for user list
  useEffect(() => {
    if (!socket) return;

    const handleUserList = (userList) => {
      console.log("✅ user-list received", userList);
      setUsers(userList);
    };

    socket.on("user-list", handleUserList);
    socket.emit("request-user-list");

    return () => {
      socket.off("user-list", handleUserList);
    };
  }, [socket]);

 

  useEffect(() => {
    if (!incomingOffer || !users) return;
    console.log("imcoming offer imgurl", [users[incomingOffer.from]?.imgurl]);
    console.log("imcoming offer fullname ", [users[incomingOffer.from]?.username]);
  }, [incomingOffer, users])


  // Handle incoming offers
  useEffect(() => {
    if (!socket || !user?.fullName || !user?.imageUrl) return;
    const offerHandler = ({ from, to, offer }) => {
      socket.emit("request-user-list");
      setIncomingOffer({ from, to, offer });
      console.log("📞 Offer received from:", from);
      route.push("/call");
    };

    socket.on("offer", offerHandler);

    return () => {
      socket.off("offer", offerHandler);
    };
  }, [socket, user?.fullName, user?.imageUrl, setIncomingOffer, route]);

  useEffect(() => {
    if (!socket) return;

    const handlecall = (callto) => {
      setcallto(callto);
      setRole("receiver");
    };

    const clearCallTimeout = () => {
      if (callTimeoutRef.current) {
        clearTimeout(callTimeoutRef.current);
        callTimeoutRef.current = null;
        console.log("✅ Timeout cleared due to call answered");
      }
    };

    socket.on("calling", handlecall);
    socket.on("call-accepted", clearCallTimeout); // listener for accepting call

    // Start timeout
    callTimeoutRef.current = setTimeout(() => {
      socket.off("calling", handlecall);
      if (callto?.from) {
        socket.emit("not-answered", callto.from);
      }
      setRole("");
      console.log("⏰ Call-answered listener removed after 60 sec");
    }, 60000);

    return () => {
      socket.off("calling", handlecall);
      socket.off("call-accepted", clearCallTimeout);
      clearCallTimeout(); // just in case
    };
  }, [socket, callto]);


  useEffect(() => {
    const handlenotanswer = () => {
      alert("did not answered to the call");
      // window.location.href = '/'
      setRole("");
      route.push("/");
    }
    socket.on("not-answered", handlenotanswer);
    return () => {
      socket.off("not-answered", handlenotanswer);
    };
  }, [socket])


  // Get self ID and other users
  const selfId = Object.entries(users).find(
    ([id, data]) => data.username === user?.fullName
  )?.[0];

  const otherUsers = Object.entries(users)
    .filter(([id, data]) => data.username !== user?.fullName)
    .map(([id, data]) => ({
      id,
      username: data.username,
      imgurl: data.imgurl,
    }));

  return (
    <div>
      {role === "receiver" ? (
        <CallUIPage roler={role} socket={socket} image={users[callto.from]?.imgurl} username={users[callto.from]?.username} fromid={callto.from} />
      ) : role === "caller" ? (
        <CallUIPage roler={role} socket={socket} image={users[callState.to]?.imgurl} username={users[callState.to]?.username} toid={callState.to} />
      ) : (
        <div className="flex h-screen bg-[#0d1117] text-white">
          {/* LEFT USERS PANEL */}

          <div className={`md:min-w-86 p-4 border-r border-gray-700 overflow-y-auto w-full
    ${selectedUser ? "bg-[#161b22] hidden md:block" : "bg-[#161b22]"}`}>
            <h2 className="mb-4 text-2xl font-bold">Chats</h2>

            {/* SELF USER DISPLAY */}
            {selfId && (
              <div className="flex items-center h-16 gap-6 p-2 pl-4 mb-4 rounded-md bg-green-800/20">
                <div className="flex items-center justify-center object-cover w-12 h-12 text-center bg-gray-500 rounded-full">
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        userButtonAvatarBox: {
                          width: "45px",
                          height: "45px",
                        },
                      },
                    }}
                  /></div>
                {/* w-12 h-12 rounded-full object-cover bg-gray-600 */}
                <div className={roboto.className}>
                  <span className="font-semibold">{users[selfId].username}</span>
                </div>
                <span className="text-xs text-green-300">(You)</span>
              </div>
            )}

            {/* OTHER USERS */}
            {otherUsers.length === 0 ? (
              <div className="text-gray-400">No users online</div>
            ) : (
              otherUsers.map((user) => (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  key={user.id}
                  className={`cursor-pointer flex items-center justify-between px-4 py-3 mb-3 rounded-lg bg-gray-800/60 hover:bg-gray-700 transition ${selectedUser?.id === user.id ? "ring-2 ring-green-500" : ""
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={user.imgurl}
                      alt={user.username}
                      className="object-cover w-12 h-12 bg-gray-600 rounded-full"
                    />
                    <div>
                      <div className="font-semibold">{user.username}</div>
                      <div className="text-xs text-gray-400">Online</div>
                    </div>
                  </div>

                  {/* ICONS */}
                  <div className="flex gap-2">
                    <lord-icon
                      onClick={() => {
                        setSelectedUser(null);
                        setTimeout(() => {
                        setSelectedUser(user.id)
                        }, 100);
                        history.pushState({ modalOpen: true }, "");
                      }}
                      src="https://cdn.lordicon.com/aryhqlzy.json"
                      trigger="hover"
                      colors="primary:#00ff9f"
                      style={{
                        width: "28px",
                        height: "28px",
                        padding: "2px",
                        background: "#1f2937",
                        borderRadius: "6px",
                      }}
                    />


                    {user.id.startsWith("abcde")
                      ? <RiVideoOffLine className="w-6 h-6 text-[#08a88a] mt-1 ml-1" onClick={()=>{alert('User is offline')}}/>
                      : <lord-icon
                        onClick={() => {
                          setSelectedUser(user.id);
                          setRole("caller");
                          setCallState({ clicked: true, from: selfId, to: user.id });
                          socket.emit("calling", { "from": selfId, "to": user.id });
                          // route.push("/call");
                        }}

                        src="https://cdn.lordicon.com/ljmewfwu.json"
                        trigger="hover"
                        colors="primary:#00ff9f"
                        style={{
                          width: "28px",
                          height: "28px",
                          padding: "2px",
                          background: "#1f2937",
                          borderRadius: "6px",
                        }}
                      />}




                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* RIGHT CHAT PANEL */}
          <div className="relative flex-1 bg-center bg-cover md:min-w-3/4">
            {selectedUser ? (
              <div className="flex flex-col items-center justify-center w-full h-full text-center">
                {/* <h1 className="mb-3 text-3xl font-bold">{users[selectedUser].username}</h1>
            <p className="text-sm text-gray-300">Chat will appear here.</p> */}
                <Openchat className='w-full' users={users}  senderEmail={users[socket.id]?.email} receiverEmail={users[selectedUser]?.email} receiversocketid={selectedUser} receiverimg={users[selectedUser]?.imgurl} receivername={users[selectedUser]?.username} />
              </div>
            ) : (
              <div className="relative flex items-center justify-center h-full ml-0 overflow-hidden">
                {/* IFRAME WRAPPER */}
                <div className="relative hidden h-screen overflow-hidden md:block">
                  <iframe
                    src="https://my.spline.design/cutecomputerfollowcursor-CJSVMphXRTYr7F3TdIlLm8Wa/"
                    frameBorder="0"
                    width="1200"
                    height="1200"
                    style={{
                      transform: "scale(0.6)",
                      transformOrigin: "top center",
                      pointerEvents: "auto",
                    }}
                  />

                  {/* ✅ TEXT OVERLAY ON TOP OF IFRAME (POSITIONED LOWER) */}
                  <div className="absolute z-20 text-center transform -translate-x-1/2 bottom-32 left-1/2">
                    <h2 className="text-2xl text-gray-300">No chat selected</h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Click on a user to start chatting
                    </p>
                  </div>
                </div>
              </div>


            )}
          </div>
        </div>
      )}
    </div>


  );
};

export default ChatPage;
