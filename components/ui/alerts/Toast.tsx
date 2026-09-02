"use client";

import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";
import { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastProps {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

export const Toast = ({ id, type, title, message, duration = 3000, onClose }: ToastProps) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => handleClose(), duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose(id);
    }, 300); // Wait for exit animation
  };

  const getStyle = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-white/95 backdrop-blur-xl border-emerald-100",
          iconBg: "bg-emerald-50",
          iconColor: "text-emerald-500",
          shadow: "shadow-[0_8px_30px_rgba(16,185,129,0.15)]",
          Icon: CheckCircle2,
          defaultTitle: "Thành công"
        };
      case "error":
        return {
          bg: "bg-white/95 backdrop-blur-xl border-rose-100",
          iconBg: "bg-rose-50",
          iconColor: "text-rose-500",
          shadow: "shadow-[0_8px_30px_rgba(244,63,94,0.15)]",
          Icon: XCircle,
          defaultTitle: "Đã xảy ra lỗi"
        };
      case "warning":
        return {
          bg: "bg-white/95 backdrop-blur-xl border-amber-100",
          iconBg: "bg-amber-50",
          iconColor: "text-amber-500",
          shadow: "shadow-[0_8px_30px_rgba(245,158,11,0.15)]",
          Icon: AlertTriangle,
          defaultTitle: "Cảnh báo"
        };
      case "info":
      default:
        return {
          bg: "bg-white/95 backdrop-blur-xl border-blue-100",
          iconBg: "bg-blue-50",
          iconColor: "text-blue-500",
          shadow: "shadow-[0_8px_30px_rgba(59,130,246,0.15)]",
          Icon: Info,
          defaultTitle: "Thông tin"
        };
    }
  };

  const style = getStyle();
  const Icon = style.Icon;

  return (
    <div 
      className={`pointer-events-auto flex items-center gap-3 border rounded-2xl px-5 py-3.5 w-full max-w-sm sm:max-w-md transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${style.bg} ${style.shadow} ${
        isClosing 
          ? "opacity-0 scale-95 translate-y-[-10px]" 
          : "animate-in slide-in-from-top-10 fade-in zoom-in-95"
      }`}
    >
      <div className={`flex items-center justify-center w-10 h-10 rounded-full shrink-0 ${style.iconBg} ${style.iconColor}`}>
        <Icon size={24} className={type === 'success' ? "animate-[bounce_1s_ease-in-out]" : type === 'warning' ? "animate-pulse" : ""} />
      </div>
      <div className="flex flex-col pr-4 flex-1">
        <h4 className="text-sm font-bold text-gray-900">{title || style.defaultTitle}</h4>
        {message && <p className="text-xs text-gray-500 font-medium mt-0.5 line-clamp-2">{message}</p>}
      </div>
      <button 
        onClick={handleClose}
        className="ml-auto p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
      >
        <X size={16} />
      </button>
    </div>
  );
};
