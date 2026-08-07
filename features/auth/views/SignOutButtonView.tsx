"use client";

import type { SignOutButtonViewProps } from "../types";

/**
 * SignOutButtonView — Thuần giao diện (Presentation Layer).
 * Chỉ render button, nhận callback onSignOut qua props.
 */
export function SignOutButtonView({ onSignOut }: SignOutButtonViewProps) {
  return (
    <button
      onClick={onSignOut}
      className="text-sm px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-600 transition-colors"
    >
      Đăng xuất
    </button>
  );
}
