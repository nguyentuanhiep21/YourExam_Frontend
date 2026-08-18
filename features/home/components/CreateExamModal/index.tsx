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
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <div className="relative w-full max-w-3xl bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="text-left">
              <h2 className="text-2xl font-bold text-gray-900">
                {state.step === 1 ? "Khởi tạo đề thi" : "Tùy chỉnh & Hoàn tất"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {state.step === 1 ? "Bước 1: Chọn Lớp và Môn học" : "Bước 2: Cấu trúc đề thi"}
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
          <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex flex-col items-center">
            {state.step === 1 && (
              <div className="w-full flex flex-col items-center">
                <button
                  disabled={!state.canProceed}
                  onClick={() => actions.setStep(2)}
                  className={`w-full max-w-sm py-3.5 rounded-xl text-base font-bold transition-all duration-300 ${state.canProceed
                      ? "bg-violet-600 text-white shadow-lg shadow-violet-200 hover:bg-violet-700 hover:-translate-y-0.5"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                >
                  Tiếp tục
                </button>
                {state.hasSelectedBoth && !state.canProceed && (
                  <p className="mt-3 text-sm text-amber-600 font-medium">
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
                className={`w-full max-w-sm flex items-center justify-center gap-2 py-3.5 rounded-xl text-base font-bold transition-all duration-300 ${state.structureType === "custom" && state.customRules.length > 0
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
