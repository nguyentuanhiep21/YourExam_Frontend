"use client";

import { useState } from "react";
import { Send, Image as ImageIcon } from "lucide-react";
import { Profile } from "../types";

interface CreateTopicCardProps {
  currentUser?: Profile;
  onSubmit: (title: string, content: string) => void;
}

export function CreateTopicCard({ currentUser, onSubmit }: CreateTopicCardProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onSubmit(title, content);
    setTitle("");
    setContent("");
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-indigo-50/50 p-6 sm:p-8 transition-all hover:shadow-md mb-8 relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-[80px] -mr-32 -mt-32 opacity-70 pointer-events-none"></div>

      <div className="relative z-10">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          Tạo chủ đề mới
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            {/* Avatar */}
            <div className="hidden sm:block shrink-0 mt-1">
              <img 
                src={currentUser?.AvatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest"} 
                alt="Avatar" 
                className="w-12 h-12 rounded-full border-2 border-white shadow-sm bg-gray-50"
              />
            </div>
            
            <div className="flex-1 space-y-4">
              <input 
                type="text" 
                placeholder="Tiêu đề (Vấn đề bạn đang gặp phải?)" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all placeholder:text-gray-400"
              />
              
              <textarea 
                placeholder="Mô tả chi tiết nội dung cần hỗ trợ..." 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all placeholder:text-gray-400 resize-y"
              />
              
              <div className="flex items-center justify-between pt-2">
                <button 
                  type="button"
                  className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  title="Đính kèm hình ảnh"
                >
                  <ImageIcon className="w-5 h-5" />
                </button>
                
                <button 
                  type="submit"
                  disabled={!title.trim() || !content.trim()}
                  className="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-indigo-700 hover:shadow-[0_8px_16px_rgba(79,70,229,0.2)] transition-all disabled:opacity-50 disabled:hover:shadow-none disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  Đăng bài
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
