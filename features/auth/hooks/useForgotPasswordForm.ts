"use client";

import { useState } from "react";
import { useAuth } from "./useAuth";

export function useForgotPasswordForm() {
  const { resetPasswordForEmail, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const success = await resetPasswordForEmail(email);
    if (success) {
      setIsSuccess(true);
    }
  }

  return {
    email,
    setEmail,
    loading,
    error,
    isSuccess,
    handleSubmit,
  };
}
