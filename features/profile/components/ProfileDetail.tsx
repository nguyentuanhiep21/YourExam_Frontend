"use client";

import { useState } from "react";
import { Profile } from "../types";
import { User, Mail, Phone, School, BookOpen, Calendar, Edit3, X, Save } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { AvatarUpdateDialog } from "./AvatarUpdateDialog";

interface ProfileDetailProps {
  profile: Profile;
  authEmail: string;
  authPhone: string | null;
}

export function ProfileDetail({ profile: initialProfile, authEmail, authPhone }: ProfileDetailProps) {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Profile>(initialProfile);
  const [authFormData, setAuthFormData] = useState({ email: authEmail, phone: authPhone || "" });
  const [currentAuth, setCurrentAuth] = useState({ email: authEmail, phone: authPhone || "" });
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);

  const handleAvatarUpdated = (url: string) => {
    setProfile(prev => ({ ...prev, AvatarUrl: url }));
    setFormData(prev => ({ ...prev, AvatarUrl: url }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    const supabase = createClient();
    
    try {
      const { error: profileError } = await supabase
        .from("Profiles")
        .update({
          FullName: formData.FullName,
          School: formData.School,
          SubjectsTaught: formData.SubjectsTaught,
        })
        .eq("Id", profile.Id);

      if (profileError) throw profileError;

      // Update Auth (Email and Phone)
      const authUpdates: any = {};
      if (authFormData.email !== currentAuth.email) authUpdates.email = authFormData.email;
      
      let rawPhone = authFormData.phone;
      if (rawPhone !== currentAuth.phone) {
        let formattedPhone = rawPhone.trim();
        if (formattedPhone.startsWith('0')) {
          formattedPhone = '+84' + formattedPhone.substring(1);
        }
        authUpdates.phone = formattedPhone;
      }

      if (Object.keys(authUpdates).length > 0) {
        const { error: authError } = await supabase.auth.updateUser(authUpdates);
        if (authError) throw authError;
        
        // Update local state to reflect the formatted phone number
        const newAuth = { ...authFormData };
        if (authUpdates.phone) {
          newAuth.phone = authUpdates.phone;
          setAuthFormData(newAuth);
        }
        setCurrentAuth(newAuth);
        
        // If email was updated, Supabase typically requires confirmation
        if (authUpdates.email) {
          alert("Bạn đã thay đổi email. Vui lòng kiểm tra hộp thư để xác nhận email mới.");
        }
      }
      
      setProfile(formData);
      setIsEditing(false);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      alert(`Có lỗi xảy ra khi cập nhật hồ sơ! ${error.message || ""}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(profile);
    setAuthFormData(currentAuth);
    setIsEditing(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_4px_30px_rgba(0,0,0,0.03)] rounded-3xl overflow-hidden">
        
        {/* Cover Image */}
        <div className="h-32 bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 relative"></div>
        
        <div className="px-8 pb-8">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-8">
            <div className="relative shrink-0 w-32 h-32 -mt-16">
              <div className="w-full h-full rounded-full border-4 border-white shadow-md bg-white flex items-center justify-center overflow-hidden relative">
                {profile.AvatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.AvatarUrl} alt={profile.FullName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white text-4xl font-bold">
                    {profile.FullName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <button 
                onClick={() => setIsAvatarDialogOpen(true)}
                className="absolute bottom-1 right-1 bg-primary text-white p-2 rounded-full shadow-md border-2 border-white hover:bg-primary-hover transition-colors z-10"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-1 w-full text-center sm:text-left sm:pt-2.5">
              {isEditing ? (
                <input
                  type="text"
                  value={formData.FullName}
                  onChange={(e) => setFormData({...formData, FullName: e.target.value})}
                  className="text-2xl font-bold font-heading text-slate-900 border border-slate-200 rounded-xl px-3 py-1.5 w-full max-w-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary inline-block"
                  placeholder="Nhập họ và tên"
                />
              ) : (
                <h1 className="text-2xl font-bold font-heading text-slate-900">{profile.FullName}</h1>
              )}
              <p className="text-slate-500 flex items-center justify-center sm:justify-start gap-1.5 mt-0">
                <Mail className="w-4 h-4" />
                {currentAuth.email}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 font-heading uppercase tracking-wider">Thông tin liên hệ</h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/50 border border-slate-100 hover:border-primary/20 hover:shadow-sm transition-all">
                  <div className="p-2 bg-primary/10 text-primary rounded-xl shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-500 font-medium mb-0.5">Số điện thoại</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={authFormData.phone}
                        onChange={(e) => setAuthFormData({...authFormData, phone: e.target.value})}
                        className="text-sm font-medium text-slate-800 border border-slate-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:border-primary"
                        placeholder="Nhập số điện thoại"
                      />
                    ) : (
                      <p className="text-sm font-medium text-slate-800">{currentAuth.phone || "Chưa cập nhật"}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/50 border border-slate-100 hover:border-primary/20 hover:shadow-sm transition-all">
                  <div className="p-2 bg-indigo-50 text-indigo-500 rounded-xl shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-500 font-medium mb-0.5">Email đăng nhập</p>
                    {isEditing ? (
                      <input
                        type="email"
                        value={authFormData.email}
                        onChange={(e) => setAuthFormData({...authFormData, email: e.target.value})}
                        className="text-sm font-medium text-slate-800 border border-slate-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:border-primary"
                        placeholder="Nhập email"
                      />
                    ) : (
                      <p className="text-sm font-medium text-slate-800">{currentAuth.email}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Work Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 font-heading uppercase tracking-wider">Công tác & Chuyên môn</h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/50 border border-slate-100 hover:border-primary/20 hover:shadow-sm transition-all">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
                    <School className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-500 font-medium mb-0.5">Đơn vị công tác</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.School || ""}
                        onChange={(e) => setFormData({...formData, School: e.target.value})}
                        className="text-sm font-medium text-slate-800 border border-slate-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:border-primary"
                        placeholder="Nhập tên trường học"
                      />
                    ) : (
                      <p className="text-sm font-medium text-slate-800">{profile.School || "Chưa cập nhật"}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/50 border border-slate-100 hover:border-primary/20 hover:shadow-sm transition-all">
                  <div className="p-2 bg-accent/10 text-accent rounded-xl shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-500 font-medium mb-0.5">Môn giảng dạy</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.SubjectsTaught || ""}
                        onChange={(e) => setFormData({...formData, SubjectsTaught: e.target.value})}
                        className="text-sm font-medium text-slate-800 border border-slate-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:border-primary"
                        placeholder="Nhập môn giảng dạy"
                      />
                    ) : (
                      <p className="text-sm font-medium text-slate-800">{profile.SubjectsTaught || "Chưa cập nhật"}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Calendar className="w-4 h-4" />
              <span>Tham gia từ {formatDate(profile.CreatedAt)}</span>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {isEditing ? (
                <>
                  <button 
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-full transition-colors disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                    Hủy
                  </button>
                  <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-full shadow-md shadow-primary/20 transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="w-full sm:w-auto px-6 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-full shadow-md shadow-primary/20 transition-all hover:-translate-y-0.5 active:scale-95"
                >
                  Cập nhật hồ sơ
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <AvatarUpdateDialog
        isOpen={isAvatarDialogOpen}
        onClose={() => setIsAvatarDialogOpen(false)}
        userId={profile.Id}
        onAvatarUpdated={handleAvatarUpdated}
      />
    </div>
  );
}
