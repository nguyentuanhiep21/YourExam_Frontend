import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Bell, Search, BookOpen, Users, MessageCircleQuestion } from "lucide-react";

export default async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <nav className="sticky top-0 z-50 w-full bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="flex h-16 items-center justify-between bg-white/40 backdrop-blur-md border border-white/40 shadow-sm rounded-full px-6">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group min-w-[150px]">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">Y</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">YourExam</span>
          </Link>

          {/* Desktop Navigation (Centered) */}
          <div className="hidden md:flex items-center justify-center gap-8 flex-1">
            <Link href="/" className="text-sm font-semibold text-violet-700 relative">
              Tài liệu
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-violet-600 rounded-full"></span>
            </Link>
            <Link href="/courses" className="text-sm font-semibold text-gray-700 hover:text-violet-700 transition-colors">
              Khóa học
            </Link>
            <Link href="/community" className="text-sm font-semibold text-gray-700 hover:text-violet-700 transition-colors">
              Cộng đồng
            </Link>
            <Link href="/support" className="text-sm font-semibold text-gray-700 hover:text-violet-700 transition-colors">
              Hỗ trợ
            </Link>
          </div>

          {/* User Actions */}
          <div className="flex items-center justify-end gap-4 min-w-[150px]">
            {user ? (
              <div className="flex items-center gap-4">
                <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </button>
                <Link href="/" className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 text-white flex items-center justify-center font-semibold text-sm shadow-sm ring-2 ring-white cursor-pointer hover:opacity-90 transition-opacity">
                    {user.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  href="/login" 
                  className="hidden md:block text-sm font-semibold text-gray-700 hover:text-violet-600 transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link 
                  href="/register" 
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-full shadow-sm transition-colors"
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
