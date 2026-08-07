// Containers (sử dụng trong app/)
export { LoginForm } from "./components/LoginForm";
export { RegisterForm } from "./components/RegisterForm";
export { SignOutButton } from "./components/SignOutButton";

// Hooks (dùng nội bộ hoặc khi cần trực tiếp)
export { useAuth } from "./hooks/useAuth";
export { useLoginForm } from "./hooks/useLoginForm";
export { useRegisterForm } from "./hooks/useRegisterForm";

// Types
export type {
  AuthFormState,
  LoginFormViewProps,
  RegisterFormViewProps,
  SignOutButtonViewProps,
} from "./types";
