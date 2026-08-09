"use client";

import { useForgotPasswordForm } from "../hooks/useForgotPasswordForm";
import { ForgotPasswordView } from "../views/ForgotPasswordView";

export function ForgotPasswordForm() {
  const { email, setEmail, loading, error, isSuccess, handleSubmit } = useForgotPasswordForm();

  return (
    <ForgotPasswordView
      email={email}
      loading={loading}
      error={error}
      isSuccess={isSuccess}
      onEmailChange={(e) => setEmail(e.target.value)}
      onSubmit={handleSubmit}
    />
  );
}
