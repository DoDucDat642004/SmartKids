// "use client";
// import { useState, useEffect } from "react";
// import { Check, X } from "lucide-react";

// export default function MatchingGame({ data, onFinish }: any) {
//   // data ở đây là 1 câu hỏi chứa mảng pairs: [{left: 'Cat', right: 'img_url'}, ...]
//   // Để game hay hơn, thường ta gộp nhiều câu hỏi lại hoặc lấy pairs của câu hiện tại

//   const [pairs, setPairs] = useState<any[]>([]);
//   const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
//   const [selectedRight, setSelectedRight] = useState<number | null>(null);
//   const [matched, setMatched] = useState<number[]>([]); // Lưu index đã nối đúng

//   useEffect(() => {
//     if (data) {
//       // Flat data để render 2 cột
//       // Ở đây demo lấy câu đầu tiên để chơi nối
//       setPairs(data[0].pairs || []);
//     }
//   }, [data]);

//   const handleLeftClick = (idx: number) => {
//     if (matched.includes(idx)) return;
//     setSelectedLeft(idx);
//     checkMatch(idx, selectedRight);
//   };

//   const handleRightClick = (idx: number) => {
//     if (matched.includes(idx)) return;
//     setSelectedRight(idx);
//     checkMatch(selectedLeft, idx);
//   };

//   const checkMatch = (left: number | null, right: number | null) => {
//     if (left !== null && right !== null) {
//       // Logic kiểm tra: Ở đây giả sử index trái phải khớp nhau là đúng
//       // Thực tế nên dùng ID
//       if (left === right) {
//         setMatched((prev) => [...prev, left]);
//         setSelectedLeft(null);
//         setSelectedRight(null);
//         // Âm thanh đúng
//         if (matched.length + 1 === pairs.length) onFinish(100); // Thắng
//       } else {
//         // Sai: Reset sau 500ms
//         setTimeout(() => {
//           setSelectedLeft(null);
//           setSelectedRight(null);
//         }, 500);
//       }
//     }
//   };

//   return (
//     <div className="flex justify-between gap-8 p-4">
//       {/* Cột Trái (Text) */}
//       <div className="flex flex-col gap-4 w-1/2">
//         {pairs.map((p, idx) => (
//           <button
//             key={`L-${idx}`}
//             onClick={() => handleLeftClick(idx)}
//             className={`p-6 rounded-xl font-bold text-lg border-2 transition-all
//               ${matched.includes(idx) ? "opacity-0 pointer-events-none" : ""}
//               ${
//                 selectedLeft === idx
//                   ? "bg-blue-200 border-blue-500"
//                   : "bg-white border-gray-200"
//               }
//             `}
//           >
//             {p.left}
//           </button>
//         ))}
//       </div>

//       {/* Cột Phải (Ảnh/Nghĩa) */}
//       <div className="flex flex-col gap-4 w-1/2">
//         {pairs.map((p, idx) => (
//           <button
//             key={`R-${idx}`}
//             onClick={() => handleRightClick(idx)}
//             className={`p-6 rounded-xl font-bold text-lg border-2 transition-all flex items-center justify-center
//               ${matched.includes(idx) ? "opacity-0 pointer-events-none" : ""}
//               ${
//                 selectedRight === idx
//                   ? "bg-purple-200 border-purple-500"
//                   : "bg-white border-gray-200"
//               }
//             `}
//           >
//             {/* Nếu là ảnh thì render img */}
//             {p.right.startsWith("http") ? (
//               <img src={p.right} className="h-12 w-12 object-contain" />
//             ) : (
//               p.right
//             )}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }
