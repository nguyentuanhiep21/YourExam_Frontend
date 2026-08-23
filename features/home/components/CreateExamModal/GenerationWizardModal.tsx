import { X, Loader2 } from "lucide-react";
import { getExerciseTypes } from "../../constants/createExam.constants";
import { CustomRule } from "../../types/createExam.types";

interface Props {
  selectedSubject: string | null;
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
  selectedSubject, customRules, currentRuleIndex, distributionState, isGeneratingExamAPI,
  onSetIsGeneratingWizard, onSetCurrentRuleIndex, onUpdateDistribution, onExecuteGenerateExam
}: Props) => {
  const rule = customRules[currentRuleIndex];
  if (!rule) return null;

  const exerciseTypes = getExerciseTypes(selectedSubject, rule.format);
  const dist = distributionState[rule.id] || {};
  const currentTotal = Object.values(dist).reduce((a, b) => a + b, 0);
  const needed = rule.quantity;
  const isMatch = currentTotal === needed;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md p-7 rounded-[2rem] bg-white/95 backdrop-blur-xl border border-white/80 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] animate-in zoom-in-[0.98] duration-300">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200/50">
          <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">Phân bổ Dạng Bài</h3>
          <button onClick={() => onSetIsGeneratingWizard(false)} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all active:scale-95">
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-6">
          <div className="p-5 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-[1.25rem] border border-indigo-100/50 shadow-inner">
            <p className="font-extrabold text-indigo-900 mb-1.5 text-lg">
              {rule.format === "tu-luan" ? "Tự luận" : "Trắc nghiệm"}{rule.diffName !== "Mặc định" ? ` - ${rule.diffName}` : ""}
            </p>
            <p className="text-sm text-indigo-700/80 font-medium">
              Cần phân bổ <strong className="text-xl text-indigo-700">{needed}</strong> câu. 
              (Đã chọn: <span className={currentTotal > needed ? 'text-red-500 font-bold' : 'font-bold'}>{currentTotal}/{needed}</span>)
            </p>
            {currentTotal > needed && (
              <p className="text-xs text-red-500 mt-2 font-bold bg-red-50 p-2 rounded-lg inline-block border border-red-100">Vượt quá số lượng cho phép!</p>
            )}
          </div>

          <div className="space-y-3">
            {exerciseTypes.map(et => (
              <div key={et.id} className="flex items-center justify-between gap-4 p-4 border border-gray-200/80 rounded-[1.25rem] hover:border-indigo-200 hover:shadow-sm bg-white transition-all duration-300">
                <span className="font-bold text-gray-700 flex-1">{et.name}</span>
                <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-100 shrink-0">
                  <button onClick={() => onUpdateDistribution(rule.id, et.id, -1)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm text-gray-600 font-bold transition-all">-</button>
                  <span className="font-bold text-gray-900 w-6 text-center">{dist[et.id] || 0}</span>
                  <button onClick={() => onUpdateDistribution(rule.id, et.id, 1)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm text-gray-600 font-bold transition-all">+</button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex gap-3 pt-5 border-t border-gray-200/50">
            <button 
              disabled={currentRuleIndex === 0}
              onClick={() => onSetCurrentRuleIndex(prev => prev - 1)}
              className="px-5 py-4 rounded-2xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition-all active:scale-95 border border-gray-200"
            >
              Quay lại
            </button>
            {currentRuleIndex < customRules.length - 1 ? (
              <button 
                disabled={!isMatch}
                onClick={() => onSetCurrentRuleIndex(prev => prev + 1)}
                className="flex-1 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:shadow-[0_8px_20px_rgba(99,102,241,0.3)] disabled:opacity-50 transition-all active:scale-95 disabled:hover:shadow-none disabled:active:scale-100"
              >
                Tiếp tục ({currentRuleIndex + 1}/{customRules.length})
              </button>
            ) : (
              <button 
                disabled={!isMatch || isGeneratingExamAPI}
                onClick={onExecuteGenerateExam}
                className="flex-1 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-[0_8px_20px_rgba(16,185,129,0.3)] disabled:opacity-50 flex justify-center items-center gap-2 transition-all active:scale-95 disabled:hover:shadow-none disabled:active:scale-100"
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
