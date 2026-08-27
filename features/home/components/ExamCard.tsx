"use client";

import { Download, ThumbsUp, FileText } from "lucide-react";
import { ExamMockData } from "../types/home.types";
import Link from "next/link";
import { useState, useEffect } from "react";
import { upvoteGeneratedExam } from "../../exam/api/exam.actions";
// Helper function to format numbers (e.g. 12000 -> 12K)
function formatNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k";
  }
  return num.toString();
}

interface ExamCardProps {
  exam: ExamMockData;
}

export function ExamCard({ exam }: ExamCardProps) {
  const [isUpvoting, setIsUpvoting] = useState(false);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [optimisticUpvoteCount, setOptimisticUpvoteCount] = useState(exam.upvotes);

  useEffect(() => {
    // Check if user has upvoted this exam in current browser session
    const upvoted = localStorage.getItem(`upvoted_exam_${exam.id}`);
    if (upvoted === "true") {
      setHasUpvoted(true);
    }
  }, [exam.id]);

  const handleUpvote = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isUpvoting) return;

    const willUpvote = !hasUpvoted;

    try {
      setIsUpvoting(true);
      setHasUpvoted(willUpvote);
      setOptimisticUpvoteCount((prev: number) => prev + (willUpvote ? 1 : -1));

      if (willUpvote) {
        localStorage.setItem(`upvoted_exam_${exam.id}`, "true");
      } else {
        localStorage.removeItem(`upvoted_exam_${exam.id}`);
      }

      // Only call real API if the ID is numeric (real data from Supabase)
      const numericId = parseInt(exam.id, 10);
      if (!isNaN(numericId)) {
        await upvoteGeneratedExam(numericId, willUpvote);
      }
    } catch (error) {
      console.error("Lỗi khi upvote:", error);
      // Rollback
      setHasUpvoted(!willUpvote);
      setOptimisticUpvoteCount((prev: number) => prev + (willUpvote ? -1 : 1));
      if (!willUpvote) {
        localStorage.setItem(`upvoted_exam_${exam.id}`, "true");
      } else {
        localStorage.removeItem(`upvoted_exam_${exam.id}`);
      }
    } finally {
      setIsUpvoting(false);
    }
  };

  // Determine icon, gradient, and tag color based on subject
  let coverImage = "";
  let coverGradient = "";
  let tagTextColor = "";

  if (exam.subject.includes("Toán") || exam.subject.includes("Math")) {
    coverImage = "/images/icon-math.png";
    coverGradient = "bg-gradient-to-br from-[#EEF2FF] to-[#E0E7FF]"; // Soft indigo/blue gradient
    tagTextColor = "text-indigo-700";
  } else if (exam.subject.includes("Việt") || exam.subject.includes("Viet")) {
    coverImage = "/images/icon-vietnamese.png";
    coverGradient = "bg-gradient-to-br from-orange-50 to-amber-100";
    tagTextColor = "text-amber-700";
  } else {
    // Default fallback
    coverImage = "/images/icon-math.png";
    coverGradient = "bg-gradient-to-br from-gray-50 to-gray-100";
    tagTextColor = "text-gray-700";
  }

  return (
    <Link href={`/exam/${exam.id}`} className="block group min-w-[280px] w-[300px] sm:w-[320px] bg-white rounded-[2rem] border border-gray-100/80 p-2 shadow-sm hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12)] hover:-translate-y-2 transition-all duration-500 cursor-pointer flex flex-col h-full snap-start overflow-hidden">

      {/* Cover Image Area */}
      <div className={`relative h-48 w-full rounded-[1.5rem] overflow-hidden mb-5 p-4 ${coverGradient}`}>
        {/* The icon image on the right */}
        <div
          className="absolute inset-y-4 right-4 w-[60%] bg-right bg-contain bg-no-repeat scale-90 group-hover:scale-105 group-hover:-translate-x-2 transition-transform duration-700 drop-shadow-sm origin-right"
          style={{ backgroundImage: `url('${coverImage}')` }}
        />

        {/* Top-left tag on the cover */}
        <div className="absolute top-4 left-4 flex items-center">
          <div className={`bg-white/90 backdrop-blur-md border border-white/80 rounded-xl px-4 py-2 shadow-sm text-xs font-bold tracking-wide ${tagTextColor}`}>
            {exam.subject}
          </div>
        </div>
      </div>

      <div className="px-4 pb-4 flex flex-col flex-1">
        {/* Title */}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors">
            {exam.title}
          </h3>
          <p className="text-sm text-gray-500 mt-2 font-medium flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-300"></span>
            {exam.school}
          </p>
        </div>

        {/* Footer: Stats */}
        <div className="flex items-center justify-between mt-8 gap-2">
          <button
            onClick={handleUpvote}
            disabled={isUpvoting}
            className={`flex items-center gap-2 px-2 py-2 rounded-[1.25rem] border transition-colors flex-1 overflow-hidden disabled:opacity-50 cursor-pointer z-10 ${hasUpvoted
                ? 'bg-emerald-500/10 border-emerald-500 hover:bg-emerald-500/20'
                : 'bg-emerald-50/50 border-emerald-100/50 hover:bg-emerald-50'
              }`}
          >
            <div className={`w-9 h-9 rounded-full flex items-center justify-center shadow-sm shrink-0 transition-colors ${hasUpvoted ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-600'
              }`}>
              <ThumbsUp className={`w-4 h-4 ${hasUpvoted ? 'fill-current' : ''} ${isUpvoting ? 'animate-bounce' : ''}`} />
            </div>
            <div className="min-w-0 text-left">
              <div className={`text-[9px] font-bold uppercase tracking-wider whitespace-nowrap truncate ${hasUpvoted ? 'text-emerald-700' : 'text-emerald-600/70'}`}>Hữu ích</div>
              <div className="text-sm font-extrabold text-emerald-900 flex items-center gap-1">
                {formatNumber(optimisticUpvoteCount)}
              </div>
            </div>
          </button>

          <div className="flex items-center gap-2 bg-indigo-50/50 px-2 py-2 rounded-[1.25rem] border border-indigo-100/50 group-hover:bg-indigo-50 transition-colors flex-1 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
              <Download className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[9px] font-bold text-indigo-600/70 uppercase tracking-wider whitespace-nowrap truncate">Tải về</div>
              <div className="text-sm font-extrabold text-indigo-900 flex items-center gap-1">
                {formatNumber(exam.downloads)} <span className="text-indigo-500 text-[10px]">↓</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
