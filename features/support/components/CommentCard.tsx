"use client";

import { TopicComment } from "../types";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { CornerDownRight, MoreHorizontal } from "lucide-react";

interface CommentCardProps {
  comment: TopicComment;
  isLast?: boolean;
}

export function CommentCard({ comment, isLast = false }: CommentCardProps) {
  const timeAgo = formatDistanceToNow(new Date(comment.CreatedAt), { addSuffix: true, locale: vi });

  return (
    <div className="relative flex gap-4 pl-4 sm:pl-12 pt-6">
      {/* Connecting line from parent. Absolute positioned so it stretches down from top. */}
      {/* Horizontal curve connecting to avatar */}
      <div className="absolute left-6 sm:left-14 top-0 w-8 h-10 border-l-2 border-b-2 border-indigo-100 rounded-bl-xl z-0"></div>
      {/* If not last, draw a continuous vertical line down for next comments */}
      {!isLast && (
        <div className="absolute left-6 sm:left-14 top-10 bottom-0 w-0 border-l-2 border-indigo-100 z-0"></div>
      )}

      {/* Comment Content */}
      <div className="flex-1 bg-white rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100 p-4 sm:p-5 relative z-10 ml-8 transition-shadow hover:shadow-md">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <img 
              src={comment.Author?.AvatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest"} 
              alt={comment.Author?.FullName} 
              className="w-8 h-8 rounded-full border border-gray-100 bg-gray-50"
            />
            <div>
              <h4 className="text-sm font-bold text-gray-900 leading-none mb-1">
                {comment.Author?.FullName || "Người dùng ẩn danh"}
                {comment.AuthorId === "admin" && (
                  <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-fuchsia-700 bg-fuchsia-50 border border-fuchsia-100 rounded-md">
                    Admin
                  </span>
                )}
              </h4>
              <p className="text-xs text-gray-400 font-medium">{timeAgo}</p>
            </div>
          </div>
          
          <button className="text-gray-400 hover:text-indigo-600 p-1 rounded-md hover:bg-indigo-50 transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
        
        <div className="text-sm text-gray-700 leading-relaxed pl-11">
          {comment.Content}
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-4 mt-3 pl-11">
          <button className="text-xs font-semibold text-gray-500 hover:text-indigo-600 transition-colors">
            Thích
          </button>
          <button className="text-xs font-semibold text-gray-500 hover:text-indigo-600 transition-colors">
            Phản hồi
          </button>
        </div>
      </div>
    </div>
  );
}
