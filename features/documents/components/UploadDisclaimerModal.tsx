import React, { useState } from 'react';
import { ShieldAlert, X } from 'lucide-react';

interface UploadDisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const UploadDisclaimerModal: React.FC<UploadDisclaimerModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [isChecked, setIsChecked] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (isChecked) {
      onConfirm();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all p-6">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
          title="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6 text-amber-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">
            Chia sẻ tài liệu cùng cộng đồng
          </h2>
        </div>
        
        <div className="space-y-4 text-slate-600 mb-6 bg-slate-50 p-4 rounded-xl text-sm border border-slate-100">
          <p>
            <strong className="text-slate-800 font-semibold block mb-1">Chế độ công khai:</strong>
            Mọi tài liệu sau khi đăng tải sẽ hiển thị công khai cho tất cả người dùng truy cập.
          </p>
          <p>
            <strong className="text-slate-800 font-semibold block mb-1">Bản quyền & Nội dung:</strong>
            Đảm bảo bạn có quyền chia sẻ tài liệu này và nội dung không vi phạm quy định pháp luật.
          </p>
          <p>
            <strong className="text-slate-800 font-semibold block mb-1">Bảo mật thông tin:</strong>
            Không tải lên tài liệu chứa thông tin cá nhân, mật khẩu, dữ liệu nội bộ hoặc tài chính nhạy cảm.
          </p>
        </div>

        <label className="flex items-start gap-3 cursor-pointer group mb-8">
          <div className="relative flex items-center justify-center mt-0.5">
            <input 
              type="checkbox" 
              className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded cursor-pointer checked:bg-blue-600 checked:border-blue-600 transition-colors"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
            />
            <svg 
              className="absolute w-3.5 h-3.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" 
              viewBox="0 0 14 10" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M1 5L5 9L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
            Tôi đã đọc, hiểu rõ và đồng ý với các quy định trên.
          </span>
        </label>

        <div className="flex items-center justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            Hủy
          </button>
          <button 
            onClick={handleConfirm}
            disabled={!isChecked}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            Tiếp tục
          </button>
        </div>
      </div>
    </div>
  );
};
