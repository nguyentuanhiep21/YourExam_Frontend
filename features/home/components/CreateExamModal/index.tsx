"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { CreateExamModalProps } from "../../types/createExam.types";
import { useCreateExamModal } from "../../hooks/useCreateExamModal";
import { getExerciseTypes } from "../../constants/createExam.constants";

import { BasicInfoStep } from "./BasicInfoStep";
import { StructureStep } from "./StructureStep";
import { AddQuestionModal } from "./AddQuestionModal";
import { SaveBlueprintModal } from "./SaveBlueprintModal";
import { GenerationWizardModal } from "./GenerationWizardModal";
import { ExamPreviewModal } from "./ExamPreviewModal";

export function CreateExamModal({ onClose }: CreateExamModalProps) {
  const { state, actions } = useCreateExamModal();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return createPortal(
    <>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
        <div className="relative w-full max-w-3xl bg-white/85 backdrop-blur-2xl border border-white/80 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-[0.98] duration-300 ease-out">
          {/* Header */}
          <div className="flex items-center justify-between p-7 border-b border-gray-200/50 bg-white/50">
            <div className="text-left">
              <h2 className="text-3xl font-extrabold bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-transparent tracking-tight">
                {state.step === 1 ? "Khởi tạo đề thi" : "Tùy chỉnh & Hoàn tất"}
              </h2>
              <p className="text-sm text-gray-500 mt-1.5 font-medium">
                {state.step === 1 ? "Bước 1: Chọn Lớp và Môn học" : "Bước 2: Cấu trúc đề thi"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100/80 rounded-full transition-all active:scale-95"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {state.step === 1 && (
              <BasicInfoStep
                selectedGrade={state.selectedGrade}
                selectedSubject={state.selectedSubject}
                onSelectGrade={actions.setSelectedGrade}
                onSelectSubject={actions.setSelectedSubject}
              />
            )}

            {state.step === 2 && (
              <StructureStep
                selectedGrade={state.selectedGrade}
                selectedSubject={state.selectedSubject}
                structureType={state.structureType}
                savedBlueprints={state.savedBlueprints}
                isLoadingBlueprints={state.isLoadingBlueprints}
                deletingId={state.deletingId}
                customRules={state.customRules}
                isAddingQuestion={state.isAddingQuestion}
                isGeneratingQuestion={state.isGeneratingQuestion}
                onSetStep={actions.setStep}
                onSetStructureType={actions.setStructureType}
                onSetDeletingId={actions.setDeletingId}
                onSetCustomRules={actions.setCustomRules}
                onSetBlueprintName={actions.setBlueprintName}
                onSetEditingBlueprintId={actions.setEditingBlueprintId}
                onDeleteBlueprint={actions.handleDeleteBlueprint}
                onEditBlueprint={actions.handleEditBlueprint}
                onUpdateQuantity={actions.updateQuantity}
                onRemoveRule={actions.removeRule}
                onSetIsAddingQuestion={actions.setIsAddingQuestion}
                onSetShowSaveDialog={actions.setShowSaveDialog}
              />
            )}
          </div>

          {/* Footer */}
          <div className="p-7 border-t border-gray-200/50 bg-gray-50/80 flex flex-col items-center backdrop-blur-md">
            {state.step === 1 && (
              <div className="w-full flex flex-col items-center">
                <button
                  disabled={!state.canProceed}
                  onClick={() => actions.setStep(2)}
                  className={`w-full max-w-sm py-4 rounded-2xl text-base font-bold transition-all duration-300 ${state.canProceed
                      ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-[0_8px_20px_rgba(139,92,246,0.3)] hover:shadow-[0_12px_25px_rgba(139,92,246,0.4)] hover:-translate-y-1 active:scale-[0.98]"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                    }`}
                >
                  Tiếp tục
                </button>
                {state.hasSelectedBoth && !state.canProceed && (
                  <p className="mt-4 text-sm text-amber-600 font-medium">
                    Hiện tại hệ thống chỉ mới hỗ trợ đề thi Toán và Tiếng Việt Lớp 1. Các môn và khối lớp khác đang được phát triển.
                  </p>
                )}
              </div>
            )}

            {state.step === 2 && (
              <button
                disabled={state.structureType !== "custom" || state.customRules.length === 0}
                onClick={() => {
                  const initDist: Record<string, Record<number, number>> = {};
                  state.customRules.forEach(r => {
                    initDist[r.id] = {};
                    const exerciseTypes = getExerciseTypes(state.selectedSubject, r.format);
                    exerciseTypes.forEach(et => {
                      initDist[r.id][et.id] = 0;
                    });
                  });
                  actions.setDistributionState(initDist);
                  actions.setCurrentRuleIndex(0);
                  actions.setIsGeneratingWizard(true);
                }}
                className={`w-full max-w-sm flex items-center justify-center gap-2 py-4 rounded-2xl text-base font-bold transition-all duration-300 ${state.structureType === "custom" && state.customRules.length > 0
                    ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-[0_8px_20px_rgba(99,102,241,0.3)] hover:shadow-[0_12px_25px_rgba(99,102,241,0.4)] hover:-translate-y-1 active:scale-[0.98]"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                  }`}
              >
                <span>✨ Tạo Đề Ngay</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {state.isAddingQuestion && !state.isGeneratingQuestion && (
        <AddQuestionModal
          selectedSubject={state.selectedSubject}
          questionFormat={state.questionFormat}
          onSetIsAddingQuestion={actions.setIsAddingQuestion}
          onSetNewExerciseType={actions.setNewExerciseType}
          onSetQuestionFormat={actions.setQuestionFormat}
          onAddCustomRule={actions.handleAddCustomRule}
        />
      )}

      {state.showSaveDialog && (
        <SaveBlueprintModal
          editingBlueprintId={state.editingBlueprintId}
          blueprintName={state.blueprintName}
          isSavingBlueprint={state.isSavingBlueprint}
          onSetShowSaveDialog={actions.setShowSaveDialog}
          onSetBlueprintName={actions.setBlueprintName}
          onSaveCustomBlueprint={actions.saveCustomBlueprint}
        />
      )}

      {state.isGeneratingWizard && (
        <GenerationWizardModal
          selectedSubject={state.selectedSubject}
          customRules={state.customRules}
          currentRuleIndex={state.currentRuleIndex}
          distributionState={state.distributionState}
          isGeneratingExamAPI={state.isGeneratingExamAPI}
          onSetIsGeneratingWizard={actions.setIsGeneratingWizard}
          onSetCurrentRuleIndex={actions.setCurrentRuleIndex}
          onUpdateDistribution={actions.updateDistribution}
          onExecuteGenerateExam={actions.executeGenerateExam}
        />
      )}

      {state.generatedQuestions.length > 0 && (
        <ExamPreviewModal
          generatedQuestions={state.generatedQuestions}
          isExporting={state.isExporting}
          onSetGeneratedQuestions={actions.setGeneratedQuestions}
          onDownloadDocx={actions.handleDownloadDocx}
        />
      )}
    </>,
    document.body
  );
}
