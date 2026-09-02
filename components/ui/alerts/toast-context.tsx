"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Toast, ToastProps, ToastType } from "./Toast";

type ShowToastOptions = Omit<ToastProps, "id" | "onClose">;

interface ToastContextType {
  showToast: (options: ShowToastOptions) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const showToast = useCallback((options: ShowToastOptions) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...options, id, onClose: removeToast }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback((message: string, title?: string) => showToast({ type: "success", message, title }), [showToast]);
  const error = useCallback((message: string, title?: string) => showToast({ type: "error", message, title }), [showToast]);
  const warning = useCallback((message: string, title?: string) => showToast({ type: "warning", message, title }), [showToast]);
  const info = useCallback((message: string, title?: string) => showToast({ type: "info", message, title }), [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[99999] flex flex-col items-center gap-3 w-full max-w-sm sm:max-w-md pointer-events-none px-4">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
