"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface UserDropdownProps {
  email: string;
}

export function UserDropdown({ email }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
    router.push("/login");
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 text-white flex items-center justify-center font-semibold text-sm shadow-sm ring-2 ring-white cursor-pointer hover:opacity-90 transition-opacity focus:outline-none"
      >
        {email.charAt(0).toUpperCase() || 'U'}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full right-0 mt-2 w-52 bg-white/90 backdrop-blur-2xl rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 z-20 p-2 origin-top-right animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-1">
              <div className="px-3 py-2 text-xs text-gray-500 font-medium truncate border-b border-gray-100 mb-1">
                {email}
              </div>
              
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-3 hover:bg-red-50 hover:text-red-600 text-gray-700"
              >
                <LogOut className="w-4 h-4" />
                Đăng xuất
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
