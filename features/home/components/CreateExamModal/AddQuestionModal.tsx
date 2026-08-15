import { X } from "lucide-react";
import { DIFFICULTIES } from "../../constants/createExam.constants";

interface Props {
  questionFormat: "tu-luan" | "trac-nghiem" | null;
  onSetIsAddingQuestion: (val: boolean) => void;
  onSetNewExerciseType: (val: number | null) => void;
  onSetQuestionFormat: (val: "tu-luan" | "trac-nghiem" | null) => void;
  onAddCustomRule: (diffId: string, diffName: string) => void;
}

export const AddQuestionModal = ({
  questionFormat, onSetIsAddingQuestion, onSetNewExerciseType, onSetQuestionFormat, onAddCustomRule
}: Props) => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md p-6 rounded-2xl border border-violet-100 bg-white shadow-2xl space-y-6 animate-in zoom-in-95 fade-in duration-200">
        <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-4">
          <h3 className="text-lg font-bold text-gray-900">Tạo câu hỏi mới</h3>
          <button 
            onClick={() => {
              onSetIsAddingQuestion(false);
              onSetNewExerciseType(null);
              onSetQuestionFormat(null);
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
              onClick={() => onSetQuestionFormat("tu-luan")}
              className={`py-3 px-3 text-sm font-semibold rounded-xl border transition-all ${questionFormat === "tu-luan" ? 'bg-violet-50 border-violet-500 text-violet-700 shadow-sm ring-1 ring-violet-500' : 'border-gray-200 hover:border-violet-300 hover:bg-violet-50 text-gray-600'}`}
            >
              Tự luận
            </button>
            <button
              onClick={() => onSetQuestionFormat("trac-nghiem")}
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
                    onClick={() => onAddCustomRule(diff.id, diff.name)}
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
  );
};
