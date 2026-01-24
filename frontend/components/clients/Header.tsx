// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import { PlayCircle, Star, CheckCircle2 } from "lucide-react";
// import { motion } from "framer-motion";

// export default function Header() {
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: { staggerChildren: 0.15, delayChildren: 0.2 },
//     },
//   };

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: { type: "spring", stiffness: 50 },
//     },
//   };

//   return (
//     <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-gradient-to-br from-green-50 to-emerald-50">
//       {/* 1. BACKGROUND IMAGE - Sử dụng Next/Image với fill cho tối ưu */}
//       <motion.div
//         initial={{ scale: 1.1, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         transition={{ duration: 1.5, ease: "easeOut" }}
//         className="absolute inset-0 z-0"
//       >
//         <Image
//           src="/images/bg-practice.png"
//           alt=""
//           fill
//           sizes="100vw"
//           className="object-cover"
//           priority
//         />
//         {/* Fallback nếu ảnh lỗi: Màu gradient */}
//         <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-green-500/30" />
//       </motion.div>

//       {/* 2. OVERLAY - Tăng blur cho đẹp hơn */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 1.5 }}
//         className="absolute inset-0 z-10 bg-gradient-to-b from-white/40 via-white/20 to-emerald-50/95 backdrop-blur-sm"
//       />

//       {/* 3. MAIN CONTENT */}
//       <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center py-12">
//         {/* CỘT TRÁI */}
//         <motion.div
//           className="flex flex-col gap-8 items-center lg:items-start text-center lg:text-left max-w-lg lg:max-w-none"
//           variants={containerVariants}
//           initial="hidden"
//           animate="visible"
//         >
//           {/* Badge */}
//           <motion.div variants={itemVariants}>
//             <div className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-sm text-emerald-800 px-6 py-3 rounded-2xl text-sm font-bold border border-emerald-200/50 shadow-xl">
//               <span className="text-xl">🏆</span>
//               <span>Giáo trình chuẩn Cambridge quốc tế</span>
//             </div>
//           </motion.div>

//           {/* Title */}
//           <motion.h1
//             variants={itemVariants}
//             className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight text-gray-900 tracking-tight bg-gradient-to-r from-gray-900 to-emerald-900 bg-clip-text text-transparent"
//           >
//             Xây dựng nền tảng <br />
//             <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent relative inline-block">
//               Tiếng Anh Vững Chắc
//               <motion.span
//                 initial={{ width: 0 }}
//                 animate={{ width: "100%" }}
//                 transition={{ delay: 0.8, duration: 0.8 }}
//                 className="absolute -bottom-1 left-0 h-2 bg-gradient-to-r from-yellow-400 to-orange-400 blur-sm -z-10 rounded"
//               />
//             </span>
//           </motion.h1>

//           {/* Description */}
//           <motion.p
//             variants={itemVariants}
//             className="text-xl md:text-2xl text-gray-600 font-semibold leading-relaxed max-w-lg mx-auto lg:mx-0"
//           >
//             Giải pháp giáo dục toàn diện dành cho trẻ 6-8 tuổi. Kết hợp công
//             nghệ AI và phương pháp Gamification giúp bé phát triển tư duy ngôn
//             ngữ tự nhiên.
//           </motion.p>

//           {/* Features */}
//           <motion.div
//             variants={itemVariants}
//             className="flex flex-wrap justify-center lg:justify-start gap-6"
//           >
//             <div className="flex items-center gap-3 p-3 bg-emerald-50/50 rounded-2xl font-bold text-emerald-800 shadow-sm">
//               <CheckCircle2 size={24} className="text-emerald-600 shrink-0" />
//               <span className="text-lg">Lộ trình cá nhân hóa</span>
//             </div>
//             <div className="flex items-center gap-3 p-3 bg-emerald-50/50 rounded-2xl font-bold text-emerald-800 shadow-sm">
//               <CheckCircle2 size={24} className="text-emerald-600 shrink-0" />
//               <span className="text-lg">Giáo viên bản ngữ</span>
//             </div>
//           </motion.div>

//           {/* Buttons */}
//           <motion.div
//             variants={itemVariants}
//             className="flex flex-col sm:flex-row flex-wrap justify-center lg:justify-start gap-4 mt-4"
//           >
//             <Link href="/register">
//               <motion.button
//                 whileHover={{ scale: 1.05, y: -2 }}
//                 whileTap={{ scale: 0.98 }}
//                 className="group relative bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white px-10 py-5 rounded-3xl font-bold text-xl shadow-2xl shadow-emerald-500/40 transition-all duration-300 overflow-hidden"
//               >
//                 <span>Đăng ký học thử ngay</span>
//                 <div className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-100 transition-transform origin-center rounded-3xl" />
//               </motion.button>
//             </Link>

//             <Link href="/about">
//               <motion.button
//                 whileHover={{ scale: 1.05, y: -2, backgroundColor: "#f8fafc" }}
//                 whileTap={{ scale: 0.98 }}
//                 className="group flex items-center justify-center gap-4 bg-white/80 backdrop-blur-sm text-gray-800 border-2 border-gray-200 hover:border-emerald-300 px-10 py-5 rounded-3xl font-bold text-lg shadow-2xl hover:shadow-emerald-200/50 transition-all duration-300"
//               >
//                 <PlayCircle
//                   size={24}
//                   className="text-gray-500 group-hover:text-emerald-600 transition-all duration-300 shrink-0"
//                 />
//                 <span>Video giới thiệu</span>
//               </motion.button>
//             </Link>
//           </motion.div>

//           {/* Social Proof */}
//           <motion.div
//             variants={itemVariants}
//             className="mt-8 flex items-center gap-6 bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white/60 shadow-2xl"
//           >
//             <div className="flex -space-x-4">
//               {[1, 2, 3, 4].map((i) => (
//                 <div
//                   key={i}
//                   className="w-14 h-14 rounded-full border-4 border-white/80 shadow-lg overflow-hidden ring-2 ring-white/50"
//                 >
//                   <Image
//                     src={`https://i.pravatar.cc/100?img=${i + 10}`}
//                     alt="User"
//                     fill
//                     className="object-cover"
//                     sizes="56px"
//                   />
//                 </div>
//               ))}
//             </div>
//             <div className="flex flex-col text-left">
//               <div className="flex gap-1 text-amber-400 mb-1">
//                 {[1, 2, 3, 4, 5].map((s) => (
//                   <Star key={s} size={18} fill="currentColor" strokeWidth={0} />
//                 ))}
//               </div>
//               <p className="text-lg font-bold text-gray-800">
//                 Tin dùng bởi{" "}
//                 <span className="text-2xl text-emerald-700">12,000+</span> phụ
//                 huynh
//               </p>
//             </div>
//           </motion.div>
//         </motion.div>

//         {/* CỘT PHẢI */}
//         <motion.div
//           initial={{ opacity: 0, x: 50 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.8, delay: 0.2 }}
//           className="relative flex justify-center [perspective:1200px] mt-12 lg:mt-0"
//         >
//           <motion.div
//             initial={{ rotateY: -15, rotateX: 5 }}
//             animate={{ rotateY: -5, rotateX: 2 }}
//             whileHover={{
//               rotateY: 0,
//               rotateX: 0,
//               scale: 1.02,
//               transition: { duration: 0.4 },
//             }}
//             className="relative group cursor-pointer"
//           >
//             {/* Main Image */}
//             <div className="relative bg-white/80 backdrop-blur-sm p-6 lg:p-8 rounded-3xl shadow-2xl shadow-emerald-900/20 border border-white/50">
//               <Image
//                 src="/images/bg-student-learning.png"
//                 alt="Bé học tiếng Anh online"
//                 width={650}
//                 height={550}
//                 priority
//                 sizes="(max-width: 768px) 100vw, 50vw"
//                 className="rounded-3xl w-full h-auto object-cover group-hover:brightness-105 transition-all duration-500"
//               />
//             </div>

//             {/* Floating Card */}
//             <motion.div
//               initial={{ y: 10, opacity: 0 }}
//               animate={{ y: [0, -12, 0] }}
//               transition={{
//                 delay: 0.5,
//                 repeat: Infinity,
//                 duration: 2.5,
//                 ease: "easeInOut",
//               }}
//               className="absolute -bottom-8 lg:-bottom-10 -left-8 lg:-left-10 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-2xl shadow-emerald-500/30 border border-white/70 w-64"
//             >
//               <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg mb-3">
//                 🎉
//               </div>
//               <p className="font-black text-xl text-gray-900 mb-1 leading-tight">
//                 Hoàn thành bài học!
//               </p>
//               <p className="text-2xl font-bold text-emerald-600">
//                 +150 Điểm thưởng
//               </p>
//             </motion.div>
//           </motion.div>
//         </motion.div>
//       </div>

//       {/* Wave Decoration - Tăng z-index */}
//       <motion.div
//         initial={{ y: 100, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ delay: 1, duration: 1.2 }}
//         className="absolute bottom-0 left-0 w-full z-30 pointer-events-none"
//       >
//         <svg
//           viewBox="0 0 1440 120"
//           fill="none"
//           xmlns="http://www.w3.org/2000/svg"
//           preserveAspectRatio="none"
//           className="w-full h-[120px] block text-emerald-100 lg:text-emerald-200"
//         >
//           <path
//             d="M0 60C240 120 480 0 720 60C960 120 1200 0 1440 60V120H0V60Z"
//             fill="currentColor"
//           />
//         </svg>
//       </motion.div>
//     </section>
//   );
// }
