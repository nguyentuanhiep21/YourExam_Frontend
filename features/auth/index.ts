// Containers (sử dụng trong app/)
export { LoginForm } from "./components/LoginForm";
export { RegisterForm } from "./components/RegisterForm";
export { SignOutButton } from "./components/SignOutButton";
export { VerificationStatus } from "./components/VerificationStatus";
export { ForgotPasswordForm } from "./components/ForgotPasswordForm";
export { ResetPasswordForm } from "./components/ResetPasswordForm";

// Hooks (dùng nội bộ hoặc khi cần trực tiếp)
export { useAuth } from "./hooks/useAuth";
export { useLoginForm } from "./hooks/useLoginForm";
export { useRegisterForm } from "./hooks/useRegisterForm";
export { useForgotPasswordForm } from "./hooks/useForgotPasswordForm";
export { useResetPasswordForm } from "./hooks/useResetPasswordForm";

// Types
export type {
  AuthFormState,
  LoginFormViewProps,
  RegisterFormViewProps,
  SignOutButtonViewProps,
} from "./types/auth.types";
