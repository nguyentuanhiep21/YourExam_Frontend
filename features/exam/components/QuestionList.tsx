"use client";

import { useState } from "react";
import { GeneratedExamQuestion, QuestionType } from "../types/exam.types";
import { Eye, EyeOff, BookOpen } from "lucide-react";

interface QuestionListProps {
  questions: GeneratedExamQuestion[];
  isEditing?: boolean;
  editedQuestions?: Record<number, Partial<GeneratedExamQuestion>>;
  onQuestionChange?: (id: number, updates: Partial<GeneratedExamQuestion>) => void;
}

export default function QuestionList({ questions, isEditing, editedQuestions, onQuestionChange }: QuestionListProps) {
  const [showAnswers, setShowAnswers] = useState(false);

  if (!questions || questions.length === 0) {
    return <p className="text-gray-500">Chưa có câu hỏi nào trong đề thi này.</p>;
  }

  // Sắp xếp câu hỏi theo OrderIndex
  const sortedQuestions = [...questions].sort((a, b) => a.OrderIndex - b.OrderIndex);

  const renderQuestionContent = (q: GeneratedExamQuestion) => {
    const isMultipleChoice = q.QuestionType === QuestionType.MultipleChoice;

    if (isEditing) {
      const editData = editedQuestions?.[q.Id] || {};
      const contentValue = editData.QuestionContent ?? q.QuestionContent;
      const answerValue = editData.CorrectAnswer ?? (q.CorrectAnswer || "");
      const optionsJson = editData.MultipleChoiceOptions ?? (q.MultipleChoiceOptions || "[]");
      
      let options: string[] = [];
      try {
        options = JSON.parse(optionsJson);
      } catch {
        // fallback
      }
      
      // Đảm bảo luôn có 4 lựa chọn cho câu trắc nghiệm
      if (isMultipleChoice) {
        while (options.length < 4) options.push("");
      }

      const handleOptionChange = (idx: number, newVal: string) => {
        const newOpts = [...options];
        newOpts[idx] = newVal;
        onQuestionChange?.(q.Id, { MultipleChoiceOptions: JSON.stringify(newOpts) });
      };

      const handleAnswerChange = (newAns: string) => {
        onQuestionChange?.(q.Id, { CorrectAnswer: newAns });
      };

      return (
        <div className="space-y-4 w-full">
          <textarea
            className="w-full min-h-[100px] p-4 text-[1.05rem] text-gray-800 bg-white border-2 border-indigo-100 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none resize-y shadow-sm"
            value={contentValue}
            onChange={(e) => onQuestionChange?.(q.Id, { QuestionContent: e.target.value })}
            placeholder="Nhập nội dung câu hỏi..."
          />
          
          {isMultipleChoice ? (
            <div className="space-y-3 mt-4 border-t border-gray-100 pt-4">
              <h4 className="font-semibold text-gray-700 text-sm">Các lựa chọn (chọn đáp án đúng):</h4>
              {options.slice(0, 4).map((opt, i) => {
                const char = String.fromCharCode(65 + i);
                const isCorrect = answerValue.trim().toUpperCase() === char || (answerValue.trim() !== "" && answerValue.trim() === opt.trim());
                
                return (
                  <div key={i} className="flex items-center gap-3 bg-gray-50/50 p-2 rounded-lg border border-transparent hover:border-gray-200 transition-colors">
                    <input 
                      type="radio" 
                      name={`correct-${q.Id}`} 
                      checked={isCorrect}
                      onChange={() => handleAnswerChange(char)}
                      className="w-5 h-5 text-indigo-600 border-gray-300 focus:ring-indigo-500 cursor-pointer"
                    />
                    <div className="flex-1 flex items-center gap-2">
                      <span className="w-6 font-bold text-gray-500 text-sm text-center">{char}.</span>
                      <input
                        type="text"
                        className="flex-1 p-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none shadow-sm"
                        value={opt}
                        onChange={(e) => handleOptionChange(i, e.target.value)}
                        placeholder={`Lựa chọn ${char}...`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-4 border-t border-gray-100 pt-4 space-y-2">
              <h4 className="font-semibold text-gray-700 text-sm">Đáp án đúng:</h4>
              <input
                type="text"
                className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none shadow-sm"
                value={answerValue}
                onChange={(e) => handleAnswerChange(e.target.value)}
                placeholder="Nhập đáp án chính xác..."
              />
            </div>
          )}
        </div>
      );
    }

    // --- Read-only Mode ---
    const content = q.QuestionContent;
    
    // For multiple choice, we don't replace blanks with the answer text, we just highlight the option below.
    if (isMultipleChoice || !showAnswers || !q.CorrectAnswer) {
      return content;
    }

    // Try to replace blanks (___ or ...)
    const blankRegex = /_{2,}|\.{3,}/;
    if (blankRegex.test(content)) {
      const parts = content.split(blankRegex);
      return (
        <>
          {parts.map((part, i) => (
            <span key={i}>
              {part}
              {i < parts.length - 1 && (
                <span className="text-rose-500 font-bold px-2 underline decoration-rose-200 decoration-2 underline-offset-4">
                  {q.CorrectAnswer}
                </span>
              )}
            </span>
          ))}
        </>
      );
    }
    
    // If no blank is found (e.g. regular essay question), append the answer below
    return (
      <>
        {content}
        <div className="mt-3 p-3 bg-rose-50/80 border border-rose-100 rounded-lg text-rose-600 font-medium">
          <span className="font-bold mr-2">Đáp án:</span>
          {q.CorrectAnswer}
        </div>
      </>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-indigo-500" />
          Danh sách câu hỏi
        </h2>
        {!isEditing && (
          <button
            onClick={() => setShowAnswers(!showAnswers)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl font-semibold transition-colors shadow-sm shrink-0"
          >
            {showAnswers ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            {showAnswers ? "Ẩn đáp án" : "Hiển thị đáp án"}
          </button>
        )}
      </div>

      {sortedQuestions.map((q, index) => (
        <div key={q.Id} className="p-5 border border-gray-100 rounded-[1.5rem] shadow-sm bg-white hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-bold text-lg text-gray-900">Câu {index + 1}</h3>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              {q.Score} điểm
            </span>
          </div>
          
          <div className="text-gray-800 mb-4 whitespace-pre-wrap leading-relaxed text-[1.05rem]">
            {renderQuestionContent(q)}
          </div>

          {!isEditing && q.QuestionType === QuestionType.MultipleChoice && q.MultipleChoiceOptions && (
            <div className="mt-5 pl-4 border-l-2 border-indigo-200">
              {(() => {
                try {
                  const options: string[] = JSON.parse(q.MultipleChoiceOptions);
                  const maxLen = Math.max(...options.map(opt => String(opt).length));
                  
                  let gridClass = "grid gap-3 ";
                  if (maxLen < 20) {
                    gridClass += "grid-cols-1 sm:grid-cols-2 md:grid-cols-4";
                  } else if (maxLen < 60) {
                    gridClass += "grid-cols-1 sm:grid-cols-2";
                  } else {
                    gridClass += "grid-cols-1";
                  }

                  const getIsCorrect = (opt: string, i: number) => {
                    if (!showAnswers || !q.CorrectAnswer) return false;
                    const char = String.fromCharCode(65 + i);
                    return q.CorrectAnswer.trim().toUpperCase() === char || q.CorrectAnswer.trim() === opt.trim();
                  };

                  return (
                    <div className={gridClass}>
                      {options.map((opt, i) => {
                        const isCorrect = getIsCorrect(opt, i);
                        return (
                          <div 
                            key={i} 
                            className={`flex items-start space-x-3 p-3 rounded-xl border transition-all ${
                              isCorrect 
                                ? "bg-rose-50/80 border-rose-200 shadow-sm" 
                                : "bg-gray-50/50 border-transparent hover:border-indigo-100 hover:bg-indigo-50/50"
                            }`}
                          >
                            <div className={`w-7 h-7 rounded-full border flex items-center justify-center text-sm font-bold shrink-0 shadow-sm ${
                              isCorrect
                                ? "bg-rose-400 text-white border-rose-500"
                                : "bg-white text-gray-700 border-gray-200"
                            }`}>
                              {String.fromCharCode(65 + i)}
                            </div>
                            <span className={`leading-snug pt-0.5 ${isCorrect ? "text-rose-600 font-bold" : "text-gray-700"}`}>
                              {opt}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  );
                } catch (e) {
                  return <p className="text-red-500 text-sm">Lỗi hiển thị đáp án (Invalid JSON)</p>;
                }
              })()}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
