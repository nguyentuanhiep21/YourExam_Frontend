"use client";

import { useState } from "react";
import { GeneratedExam, UpdateGeneratedExamPayload, UpdateGeneratedExamQuestionPayload } from "../types/exam.types";
import QuestionList from "./QuestionList";
import { Clock, BookOpen, BarChart, ThumbsUp, Download, Award, ArrowLeft, Pencil, Save, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { updateGeneratedExam } from "../api/exam.actions";

interface ExamViewerProps {
  exam: GeneratedExam;
}

export default function ExamViewer({ exam }: ExamViewerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Local state for exam metadata
  const [title, setTitle] = useState(exam.Title);
  const [duration, setDuration] = useState(exam.DurationMinutes);
  const [difficulty, setDifficulty] = useState(exam.Difficulty);
  const [totalScore, setTotalScore] = useState(exam.TotalScore);
  
  // Local state for questions
  const [editedQuestions, setEditedQuestions] = useState<Record<number, Partial<GeneratedExamQuestion>>>({});

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
      
      const questionsPayload: UpdateGeneratedExamQuestionPayload[] = Object.entries(editedQuestions).map(([idStr, updates]) => ({
        Id: parseInt(idStr, 10),
        QuestionContent: updates.QuestionContent,
        CorrectAnswer: updates.CorrectAnswer,
        MultipleChoiceOptions: updates.MultipleChoiceOptions,
      }));

      await updateGeneratedExam(exam.Id, examPayload, questionsPayload);
      
      setIsEditing(false);
      // Clean up edited questions state so they use the revalidated data next time, 
      // but Next.js Server Actions with revalidatePath will refresh the route and `exam` prop!
      setEditedQuestions({});
    } catch (error: any) {
      alert(error.message || "Đã xảy ra lỗi khi lưu đề thi.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Revert changes
    setTitle(exam.Title);
    setDuration(exam.DurationMinutes);
    setDifficulty(exam.Difficulty);
    setTotalScore(exam.TotalScore);
    setEditedQuestions({});
    setIsEditing(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-indigo-600 transition-colors bg-white hover:bg-indigo-50 px-4 py-2 rounded-xl shadow-sm border border-gray-100"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại trang chủ
        </Link>

        {!isEditing ? (
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
        )}
      </div>

      {/* Header Section */}
      <div className="relative overflow-hidden bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 sm:p-10">
        
        {/* Background gradient blur */}
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
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-8">
              {title}
            </h1>
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
                <p className="text-lg font-bold text-gray-900">{totalScore}</p>
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

          {/* Upvote & Download - Keep visible during editing? Yes, but maybe grayed out or just normal. Normal is fine. */}
          <div className="flex flex-wrap items-center gap-6 mt-8 pt-8 border-t border-gray-100">
            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl font-medium shadow-sm hover:shadow-md transition-shadow">
              <ThumbsUp className="w-4 h-4" />
              <span>{exam.UpvoteCount} <span className="hidden sm:inline">Upvotes</span></span>
            </div>
            <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-xl font-medium shadow-sm hover:shadow-md transition-shadow">
              <Download className="w-4 h-4" />
              <span>{exam.DownloadCount} <span className="hidden sm:inline">Lượt tải</span></span>
            </div>
          </div>

        </div>
      </div>

      {/* Questions section */}
      <div className={`bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 sm:p-10 relative overflow-hidden transition-colors ${isEditing ? 'ring-4 ring-indigo-500/10 border-indigo-200' : ''}`}>
        <div className="relative z-10">
          <QuestionList 
            questions={exam.Questions || []}
            isEditing={isEditing}
            editedQuestions={editedQuestions}
            onQuestionChange={handleQuestionChange}
          />
        </div>
      </div>

    </div>
  );
}
