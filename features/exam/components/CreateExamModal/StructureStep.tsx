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
  systemBlueprints?: any[];
  isLoadingSystemBlueprints?: boolean;
  onSelectSystemBlueprint?: (bp: any) => void;
}

export const StructureStep = ({
  selectedGrade, selectedSubject, structureType, savedBlueprints, isLoadingBlueprints, systemBlueprints = [], isLoadingSystemBlueprints = false, deletingId, customRules,
  isAddingQuestion, isGeneratingQuestion,
  onSetStep, onSetStructureType, onSetDeletingId, onSetCustomRules, onSetBlueprintName, onSetEditingBlueprintId,
  onDeleteBlueprint, onEditBlueprint, onSelectSystemBlueprint, onUpdateQuantity, onRemoveRule, onSetIsAddingQuestion, onSetShowSaveDialog
}: Props) => {
  return (
    <div className="space-y-8">
      {/* Selected Context */}
      <div className="flex items-center gap-3 bg-gray-50/80 p-3 rounded-2xl border border-gray-100">
        <span className="px-4 py-1.5 bg-white shadow-sm text-violet-700 rounded-xl text-sm font-bold border border-violet-100">
          {selectedGrade}
        </span>
        <span className="text-gray-300 font-bold">/</span>
        <span className="px-4 py-1.5 bg-white shadow-sm text-violet-700 rounded-xl text-sm font-bold border border-violet-100">
          {selectedSubject}
        </span>
        <button
          onClick={() => {
            onSetStep(1);
            onSetStructureType(null);
          }}
          className="ml-auto px-4 py-1.5 text-sm text-gray-500 hover:text-gray-900 bg-white border border-gray-200 rounded-xl font-semibold shadow-sm hover:bg-gray-50 transition-all active:scale-95"
        >
          Thay đổi
        </button>
      </div>

      {!structureType && (
        <div>
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Cấu trúc đề</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => onSetStructureType("template")}
              className="group flex flex-col items-start p-6 rounded-[1.5rem] border border-gray-200/80 bg-white hover:border-violet-300 hover:bg-gradient-to-br hover:from-white hover:to-violet-50/50 hover:shadow-[0_8px_24px_rgba(139,92,246,0.12)] transition-all duration-300 hover:-translate-y-1 active:scale-95 text-left"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform duration-300">💡</div>
              <span className="font-bold text-lg text-gray-900 mb-2">Gợi ý</span>
              <span className="text-sm text-gray-500 leading-relaxed">Tạo đề nhanh dựa trên các khung cấu trúc chuẩn của Bộ GD&ĐT.</span>
            </button>
            <button
              onClick={() => {
                onSetCustomRules([]);
                onSetBlueprintName("");
                onSetEditingBlueprintId(null);
                onSetStructureType("custom");
              }}
              className="group flex flex-col items-start p-6 rounded-[1.5rem] border border-gray-200/80 bg-white hover:border-indigo-300 hover:bg-gradient-to-br hover:from-white hover:to-indigo-50/50 hover:shadow-[0_8px_24px_rgba(99,102,241,0.12)] transition-all duration-300 hover:-translate-y-1 active:scale-95 text-left"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform duration-300">⚙️</div>
              <span className="font-bold text-lg text-gray-900 mb-2">Tùy chỉnh</span>
              <span className="text-sm text-gray-500 leading-relaxed">Tự do thiết kế cấu trúc đề thi, chọn độ khó cho từng câu hỏi riêng biệt.</span>
            </button>
            <button
              onClick={() => onSetStructureType("saved")}
              className="group flex flex-col items-start p-6 rounded-[1.5rem] border border-gray-200/80 bg-white hover:border-emerald-300 hover:bg-gradient-to-br hover:from-white hover:to-emerald-50/50 hover:shadow-[0_8px_24px_rgba(16,185,129,0.12)] transition-all duration-300 hover:-translate-y-1 active:scale-95 text-left"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform duration-300">💾</div>
              <span className="font-bold text-lg text-gray-900 mb-2">Đã lưu</span>
              <span className="text-sm text-gray-500 leading-relaxed">Sử dụng lại các cấu trúc đề thi bạn đã thiết kế và lưu trước đó.</span>
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
          
          {isLoadingSystemBlueprints ? (
            <div className="p-8 rounded-2xl border border-gray-200 bg-gray-50 flex justify-center items-center">
              <Loader2 className="animate-spin text-violet-500 w-6 h-6" />
            </div>
          ) : systemBlueprints.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { name: "easy", label: "Dễ", icon: "🌱", color: "emerald" },
                { name: "medium", label: "Trung bình", icon: "⭐", color: "amber" },
                { name: "hard", label: "Khó", icon: "🔥", color: "rose" }
              ].map((level) => {
                const bp = systemBlueprints.find(b => b.Name?.toLowerCase() === level.name.toLowerCase());
                const isAvailable = !!bp;
                
                return (
                  <button
                    key={level.name}
                    disabled={!isAvailable}
                    onClick={() => isAvailable && onSelectSystemBlueprint && onSelectSystemBlueprint(bp)}
                    className={`relative p-5 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center gap-3 ${
                      isAvailable
                        ? `bg-white border-gray-200 hover:border-${level.color}-400 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:-translate-y-1 active:scale-95 group cursor-pointer`
                        : "bg-gray-50 border-gray-100 opacity-60 cursor-not-allowed"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                      isAvailable ? `bg-${level.color}-50 group-hover:bg-${level.color}-100 transition-colors` : "bg-gray-100 grayscale"
                    }`}>
                      {level.icon}
                    </div>
                    <div className="text-center">
                      <span className={`font-bold block text-lg ${isAvailable ? "text-gray-900" : "text-gray-400"}`}>
                        {level.label}
                      </span>
                      {!isAvailable && <span className="text-xs text-gray-400 font-medium">(Sắp ra mắt)</span>}
                      {isAvailable && <span className={`text-xs text-${level.color}-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity`}>Chọn mẫu này</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-8 rounded-2xl border border-gray-200 bg-gray-50 text-center flex flex-col justify-center items-center">
              <span className="text-sm text-gray-500">Chưa có cấu trúc gợi ý nào được cập nhật.</span>
            </div>
          )}
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
              <div key={rule.id} className="p-5 rounded-[1.25rem] border border-gray-200/80 bg-white shadow-sm hover:shadow-md hover:border-indigo-200 flex items-center justify-between transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 font-bold">
                    {rule.format === "tu-luan" ? "TL" : "TN"}
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-gray-900 text-base">
                      {rule.format === "tu-luan" ? "Tự luận" : "Trắc nghiệm"}
                    </span>
                    {rule.diffName !== "Mặc định" && (
                      <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-md inline-block w-fit">
                        {rule.diffName}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                  <button onClick={() => onUpdateQuantity(rule.id, -1)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm text-gray-600 font-bold transition-all">-</button>
                  <span className="font-bold text-gray-900 w-6 text-center">{rule.quantity}</span>
                  <button onClick={() => onUpdateQuantity(rule.id, 1)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm text-gray-600 font-bold transition-all">+</button>
                  <div className="w-[1px] h-6 bg-gray-200 mx-1"></div>
                  <button onClick={() => onRemoveRule(rule.id)} className="w-8 h-8 flex items-center justify-center rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            {!isAddingQuestion && !isGeneratingQuestion && (
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => onSetIsAddingQuestion(true)}
                  className="flex-1 p-4 rounded-[1.25rem] border-2 border-dashed border-gray-200 text-gray-500 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all font-bold flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <span>+ Thêm tùy chỉnh</span>
                </button>
                {customRules.length > 0 && (
                  <button
                    onClick={() => onSetShowSaveDialog(true)}
                    className="px-6 py-4 rounded-[1.25rem] bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold transition-all flex items-center gap-2 active:scale-95 border border-indigo-100 shadow-sm"
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
