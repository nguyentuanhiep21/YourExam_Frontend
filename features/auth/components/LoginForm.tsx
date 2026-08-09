"use client";

import { useLoginForm } from "../hooks/useLoginForm";
import { LoginFormView } from "../views/LoginFormView";

/**
 * LoginForm — Container (Logic Layer).
 * Kết nối useLoginForm hook với LoginFormView.
 * Không chứa JSX nghiệp vụ, chỉ truyền props xuống View.
 */
export function LoginForm() {
  const { email, setEmail, password, setPassword, loading, error, justRegistered, passwordChanged, handleSubmit } =
    useLoginForm();

  return (
    <LoginFormView
      email={email}
      password={password}
      loading={loading}
      error={error}
      justRegistered={justRegistered}
      passwordChanged={passwordChanged}
      onEmailChange={(e) => setEmail(e.target.value)}
      onPasswordChange={(e) => setPassword(e.target.value)}
      onSubmit={handleSubmit}
    />
  );
}
