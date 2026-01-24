"use client";

import { useState, useEffect } from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCcw,
} from "lucide-react";

export default function ExamRoom({
  examData,
  onComplete,
}: {
  examData: any;
  onComplete?: (score: number) => void;
}) {
  // State
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(examData.durationMinutes * 60); // Giây
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Timer Countdown
  useEffect(() => {
    if (isSubmitted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(); // Auto submit khi hết giờ
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted]);

  // Handle chọn đáp án
  const handleSelect = (questionId: string, optionIndex: number) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  // Handle Nộp bài & Chấm điểm
  const handleSubmit = () => {
    let totalScore = 0;
    const maxScore = examData.questions.reduce(
      (sum: number, q: any) => sum + (q.point || 10),
      0,
    );

    examData.questions.forEach((q: any) => {
      if (answers[q.id] === q.correctAnswer) {
        totalScore += q.point || 10;
      }
    });

    const finalScore = Math.round((totalScore / maxScore) * 100); // Quy ra thang 100
    setScore(finalScore);
    setIsSubmitted(true);
    if (onComplete) onComplete(finalScore);
  };

  // Format giây -> MM:SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* HEADER: INFO & TIMER (Sticky) */}
      <div className="sticky top-4 z-20 bg-white/90 backdrop-blur-md border border-slate-200 shadow-lg rounded-2xl p-4 mb-8 flex justify-between items-center">
        <div>
          <h1 className="font-black text-slate-800 text-lg">
            {examData.title}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Tổng câu hỏi: {examData.questions.length}
          </p>
        </div>

        {!isSubmitted ? (
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold text-xl border-2 ${timeLeft < 60 ? "bg-red-50 text-red-600 border-red-200 animate-pulse" : "bg-blue-50 text-blue-600 border-blue-200"}`}
          >
            <Clock size={20} /> {formatTime(timeLeft)}
          </div>
        ) : (
          <div
            className={`px-5 py-2 rounded-xl font-bold text-white ${score >= examData.passingScore ? "bg-green-500" : "bg-red-500"}`}
          >
            {score} / 100 Điểm
          </div>
        )}
      </div>

      {/* QUESTION LIST */}
      <div className="space-y-6 pb-20">
        {examData.questions.map((q: any, idx: number) => {
          // Logic hiển thị màu sắc khi đã nộp bài
          const isCorrect = q.correctAnswer === answers[q.id];
          const isUserSelected = answers[q.id] !== undefined;

          let cardBorder = "border-slate-200";
          if (isSubmitted) {
            cardBorder = isCorrect
              ? "border-green-500 ring-1 ring-green-500"
              : isUserSelected
                ? "border-red-500 ring-1 ring-red-500"
                : "border-orange-300";
          }

          return (
            <div
              key={q.id}
              className={`bg-white p-6 rounded-2xl border-2 shadow-sm transition-all ${cardBorder}`}
            >
              <div className="flex gap-3 mb-4">
                <span className="bg-slate-100 text-slate-600 font-bold px-2.5 py-1 rounded text-sm h-fit">
                  Câu {idx + 1}
                </span>
                <h3 className="font-bold text-slate-800 text-lg">{q.text}</h3>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {q.options.map((opt: string, oIdx: number) => {
                  const isSelected = answers[q.id] === oIdx;
                  const isThisCorrect = q.correctAnswer === oIdx;

                  // Style logic cho từng option
                  let optionStyle =
                    "bg-white border-slate-200 hover:border-blue-400";
                  if (isSubmitted) {
                    if (isThisCorrect)
                      optionStyle =
                        "bg-green-100 border-green-500 text-green-700 font-bold";
                    else if (isSelected && !isThisCorrect)
                      optionStyle = "bg-red-50 border-red-500 text-red-600";
                    else
                      optionStyle = "bg-slate-50 border-slate-100 opacity-60";
                  } else {
                    if (isSelected)
                      optionStyle =
                        "bg-blue-50 border-blue-500 text-blue-700 font-bold ring-1 ring-blue-500";
                  }

                  return (
                    <button
                      key={oIdx}
                      disabled={isSubmitted}
                      onClick={() => handleSelect(q.id, oIdx)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between ${optionStyle}`}
                    >
                      <span>{opt}</span>
                      {isSubmitted && isThisCorrect && (
                        <CheckCircle size={20} />
                      )}
                      {isSubmitted && isSelected && !isThisCorrect && (
                        <XCircle size={20} />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Giải thích (Hiện sau khi nộp) */}
              {isSubmitted && !isCorrect && (
                <div className="mt-4 p-3 bg-orange-50 text-orange-700 text-sm rounded-lg flex items-center gap-2">
                  <AlertCircle size={16} /> Đáp án đúng là:{" "}
                  <strong>{q.options[q.correctAnswer]}</strong>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* FOOTER ACTION */}
      {!isSubmitted && (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 z-30">
          <div className="max-w-3xl mx-auto flex justify-between items-center">
            <span className="text-sm text-slate-500">
              Đã làm:{" "}
              <strong>
                {Object.keys(answers).length}/{examData.questions.length}
              </strong>{" "}
              câu
            </span>
            <button
              onClick={() => {
                if (confirm("Bạn có chắc chắn muốn nộp bài?")) handleSubmit();
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-blue-200 transition transform active:scale-95"
            >
              Nộp Bài
            </button>
          </div>
        </div>
      )}

      {/* RESULT MODAL (Sau khi nộp) */}
      {isSubmitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95">
            <div className="text-6xl mb-4">
              {score >= examData.passingScore ? "🏆" : "💪"}
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">
              {score >= examData.passingScore
                ? "Xuất Sắc!"
                : "Cố gắng lần sau nhé!"}
            </h2>
            <p className="text-slate-500 mb-6">
              Bạn đạt được{" "}
              <span
                className={`font-bold text-xl ${score >= 80 ? "text-green-600" : "text-orange-500"}`}
              >
                {score} điểm
              </span>
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition"
              >
                Làm lại
              </button>
              <button
                onClick={() => alert("Quay về trang khóa học")}
                className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition"
              >
                Hoàn thành
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
