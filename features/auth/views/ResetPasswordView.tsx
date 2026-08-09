"use client";

import InputField from "@/components/ui/InputField";
import type { ResetPasswordFormViewProps } from "../types";

export function ResetPasswordView({
  password,
  confirmPassword,
  loading,
  error,
  isSuccess,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
}: ResetPasswordFormViewProps) {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-[28px] font-bold tracking-tight text-[#0f0c29]">Đặt mật khẩu mới 🔑</h2>
        <p className="mt-1.5 text-sm text-gray-500">Vui lòng nhập mật khẩu mới cho tài khoản của bạn</p>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-6 flex gap-3 p-4 rounded-2xl bg-red-50 border border-red-100">
          <div className="flex-shrink-0 mt-0.5">
            <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <p className="text-sm text-red-600 leading-relaxed">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-4">
        <InputField
          id="new-password"
          label="Mật khẩu mới"
          type="password"
          required
          value={password}
          onChange={onPasswordChange}
          placeholder="••••••••"
          disabled={isSuccess}
        />

        <InputField
          id="confirm-new-password"
          label="Xác nhận mật khẩu mới"
          type="password"
          required
          value={confirmPassword}
          onChange={onConfirmPasswordChange}
          placeholder="••••••••"
          disabled={isSuccess}
        />

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading || isSuccess}
            className="relative w-full h-12 rounded-xl font-semibold text-sm text-white overflow-hidden transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            style={{ background: (loading || isSuccess) ? "#6d28d9" : "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)" }}
          >
            <span className="relative z-10">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Đang xử lý...
                </span>
              ) : (
                "Đổi mật khẩu"
              )}
            </span>
            <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity duration-200" />
          </button>
        </div>
      </form>
    </div>
  );
}
