"use client";

import { useAuth } from "../hooks/useAuth";
import { SignOutButtonView } from "./SignOutButtonView";

/**
 * SignOutButton — Container (Logic Layer).
 * Kết nối useAuth.signOut với SignOutButtonView.
 */
export function SignOutButton() {
  const { signOut } = useAuth();

  return <SignOutButtonView onSignOut={signOut} />;
}
