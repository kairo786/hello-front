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

