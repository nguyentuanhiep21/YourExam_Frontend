"use client";

import { Profile } from "../types";
import { School, BookOpen, Calendar, Loader2, X } from "lucide-react";

interface AuthorProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
}

export function AuthorProfileDialog({ isOpen, onClose, profile, isLoading, error }: AuthorProfileDialogProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="relative w-full max-w-2xl bg-slate-50 rounded-3xl shadow-2xl overflow-hidden flex flex-col m-4 animate-in fade-in zoom-in-95 duration-200 z-10">
        
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4 p-6 text-center">
            <p className="text-rose-500 font-medium">{error}</p>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
            >
              Đóng
            </button>
          </div>
        ) : profile ? (
          <div className="w-full relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Cover Image */}
            <div className="w-full h-40 sm:h-48 relative overflow-hidden">
              {profile.CoverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.CoverUrl} alt="Cover" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              )}
            </div>
            
            <div className="px-6 sm:px-10 pb-8 relative -mt-16 sm:-mt-20">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-8">
                <div className="shrink-0 w-32 h-32 sm:w-36 sm:h-36 mx-auto sm:mx-0">
                  <div className="w-full h-full rounded-full border-4 border-white shadow-lg bg-white flex items-center justify-center overflow-hidden">
                    {profile.AvatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={profile.AvatarUrl} alt={profile.FullName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white text-4xl font-bold">
                        {profile.FullName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex-1 w-full text-center sm:text-left sm:pt-[5.5rem]">
                  <h2 className="text-2xl font-bold font-heading text-slate-900">{profile.FullName}</h2>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-900 font-heading uppercase tracking-wider">Công tác & Chuyên môn</h3>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-white shadow-sm border border-slate-100">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
                      <School className="w-5 h-5" />
                    </div>
                    <div className="flex-1 pt-0.5">
                      <p className="text-xs text-slate-500 font-medium mb-1">Đơn vị công tác</p>
                      <p className="text-sm font-medium text-slate-800">{profile.School || "Chưa cập nhật"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-white shadow-sm border border-slate-100">
                    <div className="p-2 bg-indigo-50 text-indigo-500 rounded-xl shrink-0">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div className="flex-1 pt-0.5">
                      <p className="text-xs text-slate-500 font-medium mb-1">Môn giảng dạy</p>
                      <p className="text-sm font-medium text-slate-800">{profile.SubjectsTaught || "Chưa cập nhật"}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-center sm:justify-start gap-2 text-sm text-slate-500">
                <Calendar className="w-4 h-4" />
                <span>Tham gia từ {formatDate(profile.CreatedAt)}</span>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
