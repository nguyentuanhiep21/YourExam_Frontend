import { AlertTriangle, Loader2 } from "lucide-react";

interface ConfirmDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
  title?: string;
  description?: string;
}

export function ConfirmDeleteDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  isDeleting,
  title = "Xóa bài viết?",
  description = "Bạn có chắc chắn muốn xóa chủ đề này không? Hành động này không thể hoàn tác."
}: ConfirmDeleteDialogProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={!isDeleting ? onClose : undefined}
      />
      
      {/* Dialog */}
      <div className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-50 w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 duration-200 border border-slate-100">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          
          <h2 className="text-2xl font-bold text-slate-900 mb-2 font-heading">
            {title}
          </h2>
          <p className="text-slate-600 mb-8">
            {description}
          </p>
          
          <div className="flex w-full gap-3">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 px-6 py-3 rounded-xl font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 px-6 py-3 rounded-xl font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                "Xóa ngay"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
