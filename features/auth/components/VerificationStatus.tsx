"use client";

import { useSearchParams } from "next/navigation";
import { VerificationStatusView } from "./VerificationStatusView";
import { useEffect, useState } from "react";

/**
 * VerificationStatus — Container (Logic Layer).
 * Đọc query params từ URL để xác định trạng thái xác thực.
 */
export function VerificationStatus() {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // SSR hydration mismatch prevention
  if (!mounted) {
    return <VerificationStatusView status="loading" />;
  }

  const status = (searchParams.get("status") as "success" | "error") || "loading";
  const message = searchParams.get("message") || undefined;

  return <VerificationStatusView status={status} message={message} />;
}
