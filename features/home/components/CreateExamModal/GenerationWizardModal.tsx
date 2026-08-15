import { X, Loader2 } from "lucide-react";
import { EXERCISE_TYPES } from "../../constants/createExam.constants";
import { CustomRule } from "../../types/createExam.types";

interface Props {
  customRules: CustomRule[];
  currentRuleIndex: number;
  distributionState: Record<string, Record<number, number>>;
  isGeneratingExamAPI: boolean;
  onSetIsGeneratingWizard: (val: boolean) => void;
  onSetCurrentRuleIndex: (val: number | ((prev: number) => number)) => void;
  onUpdateDistribution: (ruleId: string, exerciseTypeId: number, delta: number) => void;
  onExecuteGenerateExam: () => void;
}

export const GenerationWizardModal = ({
  customRules, currentRuleIndex, distributionState, isGeneratingExamAPI,
  onSetIsGeneratingWizard, onSetCurrentRuleIndex, onUpdateDistribution, onExecuteGenerateExam
}: Props) => {
  const rule = customRules[currentRuleIndex];
  if (!rule) return null;

  const dist = distributionState[rule.id] || {};
  const currentTotal = Object.values(dist).reduce((a, b) => a + b, 0);
  const needed = rule.quantity;
  const isMatch = currentTotal === needed;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md p-6 rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 fade-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Phân bổ Dạng Bài</h3>
          <button onClick={() => onSetIsGeneratingWizard(false)} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        
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
                  <button onClick={() => onUpdateDistribution(rule.id, et.id, -1)} className="p-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-700 font-bold w-8 h-8 flex items-center justify-center">-</button>
                  <span className="font-semibold text-gray-900 w-4 text-center">{dist[et.id] || 0}</span>
                  <button onClick={() => onUpdateDistribution(rule.id, et.id, 1)} className="p-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-700 font-bold w-8 h-8 flex items-center justify-center">+</button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <button 
              disabled={currentRuleIndex === 0}
              onClick={() => onSetCurrentRuleIndex(prev => prev - 1)}
              className="px-4 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition-colors"
            >
              Quay lại
            </button>
            {currentRuleIndex < customRules.length - 1 ? (
              <button 
                disabled={!isMatch}
                onClick={() => onSetCurrentRuleIndex(prev => prev + 1)}
                className="flex-1 py-3 rounded-xl font-bold text-white bg-violet-600 hover:bg-violet-700 disabled:opacity-50 transition-colors"
              >
                Tiếp tục ({currentRuleIndex + 1}/{customRules.length})
              </button>
            ) : (
              <button 
                disabled={!isMatch || isGeneratingExamAPI}
                onClick={onExecuteGenerateExam}
                className="flex-1 py-3 rounded-xl font-bold text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 flex justify-center items-center gap-2 transition-colors"
              >
                {isGeneratingExamAPI ? <Loader2 className="animate-spin" size={18} /> : null}
                Sinh đề thi ngay!
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
