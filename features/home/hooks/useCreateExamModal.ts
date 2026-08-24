import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { CustomRule } from "../types/createExam.types";
import { EXERCISE_TYPES, SUBJECT_CODE_MAP, getExerciseTypes, QuestionFormat, QuestionDifficulty } from "../constants/createExam.constants";
import { createExamApi } from "../api/createExam.api";

export const useCreateExamModal = () => {
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
  const [isSavingExam, setIsSavingExam] = useState(false);
  const [showSaveExamDialog, setShowSaveExamDialog] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

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

      const { data } = await createExamApi.fetchBlueprints(user.id);
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
        const { error: bpError } = await createExamApi.updateBlueprint(editingBlueprintId, blueprintName);
        if (bpError) throw bpError;

        const { error: delError } = await createExamApi.deleteBlueprintRules(editingBlueprintId);
        if (delError) throw delError;
      } else {
        const { data: blueprint, error: bpError } = await createExamApi.createBlueprint(blueprintName, user.id);
        if (bpError) throw bpError;
        blueprintId = blueprint.Id;
      }

      const rulesPayload = customRules.map(q => ({
        BlueprintId: blueprintId as number,
        Topic: "Câu hỏi tuỳ chỉnh",
        Difficulty: q.diffName === "Dễ" ? QuestionDifficulty.Easy : q.diffName === "Trung bình" ? QuestionDifficulty.Medium : QuestionDifficulty.Hard,
        QuestionFormat: q.format === "tu-luan" ? QuestionFormat.Essay : QuestionFormat.MultipleChoice,
        Quantity: q.quantity
      }));

      const { error: rulesError } = await createExamApi.createBlueprintRules(rulesPayload);
      if (rulesError) throw rulesError;

      setShowSaveDialog(false);
      setBlueprintName("");
      setEditingBlueprintId(null);
      setStructureType("saved");
    } catch (error: any) {
      alert("Lỗi khi lưu cấu trúc: " + error.message);
    } finally {
      setIsSavingBlueprint(false);
    }
  };

  const handleDeleteBlueprint = async (id: number) => {
    try {
      const { error } = await createExamApi.deleteBlueprint(id);
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
      const diffName = rule.Difficulty === QuestionDifficulty.Easy ? "Dễ" : rule.Difficulty === QuestionDifficulty.Medium ? "Trung bình" : "Khó";
      const diffId = rule.Difficulty === QuestionDifficulty.Easy ? "easy" : rule.Difficulty === QuestionDifficulty.Medium ? "medium" : "hard";
      const format = rule.QuestionFormat === QuestionFormat.Essay ? "tu-luan" : "trac-nghiem";
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

  const SUPPORTED_SUBJECTS = ["Toán", "Tiếng Việt"];
  const canProceed = selectedGrade === "Lớp 1" && selectedSubject !== null && SUPPORTED_SUBJECTS.includes(selectedSubject);
  const hasSelectedBoth = selectedGrade && selectedSubject;

  const handleAddCustomRule = (diffId: string, diffName: string, overrideFormat?: "tu-luan" | "trac-nghiem") => {
    const finalFormat = overrideFormat || questionFormat;
    if (!finalFormat) return;

    setCustomRules(prev => {
      const existing = prev.find(r => r.format === finalFormat && r.diffId === diffId);
      if (existing) {
        return prev.map(r => r.id === existing.id ? { ...r, quantity: r.quantity + 1 } : r);
      }
      return [...prev, {
        id: Date.now().toString(),
        format: finalFormat,
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
            const subjectCode = SUBJECT_CODE_MAP[selectedSubject || "Toán"] || "toan";
            const payload = {
              subject: subjectCode,
              difficulty: rule.diffName === "Khó" ? QuestionDifficulty.Hard : rule.diffName === "Trung bình" ? QuestionDifficulty.Medium : QuestionDifficulty.Easy,
              exerciseType: typeId,
              gradeLevel: gradeMap[selectedGrade || "Lớp 1"] || 1,
              quantity: qty,
              format: rule.format === "tu-luan" ? QuestionFormat.Essay : QuestionFormat.MultipleChoice
            };

            promises.push(
              createExamApi.generateExercises(payload).then(res => {
                if (res.success && res.data) {
                  res.data = res.data.map((q: any) => ({ ...q, format: rule.format, exerciseType: typeId }));
                }
                return res;
              })
            );
          }
        }
      }

      const results = await Promise.all(promises);
      let allQuestions: any[] = [];
      let hasError = false;
      let errorMsg = "";

      results.forEach(res => {
        if (res.success && res.data) {
          allQuestions = [...allQuestions, ...res.data];
        } else if (!res.success) {
          hasError = true;
          errorMsg = res.errorMessage || "Có lỗi xảy ra khi tạo câu hỏi.";
        }
      });

      if (hasError) {
        alert(errorMsg);
        setIsGeneratingExamAPI(false);
        return;
      }

      if (allQuestions.length === 0) {
        alert("Không thể tạo được đề thi (không tìm thấy câu hỏi phù hợp).");
        setIsGeneratingExamAPI(false);
        return;
      }

      setGeneratedQuestions(allQuestions);
      setIsGeneratingWizard(false);
    } catch (error) {
      alert("Có lỗi xảy ra khi tạo đề thi: " + error);
    } finally {
      setIsGeneratingExamAPI(false);
    }
  };

  const handleSaveExamToSupabase = async (details: { title: string, difficulty: number, durationMinutes: number, totalScore: number }) => {
    if (generatedQuestions.length === 0) return;
    setIsSavingExam(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("Vui lòng đăng nhập để lưu đề thi.");
        return;
      }

      const gradeMap: Record<string, number> = {
        "Lớp 1": 1, "Lớp 2": 2, "Lớp 3": 3, "Lớp 4": 4, "Lớp 5": 5
      };

      const now = new Date();
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const gmt7 = new Date(utc + (3600000 * 7));
      const createdAt = `${gmt7.getFullYear()}-${String(gmt7.getMonth() + 1).padStart(2, '0')}-${String(gmt7.getDate()).padStart(2, '0')}T${String(gmt7.getHours()).padStart(2, '0')}:${String(gmt7.getMinutes()).padStart(2, '0')}:${String(gmt7.getSeconds()).padStart(2, '0')}+07:00`;

      const payload = {
        title: details.title,
        gradeLevel: gradeMap[selectedGrade || "Lớp 1"] || 1,
        subject: selectedSubject || "Chung",
        durationMinutes: details.durationMinutes,
        totalScore: details.totalScore,
        difficulty: details.difficulty,
        blueprintId: editingBlueprintId,
        createdAt: createdAt,
        questions: generatedQuestions
      };

      await createExamApi.saveGeneratedExam(payload, user.id);
      alert("Lưu đề thi vào hệ thống thành công!");
      setShowSaveExamDialog(false);
    } catch (error: any) {
      alert("Lỗi khi lưu đề thi: " + error.message);
    } finally {
      setIsSavingExam(false);
    }
  };

  const handleDownloadDocx = async () => {
    setIsExporting(true);
    try {
      let defaultFileName = "DeThi";
      if (selectedSubject && selectedGrade) {
        const subject = selectedSubject.replace(/\s+/g, '');
        const grade = selectedGrade.replace(/\s+/g, '');
        defaultFileName = `DeThi${subject}${grade}`;
      }

      const payload = {
        fileName: defaultFileName,
        exercises: generatedQuestions.map(q => ({
          content: q.content,
          choices: q.format === "tu-luan" ? [] : q.choices,
          correctAnswer: q.correctAnswer,
          exerciseType: q.exerciseType || 0
        }))
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
    } catch (error) {
      alert("Lỗi khi tải file DOCX: " + error);
    } finally {
      setIsExporting(false);
    }
  };

  return {
    state: {
      step, selectedGrade, selectedSubject, structureType, deletingId, customRules, isAddingQuestion, isGeneratingQuestion, questionFormat, newExerciseType, isGeneratingWizard, currentRuleIndex, distributionState, generatedQuestions, isGeneratingExamAPI, isSavingExam, showSaveExamDialog, savedBlueprints, isLoadingBlueprints, blueprintName, editingBlueprintId, isSavingBlueprint, showSaveDialog, canProceed, hasSelectedBoth, isExporting
    },
    actions: {
      setStep, setSelectedGrade, setSelectedSubject, setStructureType, setDeletingId, setCustomRules, setIsAddingQuestion, setIsGeneratingQuestion, setQuestionFormat, setNewExerciseType, setIsGeneratingWizard, setCurrentRuleIndex, setDistributionState, setGeneratedQuestions, setIsGeneratingExamAPI, setSavedBlueprints, setIsLoadingBlueprints, setBlueprintName, setEditingBlueprintId, setIsSavingBlueprint, setShowSaveDialog, setShowSaveExamDialog, fetchBlueprints, saveCustomBlueprint, handleDeleteBlueprint, handleEditBlueprint, handleAddCustomRule, updateQuantity, removeRule, updateDistribution, executeGenerateExam, handleSaveExamToSupabase, handleDownloadDocx
    }
  };
};
