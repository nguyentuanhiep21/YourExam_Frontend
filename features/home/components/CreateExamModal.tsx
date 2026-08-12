"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Loader2, Save, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

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

interface CustomRule {
  id: string;
  diffId: string;
  diffName: string;
  format: "tu-luan" | "trac-nghiem";
  quantity: number;
}

const DIFFICULTIES = [
  { id: "easy", name: "Dễ", value: 1 },
  { id: "medium", name: "Trung bình", value: 2 },
  { id: "hard", name: "Khó", value: 3 }
];

const EXERCISE_TYPES = [
  { id: 1, name: "Tính toán", code: "Calculation" },
  { id: 2, name: "Có lời văn", code: "WordProblem" },
  { id: 3, name: "So sánh", code: "Comparison" },
  { id: 4, name: "Điền chỗ trống", code: "FillInTheBlank" }
];

export function CreateExamModal({ onClose }: CreateExamModalProps) {
  const [step, setStep] = useState(1);
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [structureType, setStructureType] = useState<"template" | "custom" | "saved" | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [customRules, setCustomRules] = useState<CustomRule[]>([]);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);
  const [questionFormat, setQuestionFormat] = useState<"tu-luan" | "trac-nghiem" | null>(null);
  const [newExerciseType, setNewExerciseType] = useState<number | null>(null);

  // Generation Wizard states
  const [isGeneratingWizard, setIsGeneratingWizard] = useState(false);
  const [currentRuleIndex, setCurrentRuleIndex] = useState(0);
  const [distributionState, setDistributionState] = useState<Record<string, Record<number, number>>>({});
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);
  const [isGeneratingExamAPI, setIsGeneratingExamAPI] = useState(false);

  // Supabase states
  const [savedBlueprints, setSavedBlueprints] = useState<any[]>([]);
  const [isLoadingBlueprints, setIsLoadingBlueprints] = useState(false);
  const [blueprintName, setBlueprintName] = useState("");
  const [editingBlueprintId, setEditingBlueprintId] = useState<number | null>(null);
  const [isSavingBlueprint, setIsSavingBlueprint] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  useEffect(() => {
    if (structureType === "saved") {
      fetchBlueprints();
    }
  }, [structureType]);

  const fetchBlueprints = async () => {
    setIsLoadingBlueprints(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("ExamBlueprints")
        .select("*, BlueprintRules(*)")
        .eq("AuthorId", user.id)
        .order("Id", { ascending: false });
      if (data) setSavedBlueprints(data);
    } catch (error) {
      console.error("Lỗi khi tải cấu trúc đề:", error);
    } finally {
      setIsLoadingBlueprints(false);
    }
  };

  const saveCustomBlueprint = async () => {
    if (!blueprintName.trim() || customRules.length === 0) return;
    setIsSavingBlueprint(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Chưa đăng nhập");

      let blueprintId = editingBlueprintId;

      if (editingBlueprintId) {
        // Cập nhật Blueprint hiện có
        const { error: bpError } = await supabase.from("ExamBlueprints").update({
          Name: blueprintName
        }).eq("Id", editingBlueprintId);
        if (bpError) throw bpError;

        // Xóa các rules cũ
        const { error: delError } = await supabase.from("BlueprintRules").delete().eq("BlueprintId", editingBlueprintId);
        if (delError) throw delError;
      } else {
        // Tạo Blueprint mới
        const { data: blueprint, error: bpError } = await supabase.from("ExamBlueprints").insert({
          Name: blueprintName,
          IsSystemProvided: false,
          AuthorId: user.id
        }).select().single();
        if (bpError) throw bpError;
        blueprintId = blueprint.Id;
      }
      
      // 2. Lưu BlueprintRules
      const rules = customRules.map(q => ({
        BlueprintId: blueprintId,
        Topic: "Câu hỏi tuỳ chỉnh", 
        Difficulty: q.diffName === "Dễ" ? 1 : q.diffName === "Trung bình" ? 2 : 3,
        QuestionFormat: q.format === "tu-luan" ? 2 : 1, 
        Quantity: q.quantity
      }));
      
      const { error: rulesError } = await supabase.from("BlueprintRules").insert(rules);
      if (rulesError) throw rulesError;
      
      setShowSaveDialog(false);
      setBlueprintName("");
      setEditingBlueprintId(null);
      setStructureType("saved"); // Chuyển sang màn hình đã lưu để xem kết quả
    } catch (error: any) {
      alert("Lỗi khi lưu cấu trúc: " + error.message);
    } finally {
      setIsSavingBlueprint(false);
    }
  };

  const handleDeleteBlueprint = async (id: number) => {
    try {
      const supabase = createClient();
      const { error } = await supabase.from("ExamBlueprints").delete().eq("Id", id);
      if (error) throw error;
      setSavedBlueprints(prev => prev.filter(bp => bp.Id !== id));
    } catch (error: any) {
      alert("Lỗi khi xóa cấu trúc đề: " + error.message);
    }
  };

  const handleEditBlueprint = (bp: any) => {
    setEditingBlueprintId(bp.Id);
    setBlueprintName(bp.Name);
    const mappedRules = (bp.BlueprintRules || []).map((rule: any) => {
      const diffName = rule.Difficulty === 1 ? "Dễ" : rule.Difficulty === 2 ? "Trung bình" : "Khó";
      const diffId = rule.Difficulty === 1 ? "easy" : rule.Difficulty === 2 ? "medium" : "hard";
      const format = rule.QuestionFormat === 2 ? "tu-luan" : "trac-nghiem";
      return {
        id: rule.Id.toString(),
        diffId,
        diffName,
        format,
        quantity: rule.Quantity
      };
    });
    setCustomRules(mappedRules);
    setStructureType("custom");
  };

  const canProceed = selectedGrade === "Lớp 1" && selectedSubject === "Toán";
  const hasSelectedBoth = selectedGrade && selectedSubject;

  const handleAddCustomRule = (diffId: string, diffName: string) => {
    if (!questionFormat) return;

    setCustomRules(prev => {
      const existing = prev.find(r => r.format === questionFormat && r.diffId === diffId);
      if (existing) {
        return prev.map(r => r.id === existing.id ? { ...r, quantity: r.quantity + 1 } : r);
      }
      return [...prev, {
        id: Date.now().toString(),
        format: questionFormat,
        diffId,
        diffName,
        quantity: 1
      }];
    });

    setIsAddingQuestion(false);
    setQuestionFormat(null);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCustomRules(prev => prev.map(r => {
      if (r.id === id) {
        return { ...r, quantity: Math.max(1, r.quantity + delta) };
      }
      return r;
    }));
  };

  const removeRule = (id: string) => {
    setCustomRules(prev => prev.filter(r => r.id !== id));
  };

  const updateDistribution = (ruleId: string, exerciseTypeId: number, delta: number) => {
    setDistributionState(prev => {
      const currentVal = prev[ruleId]?.[exerciseTypeId] || 0;
      const newVal = Math.max(0, currentVal + delta);
      return {
        ...prev,
        [ruleId]: {
          ...prev[ruleId],
          [exerciseTypeId]: newVal
        }
      };
    });
  };

  const executeGenerateExam = async () => {
    setIsGeneratingExamAPI(true);
    try {
      const gradeMap: Record<string, number> = {
        "Lớp 1": 1, "Lớp 2": 2, "Lớp 3": 3, "Lớp 4": 4, "Lớp 5": 5
      };
      
      const promises: Promise<any>[] = [];
      
      for (const rule of customRules) {
        const dist = distributionState[rule.id];
        for (const typeIdStr in dist) {
          const typeId = parseInt(typeIdStr);
          const qty = dist[typeId];
          if (qty > 0) {
            promises.push(
              fetch("https://yourexam-backend.onrender.com/api/exercises/generate", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  Subject: selectedSubject || "Toán",
                  Difficulty: rule.diffName === "Dễ" ? 1 : rule.diffName === "Trung bình" ? 2 : 3,
                  ExerciseType: typeId,
                  GradeLevel: gradeMap[selectedGrade || "Lớp 1"] || 1,
                  Quantity: qty
                })
              }).then(r => r.json())
            );
          }
        }
      }

      const results = await Promise.all(promises);
      let allQuestions: any[] = [];
      results.forEach(res => {
        if (res.success && res.data) {
          allQuestions = [...allQuestions, ...res.data];
        }
      });
      
      setGeneratedQuestions(allQuestions);
      setIsGeneratingWizard(false); // Đóng wizard, hiện preview
    } catch (error) {
      alert("Có lỗi xảy ra khi tạo đề thi: " + error);
    } finally {
      setIsGeneratingExamAPI(false);
    }
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return createPortal(
    <>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
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
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button
                      onClick={() => setStructureType("template")}
                      className="flex flex-col items-start p-6 rounded-2xl border border-gray-200 bg-white hover:border-violet-300 hover:bg-violet-50 transition-all duration-200 text-left"
                    >
                      <span className="font-bold text-lg text-gray-900 mb-2">💡 Gợi ý</span>
                      <span className="text-sm text-gray-500">Tạo đề nhanh dựa trên các khung cấu trúc chuẩn của Bộ GD&ĐT.</span>
                    </button>
                      <button
                        onClick={() => {
                          setCustomRules([]);
                          setBlueprintName("");
                          setEditingBlueprintId(null);
                          setStructureType("custom");
                        }}
                        className="flex flex-col items-start p-6 rounded-2xl border border-gray-200 bg-white hover:border-violet-300 hover:bg-violet-50 transition-all duration-200 text-left"
                      >
                        <span className="font-bold text-lg text-gray-900 mb-2">⚙️ Tùy chỉnh</span>
                        <span className="text-sm text-gray-500">Tự do thiết kế cấu trúc đề thi, chọn độ khó cho từng câu hỏi riêng biệt.</span>
                      </button>
                    <button
                      onClick={() => setStructureType("saved")}
                      className="flex flex-col items-start p-6 rounded-2xl border border-gray-200 bg-white hover:border-violet-300 hover:bg-violet-50 transition-all duration-200 text-left"
                    >
                      <span className="font-bold text-lg text-gray-900 mb-2">💾 Đã lưu</span>
                      <span className="text-sm text-gray-500">Sử dụng lại các cấu trúc đề thi bạn đã thiết kế và lưu trước đó.</span>
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

              {structureType === "saved" && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <button onClick={() => setStructureType(null)} className="text-sm text-gray-500 hover:text-gray-800 font-medium underline-offset-2 hover:underline">
                      &larr; Quay lại
                    </button>
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider ml-2">Cấu trúc đề đã lưu</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {isLoadingBlueprints ? (
                      <div className="p-8 rounded-2xl border border-gray-200 bg-gray-50 flex justify-center items-center">
                        <Loader2 className="animate-spin text-violet-500 w-6 h-6" />
                      </div>
                    ) : savedBlueprints.length > 0 ? (
                      savedBlueprints.map((bp) => (
                        <div key={bp.Id} className="p-5 rounded-2xl border border-gray-200 bg-white shadow-sm flex items-center justify-between hover:border-violet-400 transition-all cursor-pointer group">
                          <div onClick={() => handleEditBlueprint(bp)} className="flex-1 flex flex-col gap-2">
                            <h4 className="font-bold text-gray-900 text-lg group-hover:text-violet-700 transition-colors">{bp.Name}</h4>
                            <p className="text-sm text-gray-500 font-medium">{bp.BlueprintRules?.length || 0} câu hỏi thiết kế</p>
                          </div>
                          {deletingId === bp.Id ? (
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleDeleteBlueprint(bp.Id); }}
                                className="px-3 py-1.5 bg-red-500 text-white text-sm font-bold rounded-lg hover:bg-red-600 transition-colors shadow-sm"
                              >
                                Xóa ngay
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); setDeletingId(null); }}
                                className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-200 transition-colors"
                              >
                                Hủy
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeletingId(bp.Id);
                              }}
                              className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                              title="Xóa cấu trúc đề"
                            >
                              <Trash2 size={20} />
                            </button>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="p-8 rounded-2xl border border-gray-200 bg-gray-50 text-center flex flex-col justify-center items-center">
                        <span className="text-sm text-gray-500 mb-4">Bạn chưa có cấu trúc đề nào được lưu.</span>
                      </div>
                    )}
                    
                    <button
                      onClick={() => {
                        setCustomRules([]);
                        setBlueprintName("");
                        setEditingBlueprintId(null);
                        setStructureType("custom");
                      }}
                      className="w-full py-3.5 rounded-xl bg-white border border-violet-200 text-violet-700 hover:bg-violet-50 hover:border-violet-400 shadow-sm transition-all text-sm font-bold flex justify-center items-center gap-2"
                    >
                      <span>+ Tạo cấu trúc đề mới</span>
                    </button>
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
                    {customRules.map((rule, idx) => (
                      <div key={rule.id} className="p-5 rounded-2xl border border-indigo-100 bg-white shadow-sm flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
                        <div className="flex flex-col gap-1">
                          <span className="font-bold text-lg text-indigo-900">
                            {rule.format === "tu-luan" ? "Tự luận" : "Trắc nghiệm"} - {rule.diffName}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <button onClick={() => updateQuantity(rule.id, -1)} className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-700 font-bold w-8 h-8 flex items-center justify-center">-</button>
                          <span className="font-semibold text-gray-900 w-4 text-center">{rule.quantity}</span>
                          <button onClick={() => updateQuantity(rule.id, 1)} className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-700 font-bold w-8 h-8 flex items-center justify-center">+</button>
                          <button onClick={() => removeRule(rule.id)} className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded-lg text-sm font-semibold">Xóa</button>
                        </div>
                      </div>
                    ))}

                    {!isAddingQuestion && !isGeneratingQuestion && (
                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={() => setIsAddingQuestion(true)}
                          className="flex-1 p-4 rounded-xl border-2 border-dashed border-gray-200 text-gray-500 hover:border-violet-300 hover:text-violet-600 hover:bg-violet-50 transition-all font-semibold flex items-center justify-center gap-2"
                        >
                          <span>+ Thêm tùy chỉnh</span>
                        </button>
                        {customRules.length > 0 && (
                          <button
                            onClick={() => setShowSaveDialog(true)}
                            className="px-6 py-4 rounded-xl bg-violet-50 text-violet-700 hover:bg-violet-100 font-bold transition-all flex items-center gap-2"
                          >
                            <Save size={18} /> Lưu cấu trúc
                          </button>
                        )}
                      </div>
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
              disabled={structureType !== "custom" || customRules.length === 0}
              onClick={() => {
                const initDist: Record<string, Record<number, number>> = {};
                customRules.forEach(r => {
                  initDist[r.id] = {};
                  EXERCISE_TYPES.forEach(et => {
                    initDist[r.id][et.id] = 0;
                  });
                });
                setDistributionState(initDist);
                setCurrentRuleIndex(0);
                setIsGeneratingWizard(true);
              }}
              className={`w-full max-w-sm flex items-center justify-center gap-2 py-3.5 rounded-xl text-base font-bold transition-all duration-300 ${structureType === "custom" && customRules.length > 0
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 hover:-translate-y-0.5"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
            >
              <span>✨ Tạo Đề Ngay</span>
            </button>
          )}
        </div>
      </div>
    </div>

    {isAddingQuestion && !isGeneratingQuestion && (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <div className="w-full max-w-md p-6 rounded-2xl border border-violet-100 bg-white shadow-2xl space-y-6 animate-in zoom-in-95 fade-in duration-200">
              <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-4">
                <h3 className="text-lg font-bold text-gray-900">Tạo câu hỏi mới</h3>
                <button 
                  onClick={() => {
                    setIsAddingQuestion(false);
                    setNewExerciseType(null);
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
                    <p className="text-sm font-semibold text-gray-700 mb-3">2. Chọn độ khó:</p>
                    <div className="grid grid-cols-3 gap-3">
                      {DIFFICULTIES.map(diff => (
                        <button
                          key={diff.id}
                          onClick={() => handleAddCustomRule(diff.id, diff.name)}
                          className="py-3 px-2 text-sm font-semibold rounded-xl border border-gray-200 hover:border-violet-300 hover:bg-violet-50 text-gray-600 hover:text-violet-700 transition-all"
                        >
                          {diff.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
    {showSaveDialog && (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <div className="w-full max-w-sm p-0 rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 fade-in duration-200 overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <h3 className="text-xl font-bold text-gray-900">{editingBlueprintId ? "Cập nhật cấu trúc đề" : "Lưu cấu trúc đề"}</h3>
            <button onClick={() => setShowSaveDialog(false)} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên cấu trúc <span className="text-red-500">*</span></label>
              <input 
                type="text"
                value={blueprintName}
                onChange={(e) => setBlueprintName(e.target.value)}
                placeholder="Ví dụ: Đề kiểm tra 15 phút Toán lớp 1..."
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500"
                autoFocus
              />
            </div>
            <button
              onClick={saveCustomBlueprint}
              disabled={!blueprintName.trim() || isSavingBlueprint}
              className="w-full py-3.5 rounded-xl bg-violet-600 text-white font-bold hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 transition-all"
            >
              {isSavingBlueprint ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              {editingBlueprintId ? "Cập nhật" : "Lưu lại"}
            </button>
          </div>
        </div>
      </div>
    )}

    {isGeneratingWizard && (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <div className="w-full max-w-md p-6 rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 fade-in duration-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">Phân bổ Dạng Bài</h3>
            <button onClick={() => setIsGeneratingWizard(false)} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
          
          {customRules[currentRuleIndex] && (() => {
            const rule = customRules[currentRuleIndex];
            const dist = distributionState[rule.id] || {};
            const currentTotal = Object.values(dist).reduce((a, b) => a + b, 0);
            const needed = rule.quantity;
            const isMatch = currentTotal === needed;
            
            return (
              <div className="space-y-6">
                <div className="p-4 bg-violet-50 rounded-xl border border-violet-100">
                  <p className="font-semibold text-violet-900 mb-1">
                    {rule.format === "tu-luan" ? "Tự luận" : "Trắc nghiệm"} - {rule.diffName}
                  </p>
                  <p className="text-sm text-violet-700">
                    Bạn cần phân bổ đúng <strong className="text-xl">{needed}</strong> câu hỏi. 
                    (Đã phân bổ: {currentTotal}/{needed})
                  </p>
                  {currentTotal > needed && (
                    <p className="text-xs text-red-500 mt-1 font-bold">Vượt quá số lượng cho phép!</p>
                  )}
                </div>

                <div className="space-y-3">
                  {EXERCISE_TYPES.map(et => (
                    <div key={et.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-xl hover:border-gray-300">
                      <span className="font-medium text-gray-700">{et.name}</span>
                      <div className="flex items-center gap-3">
                        <button onClick={() => updateDistribution(rule.id, et.id, -1)} className="p-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-700 font-bold w-8 h-8 flex items-center justify-center">-</button>
                        <span className="font-semibold text-gray-900 w-4 text-center">{dist[et.id] || 0}</span>
                        <button onClick={() => updateDistribution(rule.id, et.id, 1)} className="p-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-700 font-bold w-8 h-8 flex items-center justify-center">+</button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-3 pt-2 border-t border-gray-100">
                  <button 
                    disabled={currentRuleIndex === 0}
                    onClick={() => setCurrentRuleIndex(prev => prev - 1)}
                    className="px-4 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition-colors"
                  >
                    Quay lại
                  </button>
                  {currentRuleIndex < customRules.length - 1 ? (
                    <button 
                      disabled={!isMatch}
                      onClick={() => setCurrentRuleIndex(prev => prev + 1)}
                      className="flex-1 py-3 rounded-xl font-bold text-white bg-violet-600 hover:bg-violet-700 disabled:opacity-50 transition-colors"
                    >
                      Tiếp tục ({currentRuleIndex + 1}/{customRules.length})
                    </button>
                  ) : (
                    <button 
                      disabled={!isMatch || isGeneratingExamAPI}
                      onClick={executeGenerateExam}
                      className="flex-1 py-3 rounded-xl font-bold text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 flex justify-center items-center gap-2 transition-colors"
                    >
                      {isGeneratingExamAPI ? <Loader2 className="animate-spin" size={18} /> : null}
                      Sinh đề thi ngay!
                    </button>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    )}

    {generatedQuestions.length > 0 && (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-violet-50">
            <div>
              <h2 className="text-2xl font-bold text-violet-900">Chi tiết Đề Thi</h2>
              <p className="text-violet-700 text-sm mt-1">Gồm {generatedQuestions.length} câu hỏi được sinh ngẫu nhiên.</p>
            </div>
            <button onClick={() => setGeneratedQuestions([])} className="p-2 text-violet-400 hover:text-violet-700 hover:bg-violet-100 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {generatedQuestions.map((q, idx) => (
              <div key={idx} className="p-5 border border-gray-200 rounded-2xl bg-white shadow-sm">
                <p className="font-bold text-gray-900 mb-3 text-lg">Câu {idx + 1}: <span className="font-normal">{q.content}</span></p>
                {q.choices && q.choices.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {q.choices.map((c: string, i: number) => (
                      <div key={i} className={`p-3 rounded-xl border ${c === q.correctAnswer ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                        <span className="font-bold mr-2">{String.fromCharCode(65 + i)}.</span> {c}
                      </div>
                    ))}
                  </div>
                )}
                {(!q.choices || q.choices.length === 0) && (
                  <div className="p-3 bg-green-50 text-green-800 border border-green-200 rounded-xl mb-2 font-medium">
                    Đáp án: {q.correctAnswer}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
             <button onClick={() => setGeneratedQuestions([])} className="px-6 py-3 font-bold text-gray-600 hover:bg-gray-200 bg-gray-100 rounded-xl transition-colors">
               Đóng
             </button>
             <button className="px-6 py-3 font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-xl transition-colors shadow-lg">
               Lưu / Tải đề thi
             </button>
          </div>
        </div>
      </div>
    )}
    </>,
    document.body
  );
}
