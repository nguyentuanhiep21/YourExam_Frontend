"use client";

import { useState } from "react";
import { Loader2, Check, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { profileApi } from "../api/profile.api";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function ChangePasswordForm() {
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      setIsLoading(true);
      await profileApi.updatePassword(oldPassword, password);
      
      setSuccess(true);
      setOldPassword("");
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      console.error("Change password error:", err);
      setError(err.message || "Đã xảy ra lỗi khi đổi mật khẩu.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm ring-4 ring-green-50">
          <Check className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold font-heading text-slate-900 mb-3 tracking-tight">Đổi mật khẩu thành công!</h3>
        <p className="text-slate-500 mb-8 max-w-sm leading-relaxed">
          Mật khẩu của bạn đã được cập nhật. Bạn có thể sử dụng mật khẩu mới cho những lần đăng nhập sau.
        </p>
        <Link
          href="/profile"
          className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary hover:bg-primary-hover text-white font-semibold rounded-full shadow-md shadow-primary/20 transition-all hover:-translate-y-0.5 active:scale-95"
        >
          Trở về Hồ sơ
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Mật khẩu hiện tại</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type={showOldPassword ? "text" : "password"}
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-slate-50 focus:bg-white"
              placeholder="Nhập mật khẩu hiện tại"
            />
            <button
              type="button"
              onClick={() => setShowOldPassword(!showOldPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showOldPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Mật khẩu mới</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type={showNewPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-slate-50 focus:bg-white"
              placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showNewPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Xác nhận mật khẩu mới</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-slate-50 focus:bg-white"
              placeholder="Nhập lại mật khẩu mới"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-start gap-3">
          <div className="p-1 bg-red-100 rounded-full shrink-0">
            <X className="w-3 h-3 text-red-600" />
          </div>
          <span className="font-medium mt-0.5">{error}</span>
        </div>
      )}

      <div className="pt-4 flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isLoading}
          className="flex-1 px-6 py-3 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors disabled:opacity-50"
        >
          Hủy bỏ
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-[2] flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-primary hover:bg-primary-hover rounded-full shadow-md shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Đang lưu thay đổi...
            </>
          ) : (
            "Cập nhật mật khẩu"
          )}
        </button>
      </div>
    </form>
  );
}
