// "use client"
// import React, { useState, useEffect } from 'react';
// import { Heart, Skull, Shield, Beer, Eye, Cigarette, Zap, Target, User } from 'lucide-react';

// const BuckshotRoulette = () => {
//   const [gameState, setGameState] = useState('menu');
//   const [playerHP, setPlayerHP] = useState(5);
//   const [dealerHP, setDealerHP] = useState(5);
//   const [playerItems, setPlayerItems] = useState([0, 0, 0, 0, 0]);
//   const [dealerItems, setDealerItems] = useState([0, 0, 0, 0, 0]);
//   const [gun, setGun] = useState([]);
//   const [currentBullet, setCurrentBullet] = useState(0);
//   const [liveCount, setLiveCount] = useState(0);
//   const [blankCount, setBlankCount] = useState(0);
//   const [round, setRound] = useState(1);
//   const [turn, setTurn] = useState('player');
//   const [message, setMessage] = useState('');
//   const [showShoot, setShowShoot] = useState(false);
//   const [playerCuffed, setPlayerCuffed] = useState(false);
//   const [dealerCuffed, setDealerCuffed] = useState(false);
//   const [damageMultiplier, setDamageMultiplier] = useState(1);
//   const [showItems, setShowItems] = useState(false);
//   const [animation, setAnimation] = useState('');
//   const [winner, setWinner] = useState('');
//   const [showRules, setShowRules] = useState(false);
//   const [shootEffect, setShootEffect] = useState({ show: false, target: '', hit: false });
//   const [characterAnimations, setCharacterAnimations] = useState({ player: '', dealer: '' });

//   const itemNames = ['Handcuff', 'Beer', 'X-Ray', 'Cigar', 'Gunpowder'];
//   const itemIcons = [Shield, Beer, Eye, Cigarette, Zap];

//   const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

//   const startGame = () => {
//     setGameState('playing');
//     setPlayerHP(5);
//     setDealerHP(5);
//     setRound(1);
//     setWinner('');
//     startRound();
//   };

//   const startRound = async () => {
//     setMessage(`Round ${round} - Loading gun...`);
//     await sleep(1000);

//     const bullets = Array(8).fill(0).map(() => Math.random() > 0.5 ? 1 : 0);
//     const live = bullets.filter(b => b === 1).length;
//     const blank = 8 - live;
    
//     setGun(bullets);
//     setCurrentBullet(0);
//     setLiveCount(live);
//     setBlankCount(blank);

//     setMessage(`${live} Live bullets, ${blank} Blank bullets loaded`);
//     await sleep(2000);

//     const pItems = [0, 0, 0, 0, 0];
//     const dItems = [0, 0, 0, 0, 0];
//     for (let i = 0; i < 3; i++) {
//       pItems[Math.floor(Math.random() * 5)]++;
//       dItems[Math.floor(Math.random() * 5)]++;
//     }
//     setPlayerItems(pItems);
//     setDealerItems(dItems);

//     setMessage('Items distributed. Your turn!');
//     setTurn('player');
//     setShowShoot(true);
//     setPlayerCuffed(false);
//     setDealerCuffed(false);
//     setDamageMultiplier(1);
//     setCharacterAnimations({ player: '', dealer: '' });
//   };

//   // Actual gun se bullet counts calculate karega
//   const calculateRemainingBullets = () => {
//     const remainingGun = gun.slice(currentBullet);
//     const live = remainingGun.filter(b => b === 1).length;
//     const blank = remainingGun.filter(b => b === 0).length;
//     return { live, blank };
//   };

//   const showShootAnimation = async (target, hit) => {
//     setShootEffect({ show: true, target, hit });
//     if (target === 'player') {
//       setCharacterAnimations({ player: hit ? 'hit' : 'dodge', dealer: 'shooting' });
//     } else {
//       setCharacterAnimations({ player: 'shooting', dealer: hit ? 'hit' : 'dodge' });
//     }
//     await sleep(1500);
//     setShootEffect({ show: false, target: '', hit: false });
//     setCharacterAnimations({ player: '', dealer: '' });
//   };

//   const checkRoundEnd = async () => {
//     if (currentBullet >= gun.length) {
//       setMessage("All bullets used! Starting next round...");
//       await sleep(2000);
//       setRound(r => r + 1);
//       startRound();
//       return true;
//     }
//     return false;
//   };

//   const shoot = async (target) => {
//     if (await checkRoundEnd()) return;

//     setShowShoot(false);
//     setShowItems(false);
    
//     if (currentBullet >= gun.length) {
//       setMessage("No bullets left!");
//       await sleep(1000);
//       return;
//     }

//     const isLive = gun[currentBullet] === 1;
//     const damage = damageMultiplier;
    
//     await showShootAnimation(target, isLive);

//     // Actual gun se remaining bullets calculate karo
//     const remainingBullets = calculateRemainingBullets();
//     setLiveCount(remainingBullets.live);
//     setBlankCount(remainingBullets.blank);

//     if (target === 'dealer') {
//       setMessage('Shooting the dealer...');
      
//       if (isLive) {
//         setMessage(`💥 LIVE BULLET! Dealer takes ${damage} damage!`);
//         setDealerHP(h => Math.max(0, h - damage));
        
//         if (dealerHP - damage <= 0) {
//           await sleep(2000);
//           setWinner('player');
//           setGameState('gameOver');
//           return;
//         }
//       } else {
//         setMessage('Click... BLANK! Dealer survives.');
//       }
      
//       setDamageMultiplier(1);
//       if (dealerCuffed) {
//         setDealerCuffed(false);
//       }
//       await sleep(2000);
//       setCurrentBullet(c => c + 1);
      
//       if (!(await checkRoundEnd())) {
//         setTurn('dealer');
//         dealerTurn();
//       }
//     } else {
//       setMessage('Shooting yourself...');
      
//       if (isLive) {
//         setMessage(`💥 LIVE BULLET! You take ${damage} damage!`);
//         setPlayerHP(h => Math.max(0, h - damage));
        
//         if (playerHP - damage <= 0) {
//           await sleep(2000);
//           setWinner('dealer');
//           setGameState('gameOver');
//           return;
//         }
        
//         setDamageMultiplier(1);
//         await sleep(2000);
//         setCurrentBullet(c => c + 1);
        
//         if (!(await checkRoundEnd())) {
//           setTurn('dealer');
//           dealerTurn();
//         }
//       } else {
//         setMessage('Click... BLANK! You survive and keep your turn!');
//         setDamageMultiplier(1);
//         await sleep(2000);
//         setCurrentBullet(c => c + 1);
        
//         // Update bullet counts after shooting
//         const newRemainingBullets = calculateRemainingBullets();
//         setLiveCount(newRemainingBullets.live);
//         setBlankCount(newRemainingBullets.blank);
        
//         if (!(await checkRoundEnd())) {
//           setMessage('Your turn again!');
//           setShowShoot(true);
//         }
//       }
//     }
//   };

//   const useItem = async (itemIndex) => {
//     const newItems = [...playerItems];
//     if (newItems[itemIndex] <= 0) return;
    
//     newItems[itemIndex]--;
//     setPlayerItems(newItems);
//     setShowItems(false);

//     switch(itemIndex) {
//       case 0: // Handcuff
//         setMessage('You cuff the dealer!');
//         setDealerCuffed(true);
//         break;
//       case 1: // Beer
//         if (currentBullet < gun.length) {
//           const ejected = gun[currentBullet];
//           setMessage(`Ejected a ${ejected === 1 ? 'LIVE' : 'BLANK'} bullet!`);
//           setCurrentBullet(c => c + 1);
//           // Update bullet counts after beer
//           const remainingBullets = calculateRemainingBullets();
//           setLiveCount(remainingBullets.live);
//           setBlankCount(remainingBullets.blank);
//         }
//         break;
//       case 2: // X-Ray
//         if (currentBullet < gun.length) {
//           setMessage(`Next bullet is ${gun[currentBullet] === 1 ? '🔴 LIVE' : '⚪ BLANK'}!`);
//         }
//         break;
//       case 3: // Cigar
//         setMessage('HP +1');
//         setPlayerHP(h => h + 1);
//         break;
//       case 4: // Gunpowder
//         setMessage('Next shot deals 2x damage!');
//         setDamageMultiplier(2);
//         break;
//     }
    
//     await sleep(2000);
//     setMessage('Choose your action');
//     setShowShoot(true);
//   };

//   const dealerTurn = async () => {
//     if (await checkRoundEnd()) return;

//     await sleep(1000);
    
//     if (dealerCuffed) {
//       setMessage("Dealer is cuffed! Skip turn.");
//       setDealerCuffed(false);
//       await sleep(2000);
//       setTurn('player');
//       setMessage('Your turn!');
//       setShowShoot(true);
//       return;
//     }

//     setMessage("Dealer's turn...");
//     await sleep(1500);

//     // Actual remaining bullets use karo
//     const remainingBullets = calculateRemainingBullets();
//     const totalRemaining = remainingBullets.live + remainingBullets.blank;
//     const liveRatio = totalRemaining > 0 ? remainingBullets.live / totalRemaining : 0;
    
//     let dealerDmg = 1;
//     let usedCigar = false;

//     const currentDealerItems = [...dealerItems];

//     // Use cigar only if HP is low and dealer has cigar
//     if (dealerHP < 3 && currentDealerItems[3] > 0 && !usedCigar) {
//       currentDealerItems[3]--;
//       setDealerItems(currentDealerItems);
//       setMessage('Dealer smokes a cigar (+1 HP)');
//       setDealerHP(h => h + 1);
//       usedCigar = true;
//       await sleep(2000);
//     }

//     // Use gunpowder only if live ratio is high and dealer has gunpowder
//     if (liveRatio >= 0.5 && currentDealerItems[4] > 0) {
//       currentDealerItems[4]--;
//       setDealerItems(currentDealerItems);
//       setMessage('Dealer uses gunpowder!');
//       dealerDmg = 2;
//       await sleep(2000);
//     }

//     // Use handcuff only if conditions are met and dealer has handcuff
//     if (liveRatio < 0.5 && liveRatio > 0.4 && currentDealerItems[0] > 0 && !playerCuffed) {
//       currentDealerItems[0]--;
//       setDealerItems(currentDealerItems);
//       setMessage('Dealer cuffs you!');
//       setPlayerCuffed(true);
//       await sleep(2000);
//     }

//     const target = liveRatio >= 0.5 ? 'player' : 'self';
    
//     await showShootAnimation(target, gun[currentBullet] === 1);

//     // Update bullet counts before processing result
//     const updatedRemainingBullets = calculateRemainingBullets();
//     setLiveCount(updatedRemainingBullets.live);
//     setBlankCount(updatedRemainingBullets.blank);

//     if (target === 'player') {
//       setMessage('Dealer shoots you!');
      
//       if (gun[currentBullet] === 1) {
//         setMessage(`💥 You take ${dealerDmg} damage!`);
//         setPlayerHP(h => Math.max(0, h - dealerDmg));
        
//         if (playerHP - dealerDmg <= 0) {
//           await sleep(2000);
//           setWinner('dealer');
//           setGameState('gameOver');
//           return;
//         }
//       } else {
//         setMessage('Click... BLANK!');
//       }
      
//       if (playerCuffed) setPlayerCuffed(false);
//       await sleep(2000);
//       setCurrentBullet(c => c + 1);
      
//       if (!(await checkRoundEnd())) {
//         setTurn('player');
//         setMessage('Your turn!');
//         setShowShoot(true);
//       }
//     } else {
//       setMessage('Dealer shoots himself!');
      
//       if (gun[currentBullet] === 1) {
//         setMessage(`💥 Dealer takes ${dealerDmg} damage!`);
//         setDealerHP(h => Math.max(0, h - dealerDmg));
        
//         if (dealerHP - dealerDmg <= 0) {
//           await sleep(2000);
//           setWinner('player');
//           setGameState('gameOver');
//           return;
//         }
        
//         if (playerCuffed) setPlayerCuffed(false);
//         await sleep(2000);
//         setCurrentBullet(c => c + 1);
        
//         if (!(await checkRoundEnd())) {
//           setTurn('player');
//           setMessage('Your turn!');
//           setShowShoot(true);
//         }
//       } else {
//         setMessage('Click... BLANK! Dealer goes again.');
//         if (playerCuffed) setPlayerCuffed(false);
//         await sleep(2000);
//         setCurrentBullet(c => c + 1);
        
//         // Update bullet counts again for next dealer turn
//         const newRemainingBullets = calculateRemainingBullets();
//         setLiveCount(newRemainingBullets.live);
//         setBlankCount(newRemainingBullets.blank);
        
//         if (!(await checkRoundEnd())) {
//           dealerTurn();
//         }
//       }
//     }
//   };

//   // Shooting Effect Component
//   const ShootingEffect = () => {
//     if (!shootEffect.show) return null;

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-black via-red-950 to-black text-white p-4">
//       <ShootingEffect />
      
//       <div className="max-w-6xl mx-auto">
//         <div className="text-center mb-6">
//           <h2 className="text-3xl font-bold text-red-500">Round {round}</h2>
//           <div className="flex justify-center gap-8 mt-4 text-xl">
//             <div className="flex items-center gap-2">
//               <div className="w-4 h-4 rounded-full bg-red-500"></div>
//               <span>{liveCount} Live</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="w-4 h-4 rounded-full bg-gray-400"></div>
//               <span>{blankCount} Blank</span>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//           {/* Dealer Section */}
//           <div className={`bg-black/50 p-6 rounded-lg border-2 ${turn === 'dealer' ? 'border-red-500' : 'border-gray-700'} transition-all duration-300 ${
//             characterAnimations.dealer === 'hit' ? 'bg-red-900/50 animate-pulse' : 
//             characterAnimations.dealer === 'shooting' ? 'bg-yellow-900/30' : 
//             characterAnimations.dealer === 'dodge' ? 'bg-blue-900/30' : ''
//           }`}>
//             <div className="text-center">
//               <div className="relative">
//                 <Skull className={`w-20 h-20 mx-auto mb-4 text-red-600 ${
//                   characterAnimations.dealer === 'hit' ? 'animate-bounce' : 
//                   characterAnimations.dealer === 'dodge' ? 'animate-pulse' : ''
//                 }`} />
//                 {characterAnimations.dealer === 'shooting' && (
//                   <div className="absolute inset-0 flex items-center justify-center">
//                     <div className="text-4xl animate-ping">🔫</div>
//                   </div>
//                 )}
//               </div>
//               <h3 className="text-2xl font-bold mb-2">DEALER</h3>
//               {dealerCuffed && <div className="text-yellow-400 text-sm mb-2">🔗 CUFFED</div>}
//               <div className="flex items-center justify-center gap-2 text-3xl">
//                 {Array(dealerHP).fill(0).map((_, i) => (
//                   <Heart key={i} className="fill-red-600 text-red-600" />
//                 ))}
//               </div>
//               <div className="mt-4 text-sm text-gray-400">
//                 {dealerItems.map((count, i) => {
//                   const Icon = itemIcons[i];
//                   return count > 0 ? (
//                     <div key={i} className="inline-flex items-center gap-1 mr-2">
//                       <Icon className="w-4 h-4" />
//                       <span>x{count}</span>
//                     </div>
//                   ) : null;
//                 })}
//               </div>
//             </div>
//           </div>

//           {/* Gun Section */}
//           <div className="bg-black/50 p-6 rounded-lg border-2 border-yellow-500 flex items-center justify-center">
//             <div className="text-center">
//               <div className={`w-32 h-32 mx-auto mb-4 ${characterAnimations.player === 'shooting' || characterAnimations.dealer === 'shooting' ? 'animate-bounce' : ''}`}>
//                 <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-yellow-500">
//                   <path d="M3 12h4l3-9 4 18 3-9h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                   <circle cx="12" cy="12" r="2" fill="currentColor"/>
//                 </svg>
//               </div>
//               <div className="text-4xl font-bold">{8 - currentBullet}</div>
//               <div className="text-sm text-gray-400">bullets left</div>
//               {damageMultiplier > 1 && (
//                 <div className="mt-2 text-yellow-400 font-bold animate-pulse">
//                   ⚡ 2x DAMAGE ⚡
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Player Section */}
//           <div className={`bg-black/50 p-6 rounded-lg border-2 ${turn === 'player' ? 'border-green-500' : 'border-gray-700'} transition-all duration-300 ${
//             characterAnimations.player === 'hit' ? 'bg-red-900/50 animate-pulse' : 
//             characterAnimations.player === 'shooting' ? 'bg-yellow-900/30' : 
//             characterAnimations.player === 'dodge' ? 'bg-blue-900/30' : ''
//           }`}>
//             <div className="text-center">
//               <div className="relative">
//                 <User className={`w-20 h-20 mx-auto mb-4 text-green-500 ${
//                   characterAnimations.player === 'hit' ? 'animate-bounce' : 
//                   characterAnimations.player === 'dodge' ? 'animate-pulse' : ''
//                 }`} />
//                 {characterAnimations.player === 'shooting' && (
//                   <div className="absolute inset-0 flex items-center justify-center">
//                     <div className="text-4xl animate-ping">🔫</div>
//                   </div>
//                 )}
//               </div>
//               <h3 className="text-2xl font-bold mb-2">YOU</h3>
//               {playerCuffed && <div className="text-yellow-400 text-sm mb-2">🔗 CUFFED</div>}
//               <div className="flex items-center justify-center gap-2 text-3xl">
//                 {Array(playerHP).fill(0).map((_, i) => (
//                   <Heart key={i} className="fill-green-600 text-green-600" />
//                 ))}
//               </div>
//               <div className="mt-4 grid grid-cols-5 gap-2">
//                 {playerItems.map((count, i) => {
//                   const Icon = itemIcons[i];
//                   return (
//                     <button
//                       key={i}
//                       onClick={() => useItem(i)}
//                       disabled={count === 0 || !showItems}
//                       className={`p-2 rounded ${count > 0 && showItems ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700'} transition relative`}
//                     >
//                       <Icon className="w-6 h-6 mx-auto" />
//                       {count > 0 && (
//                         <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                           {count}
//                         </span>
//                       )}
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="bg-black/50 p-4 rounded-lg border-2 border-gray-700 mb-6 text-center">
//           <p className="text-xl font-bold">{message}</p>
//         </div>

//         {turn === 'player' && showShoot && (
//           <div className="flex justify-center gap-4 flex-wrap">
//             <button 
//               onClick={() => shoot('dealer')}
//               className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition flex items-center gap-2"
//             >
//               <Target className="w-6 h-6" />
//               SHOOT DEALER
//             </button>
//             <button 
//               onClick={() => shoot('self')}
//               className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition flex items-center gap-2"
//             >
//               <User className="w-6 h-6" />
//               SHOOT SELF
//             </button>
//             <button 
//               onClick={() => setShowItems(!showItems)}
//               className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition"
//             >
//               {showItems ? 'HIDE' : 'USE'} ITEMS
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// "use client";
// import React, { useEffect } from "react";

// const Page = () => {
//   useEffect(() => {
//     const email = "aarvindkumar@gmail.com";
//     if (!email) return;

//     const sendEmail = async () => {
//       try {
//         const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/send-email`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ mail: email }),
//         });

//         if (res.ok) {
//           console.log("✅ Email sent successfully!");
//         } else {
//           console.error("❌ Failed to send email");
//         }
//       } catch (err) {
//         console.error("Failed to send email", err);
//       }
//     };

//     sendEmail();
//   }, []);

//   return <div>hi</div>;
// // };

// // export default Page;






// "use client";
// import { useState } from "react";

// export default function PayButton() {
//   const [loading, setLoading] = useState(false);

//   const handlePayment = async () => {
//     setLoading(true);
//     const res = await fetch("/api/razorpay", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ amount: 499 }), // ₹499
//     });

//     const data = await res.json();
//     setLoading(false);

//     const options = {
//       key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // ✅ public key only
//       amount: data.amount,
//       currency: data.currency,
//       name: "My App",
//       description: "Test Transaction",
//       order_id: data.id,
//       handler: function (response) {
//         alert(`Payment successful! ID: ${response.razorpay_payment_id}`);
//       },
//       prefill: {
//         name: "Your Name",
//         email: "email@example.com",
//         contact: "9999999999",
//       },
//       theme: { color: "#3399cc" },
//     };

//     const rzp = new window.Razorpay(options);
//     rzp.open();
//   };

//   return (
//     <button onClick={handlePayment} disabled={loading}>
//       {loading ? "Processing..." : "Pay ₹499"}
//     </button>
//   );
// }





// import { useState, useEffect } from 'react';
// import { Heart, Coffee, X } from 'lucide-react';

// export default function BuyMeCoffee() {
//   const [donations, setDonations] = useState([]);
//   const [name, setName] = useState('');
//   const [message, setMessage] = useState('');
//   const [selectedOption, setSelectedOption] = useState(null);
//   const [customAmount, setCustomAmount] = useState('');
//   const [isPrivate, setIsPrivate] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const coffeeOptions = [
//     { id: 'coffee', label: 'Buy me a coffee', baseAmount: 100, emoji: '☕' },
//     { id: 'lunch', label: 'Buy me lunch', baseAmount: 300, emoji: '🍱' },
//     { id: 'dinner', label: 'Buy me dinner', baseAmount: 500, emoji: '🍽️' },
//     { id: 'movie', label: 'Movie night!', baseAmount: 750, emoji: '🎬' },
//   ];

//   const multipliers = [1, 2, 3, 5];

//   // Load donations from storage
//   useEffect(() => {
//     const loadDonations = async () => {
//       try {
//         const result = await window.storage?.get('donations-list');
//         if (result?.value) {
//           setDonations(JSON.parse(result.value));
//         }
//       } catch (error) {
//         console.error('Load error:', error);
//       }
//     };
//     loadDonations();
//   }, []);

//   // Save donations to storage
//   const saveDonations = async (newDonations) => {
//     try {
//       await window.storage?.set('donations-list', JSON.stringify(newDonations), true);
//       setDonations(newDonations);
//     } catch (error) {
//       console.error('Save error:', error);
//     }
//   };

//   const handlePayment = async (amount) => {
//     if (!name.trim()) {
//       alert('Please enter your name');
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await fetch('/api/razorpay', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ amount }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to create order');
//       }

//       const order = await response.json();

//       const options = {
//         key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
//         amount: order.amount,
//         currency: order.currency,
//         name: 'Buy Me A Coffee',
//         description: `Support from ${name}`,
//         order_id: order.id,
//         handler: async function (response) {
//           // Add donation to list only after successful payment
//           if (!isPrivate) {
//             const newDonation = {
//               id: Date.now(),
//               name: name.trim(),
//               amount,
//               message: message.trim(),
//               timestamp: new Date().toLocaleString(),
//             };
//             const updated = [newDonation, ...donations];
//             await saveDonations(updated);
//           }

//           // Reset form
//           setName('');
//           setMessage('');
//           setSelectedOption(null);
//           setCustomAmount('');
//           setIsPrivate(false);
//           alert('🎉 Thank you so much for your support!');
//         },
//         prefill: {
//           name,
//         },
//         theme: {
//           color: '#92400e',
//         },
//         modal: {
//           ondismiss: function () {
//             setLoading(false);
//           },
//         },
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.open();
//     } catch (error) {
//       console.error('Payment error:', error);
//       alert('Error creating payment. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getAmount = () => {
//     if (customAmount) return Number(customAmount);
//     if (selectedOption) {
//       const option = coffeeOptions.find(o => o.id === selectedOption.id);
//       return option.baseAmount * selectedOption.multiplier;
//     }
//     return 0;
//   };

//   const amount = getAmount();

//   return (
//     <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-rose-50">

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 max-w-7xl mx-auto">
//         {/* Left - Donations Feed */}
//         <div className="lg:col-span-1 order-2 lg:order-1">
//           <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6 max-h-[calc(100vh-48px)] overflow-y-auto">
//             <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
//               <Heart size={24} className="text-red-500" />
//               Recent Supporters
//             </h2>

//             {donations.length === 0 ? (
//               <div className="text-center py-12">
//                 <Coffee size={48} className="text-gray-300 mx-auto mb-4" />
//                 <p className="text-gray-500 font-medium">No supporters yet</p>
//                 <p className="text-gray-400 text-sm">Be the first one! ☕</p>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {donations.map((donation) => (
//                   <div
//                     key={donation.id}
//                     className="bg-linear-to-r from-amber-50 to-orange-50 rounded-lg p-4 border-l-4 border-amber-400 hover:shadow-md transition-shadow"
//                   >
//                     <div className="flex justify-between items-start mb-2">
//                       <p className="font-bold text-gray-900">{donation.name}</p>
//                       <p className="text-lg font-bold text-amber-700">₹{donation.amount}</p>
//                     </div>
//                     {donation.message && (
//                       <p className="text-gray-700 italic text-sm mb-2">
//                         &quot;{donation.message}&quot;
//                       </p>
//                     )}
//                     <p className="text-xs text-gray-500">{donation.timestamp}</p>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Right - Payment Form */}
//         <div className="lg:col-span-2 order-1 lg:order-2">
//           <div className="bg-white rounded-2xl shadow-lg p-8">
//             {/* Header */}
//             <div className="text-center mb-8">
//               <Coffee size={64} className="text-amber-700 mx-auto mb-4 drop-shadow-lg" />
//               <h1 className="text-4xl font-bold text-gray-900 mb-2">
//                 Buy me a coffee
//               </h1>
//               <p className="text-gray-600">
//                 Your support fuels my creativity and keeps me going! ☕
//               </p>
//             </div>

//             {/* Coffee Options */}
//             <div className="mb-8">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Option</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                 {coffeeOptions.map((option) => (
//                   <div key={option.id} className="border-2 border-gray-200 rounded-lg p-4 hover:border-amber-400 transition-colors">
//                     <div className="flex items-center justify-between mb-3">
//                       <div>
//                         <p className="font-semibold text-gray-900">{option.label}</p>
//                         <p className="text-sm text-gray-600">Base: ₹{option.baseAmount}</p>
//                       </div>
//                       <span className="text-3xl">{option.emoji}</span>
//                     </div>
//                     <div className="flex flex-wrap gap-2">
//                       {multipliers.map((mult) => (
//                         <button
//                           key={mult}
//                           onClick={() => {
//                             setSelectedOption({ id: option.id, multiplier: mult });
//                             setCustomAmount('');
//                           }}
//                           className={`px-3 py-1 rounded font-semibold text-sm transition-colors ${
//                             selectedOption?.id === option.id && selectedOption?.multiplier === mult
//                               ? 'bg-amber-600 text-white'
//                               : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                           }`}
//                         >
//                           ×{mult}
//                         </button>
//                       ))}
//                     </div>
//                     {selectedOption?.id === option.id && (
//                       <p className="text-lg font-bold text-amber-700 mt-2">
//                         ₹{option.baseAmount * selectedOption.multiplier}
//                       </p>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Custom Amount */}
//             <div className="mb-8">
//               <label className="block text-lg font-semibold text-gray-900 mb-3">
//                 💰 Or enter custom amount
//               </label>
//               <div className="relative">
//                 <span className="absolute left-4 top-3 text-2xl text-gray-500">₹</span>
//                 <input
//                   type="number"
//                   min="10"
//                   value={customAmount}
//                   onChange={(e) => {
//                     setCustomAmount(e.target.value);
//                     setSelectedOption(null);
//                   }}
//                   placeholder="Enter amount"
//                   className="w-full pl-12 pr-4 py-3 text-xl font-semibold border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
//                 />
//               </div>
//             </div>

//             {/* Name */}
//             <div className="mb-6">
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Your Name *
//               </label>
//               <input
//                 type="text"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 placeholder="Enter your name"
//                 className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
//               />
//             </div>

//             {/* Message */}
//             <div className="mb-6">
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Your Message (optional)
//               </label>
//               <textarea
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 placeholder="Say something nice! 💬"
//                 maxLength={100}
//                 className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 resize-none"
//                 rows="3"
//               />
//               <p className="text-xs text-gray-500 mt-1 text-right">
//                 {message.length}/100
//               </p>
//             </div>

//             {/* Private Checkbox */}
//             <div className="mb-8 flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
//               <input
//                 type="checkbox"
//                 id="private"
//                 checked={isPrivate}
//                 onChange={(e) => setIsPrivate(e.target.checked)}
//                 className="w-5 h-5 cursor-pointer accent-amber-600"
//               />
//               <label htmlFor="private" className="text-gray-700 font-medium cursor-pointer">
//                 Keep this donation private (won&apos;t be shown in the feed)
//               </label>
//             </div>

//             {/* Pay Button */}
//             <button
//               onClick={() => handlePayment(amount)}
//               disabled={loading || !amount || !name.trim()}
//               className="w-full py-4 bg-linear-to-r from-amber-600 to-orange-600 text-white text-xl font-bold rounded-lg hover:from-amber-700 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 transition-all transform hover:scale-105 shadow-lg"
//             >
//               {loading ? (
//                 <span className="flex items-center justify-center gap-2">
//                   <div className="animate-spin">⏳</div> Processing...
//                 </span>
//               ) : amount ? (
//                 <span className="flex items-center justify-center gap-2">
//                   <Heart size={20} /> Support with ₹{amount}
//                 </span>
//               ) : (
//                 'Select amount'
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// components/VideoModeration.js
// components/VideoModeration.js
// app/page.js
'use client';

import { useEffect, useRef, useState } from 'react';

export default function Page() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);

  const [status, setStatus] = useState('idle'); // idle | streaming | checking | blocked
  const [nudity, setNudity] = useState(false);
  const [lastLabels, setLastLabels] = useState([]);
  const [error, setError] = useState(null);

  const CAPTURE_INTERVAL = 1500; // ms, tweak for perf / cost

  useEffect(() => {
    let mounted = true;

    async function startCamera() {
      setStatus('starting');
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (!mounted) {
          // stop stream if component unmounted quickly
          stream.getTracks().forEach(t => t.stop());
          return;
        }
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setStatus('streaming');

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        async function captureAndCheck() {
          if (!videoRef.current || videoRef.current.readyState < 2) return;

          // fit canvas to video size
          canvas.width = videoRef.current.videoWidth || 640;
          canvas.height = videoRef.current.videoHeight || 480;

          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

          // get compressed image to reduce upload size
          const dataUrl = canvas.toDataURL('image/jpeg', 0.6);

          setStatus('checking');
          try {
            const res = await fetch('/api/moderate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ image: dataUrl })
            });
            const json = await res.json();
            console.log(json);
            if (json.error) {
              console.error('API error', json);
            } else {
              setNudity(!!json.nudity);
              setLastLabels(json.confidence || json.rawLabels || []);
            }
          } catch (err) {
            console.error(err);
            setError(String(err));
          } finally {
            setStatus('streaming');
          }
        }

        // capture immediately then every interval
        captureAndCheck();
        intervalRef.current = setInterval(captureAndCheck, CAPTURE_INTERVAL);
      } catch (err) {
        console.error('Camera start error', err);
        setError('Camera permission denied or no camera found.');
        setStatus('blocked');
      }
    }

    startCamera();

    return () => {
      mounted = false;
      // stop interval
      if (intervalRef.current) clearInterval(intervalRef.current);
      // stop tracks
      const stream = videoRef.current?.srcObject;
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl space-y-4">
        <h1 className="text-2xl font-semibold">Live Moderation — Rekognition demo</h1>

        <div className="relative bg-black rounded-lg overflow-hidden">
          {/* Video (blur when nudity detected) */}
          <video
            ref={videoRef}
            className={`w-full h-auto block transform transition-all duration-300 ${nudity ? 'filter blur-md scale-105' : ''}`}
            playsInline
            muted
            autoPlay
          />

          {/* overlay when blurred */}
          {nudity && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-black/60 text-white px-4 py-2 rounded">
                Explicit content detected — video blurred
              </div>
            </div>
          )}
        </div>

        {/* Hidden canvas for captures */}
        <canvas ref={canvasRef} className="hidden" />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="text-sm text-gray-600">Status: <span className="font-medium text-gray-800">{status}</span></div>
            <div className="text-sm text-gray-600">Nudity detected: <span className={`font-medium ${nudity ? 'text-red-600' : 'text-green-600'}`}>{nudity ? 'YES' : 'NO'}</span></div>
            {error && <div className="text-sm text-red-600">Error: {error}</div>}
          </div>

          <div className="text-sm text-gray-700">
            <div>Last labels (confidence):</div>
            <ul className="mt-2">
              {lastLabels && lastLabels.length ? (
                lastLabels.map((l, i) => (
                  <li key={i} className="text-xs">
                    {l.Name ?? l.name} — {(l.Confidence ?? l.confidence ?? 0).toFixed(1)}%
                  </li>
                ))
              ) : (
                <li className="text-xs text-gray-400">None</li>
              )}
            </ul>
          </div>
        </div>

        <div className="text-xs text-gray-500">
          Note: Frames are sent to your server which calls Amazon Rekognition. Keep an eye on cost (calls per minute).
        </div>
      </div>
    </main>
  );
}
