"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export function useAuth() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hàm hỗ trợ dịch lỗi Supabase sang tiếng Việt
  const handleAuthError = (err: any) => {
    const msg = err.message?.toLowerCase() || "";
    if (msg.includes("60 seconds") || msg.includes("security purposes")) {
      setError("Vì lý do bảo mật, bạn chỉ có thể gửi yêu cầu mỗi 60 giây một lần.");
    } else if (msg.includes("invalid login credentials")) {
      setError("Email hoặc mật khẩu không chính xác.");
    } else if (msg.includes("user already registered")) {
      setError("Email này đã được đăng ký.");
    } else if (msg.includes("email not confirmed")) {
      setError("Vui lòng xác nhận email trước khi đăng nhập.");
    } else if (msg.includes("password should be at least")) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
    } else if (msg.includes("user not found")) {
      setError("Tài khoản không tồn tại.");
    } else if (msg.includes("invalid email")) {
      setError("Định dạng email không hợp lệ.");
    } else {
      // Fallback
      setError("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
    }
  };

  async function signIn(email: string, password: string) {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      handleAuthError(error);
    } else {
      router.push("/");
      router.refresh();
    }
    setLoading(false);
  }

  async function signUp(email: string, password: string) {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth/callback`
      }
    });
    if (error) {
      handleAuthError(error);
    } else {
      // Supabase gửi email xác nhận — thông báo cho user
      router.push("/login?registered=true");
    }
    setLoading(false);
  }

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  async function getUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }
  async function resetPasswordForEmail(email: string) {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/api/auth/callback?next=/reset-password`,
    });
    if (error) {
      handleAuthError(error);
    }
    setLoading(false);
    return !error;
  }

  async function updatePassword(password: string) {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      handleAuthError(error);
    } else {
      // Force user to log in again after changing password
      await supabase.auth.signOut();
      router.push("/login?passwordChanged=true");
    }
    setLoading(false);
    return !error;
  }

  return { signIn, signUp, signOut, getUser, resetPasswordForEmail, updatePassword, loading, error };
}
