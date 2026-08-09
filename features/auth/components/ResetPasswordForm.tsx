"use client";

import { useResetPasswordForm } from "../hooks/useResetPasswordForm";
import { ResetPasswordView } from "../views/ResetPasswordView";

export function ResetPasswordForm() {
  const { password, setPassword, confirmPassword, setConfirmPassword, loading, error, handleSubmit } = useResetPasswordForm();

  return (
    <ResetPasswordView
      password={password}
      confirmPassword={confirmPassword}
      loading={loading}
      error={error}
      isSuccess={false}
      onPasswordChange={(e) => setPassword(e.target.value)}
      onConfirmPasswordChange={(e) => setConfirmPassword(e.target.value)}
      onSubmit={handleSubmit}
    />
  );
}
