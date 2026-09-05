"use client";

import { useState, useEffect } from "react";
import { GeneratedExam, UpdateGeneratedExamPayload, UpdateGeneratedExamQuestionPayload, GeneratedExamQuestion, QuestionType } from "../types/exam.types";
import QuestionList from "./QuestionList";
import ExamTimer from "./ExamTimer";
import ExamResultSummary from "./ExamResultSummary";
import ConfirmExitDialog from "./ConfirmExitDialog";
import { Clock, BookOpen, BarChart, ThumbsUp, Download, Award, ArrowLeft, Pencil, Save, X, Loader2, Globe, Lock, ChevronDown, Play } from "lucide-react";
import Link from "next/link";
import { updateGeneratedExam, upvoteGeneratedExam } from "../api/exam.actions";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/alerts/toast-context";

interface ExamViewerProps {
  exam: GeneratedExam;
  currentUserId?: string | null;
}

type ViewMode = 'view' | 'take' | 'result' | 'review';

export default function ExamViewer({ exam, currentUserId }: ExamViewerProps) {
  const router = useRouter();
  const toast = useToast();
  const isAuthor = currentUserId === exam.AuthorId;
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpvoting, setIsUpvoting] = useState(false);
  const [optimisticUpvoteCount, setOptimisticUpvoteCount] = useState(exam.UpvoteCount);
  const [hasUpvoted, setHasUpvoted] = useState(exam.hasUpvoted || false);
  
  const [isDownloading, setIsDownloading] = useState(false);
  const [optimisticDownloadCount, setOptimisticDownloadCount] = useState(exam.DownloadCount);
  const [hasDownloaded, setHasDownloaded] = useState(exam.hasDownloaded || false);
  
  // Local state for exam metadata
  const [title, setTitle] = useState(exam.Title);
  const [duration, setDuration] = useState(exam.DurationMinutes);
  const [difficulty, setDifficulty] = useState(exam.Difficulty);
  const [totalScore, setTotalScore] = useState(exam.TotalScore);
  const [isPublic, setIsPublic] = useState(exam.IsPublic);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const authorName = (Array.isArray(exam.Author) ? exam.Author[0]?.FullName : (exam.Author as any)?.FullName) || "Khuyết danh";
  
  // Local state for questions
  const [editedQuestions, setEditedQuestions] = useState<Record<number, Partial<GeneratedExamQuestion>>>({});

  // States for Taking Exam
  const [viewMode, setViewMode] = useState<ViewMode>('view');
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [startTime, setStartTime] = useState<number>(0);
  const [timeTaken, setTimeTaken] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const handleQuestionChange = (id: number, updates: Partial<GeneratedExamQuestion>) => {
    setEditedQuestions((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || {}),
        ...updates
      },
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const examPayload: UpdateGeneratedExamPayload = {};
      if (title !== exam.Title) examPayload.Title = title;
      if (duration !== exam.DurationMinutes) examPayload.DurationMinutes = duration;
      if (difficulty !== exam.Difficulty) examPayload.Difficulty = difficulty;
      if (totalScore !== exam.TotalScore) examPayload.TotalScore = totalScore;
      if (isPublic !== exam.IsPublic) examPayload.IsPublic = isPublic;
      
      const questionsPayload: UpdateGeneratedExamQuestionPayload[] = Object.entries(editedQuestions).map(([idStr, updates]) => ({
        Id: parseInt(idStr, 10),
        QuestionContent: updates.QuestionContent,
        CorrectAnswer: updates.CorrectAnswer,
        MultipleChoiceOptions: updates.MultipleChoiceOptions,
      }));

      await updateGeneratedExam(exam.Id, examPayload, questionsPayload);
      
      setIsEditing(false);
      setEditedQuestions({});
      toast.success("Đã lưu thay đổi đề thi", "Thành công");
    } catch (error: any) {
      toast.error(error.message || "Đã xảy ra lỗi khi lưu đề thi.", "Lỗi lưu đề thi");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setTitle(exam.Title);
    setDuration(exam.DurationMinutes);
    setDifficulty(exam.Difficulty);
    setTotalScore(exam.TotalScore);
    setIsPublic(exam.IsPublic);
    setEditedQuestions({});
    setIsEditing(false);
  };

  const handleUpvote = async () => {
    if (isUpvoting) return;
    const willUpvote = !hasUpvoted;
    try {
      setIsUpvoting(true);
      setHasUpvoted(willUpvote);
      setOptimisticUpvoteCount(prev => prev + (willUpvote ? 1 : -1));
      await upvoteGeneratedExam(exam.Id, willUpvote);
    } catch (error) {
      console.error("Lỗi khi upvote:", error);
      setHasUpvoted(!willUpvote);
      setOptimisticUpvoteCount(prev => prev + (willUpvote ? -1 : 1));
      toast.error("Đã xảy ra lỗi khi cập nhật upvote.", "Lỗi upvote");
    } finally {
      setIsUpvoting(false);
    }
  };

  const handleDownload = async () => {
    if (isDownloading) return;
    try {
      setIsDownloading(true);
      const subject = exam.Subject?.replace(/\s+/g, '') || "Chung";
      const grade = exam.GradeLevel || "";
      const defaultFileName = `DeThi${subject}${grade}`;

      const payload = {
        fileName: defaultFileName,
        exercises: (exam.Questions || []).map(q => ({
          content: q.QuestionContent,
          choices: q.MultipleChoiceOptions ? JSON.parse(q.MultipleChoiceOptions) : [],
          correctAnswer: q.CorrectAnswer,
          exerciseType: q.QuestionType || 0
        }))
      };

      const { createExamApi } = await import("../api/createExam.api");
      const blob = await createExamApi.exportToDocx(payload);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${defaultFileName}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      if (!hasDownloaded && currentUserId) {
        // Optimistic UI Update
        setHasDownloaded(true);
        setOptimisticDownloadCount(prev => prev + 1);

        const { incrementDownloadCount } = await import("../api/exam.actions");
        const res = await incrementDownloadCount(exam.Id);
        
        if (!res.success) {
          // Rollback if failed
          setHasDownloaded(false);
          setOptimisticDownloadCount(prev => prev - 1);
          console.error("Lỗi khi ghi nhận lượt tải vào DB:", res.message);
        }
      }
    } catch (error: any) {
      console.error("Lỗi khi tải xuống:", error);
      if (error.message?.includes("đăng nhập")) {
        toast.warning("Vui lòng đăng nhập để tải đề thi.", "Yêu cầu đăng nhập");
      } else {
        toast.error("Đã xảy ra lỗi khi tải đề thi.", "Lỗi tải xuống");
      }
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSubmitExam = () => {
    let calculatedScore = 0;
    const totalQ = exam.Questions?.length || 1;
    const scorePerQuestion = (exam.TotalScore || 10) / totalQ;

    exam.Questions?.forEach(q => {
      const uAns = userAnswers[q.Id];
      if (!uAns) return;
      
      if (q.QuestionType === QuestionType.MultipleChoice) {
        if (q.CorrectAnswer?.trim().toUpperCase() === uAns) {
          calculatedScore += scorePerQuestion;
        }
      } else {
        if (q.CorrectAnswer?.trim().toLowerCase() === uAns.trim().toLowerCase()) {
          calculatedScore += scorePerQuestion;
        }
      }
    });

    const initialSeconds = (exam.DurationMinutes || 0) * 60;
    let taken = Math.floor((Date.now() - startTime) / 1000);
    if (taken < 0) taken = 0;
    if (taken > initialSeconds) taken = initialSeconds;

    setTimeTaken(taken);
    setScore(calculatedScore);
    setViewMode('result');
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {viewMode === 'take' ? (
          <button 
            onClick={() => setShowExitConfirm(true)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-rose-600 transition-colors bg-white hover:bg-rose-50 px-4 py-2 rounded-xl shadow-sm border border-gray-100"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </button>
        ) : viewMode === 'result' || viewMode === 'review' ? (
          <button 
            onClick={() => setViewMode('view')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-indigo-600 transition-colors bg-white hover:bg-indigo-50 px-4 py-2 rounded-xl shadow-sm border border-gray-100"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </button>
        ) : (
          <button 
            onClick={() => router.push('/exams')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-indigo-600 transition-colors bg-white hover:bg-indigo-50 px-4 py-2 rounded-xl shadow-sm border border-gray-100"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </button>
        )}

        {isAuthor && viewMode === 'view' && (
          !isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 text-sm font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-5 py-2.5 rounded-xl shadow-sm transition-colors border border-indigo-100"
            >
              <Pencil className="w-4 h-4" />
              Chỉnh sửa đề thi
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button 
                onClick={handleCancel}
                disabled={isSaving}
                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 bg-white hover:bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl shadow-sm transition-colors disabled:opacity-50"
              >
                <X className="w-4 h-4" />
                Hủy
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center gap-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-6 py-2.5 rounded-xl shadow-sm transition-all hover:shadow-md disabled:opacity-70"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          )
        )}
      </div>

      {/* Header Section / Result Section */}
      {viewMode === 'result' || viewMode === 'review' ? (
        <ExamResultSummary 
          score={score}
          totalScore={exam.TotalScore || 10}
          timeTakenSeconds={timeTaken}
          durationSeconds={(exam.DurationMinutes || 0) * 60}
          onReview={() => setViewMode('review')}
          onClose={() => setViewMode('view')}
          isReviewing={viewMode === 'review'}
        />
      ) : viewMode === 'view' ? (
        <div className="relative overflow-hidden bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 sm:p-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-[80px] -mr-32 -mt-32 opacity-70 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-50 rounded-full blur-[80px] -ml-32 -mb-32 opacity-70 pointer-events-none"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center justify-center px-3 py-1 text-xs font-semibold tracking-wide text-indigo-700 bg-indigo-100 rounded-full">
                {exam.Subject}
              </span>
              <span className="inline-flex items-center justify-center px-3 py-1 text-xs font-semibold tracking-wide text-fuchsia-700 bg-fuchsia-100 rounded-full">
                Lớp {exam.GradeLevel}
              </span>
              {isEditing ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold tracking-wide rounded-full border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 ${
                      isPublic 
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100" 
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {isPublic ? <Globe className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                    {isPublic ? 'Công khai' : 'Riêng tư'}
                    <ChevronDown className={`w-3.5 h-3.5 opacity-70 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isDropdownOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40"
                        onClick={() => setIsDropdownOpen(false)}
                      />
                      <div className="absolute top-full left-0 mt-2 w-36 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200 origin-top-left">
                        <button
                          type="button"
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-gray-50 text-emerald-700 font-medium transition-colors"
                          onClick={() => {
                            setIsPublic(true);
                            setIsDropdownOpen(false);
                          }}
                        >
                          <Globe className="w-4 h-4" />
                          Công khai
                        </button>
                        <button
                          type="button"
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-gray-50 text-slate-700 font-medium transition-colors"
                          onClick={() => {
                            setIsPublic(false);
                            setIsDropdownOpen(false);
                          }}
                        >
                          <Lock className="w-4 h-4" />
                          Riêng tư
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold tracking-wide rounded-full border ${
                  isPublic 
                    ? 'text-emerald-700 bg-emerald-50 border-emerald-200' 
                    : 'text-slate-700 bg-slate-50 border-slate-200'
                }`}>
                  {isPublic ? <Globe className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                  {isPublic ? 'Công khai' : 'Riêng tư'}
                </span>
              )}
            </div>

            {isEditing ? (
              <textarea
                className="w-full text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-8 p-4 bg-white border-2 border-indigo-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-y shadow-sm"
                rows={2}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nhập tiêu đề đề thi..."
              />
            ) : (
              <div className="mb-8">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-3">
                  {title}
                </h1>
                <p className="text-sm text-slate-500 font-medium">
                  đăng bởi <span className="text-indigo-600 font-semibold">{authorName}</span>
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              
              <div className="flex flex-col gap-2 p-4 rounded-2xl bg-gray-50 border border-gray-100/50 hover:bg-gray-100/80 transition-colors">
                <div className="flex items-center gap-2 text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wider">Thời gian</span>
                </div>
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      className="w-20 font-bold text-lg text-gray-900 bg-white border-2 border-indigo-100 rounded-lg px-3 py-1.5 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all shadow-sm"
                    />
                    <span className="text-sm font-bold text-gray-500">phút</span>
                  </div>
                ) : (
                  <p className="text-lg font-bold text-gray-900">{duration} phút</p>
                )}
              </div>

              <div className="flex flex-col gap-2 p-4 rounded-2xl bg-gray-50 border border-gray-100/50 hover:bg-gray-100/80 transition-colors">
                <div className="flex items-center gap-2 text-gray-500">
                  <BarChart className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wider">Độ khó</span>
                </div>
                {isEditing ? (
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(Number(e.target.value))}
                    className="w-full font-bold text-lg text-gray-900 bg-white border-2 border-indigo-100 rounded-lg px-3 py-1.5 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all shadow-sm cursor-pointer"
                  >
                    <option value={1}>Dễ</option>
                    <option value={2}>Trung bình</option>
                    <option value={3}>Khó</option>
                  </select>
                ) : (
                  <p className="text-lg font-bold text-gray-900">
                    {difficulty === 1 ? "Dễ" : difficulty === 2 ? "Trung bình" : "Khó"}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2 p-4 rounded-2xl bg-gray-50 border border-gray-100/50 hover:bg-gray-100/80 transition-colors">
                <div className="flex items-center gap-2 text-gray-500">
                  <Award className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wider">Tổng điểm</span>
                </div>
                {isEditing ? (
                  <input
                    type="number"
                    value={totalScore}
                    onChange={(e) => setTotalScore(Number(e.target.value))}
                    className="w-24 font-bold text-lg text-gray-900 bg-white border-2 border-indigo-100 rounded-lg px-3 py-1.5 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all shadow-sm"
                  />
                ) : (
                  <p className="text-lg font-bold text-gray-900">{totalScore || 10}</p>
                )}
              </div>

              <div className="flex flex-col gap-2 p-4 rounded-2xl bg-gray-50 border border-gray-100/50 hover:bg-gray-100/80 transition-colors">
                <div className="flex items-center gap-2 text-gray-500">
                  <BookOpen className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wider">Số câu</span>
                </div>
                <p className="text-lg font-bold text-gray-900">{exam.Questions?.length || 0} câu</p>
              </div>

            </div>

            <div className="flex flex-wrap items-center gap-6 mt-8 pt-8 border-t border-gray-100">
              <button 
                onClick={handleUpvote}
                disabled={isUpvoting}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium shadow-sm transition-all disabled:opacity-50 cursor-pointer ${
                  hasUpvoted 
                    ? "text-white bg-emerald-500 hover:bg-emerald-600 hover:shadow-md" 
                    : "text-emerald-600 bg-emerald-50 hover:bg-emerald-100 hover:shadow-md"
                }`}
              >
                {isUpvoting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ThumbsUp className={`w-4 h-4 ${hasUpvoted ? 'fill-current' : ''}`} />
                )}
                <span>{optimisticUpvoteCount} <span className="hidden sm:inline">Upvotes</span></span>
              </button>
              <button 
                onClick={handleDownload}
                disabled={isDownloading}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium shadow-sm transition-all disabled:opacity-50 cursor-pointer ${
                  hasDownloaded 
                    ? "text-white bg-blue-500 hover:bg-blue-600 hover:shadow-md" 
                    : "text-blue-600 bg-blue-50 hover:bg-blue-100 hover:shadow-md"
                }`}
              >
                {isDownloading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className={`w-4 h-4 ${hasDownloaded ? 'fill-current' : ''}`} />
                )}
                <span>{optimisticDownloadCount} <span className="hidden sm:inline">Lượt tải</span></span>
              </button>
              
              {!isEditing && (
                <button 
                  onClick={() => {
                    setUserAnswers({});
                    setStartTime(Date.now());
                    setViewMode('take');
                  }}
                  className="flex items-center gap-2 text-white bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-xl font-bold shadow-sm hover:shadow-md transition-all ml-auto cursor-pointer"
                >
                  <Play className="w-4 h-4" />
                  <span>Làm đề thi</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {/* Questions section */}
      {(viewMode === 'view' || viewMode === 'take' || viewMode === 'review') && (
        <div className={`bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 sm:p-10 relative overflow-hidden transition-colors ${isEditing ? 'ring-4 ring-indigo-500/10 border-indigo-200' : ''}`}>
          <div className="relative z-10">
            <QuestionList 
              questions={exam.Questions || []}
              totalScore={exam.TotalScore || 10}
              mode={isEditing ? 'edit' : viewMode}
              editedQuestions={editedQuestions}
              onQuestionChange={handleQuestionChange}
              userAnswers={userAnswers}
              onAnswerChange={(id, ans) => setUserAnswers(prev => ({ ...prev, [id]: ans }))}
              onSubmit={handleSubmitExam}
              timerElement={viewMode === 'take' ? (
                <ExamTimer 
                  initialSeconds={(exam.DurationMinutes || 0) * 60}
                  onTimeUp={() => {
                    // Prevent infinite loops or state update during render
                    setTimeout(() => handleSubmitExam(), 0);
                  }}
                />
              ) : null}
            />
          </div>
        </div>
      )}

      <ConfirmExitDialog 
        isOpen={showExitConfirm}
        onConfirm={() => {
          setShowExitConfirm(false);
          setViewMode('view');
        }}
        onCancel={() => setShowExitConfirm(false)}
      />
    </div>
  );
}
