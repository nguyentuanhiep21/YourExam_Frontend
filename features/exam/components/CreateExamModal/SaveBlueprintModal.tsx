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
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md p-0 rounded-[2rem] bg-white/95 backdrop-blur-xl border border-white/80 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] animate-in zoom-in-[0.98] duration-300 overflow-hidden">
        <div className="flex justify-between items-center p-7 border-b border-gray-200/50">
          <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">{editingBlueprintId ? "Cập nhật cấu trúc đề" : "Lưu cấu trúc đề"}</h3>
          <button onClick={() => onSetShowSaveDialog(false)} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all active:scale-95">
            <X size={20} />
          </button>
        </div>
        <div className="p-7 space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Tên cấu trúc <span className="text-red-500">*</span></label>
            <input 
              type="text"
              value={blueprintName}
              onChange={(e) => onSetBlueprintName(e.target.value)}
              placeholder="Ví dụ: Đề kiểm tra 15 phút Toán lớp 1..."
              className="w-full border border-gray-200/80 bg-gray-50/50 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 focus:bg-white transition-all shadow-sm"
              autoFocus
            />
          </div>
          <button
            onClick={onSaveCustomBlueprint}
            disabled={!blueprintName.trim() || isSavingBlueprint}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold hover:shadow-[0_8px_20px_rgba(99,102,241,0.3)] hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none flex justify-center items-center gap-2 transition-all duration-300"
          >
            {isSavingBlueprint ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {editingBlueprintId ? "Cập nhật" : "Lưu lại"}
          </button>
        </div>
      </div>
    </div>
  );
};
