"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "./useAuth";

export function useLoginForm() {
  const { signIn, loading, error } = useAuth();
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered") === "true";

  const passwordChanged = searchParams.get("passwordChanged") === "true";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await signIn(email, password);
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    justRegistered,
    passwordChanged,
    handleSubmit,
  };
}
