export interface AuthFormState {
  loading: boolean;
  error: string | null;
}

export interface LoginFormViewProps extends AuthFormState {
  email: string;
  password: string;
  justRegistered: boolean;
  passwordChanged: boolean;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export interface RegisterFormViewProps extends AuthFormState {
  email: string;
  password: string;
  confirmPassword: string;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onConfirmPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export interface SignOutButtonViewProps {
  onSignOut: () => void;
}

export interface ForgotPasswordFormViewProps extends AuthFormState {
  email: string;
  isSuccess: boolean;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export interface ResetPasswordFormViewProps extends AuthFormState {
  password: string;
  confirmPassword: string;
  isSuccess: boolean;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onConfirmPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}
