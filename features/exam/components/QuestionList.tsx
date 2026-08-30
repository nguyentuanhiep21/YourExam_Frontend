"use client";

import { useState } from "react";
import { GeneratedExamQuestion, QuestionType } from "../types/exam.types";
import { Eye, EyeOff, BookOpen, Send } from "lucide-react";

interface QuestionListProps {
  questions: GeneratedExamQuestion[];
  totalScore?: number;
  mode?: 'view' | 'edit' | 'take' | 'review';
  editedQuestions?: Record<number, Partial<GeneratedExamQuestion>>;
  onQuestionChange?: (id: number, updates: Partial<GeneratedExamQuestion>) => void;
  userAnswers?: Record<number, string>;
  onAnswerChange?: (id: number, answer: string) => void;
  onSubmit?: () => void;
  timerElement?: React.ReactNode;
}

export default function QuestionList({ 
  questions, 
  totalScore,
  mode = 'view', 
  editedQuestions, 
  onQuestionChange,
  userAnswers,
  onAnswerChange,
  onSubmit,
  timerElement
}: QuestionListProps) {
  const [showAnswers, setShowAnswers] = useState(false);

  if (!questions || questions.length === 0) {
    return <p className="text-gray-500">Chưa có câu hỏi nào trong đề thi này.</p>;
  }

  const sortedQuestions = [...questions].sort((a, b) => a.OrderIndex - b.OrderIndex);

  const scorePerQuestion = totalScore !== undefined && questions.length > 0 ? totalScore / questions.length : 0;
  const formattedScorePerQuestion = scorePerQuestion % 1 === 0 ? scorePerQuestion : Number(scorePerQuestion.toFixed(2));

  const renderQuestionContent = (q: GeneratedExamQuestion) => {
    const isMultipleChoice = q.QuestionType === QuestionType.MultipleChoice;

    if (mode === 'edit') {
      const editData = editedQuestions?.[q.Id] || {};
      const contentValue = editData.QuestionContent ?? q.QuestionContent;
      const answerValue = editData.CorrectAnswer ?? (q.CorrectAnswer || "");
      const optionsJson = editData.MultipleChoiceOptions ?? (q.MultipleChoiceOptions || "[]");
      
      let options: string[] = [];
      try {
        options = JSON.parse(optionsJson);
      } catch {}
      
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

    const content = q.QuestionContent;
    
    if (isMultipleChoice) {
      return <div>{content}</div>;
    }

    // Essay logic
    const blankRegex = /_{2,}|\.{3,}/;
    if (blankRegex.test(content)) {
      const parts = content.split(blankRegex);
      return (
        <span className="leading-loose">
          {parts.map((part, i) => {
            if (i === parts.length - 1) return <span key={i}>{part}</span>;
            
            if (mode === 'take') {
              return (
                <span key={i}>
                  {part}
                  <input
                    type="text"
                    className="mx-2 px-3 py-1 bg-indigo-50/50 border-b-2 border-indigo-300 focus:border-indigo-600 outline-none text-indigo-900 font-semibold w-32 sm:w-48 transition-colors text-center inline-block"
                    value={userAnswers?.[q.Id] || ''}
                    onChange={(e) => onAnswerChange?.(q.Id, e.target.value)}
                    placeholder="Nhập..."
                  />
                </span>
              );
            }
            
            if (mode === 'review') {
              const userAnswer = userAnswers?.[q.Id] || '';
              const correctAns = q.CorrectAnswer || '';
              const isCorrect = userAnswer.trim().toLowerCase() === correctAns.trim().toLowerCase();
              
              if (isCorrect) {
                return (
                  <span key={i}>
                    {part}
                    <span className="text-emerald-600 font-bold px-2 underline decoration-emerald-300 decoration-2 underline-offset-4">
                      {userAnswer || '____'}
                    </span>
                  </span>
                );
              } else {
                return (
                  <span key={i}>
                    {part}
                    <span className="text-rose-600 font-bold px-2 underline decoration-rose-300 decoration-2 underline-offset-4 line-through">
                      {userAnswer || '____'}
                    </span>
                    <span className="text-emerald-600 font-bold px-2 underline decoration-emerald-300 decoration-2 underline-offset-4 ml-2">
                      {correctAns}
                    </span>
                  </span>
                );
              }
            }

            // 'view'
            return (
              <span key={i}>
                {part}
                <span className={`font-bold px-2 underline decoration-2 underline-offset-4 ${showAnswers && q.CorrectAnswer ? 'text-emerald-600 decoration-emerald-300' : 'text-gray-400 decoration-gray-300'}`}>
                  {showAnswers && q.CorrectAnswer ? q.CorrectAnswer : "____"}
                </span>
              </span>
            );
          })}
        </span>
      );
    }
    
    // Regular essay question
    return (
      <div className="space-y-4">
        <div>{content}</div>
        
        {mode === 'take' && (
          <textarea
            className="w-full p-4 bg-indigo-50/30 border-2 border-indigo-100 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all resize-y min-h-[120px]"
            value={userAnswers?.[q.Id] || ''}
            onChange={(e) => onAnswerChange?.(q.Id, e.target.value)}
            placeholder="Nhập câu trả lời của bạn vào đây..."
          />
        )}
        
        {mode === 'review' && (
          <div className="space-y-3 mt-4 border-t border-gray-100 pt-4">
            {(() => {
              const userAnswer = userAnswers?.[q.Id] || '';
              const correctAns = q.CorrectAnswer || '';
              const isCorrect = userAnswer.trim().toLowerCase() === correctAns.trim().toLowerCase();
              
              if (isCorrect) {
                return (
                  <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl text-emerald-700">
                    <span className="font-bold mr-2">Đáp án của bạn (Đúng):</span>
                    <div className="mt-2 whitespace-pre-wrap">{userAnswer}</div>
                  </div>
                );
              } else {
                return (
                  <>
                    <div className="p-4 bg-rose-50/80 border border-rose-200 rounded-xl text-rose-700">
                      <span className="font-bold mr-2">Đáp án của bạn (Sai):</span>
                      <div className="mt-2 whitespace-pre-wrap">{userAnswer || <span className="italic opacity-70">Không có câu trả lời</span>}</div>
                    </div>
                    <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl text-emerald-700">
                      <span className="font-bold mr-2">Đáp án chuẩn:</span>
                      <div className="mt-2 whitespace-pre-wrap">{correctAns}</div>
                    </div>
                  </>
                );
              }
            })()}
          </div>
        )}

        {mode === 'view' && showAnswers && q.CorrectAnswer && (
          <div className="mt-4 p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl text-emerald-700 font-medium">
            <span className="font-bold mr-2">Đáp án:</span>
            <div className="mt-2 whitespace-pre-wrap">{q.CorrectAnswer}</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-indigo-500" />
          Danh sách câu hỏi
        </h2>
        
        {mode === 'view' && (
          <button
            onClick={() => setShowAnswers(!showAnswers)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl font-semibold transition-colors shadow-sm shrink-0"
          >
            {showAnswers ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            {showAnswers ? "Ẩn đáp án" : "Hiển thị đáp án"}
          </button>
        )}

        {mode === 'take' && timerElement && (
          <div className="shrink-0">
            {timerElement}
          </div>
        )}
      </div>

      {sortedQuestions.map((q, index) => (
        <div key={q.Id} className={`p-5 rounded-[1.5rem] shadow-sm transition-shadow ${
          mode === 'review' ? (
            // Thêm màu viền cho toàn câu hỏi nếu làm đúng/sai ở chế độ review? Tạm thời giữ nguyên hoặc nhạt
            "bg-white border border-gray-200"
          ) : "bg-white border border-gray-100 hover:shadow-md"
        }`}>
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-bold text-lg text-gray-900">Câu {index + 1}</h3>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              {formattedScorePerQuestion} điểm
            </span>
          </div>
          
          <div className="text-gray-800 mb-4 whitespace-pre-wrap leading-relaxed text-[1.05rem]">
            {renderQuestionContent(q)}
          </div>

          {mode !== 'edit' && q.QuestionType === QuestionType.MultipleChoice && q.MultipleChoiceOptions && (
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

                  const getChoiceClass = (opt: string, i: number) => {
                    const char = String.fromCharCode(65 + i);
                    
                    if (mode === 'take') {
                      const isSelected = userAnswers?.[q.Id] === char;
                      return isSelected 
                        ? "bg-indigo-50 border-indigo-300 shadow-sm ring-1 ring-indigo-500" 
                        : "bg-gray-50/50 border-transparent hover:border-indigo-200 hover:bg-gray-50 cursor-pointer";
                    }
                    
                    if (mode === 'review') {
                      const isCorrect = q.CorrectAnswer?.trim().toUpperCase() === char || q.CorrectAnswer?.trim() === opt.trim();
                      const isUserSelected = userAnswers?.[q.Id] === char;
                      
                      if (isCorrect) return "bg-emerald-50/80 border-emerald-300 shadow-sm"; 
                      if (isUserSelected) return "bg-rose-50/80 border-rose-300 shadow-sm";
                      return "bg-gray-50/50 border-transparent opacity-60";
                    }
                    
                    const isCorrect = showAnswers && q.CorrectAnswer && (q.CorrectAnswer.trim().toUpperCase() === char || q.CorrectAnswer.trim() === opt.trim());
                    return isCorrect 
                      ? "bg-emerald-50/80 border-emerald-300 shadow-sm" 
                      : "bg-gray-50/50 border-transparent hover:border-indigo-100 hover:bg-indigo-50/50";
                  };

                  const getChoiceIconClass = (opt: string, i: number) => {
                    const char = String.fromCharCode(65 + i);
                    
                    if (mode === 'take') {
                      const isSelected = userAnswers?.[q.Id] === char;
                      return isSelected 
                        ? "bg-indigo-600 text-white border-indigo-600" 
                        : "bg-white text-gray-700 border-gray-200";
                    }
                    
                    if (mode === 'review') {
                      const isCorrect = q.CorrectAnswer?.trim().toUpperCase() === char || q.CorrectAnswer?.trim() === opt.trim();
                      const isUserSelected = userAnswers?.[q.Id] === char;
                      
                      if (isCorrect) return "bg-emerald-500 text-white border-emerald-600";
                      if (isUserSelected) return "bg-rose-500 text-white border-rose-600";
                      return "bg-white text-gray-400 border-gray-200";
                    }

                    const isCorrect = showAnswers && q.CorrectAnswer && (q.CorrectAnswer.trim().toUpperCase() === char || q.CorrectAnswer.trim() === opt.trim());
                    return isCorrect
                      ? "bg-emerald-500 text-white border-emerald-600"
                      : "bg-white text-gray-700 border-gray-200";
                  };
                  
                  const getChoiceTextClass = (opt: string, i: number) => {
                    const char = String.fromCharCode(65 + i);
                    
                    if (mode === 'take') {
                      return userAnswers?.[q.Id] === char ? "text-indigo-900 font-bold" : "text-gray-700";
                    }
                    
                    if (mode === 'review') {
                      const isCorrect = q.CorrectAnswer?.trim().toUpperCase() === char || q.CorrectAnswer?.trim() === opt.trim();
                      const isUserSelected = userAnswers?.[q.Id] === char;
                      
                      if (isCorrect) return "text-emerald-700 font-bold";
                      if (isUserSelected) return "text-rose-700 font-bold";
                      return "text-gray-500";
                    }
                    
                    const isCorrect = showAnswers && q.CorrectAnswer && (q.CorrectAnswer.trim().toUpperCase() === char || q.CorrectAnswer.trim() === opt.trim());
                    return isCorrect ? "text-emerald-700 font-bold" : "text-gray-700";
                  };

                  return (
                    <div className={gridClass}>
                      {options.map((opt, i) => {
                        return (
                          <div 
                            key={i} 
                            onClick={() => {
                              if (mode === 'take') {
                                onAnswerChange?.(q.Id, String.fromCharCode(65 + i));
                              }
                            }}
                            className={`flex items-start space-x-3 p-3 rounded-xl border transition-all select-none ${getChoiceClass(opt, i)}`}
                          >
                            <div className={`w-7 h-7 rounded-full border flex items-center justify-center text-sm font-bold shrink-0 shadow-sm transition-colors ${getChoiceIconClass(opt, i)}`}>
                              {String.fromCharCode(65 + i)}
                            </div>
                            <span className={`leading-snug pt-0.5 transition-colors ${getChoiceTextClass(opt, i)}`}>
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
      
      {mode === 'take' && (
        <div className="flex justify-center mt-12 mb-8 animate-in fade-in slide-in-from-bottom-4">
          <button
            onClick={onSubmit}
            className="flex items-center gap-2 px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all text-lg"
          >
            <Send className="w-5 h-5" />
            Nộp bài thi
          </button>
        </div>
      )}
    </div>
  );
}
