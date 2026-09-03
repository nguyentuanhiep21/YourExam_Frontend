import { createClient } from "@/lib/supabase/server";
import { ProfileDetail } from "@/features/profile/components/ProfileDetail";
import { redirect } from "next/navigation";
import { Profile } from "@/features/profile/types";

export const metadata = {
  title: "Thông tin tài khoản - YourExam",
  description: "Trang thông tin tài khoản giáo viên trên hệ thống YourExam",
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch from Profiles table
  const { data, error } = await supabase
    .from("Profiles")
    .select("*")
    .eq("Email", user.email)
    .single();

  let profile: Profile;

  if (error || !data) {
    // If not found in DB or error (maybe new user hasn't been synced?), we can fallback to auth user info
    // However, since we are designing, it's fine to provide a mock fallback if it fails for design review
    console.error("Error fetching profile from database:", error);
    profile = {
      Id: user.id,
      Email: user.email || "",
      FullName: user.user_metadata?.full_name || "Chưa cập nhật tên",
      PhoneNumber: user.phone || null,
      School: null,
      SubjectsTaught: null,
      AvatarUrl: user.user_metadata?.avatar_url || null,
      CreatedAt: user.created_at,
    };
  } else {
    profile = data as Profile;
  }

  return (
    <div className="min-h-screen pt-10 pb-20 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 pl-4">
          <h1 className="text-3xl font-bold font-heading text-slate-900">Hồ sơ cá nhân</h1>
          <p className="text-slate-500 mt-2">Quản lý thông tin tài khoản và cài đặt cá nhân của bạn.</p>
        </div>
        
        <ProfileDetail profile={profile} />
      </div>
    </div>
  );
}
