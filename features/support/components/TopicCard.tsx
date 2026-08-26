"use client";

import { Topic } from "../types";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { MessageSquare, MoreHorizontal, Share2 } from "lucide-react";

interface TopicCardProps {
  topic: Topic;
}

export function TopicCard({ topic }: TopicCardProps) {
  const timeAgo = formatDistanceToNow(new Date(topic.CreatedAt), { addSuffix: true, locale: vi });
  const commentCount = topic.Comments?.length || 0;

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 sm:p-8 relative z-10 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <img 
            src={topic.Author?.AvatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest"} 
            alt={topic.Author?.FullName} 
            className="w-12 h-12 rounded-full border-2 border-white shadow-sm bg-gray-50"
          />
          <div>
            <h3 className="text-base font-bold text-gray-900 leading-tight">
              {topic.Author?.FullName || "Người dùng ẩn danh"}
            </h3>
            <p className="text-sm text-gray-500 font-medium">Đã đăng {timeAgo}</p>
          </div>
        </div>
        
        <button className="text-gray-400 hover:text-indigo-600 p-2 rounded-xl hover:bg-indigo-50 transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>
      
      <div className="pl-0 sm:pl-16">
        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-3 leading-snug">
          {topic.Title}
        </h2>
        <p className="text-base text-gray-700 leading-relaxed mb-6 whitespace-pre-wrap">
          {topic.Content}
        </p>

        {topic.ImageUrl && (
          <div className="mb-6 rounded-xl overflow-hidden border border-gray-200">
            <img src={topic.ImageUrl} alt="Đính kèm" className="max-h-96 w-auto object-contain bg-gray-50 mx-auto" />
          </div>
        )}
        
        <div className="flex items-center gap-4 border-t border-gray-100 pt-4">
          <button className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-indigo-600 bg-gray-50 hover:bg-indigo-50 px-4 py-2 rounded-xl transition-all">
            <MessageSquare className="w-4 h-4" />
            {commentCount} Bình luận
          </button>
        </div>
      </div>
    </div>
  );
}
