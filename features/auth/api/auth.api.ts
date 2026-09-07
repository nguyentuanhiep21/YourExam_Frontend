import { createClient } from "@/lib/supabase/client";
import { AuthTokenResponseV1, UserResponse, User } from "@supabase/supabase-js";

class AuthApi {
  private getSupabase() {
    return createClient();
  }

  async signIn(email: string, password: string): Promise<AuthTokenResponseV1> {
    return this.getSupabase().auth.signInWithPassword({ email, password });
  }

  async signUp(email: string, password: string): Promise<AuthTokenResponseV1> {
    return this.getSupabase().auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth/callback`
      }
    });
  }

  async signOut(): Promise<{ error: any }> {
    return this.getSupabase().auth.signOut();
  }

  async getUser(): Promise<User | null> {
    const { data: { user } } = await this.getSupabase().auth.getUser();
    return user;
  }

  async resetPasswordForEmail(email: string) {
    return this.getSupabase().auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/api/auth/callback?next=/reset-password`,
    });
  }

  async updatePassword(password: string) {
    return this.getSupabase().auth.updateUser({ password });
  }
}

export const authApi = new AuthApi();
