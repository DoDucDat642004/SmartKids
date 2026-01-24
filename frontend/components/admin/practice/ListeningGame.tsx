// "use client";
// import { useState, useRef } from "react";
// import { Volume2 } from "lucide-react";

// export default function ListeningGame({ question, onAnswer }: any) {
//   const audioRef = useRef<HTMLAudioElement>(null);

//   const playAudio = () => {
//     if (audioRef.current) {
//       audioRef.current.currentTime = 0;
//       audioRef.current.play();
//     }
//   };

//   return (
//     <div className="flex flex-col items-center">
//       {/* Nút Nghe Loa */}
//       <button
//         onClick={playAudio}
//         className="w-32 h-32 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-600 transition active:scale-95 mb-8"
//       >
//         <Volume2 size={48} />
//         <audio ref={audioRef} src={question.mediaUrl} />
//       </button>
//       <p className="text-gray-500 mb-6 text-sm">Nhấn vào loa để nghe câu hỏi</p>

//       {/* Đáp án (Tương tự Quiz) */}
//       <div className="grid grid-cols-1 w-full gap-3">
//         {question.options.map((opt: string, idx: number) => (
//           <button
//             key={idx}
//             onClick={() => onAnswer(opt)}
//             className="p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-400 font-bold text-slate-700"
//           >
//             {opt}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }
