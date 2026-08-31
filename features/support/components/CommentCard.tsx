"use client";

import { TopicComment } from "../types/support.types";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { CornerDownRight, MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";

interface CommentCardProps {
  comment: TopicComment;
  isLast?: boolean;
  currentUserId?: string;
  onDelete?: () => void;
}

export function CommentCard({ comment, isLast = false, currentUserId, onDelete }: CommentCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isOwnComment = currentUserId === comment.AuthorId;
  const timeAgo = formatDistanceToNow(new Date(comment.CreatedAt), { addSuffix: true, locale: vi });

  return (
    <div className="relative flex gap-4 pl-4 sm:pl-12 pt-6 font-body">
      {/* Connecting line from parent. Absolute positioned so it stretches down from top. */}
      {/* Horizontal curve connecting to avatar */}
      <div className="absolute left-6 sm:left-14 top-0 w-8 h-10 border-l-2 border-b-2 border-primary/20 rounded-bl-xl z-0"></div>
      {/* If not last, draw a continuous vertical line down for next comments */}
      {!isLast && (
        <div className="absolute left-6 sm:left-14 top-10 bottom-0 w-0 border-l-2 border-primary/20 z-0"></div>
      )}

      {/* Comment Content */}
      <div className="flex-1 bg-white rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100 p-4 sm:p-5 relative z-10 ml-8 transition-all hover:shadow-md hover:border-primary/20">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <img 
              src={comment.Author?.AvatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest"} 
              alt={comment.Author?.FullName} 
              className="w-8 h-8 rounded-full border border-slate-100 bg-slate-50"
            />
            <div>
              <h4 className="text-sm font-bold font-heading text-slate-900 leading-none mb-1">
                {comment.Author?.FullName || "Người dùng ẩn danh"}
                {comment.AuthorId === "admin" && (
                  <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent bg-accent/10 border border-accent/20 rounded-md">
                    Admin
                  </span>
                )}
              </h4>
              <p className="text-xs text-slate-400 font-medium">{timeAgo}</p>
            </div>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-400 hover:text-primary p-1 rounded-md hover:bg-primary/5 transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            {isMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsMenuOpen(false)}
                />
                <div className="absolute top-full right-0 mt-1 w-40 bg-white/95 backdrop-blur-2xl rounded-xl shadow-xl shadow-slate-200/50 border border-slate-100 z-20 p-1 origin-top-right animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex flex-col gap-1">
                    {isOwnComment && onDelete ? (
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          onDelete();
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 hover:bg-red-50 hover:text-red-600 text-red-500"
                        title="Xóa bình luận này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Xóa bình luận
                      </button>
                    ) : (
                      <div className="px-3 py-2 text-xs text-slate-400 font-medium">Không có hành động</div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="text-sm text-slate-700 leading-relaxed pl-11">
          {comment.Content}
        </div>
      </div>
    </div>
  );
}
