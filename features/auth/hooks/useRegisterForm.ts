"use client";

import { useState } from "react";
import { useAuth } from "./useAuth";

export function useRegisterForm() {
  const { signUp, loading, error } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setValidationError(null);

    if (password !== confirmPassword) {
      setValidationError("Mật khẩu xác nhận không khớp.");
      return;
    }
    if (password.length < 6) {
      setValidationError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    await signUp(email, password);
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    error: validationError || error,
    handleSubmit,
  };
}
