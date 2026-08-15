import { X, Loader2, Save } from "lucide-react";

interface Props {
  editingBlueprintId: number | null;
  blueprintName: string;
  isSavingBlueprint: boolean;
  onSetShowSaveDialog: (val: boolean) => void;
  onSetBlueprintName: (name: string) => void;
  onSaveCustomBlueprint: () => void;
}

export const SaveBlueprintModal = ({
  editingBlueprintId, blueprintName, isSavingBlueprint,
  onSetShowSaveDialog, onSetBlueprintName, onSaveCustomBlueprint
}: Props) => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-sm p-0 rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 fade-in duration-200 overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900">{editingBlueprintId ? "Cập nhật cấu trúc đề" : "Lưu cấu trúc đề"}</h3>
          <button onClick={() => onSetShowSaveDialog(false)} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên cấu trúc <span className="text-red-500">*</span></label>
            <input 
              type="text"
              value={blueprintName}
              onChange={(e) => onSetBlueprintName(e.target.value)}
              placeholder="Ví dụ: Đề kiểm tra 15 phút Toán lớp 1..."
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500"
              autoFocus
            />
          </div>
          <button
            onClick={onSaveCustomBlueprint}
            disabled={!blueprintName.trim() || isSavingBlueprint}
            className="w-full py-3.5 rounded-xl bg-violet-600 text-white font-bold hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 transition-all"
          >
            {isSavingBlueprint ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {editingBlueprintId ? "Cập nhật" : "Lưu lại"}
          </button>
        </div>
      </div>
    </div>
  );
};
