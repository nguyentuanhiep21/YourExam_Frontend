"use client";

import { Download, ThumbsUp, FileText } from "lucide-react";
import { ExamMockData } from "../types/exam.types";
import Link from "next/link";
import { useState, useEffect } from "react";
import { upvoteGeneratedExam, fetchExamForDownload, incrementDownloadCount } from "../api/exam.actions";
import { createExamApi } from "../api/createExam.api";
import { useToast } from "@/components/ui/alerts/toast-context";
import { Loader2 } from "lucide-react";

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
  const toast = useToast();
  const [isUpvoting, setIsUpvoting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [optimisticUpvoteCount, setOptimisticUpvoteCount] = useState(exam.upvotes);
  const [optimisticDownloadCount, setOptimisticDownloadCount] = useState(exam.downloads);

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

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isDownloading) return;

    try {
      setIsDownloading(true);
      const numericId = parseInt(exam.id, 10);
      if (isNaN(numericId)) throw new Error("ID không hợp lệ");

      const fullExam = await fetchExamForDownload(numericId);
      
      let defaultFileName = "DeThi";
      if (fullExam.Subject && fullExam.GradeLevel) {
        const subject = fullExam.Subject.replace(/\s+/g, '');
        const grade = fullExam.GradeLevel;
        defaultFileName = `DeThi${subject}Lop${grade}`;
      }

      const payload = {
        fileName: defaultFileName,
        exercises: fullExam.Questions?.map((q: any) => ({
          content: q.QuestionContent,
          choices: q.QuestionFormat === 0 ? q.MultipleChoiceOptions || [] : [],
          correctAnswer: q.CorrectAnswer,
          exerciseType: 0
        })) || []
      };

      const blob = await createExamApi.exportToDocx(payload);
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${defaultFileName}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      
      const result = await incrementDownloadCount(numericId);
      if (result.success && result.newCount) {
        setOptimisticDownloadCount(result.newCount);
      }
      
      toast.success("Tải đề thi thành công!", "Thành công");
    } catch (error: any) {
      console.error("Lỗi khi tải xuống:", error);
      if (error.message?.includes("đăng nhập") || error.message?.includes("quyền")) {
        toast.warning("Vui lòng đăng nhập để tải đề thi.", "Yêu cầu đăng nhập");
      } else {
        toast.error("Đã xảy ra lỗi khi tải đề thi.", "Lỗi tải xuống");
      }
    } finally {
      setIsDownloading(false);
    }
  };

  // Determine icon, gradient, and tag color based on subject
  let coverImage = "";
  let coverGradient = "";
  let tagTextColor = "";

  if (exam.subject.includes("Toán") || exam.subject.includes("Math")) {
    coverImage = "/images/icon-math.png";
    coverGradient = "bg-primary-light/50"; // Soft primary background
    tagTextColor = "text-primary";
  } else if (exam.subject.includes("Việt") || exam.subject.includes("Viet")) {
    coverImage = "/images/icon-vietnamese.png";
    coverGradient = "bg-orange-50/80"; // Soft accent background
    tagTextColor = "text-accent";
  } else {
    // Default fallback
    coverImage = "/images/icon-math.png";
    coverGradient = "bg-slate-50";
    tagTextColor = "text-slate-600";
  }

  return (
    <Link href={`/exam/${exam.id}`} className="block group min-w-[280px] w-[300px] sm:w-[320px] bg-white/90 backdrop-blur-sm rounded-[2rem] border border-slate-200/60 p-2 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.15)] hover:border-primary/40 hover:-translate-y-2 transition-all duration-500 cursor-pointer flex flex-col h-full snap-start overflow-hidden">

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
          <h3 className="text-xl font-bold font-heading text-slate-900 leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {exam.title}
          </h3>
          <p className="text-sm text-slate-500 mt-2 font-medium font-body flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
            {exam.school}
          </p>
        </div>

        {/* Footer: Stats */}
        <div className="flex items-center justify-between mt-8 gap-2 font-body">
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

          <button 
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-2 bg-primary/5 px-2 py-2 rounded-[1.25rem] border border-primary/10 hover:bg-primary/10 transition-colors flex-1 overflow-hidden disabled:opacity-50 cursor-pointer z-10"
          >
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-primary shadow-sm shrink-0">
              {isDownloading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
            </div>
            <div className="min-w-0 text-left">
              <div className="text-[9px] font-bold text-primary/70 uppercase tracking-wider whitespace-nowrap truncate">Tải về</div>
              <div className="text-sm font-extrabold text-slate-800 flex items-center gap-1">
                {formatNumber(optimisticDownloadCount)} <span className="text-primary text-[10px]">↓</span>
              </div>
            </div>
          </button>
        </div>
      </div>
    </Link>
  );
}
