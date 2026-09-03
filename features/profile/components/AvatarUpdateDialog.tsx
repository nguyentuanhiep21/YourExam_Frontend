"use client";

import React, { useState, useCallback, useRef } from "react";
import Cropper from "react-easy-crop";
import { X, Upload, Check, Loader2, Image as ImageIcon } from "lucide-react";
import getCroppedImg from "../utils/cropImage";
import { createClient } from "@/lib/supabase/client";

interface AvatarUpdateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onAvatarUpdated: (url: string) => void;
}

export function AvatarUpdateDialog({ isOpen, onClose, userId, onAvatarUpdated }: AvatarUpdateDialogProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageSrc(reader.result?.toString() || "");
      });
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      setIsUploading(true);
      
      // 1. Cut the image locally
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (!croppedBlob) throw new Error("Không thể cắt ảnh");

      // 2. Upload to Supabase Storage
      const supabase = createClient();
      
      // Policy requires: (storage.foldername(name))[1] = (select auth.uid()::text)
      // So path should be: {userId}/avatar.jpg
      const filePath = `${userId}/avatar.jpg`;
      
      const { data, error } = await supabase.storage
        .from("UserAvatar")
        .upload(filePath, croppedBlob, {
          contentType: "image/jpeg",
          upsert: true,
          cacheControl: "0"
        });

      if (error) {
        throw error;
      }

      // 3. Get Public URL
      const { data: publicUrlData } = supabase.storage
        .from("UserAvatar")
        .getPublicUrl(filePath);
        
      // Append a timestamp to break browser cache if they upload a new one
      const finalUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`;

      // 4. Update Profiles table
      const { error: profileError } = await supabase
        .from("Profiles")
        .update({ AvatarUrl: finalUrl })
        .eq("Id", userId);

      if (profileError) {
        throw profileError;
      }

      onAvatarUpdated(finalUrl);
      resetState();
      onClose();
    } catch (err: any) {
      console.error("Error uploading avatar:", err);
      alert("Lỗi khi tải ảnh lên. Chi tiết: " + (err.message || "Unknown error"));
    } finally {
      setIsUploading(false);
    }
  };

  const resetState = () => {
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={isUploading ? undefined : handleClose}
      />
      
      {/* Dialog */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col m-4 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold font-heading text-slate-900">Cập nhật ảnh đại diện</h2>
          <button 
            onClick={handleClose}
            disabled={isUploading}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          {!imageSrc ? (
            <div 
              className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 hover:bg-slate-100 hover:border-primary/50 transition-all cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="p-4 bg-white rounded-full shadow-sm group-hover:scale-105 transition-transform mb-4">
                <ImageIcon className="w-8 h-8 text-primary/80" />
              </div>
              <p className="text-sm font-medium text-slate-700 mb-1">Nhấn để chọn ảnh</p>
              <p className="text-xs text-slate-500 text-center">Định dạng hỗ trợ: JPG, PNG, WebP (Tối đa 5MB)</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="relative w-full h-[300px] bg-slate-900 rounded-2xl overflow-hidden">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  showGrid={false}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>
              
              <div className="flex items-center gap-4 px-2">
                <span className="text-xs font-medium text-slate-500">Thu phóng</span>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            </div>
          )}
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/jpeg,image/png,image/webp" 
            className="hidden" 
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          {imageSrc && (
            <button
              onClick={() => setImageSrc(null)}
              disabled={isUploading}
              className="px-5 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-full hover:bg-slate-100 transition-colors disabled:opacity-50"
            >
              Chọn ảnh khác
            </button>
          )}
          
          {imageSrc ? (
            <button
              onClick={handleSave}
              disabled={isUploading}
              className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-primary rounded-full hover:bg-primary-hover shadow-md shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Cắt & Lưu
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleClose}
              className="px-5 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-full hover:bg-slate-100 transition-colors"
            >
              Đóng
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
