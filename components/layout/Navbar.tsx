import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Bell, Search, BookOpen, Users, MessageCircleQuestion } from "lucide-react";
import { UserDropdown } from "./UserDropdown";
import { NavLinks } from "./NavLinks";

export default async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <nav className="sticky top-0 z-50 w-full bg-transparent pt-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex h-16 items-center justify-between bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_4px_30px_rgba(0,0,0,0.03)] rounded-full px-6 transition-all duration-300">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group min-w-[150px]">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent/80 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
              <span className="text-white font-bold text-lg font-heading">Y</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-primary transition-colors font-heading">YourExam</span>
          </Link>

          {/* Desktop Navigation (Centered) */}
          <NavLinks />

          {/* User Actions */}
          <div className="flex items-center justify-end gap-4 min-w-[150px]">
            {user ? (
              <div className="flex items-center gap-4">
                <button className="relative p-2 text-slate-500 hover:text-primary hover:bg-primary-light/50 rounded-full transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full border-2 border-white"></span>
                </button>
                <UserDropdown email={user.email || ""} />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  href="/login" 
                  className="hidden md:block text-sm font-semibold text-slate-600 hover:text-primary transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link 
                  href="/register" 
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary-hover rounded-full shadow-md shadow-primary/20 transition-all hover:-translate-y-0.5 active:scale-95"
                >
                  Đăng ký miễn phí
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
