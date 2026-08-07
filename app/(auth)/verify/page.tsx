import { Suspense } from "react";
import { VerificationStatus } from "@/features/auth";

export default function VerifyPage() {
  return (
    <Suspense>
      <VerificationStatus />
    </Suspense>
  );
}
