export interface AuthFormState {
  loading: boolean;
  error: string | null;
}

export interface LoginFormViewProps extends AuthFormState {
  email: string;
  password: string;
  justRegistered: boolean;
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
