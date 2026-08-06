"use client";

import { useAuth } from "@/hooks/useAuth";

export default function SignOutButton() {
  const { signOut } = useAuth();

  return (
    <button
      onClick={signOut}
      className="text-sm px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-600 transition-colors"
    >
      Đăng xuất
    </button>
  );
}
