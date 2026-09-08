import { createClient } from "@/lib/supabase/client";
import { Profile } from "../types";

export const profileApi = {
  /**
   * Get user profile by ID
   */
  getProfileById: async (userId: string): Promise<Profile> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("Profiles")
      .select("*")
      .eq("Id", userId)
      .single();

    if (error) throw error;
    return data as Profile;
  },

  /**
   * Update user profile information
   */
  updateProfile: async (
    userId: string,
    data: { FullName: string; School: string | null; SubjectsTaught: string | null }
  ) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("Profiles")
      .update(data)
      .eq("Id", userId);

    if (error) throw error;
  },

  /**
   * Update auth email and phone
   */
  updateAuthDetails: async (email?: string, phone?: string) => {
    const supabase = createClient();
    const authUpdates: Record<string, string> = {};
    if (email) authUpdates.email = email;
    if (phone) authUpdates.phone = phone;

    if (Object.keys(authUpdates).length > 0) {
      const { error } = await supabase.auth.updateUser(authUpdates);
      if (error) throw error;
    }
  },

  /**
   * Update user password with old password verification
   */
  updatePassword: async (oldPassword: string, newPassword: string) => {
    const supabase = createClient();
    
    // 1. Lấy thông tin user hiện tại
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) throw new Error("Không tìm thấy thông tin email của tài khoản.");

    // 2. Xác thực mật khẩu cũ
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: oldPassword,
    });

    if (verifyError) {
      throw new Error("Mật khẩu hiện tại không chính xác.");
    }

    // 3. Nếu đúng, tiến hành cập nhật mật khẩu mới
    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
    if (updateError) throw updateError;
  },

  /**
   * Upload an image to the UserAvatar bucket and update the profile URL
   */
  uploadProfileImage: async (
    userId: string,
    fileBlob: Blob,
    type: "avatar" | "cover"
  ): Promise<string> => {
    const supabase = createClient();
    const fileName = type === "avatar" ? "avatar.jpg" : "cover.jpg";
    const filePath = `${userId}/${fileName}`;

    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from("UserAvatar")
      .upload(filePath, fileBlob, {
        contentType: "image/jpeg",
        upsert: true,
        cacheControl: "0",
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("UserAvatar")
      .getPublicUrl(filePath);

    const finalUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`;

    // Update Profiles table
    const updateData = type === "avatar" ? { AvatarUrl: finalUrl } : { CoverUrl: finalUrl };
    const { error: profileError } = await supabase
      .from("Profiles")
      .update(updateData)
      .eq("Id", userId);

    if (profileError) throw profileError;

    return finalUrl;
  },
};
