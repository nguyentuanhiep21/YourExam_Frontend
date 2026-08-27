"use client";

import Link from "next/link";
import InputField from "@/components/ui/InputField";
import type { LoginFormViewProps } from "../types/auth.types";

/**
 * LoginFormView — Thuần giao diện (Presentation Layer).
 * Không chứa state, không import hook, không biết Supabase tồn tại.
 * Nhận toàn bộ data và callbacks qua props từ LoginForm container.
 */
export function LoginFormView({
  email,
  password,
  loading,
  error,
  justRegistered,
  passwordChanged,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: LoginFormViewProps) {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-[28px] font-bold tracking-tight text-[#0f0c29]">Chào mừng trở lại 👋</h2>
        <p className="mt-1.5 text-sm text-gray-500">Đăng nhập để tiếp tục quản lý đề thi của bạn</p>
      </div>

      {/* Success banner for registration */}
      {justRegistered && (
        <div className="mb-6 flex gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
          <div className="flex-shrink-0 mt-0.5">
            <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <p className="text-sm text-emerald-700 leading-relaxed">
            Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản trước khi đăng nhập.
          </p>
        </div>
      )}

      {/* Success banner for password changed */}
      {passwordChanged && (
        <div className="mb-6 flex gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
          <div className="flex-shrink-0 mt-0.5">
            <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <p className="text-sm text-emerald-700 leading-relaxed">
            Đổi mật khẩu thành công! Vui lòng đăng nhập lại với mật khẩu mới.
          </p>
        </div>
      )}

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
          id="login-email"
          label="Email"
          type="email"
          required
          value={email}
          onChange={onEmailChange}
          placeholder="giaovien@truong.edu.vn"
        />

        <div className="flex flex-col gap-2">
          <InputField
            id="login-password"
            label="Mật khẩu"
            type="password"
            required
            value={password}
            onChange={onPasswordChange}
            placeholder="••••••••"
          />
          <div className="flex justify-end">
            <Link 
              href="/forgot-password" 
              className="text-sm font-semibold text-violet-600 hover:text-violet-700 transition-colors"
            >
              Quên mật khẩu?
            </Link>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="relative w-full h-12 rounded-xl font-semibold text-sm text-white overflow-hidden transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            style={{ background: loading ? "#6d28d9" : "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)" }}
          >
            <span className="relative z-10">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Đang đăng nhập...
                </span>
              ) : (
                "Đăng nhập"
              )}
            </span>
            <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity duration-200" />
          </button>
        </div>
      </form>

      {/* Divider */}
      <div className="relative my-7">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-100" />
        </div>
      </div>

      {/* Sign up link */}
      <p className="text-center text-sm text-gray-500">
        Chưa có tài khoản?{" "}
        <Link
          href="/register"
          className="font-semibold text-violet-600 hover:text-violet-700 transition-colors"
        >
          Đăng ký miễn phí →
        </Link>
      </p>
    </div>
  );
}
