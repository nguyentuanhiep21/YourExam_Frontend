"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface CreateExamModalProps {
  onClose: () => void;
}

const GRADES = [
  "Lớp 1", "Lớp 2", "Lớp 3", "Lớp 4", "Lớp 5",
  "Lớp 6", "Lớp 7", "Lớp 8", "Lớp 9",
  "Lớp 10", "Lớp 11", "Lớp 12"
];

const SUBJECTS = [
  "Toán", "Tiếng Việt", "Tiếng Anh", "Vật Lý", "Hóa Học", "Sinh Học"
];

interface Question {
  id: string;
  diffName: string;
  content: string;
  choices?: string[];
  correctAnswer?: string;
  format?: "tu-luan" | "trac-nghiem";
}

const DIFFICULTIES = [
  { id: "easy", name: "Dễ", value: 1 },
  { id: "medium", name: "Trung bình", value: 2 },
  { id: "hard", name: "Khó", value: 3 }
];

const QUESTION_TYPES = [
  { id: 1, name: "Tính toán", code: "Calculation" },
  { id: 2, name: "Có lời văn", code: "WordProblem" },
  { id: 3, name: "So sánh", code: "Comparison" },
  { id: 4, name: "Điền chỗ trống", code: "FillInTheBlank" }
];

export function CreateExamModal({ onClose }: CreateExamModalProps) {
  const [step, setStep] = useState(1);
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [structureType, setStructureType] = useState<"template" | "custom" | null>(null);
  const [customQuestions, setCustomQuestions] = useState<Question[]>([]);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);
  const [questionFormat, setQuestionFormat] = useState<"tu-luan" | "trac-nghiem" | null>(null);
  const [newQuestionType, setNewQuestionType] = useState<number | null>(null);

  const canProceed = selectedGrade === "Lớp 1" && selectedSubject === "Toán";
  const hasSelectedBoth = selectedGrade && selectedSubject;

  const handleAddCustomQuestion = async (diffId: string, diffName: string) => {
    if (!newQuestionType) return;
    setIsGeneratingQuestion(true);

    try {
      const difficultyValue = DIFFICULTIES.find(d => d.id === diffId)?.value || 0;
      const gradeLevel = parseInt(selectedGrade?.replace("Lớp ", "") || "1");

      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/exercises/generate`;
      console.log("🚀 Đang gửi request tới:", apiUrl);
      
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          subject: selectedSubject || "Toán",
          difficulty: difficultyValue,
          questionType: newQuestionType,
          gradeLevel: gradeLevel,
          topic: "",
          quantity: 1
        })
      });

      const data = await response.json();
      console.log("Kết quả từ server:", data);

      if (data.success && data.data && data.data.length > 0) {
        const generatedQuestion = data.data[0];
        setCustomQuestions((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            diffName,
            content: generatedQuestion.content,
            choices: generatedQuestion.choices,
            correctAnswer: generatedQuestion.correctAnswer,
            format: questionFormat as any
          }
        ]);
      } else {
        alert("Có lỗi khi tạo câu hỏi, server trả về: " + JSON.stringify(data));
      }
    } catch (error: any) {
      console.error("LỖI FETCH API:", error);
      alert(`Lỗi kết nối đến server!\n\nChi tiết: ${error.message || error}\nURL: ${process.env.NEXT_PUBLIC_API_URL}/exercises/generate`);
    } finally {
      setIsGeneratingQuestion(false);
      setIsAddingQuestion(false);
      setNewQuestionType(null);
      setQuestionFormat(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="text-left">
            <h2 className="text-2xl font-bold text-gray-900">
              {step === 1 ? "Khởi tạo đề thi" : "Tùy chỉnh & Hoàn tất"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {step === 1 ? "Bước 1: Chọn Lớp và Môn học" : "Bước 2: Cấu trúc đề thi"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 && (
            <div className="space-y-8">
              {/* Grade Selection */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Khối Lớp</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {GRADES.map((grade) => (
                    <button
                      key={grade}
                      onClick={() => setSelectedGrade(grade)}
                      className={`py-3 px-2 rounded-xl text-sm font-medium transition-all duration-200 border ${selectedGrade === grade
                          ? "bg-violet-50 border-violet-500 text-violet-700 shadow-sm ring-1 ring-violet-500"
                          : "bg-white border-gray-200 text-gray-600 hover:border-violet-300 hover:bg-gray-50"
                        }`}
                    >
                      {grade}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject Selection */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Môn Học</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {SUBJECTS.map((subject) => (
                    <button
                      key={subject}
                      onClick={() => setSelectedSubject(subject)}
                      className={`py-4 px-3 rounded-xl text-sm font-medium transition-all duration-200 border ${selectedSubject === subject
                          ? "bg-violet-50 border-violet-500 text-violet-700 shadow-sm ring-1 ring-violet-500"
                          : "bg-white border-gray-200 text-gray-600 hover:border-violet-300 hover:bg-gray-50"
                        }`}
                    >
                      {subject}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              {/* Selected Context */}
              <div className="flex items-center gap-3">
                <span className="px-4 py-1.5 bg-violet-100 text-violet-700 rounded-full text-sm font-semibold">
                  {selectedGrade}
                </span>
                <span className="text-gray-400">/</span>
                <span className="px-4 py-1.5 bg-violet-100 text-violet-700 rounded-full text-sm font-semibold">
                  {selectedSubject}
                </span>
                <button
                  onClick={() => {
                    setStep(1);
                    setStructureType(null);
                  }}
                  className="ml-auto text-sm text-violet-600 hover:text-violet-700 font-medium underline-offset-4 hover:underline"
                >
                  Thay đổi
                </button>
              </div>

              {!structureType && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Cấu trúc đề</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={() => setStructureType("template")}
                      className="flex flex-col items-start p-6 rounded-2xl border border-gray-200 bg-white hover:border-violet-300 hover:bg-violet-50 transition-all duration-200 text-left"
                    >
                      <span className="font-bold text-lg text-gray-900 mb-2">💡 Gợi ý</span>
                      <span className="text-sm text-gray-500">Tạo đề nhanh dựa trên các khung cấu trúc chuẩn của Bộ GD&ĐT.</span>
                    </button>
                    <button
                      onClick={() => setStructureType("custom")}
                      className="flex flex-col items-start p-6 rounded-2xl border border-gray-200 bg-white hover:border-violet-300 hover:bg-violet-50 transition-all duration-200 text-left"
                    >
                      <span className="font-bold text-lg text-gray-900 mb-2">⚙️ Tùy chỉnh</span>
                      <span className="text-sm text-gray-500">Tự do thiết kế cấu trúc đề thi, chọn độ khó cho từng câu hỏi riêng biệt.</span>
                    </button>
                  </div>
                </div>
              )}

              {structureType === "template" && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <button onClick={() => setStructureType(null)} className="text-sm text-gray-500 hover:text-gray-800 font-medium underline-offset-2 hover:underline">
                      &larr; Quay lại
                    </button>
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider ml-2">Chọn mức độ (Gợi ý)</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {["Dễ", "Trung bình", "Khó"].map((level) => (
                      <button
                        key={level}
                        disabled
                        className="py-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-400 font-semibold cursor-not-allowed"
                      >
                        {level} (Sắp ra mắt)
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {structureType === "custom" && (
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <button onClick={() => setStructureType(null)} className="text-sm text-gray-500 hover:text-gray-800 font-medium underline-offset-2 hover:underline">
                      &larr; Quay lại
                    </button>
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider ml-2">Thiết kế câu hỏi</h3>
                  </div>

                  <div className="space-y-4">
                    {customQuestions.map((q, idx) => (
                      <div key={q.id} className="p-5 rounded-2xl border border-indigo-100 bg-white shadow-sm flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-lg text-indigo-900">Câu {idx + 1}</span>
                          <span className="text-xs font-semibold text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full">{q.diffName}</span>
                        </div>
                        <div className="text-gray-800 text-[15px] font-medium leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: q.content }} />
                        {q.format !== "tu-luan" && q.choices && q.choices.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                            {q.choices.map((choice, i) => (
                              <div key={i} className={`p-3 rounded-xl border text-sm transition-all ${choice === q.correctAnswer ? "border-green-400 bg-green-50 text-green-800 font-bold shadow-sm" : "border-gray-200 bg-gray-50 text-gray-700"}`}>
                                <span className="font-bold mr-2">{String.fromCharCode(65 + i)}.</span> {choice}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}

                    {isGeneratingQuestion && (
                      <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 flex justify-center items-center animate-pulse">
                        <span className="text-sm font-medium text-gray-500">Đang gọi AI xử lý câu hỏi...</span>
                      </div>
                    )}

                    {!isAddingQuestion && !isGeneratingQuestion && (
                      <button
                        onClick={() => setIsAddingQuestion(true)}
                        className="w-full p-4 rounded-xl border-2 border-dashed border-gray-200 text-gray-500 hover:border-violet-300 hover:text-violet-600 hover:bg-violet-50 transition-all font-semibold flex items-center justify-center gap-2"
                      >
                        <span>+ Thêm câu hỏi</span>
                      </button>
                    )}


                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex flex-col items-center">
          {step === 1 && (
            <div className="w-full flex flex-col items-center">
              <button
                disabled={!canProceed}
                onClick={() => setStep(2)}
                className={`w-full max-w-sm py-3.5 rounded-xl text-base font-bold transition-all duration-300 ${canProceed
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-200 hover:bg-violet-700 hover:-translate-y-0.5"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
              >
                Tiếp tục
              </button>
              {hasSelectedBoth && !canProceed && (
                <p className="mt-3 text-sm text-amber-600 font-medium">
                  Hiện tại hệ thống chỉ mới hỗ trợ đề thi Toán Lớp 1. Các môn và khối lớp khác đang được phát triển.
                </p>
              )}
            </div>
          )}

          {step === 2 && (
            <button
              disabled={structureType !== "custom" || customQuestions.length === 0}
              onClick={() => {
                alert(`Mock: Đang khởi tạo đề thi AI gồm ${customQuestions.length} câu...`);
                onClose();
              }}
              className={`w-full max-w-sm flex items-center justify-center gap-2 py-3.5 rounded-xl text-base font-bold transition-all duration-300 ${structureType === "custom" && customQuestions.length > 0
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 hover:-translate-y-0.5"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
            >
              <span>✨ Tạo Đề Ngay</span>
            </button>
          )}
        </div>

        {isAddingQuestion && !isGeneratingQuestion && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-white/60 backdrop-blur-md">
            <div className="w-full max-w-md p-6 rounded-2xl border border-violet-100 bg-white shadow-2xl space-y-6 animate-in zoom-in-95 fade-in duration-200">
              <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-4">
                <h3 className="text-lg font-bold text-gray-900">Tạo câu hỏi mới</h3>
                <button 
                  onClick={() => {
                    setIsAddingQuestion(false);
                    setNewQuestionType(null);
                    setQuestionFormat(null);
                  }} 
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">1. Chọn hình thức:</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setQuestionFormat("tu-luan")}
                    className={`py-3 px-3 text-sm font-semibold rounded-xl border transition-all ${questionFormat === "tu-luan" ? 'bg-violet-50 border-violet-500 text-violet-700 shadow-sm ring-1 ring-violet-500' : 'border-gray-200 hover:border-violet-300 hover:bg-violet-50 text-gray-600'}`}
                  >
                    Tự luận
                  </button>
                  <button
                    onClick={() => setQuestionFormat("trac-nghiem")}
                    className={`py-3 px-3 text-sm font-semibold rounded-xl border transition-all ${questionFormat === "trac-nghiem" ? 'bg-violet-50 border-violet-500 text-violet-700 shadow-sm ring-1 ring-violet-500' : 'border-gray-200 hover:border-violet-300 hover:bg-violet-50 text-gray-600'}`}
                  >
                    Trắc nghiệm
                  </button>
                </div>
              </div>

              {questionFormat && (
                <div className="pt-4 border-t border-gray-100 space-y-6 animate-in fade-in">
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-3">2. Chọn dạng bài tập:</p>
                    <div className="grid grid-cols-2 gap-3">
                      {QUESTION_TYPES.map(qt => (
                        <button
                          key={qt.id}
                          onClick={() => setNewQuestionType(qt.id)}
                          className={`py-3 px-3 text-sm font-semibold rounded-xl border transition-all ${newQuestionType === qt.id ? 'bg-violet-50 border-violet-500 text-violet-700 shadow-sm ring-1 ring-violet-500' : 'border-gray-200 hover:border-violet-300 hover:bg-violet-50 text-gray-600'}`}
                        >
                          {qt.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {newQuestionType && (
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-sm font-semibold text-gray-700 mb-3">3. Chọn độ khó:</p>
                      <div className="grid grid-cols-3 gap-3">
                        {DIFFICULTIES.map(diff => (
                          <button
                            key={diff.id}
                            onClick={() => handleAddCustomQuestion(diff.id, diff.name)}
                            className="py-3 px-2 text-sm font-semibold rounded-xl border border-gray-200 hover:border-violet-300 hover:bg-violet-50 text-gray-600 hover:text-violet-700 transition-all"
                          >
                            {diff.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
