import { X } from "lucide-react";
import { DIFFICULTIES } from "../../constants/createExam.constants";

interface Props {
  selectedSubject: string | null;
  questionFormat: "tu-luan" | "trac-nghiem" | null;
  onSetIsAddingQuestion: (val: boolean) => void;
  onSetNewExerciseType: (val: number | null) => void;
  onSetQuestionFormat: (val: "tu-luan" | "trac-nghiem" | null) => void;
  onAddCustomRule: (diffId: string, diffName: string, overrideFormat?: "tu-luan" | "trac-nghiem") => void;
}

export const AddQuestionModal = ({
  selectedSubject, questionFormat, onSetIsAddingQuestion, onSetNewExerciseType, onSetQuestionFormat, onAddCustomRule
}: Props) => {
  const handleFormatSelect = (format: "tu-luan" | "trac-nghiem") => {
    if (selectedSubject === "Tiếng Việt") {
      onAddCustomRule("default", "Mặc định", format);
    } else {
      onSetQuestionFormat(format);
    }
  };
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md p-7 rounded-[2rem] border border-white/80 bg-white/95 backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] space-y-6 animate-in zoom-in-[0.98] duration-300">
        <div className="flex justify-between items-center mb-4 border-b border-gray-200/50 pb-5">
          <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">Thêm tùy chỉnh mới</h3>
          <button 
            onClick={() => {
              onSetIsAddingQuestion(false);
              onSetNewExerciseType(null);
              onSetQuestionFormat(null);
            }} 
            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <p className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">1. Chọn hình thức</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleFormatSelect("tu-luan")}
              className={`py-3.5 px-3 text-sm font-bold rounded-2xl border transition-all duration-300 overflow-hidden relative ${questionFormat === "tu-luan" ? 'bg-gradient-to-br from-indigo-50 to-violet-50 border-indigo-400 text-indigo-700 shadow-[0_4px_12px_rgba(99,102,241,0.15)] ring-1 ring-indigo-400 hover:-translate-y-0.5' : 'bg-white border-gray-200/80 hover:border-indigo-300 hover:bg-indigo-50/30 hover:shadow-sm hover:-translate-y-0.5 active:scale-95 text-gray-600'}`}
            >
              <span className="relative z-10">Tự luận</span>
              {questionFormat === "tu-luan" && <div className="absolute inset-0 rounded-2xl bg-indigo-400/10 animate-pulse"></div>}
            </button>
            <button
              onClick={() => handleFormatSelect("trac-nghiem")}
              className={`py-3.5 px-3 text-sm font-bold rounded-2xl border transition-all duration-300 overflow-hidden relative ${questionFormat === "trac-nghiem" ? 'bg-gradient-to-br from-indigo-50 to-violet-50 border-indigo-400 text-indigo-700 shadow-[0_4px_12px_rgba(99,102,241,0.15)] ring-1 ring-indigo-400 hover:-translate-y-0.5' : 'bg-white border-gray-200/80 hover:border-indigo-300 hover:bg-indigo-50/30 hover:shadow-sm hover:-translate-y-0.5 active:scale-95 text-gray-600'}`}
            >
              <span className="relative z-10">Trắc nghiệm</span>
              {questionFormat === "trac-nghiem" && <div className="absolute inset-0 rounded-2xl bg-indigo-400/10 animate-pulse"></div>}
            </button>
          </div>
        </div>

        {questionFormat && (
          <div className="pt-5 border-t border-gray-200/50 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
            <div>
              <p className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">2. Chọn độ khó</p>
              <div className="grid grid-cols-3 gap-3">
                {DIFFICULTIES.map(diff => (
                  <button
                    key={diff.id}
                    onClick={() => onAddCustomRule(diff.id, diff.name)}
                    className="py-3.5 px-2 text-sm font-bold rounded-2xl border border-gray-200/80 bg-white hover:border-violet-400 hover:bg-violet-50/50 text-gray-600 hover:text-violet-700 hover:shadow-[0_4px_12px_rgba(139,92,246,0.1)] hover:-translate-y-0.5 active:scale-95 transition-all duration-300"
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
  );
};
