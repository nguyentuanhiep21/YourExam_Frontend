import { createClient } from "@/lib/supabase/server";
import { ProfileDetail } from "@/features/profile/components/ProfileDetail";
import { redirect } from "next/navigation";
import { Profile } from "@/features/profile/types";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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
    .eq("Id", user.id)
    .single();

  let profile: Profile;

  if (error || !data) {
    // If not found in DB or error (e.g., new user profile hasn't been synced), fallback to auth user info
    console.error("Error fetching profile from database:", error);
    profile = {
      Id: user.id,
      FullName: user.user_metadata?.full_name || "Chưa cập nhật tên",
      School: null,
      SubjectsTaught: null,
      AvatarUrl: user.user_metadata?.avatar_url || null,
      CreatedAt: user.created_at,
    };
  } else {
    profile = data as Profile;
  }

  return (
    <div className="min-h-screen pt-10 pb-20 px-4 sm:px-6 lg:px-8 relative bg-slate-50 overflow-hidden">
      {/* Subtle Background Effects */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-50/80 to-transparent pointer-events-none"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
      <div className="absolute top-48 -left-24 w-72 h-72 bg-purple-100/50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors mb-6 group">
            <ArrowLeft className="w-4 h-4 mr-1.5 transition-transform group-hover:-translate-x-1" />
            Quay lại trang chủ
          </Link>
          <h1 className="text-3xl font-bold font-heading text-slate-900 tracking-tight">Hồ sơ cá nhân</h1>
          <p className="text-slate-500 mt-2 text-sm">Quản lý thông tin tài khoản và cài đặt cá nhân của bạn.</p>
        </div>
        
        <ProfileDetail 
          profile={profile} 
          authEmail={user.email || ""} 
          authPhone={user.phone ? (user.phone.startsWith("+") ? user.phone : `+${user.phone}`) : null} 
        />
      </div>
    </div>
  );
}
