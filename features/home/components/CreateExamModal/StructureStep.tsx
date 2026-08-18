import { Loader2, Trash2, Save } from "lucide-react";
import { CustomRule } from "../../types/createExam.types";

interface Props {
  selectedGrade: string | null;
  selectedSubject: string | null;
  structureType: "template" | "custom" | "saved" | null;
  savedBlueprints: any[];
  isLoadingBlueprints: boolean;
  deletingId: number | null;
  customRules: CustomRule[];
  isAddingQuestion: boolean;
  isGeneratingQuestion: boolean;
  onSetStep: (step: number) => void;
  onSetStructureType: (type: "template" | "custom" | "saved" | null) => void;
  onSetDeletingId: (id: number | null) => void;
  onSetCustomRules: (rules: CustomRule[]) => void;
  onSetBlueprintName: (name: string) => void;
  onSetEditingBlueprintId: (id: number | null) => void;
  onDeleteBlueprint: (id: number) => void;
  onEditBlueprint: (bp: any) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveRule: (id: string) => void;
  onSetIsAddingQuestion: (val: boolean) => void;
  onSetShowSaveDialog: (val: boolean) => void;
}

export const StructureStep = ({
  selectedGrade, selectedSubject, structureType, savedBlueprints, isLoadingBlueprints, deletingId, customRules,
  isAddingQuestion, isGeneratingQuestion,
  onSetStep, onSetStructureType, onSetDeletingId, onSetCustomRules, onSetBlueprintName, onSetEditingBlueprintId,
  onDeleteBlueprint, onEditBlueprint, onUpdateQuantity, onRemoveRule, onSetIsAddingQuestion, onSetShowSaveDialog
}: Props) => {
  return (
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
            onSetStep(1);
            onSetStructureType(null);
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
              onClick={() => onSetStructureType("template")}
              className="flex flex-col items-start p-6 rounded-2xl border border-gray-200 bg-white hover:border-violet-300 hover:bg-violet-50 transition-all duration-200 text-left"
            >
              <span className="font-bold text-lg text-gray-900 mb-2">💡 Gợi ý</span>
              <span className="text-sm text-gray-500">Tạo đề nhanh dựa trên các khung cấu trúc chuẩn của Bộ GD&ĐT.</span>
            </button>
            <button
              onClick={() => {
                onSetCustomRules([]);
                onSetBlueprintName("");
                onSetEditingBlueprintId(null);
                onSetStructureType("custom");
              }}
              className="flex flex-col items-start p-6 rounded-2xl border border-gray-200 bg-white hover:border-violet-300 hover:bg-violet-50 transition-all duration-200 text-left"
            >
              <span className="font-bold text-lg text-gray-900 mb-2">⚙️ Tùy chỉnh</span>
              <span className="text-sm text-gray-500">Tự do thiết kế cấu trúc đề thi, chọn độ khó cho từng câu hỏi riêng biệt.</span>
            </button>
            <button
              onClick={() => onSetStructureType("saved")}
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
            <button onClick={() => onSetStructureType(null)} className="text-sm text-gray-500 hover:text-gray-800 font-medium underline-offset-2 hover:underline">
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
            <button onClick={() => onSetStructureType(null)} className="text-sm text-gray-500 hover:text-gray-800 font-medium underline-offset-2 hover:underline">
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
                  <div onClick={() => onEditBlueprint(bp)} className="flex-1 flex flex-col gap-2">
                    <h4 className="font-bold text-gray-900 text-lg group-hover:text-violet-700 transition-colors">{bp.Name}</h4>
                    <p className="text-sm text-gray-500 font-medium">{bp.BlueprintRules?.length || 0} câu hỏi thiết kế</p>
                  </div>
                  {deletingId === bp.Id ? (
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); onDeleteBlueprint(bp.Id); }}
                        className="px-3 py-1.5 bg-red-500 text-white text-sm font-bold rounded-lg hover:bg-red-600 transition-colors shadow-sm"
                      >
                        Xóa ngay
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onSetDeletingId(null); }}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Hủy
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSetDeletingId(bp.Id);
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
                onSetCustomRules([]);
                onSetBlueprintName("");
                onSetEditingBlueprintId(null);
                onSetStructureType("custom");
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
            <button onClick={() => onSetStructureType(null)} className="text-sm text-gray-500 hover:text-gray-800 font-medium underline-offset-2 hover:underline">
              &larr; Quay lại
            </button>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider ml-2">Thiết kế câu hỏi</h3>
          </div>

          <div className="space-y-4">
            {customRules.map((rule) => (
              <div key={rule.id} className="p-5 rounded-2xl border border-indigo-100 bg-white shadow-sm flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-lg text-indigo-900">
                    {rule.format === "tu-luan" ? "Tự luận" : "Trắc nghiệm"}{rule.diffName !== "Mặc định" ? ` - ${rule.diffName}` : ""}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => onUpdateQuantity(rule.id, -1)} className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-700 font-bold w-8 h-8 flex items-center justify-center">-</button>
                  <span className="font-semibold text-gray-900 w-4 text-center">{rule.quantity}</span>
                  <button onClick={() => onUpdateQuantity(rule.id, 1)} className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-700 font-bold w-8 h-8 flex items-center justify-center">+</button>
                  <button onClick={() => onRemoveRule(rule.id)} className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded-lg text-sm font-semibold">Xóa</button>
                </div>
              </div>
            ))}

            {!isAddingQuestion && !isGeneratingQuestion && (
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => onSetIsAddingQuestion(true)}
                  className="flex-1 p-4 rounded-xl border-2 border-dashed border-gray-200 text-gray-500 hover:border-violet-300 hover:text-violet-600 hover:bg-violet-50 transition-all font-semibold flex items-center justify-center gap-2"
                >
                  <span>+ Thêm tùy chỉnh</span>
                </button>
                {customRules.length > 0 && (
                  <button
                    onClick={() => onSetShowSaveDialog(true)}
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
  );
};
