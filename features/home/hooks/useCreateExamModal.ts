import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { CustomRule } from "../types/createExam.types";
import { EXERCISE_TYPES } from "../constants/createExam.constants";
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
        Difficulty: q.diffName === "Dễ" ? 1 : q.diffName === "Trung bình" ? 2 : 3,
        QuestionFormat: q.format === "tu-luan" ? 2 : 1, 
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
            const payload = {
              Subject: selectedSubject || "Toán",
              Difficulty: rule.diffName === "Dễ" ? 1 : rule.diffName === "Trung bình" ? 2 : 3,
              ExerciseType: typeId,
              GradeLevel: gradeMap[selectedGrade || "Lớp 1"] || 1,
              Quantity: qty
            };

            promises.push(
              createExamApi.generateExercises(payload).then(res => {
                if (res.success && res.data) {
                  res.data = res.data.map((q: any) => ({ ...q, format: rule.format }));
                }
                return res;
              })
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
      setIsGeneratingWizard(false);
    } catch (error) {
      alert("Có lỗi xảy ra khi tạo đề thi: " + error);
    } finally {
      setIsGeneratingExamAPI(false);
    }
  };

  return {
    state: {
      step, selectedGrade, selectedSubject, structureType, deletingId, customRules, isAddingQuestion, isGeneratingQuestion, questionFormat, newExerciseType, isGeneratingWizard, currentRuleIndex, distributionState, generatedQuestions, isGeneratingExamAPI, savedBlueprints, isLoadingBlueprints, blueprintName, editingBlueprintId, isSavingBlueprint, showSaveDialog, canProceed, hasSelectedBoth
    },
    actions: {
      setStep, setSelectedGrade, setSelectedSubject, setStructureType, setDeletingId, setCustomRules, setIsAddingQuestion, setIsGeneratingQuestion, setQuestionFormat, setNewExerciseType, setIsGeneratingWizard, setCurrentRuleIndex, setDistributionState, setGeneratedQuestions, setIsGeneratingExamAPI, setSavedBlueprints, setIsLoadingBlueprints, setBlueprintName, setEditingBlueprintId, setIsSavingBlueprint, setShowSaveDialog, fetchBlueprints, saveCustomBlueprint, handleDeleteBlueprint, handleEditBlueprint, handleAddCustomRule, updateQuantity, removeRule, updateDistribution, executeGenerateExam
    }
  };
};
