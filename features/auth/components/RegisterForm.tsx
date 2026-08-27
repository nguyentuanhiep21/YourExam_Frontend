"use client";

import { useRegisterForm } from "../hooks/useRegisterForm";
import { RegisterFormView } from "./RegisterFormView";

/**
 * RegisterForm — Container (Logic Layer).
 * Kết nối useRegisterForm hook với RegisterFormView.
 * Không chứa JSX nghiệp vụ, chỉ truyền props xuống View.
 */
export function RegisterForm() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    error,
    handleSubmit,
  } = useRegisterForm();

  return (
    <RegisterFormView
      email={email}
      password={password}
      confirmPassword={confirmPassword}
      loading={loading}
      error={error}
      onEmailChange={(e) => setEmail(e.target.value)}
      onPasswordChange={(e) => setPassword(e.target.value)}
      onConfirmPasswordChange={(e) => setConfirmPassword(e.target.value)}
      onSubmit={handleSubmit}
    />
  );
}
