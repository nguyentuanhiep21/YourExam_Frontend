import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, KeyRound } from "lucide-react";
import { ChangePasswordForm } from "@/features/profile/components/ChangePasswordForm";

export const metadata = {
  title: "Đổi mật khẩu - YourExam",
  description: "Cập nhật mật khẩu bảo mật tài khoản YourExam",
};

export default async function ChangePasswordPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen pt-10 pb-20 px-4 sm:px-6 lg:px-8 relative bg-slate-50 overflow-hidden">
      {/* Subtle Background Effects */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-50/80 to-transparent pointer-events-none"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
      <div className="absolute top-48 -left-24 w-72 h-72 bg-purple-100/50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

      <div className="max-w-2xl mx-auto relative z-10">
        <div className="mb-8">
          <Link href="/profile" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors mb-6 group">
            <ArrowLeft className="w-4 h-4 mr-1.5 transition-transform group-hover:-translate-x-1" />
            Quay lại Hồ sơ cá nhân
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl shadow-sm">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-heading text-slate-900 tracking-tight">Đổi mật khẩu</h1>
              <p className="text-slate-500 mt-1 text-sm">Cập nhật mật khẩu mới để bảo vệ tài khoản của bạn.</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-2xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-6 sm:p-10 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
}
