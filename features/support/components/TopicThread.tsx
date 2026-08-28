"use client";

import { Topic } from "../types/support.types";
import { TopicCard } from "./TopicCard";
import { CommentCard } from "./CommentCard";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface TopicThreadProps {
  topic: Topic;
  onCreateComment?: (topicId: number, content: string) => Promise<void>;
  currentUserId?: string;
  isSaved?: boolean;
  onToggleSave?: () => void;
  onDelete?: () => void;
  onDeleteComment?: (commentId: number) => void;
}

export function TopicThread({ 
  topic, 
  onCreateComment,
  currentUserId,
  isSaved,
  onToggleSave,
  onDelete,
  onDeleteComment,
  onLoadMoreComments
}: TopicThreadProps) {
  const [showComments, setShowComments] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentPage, setCommentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || !onCreateComment) return;
    try {
      setIsSubmitting(true);
      await onCreateComment(topic.Id, replyContent);
      setReplyContent("");
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi khi tạo bình luận.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoadMore = async () => {
    if (!onLoadMoreComments) return;
    setIsLoadingMore(true);
    try {
      const nextPage = commentPage + 1;
      await onLoadMoreComments(topic.Id, nextPage);
      setCommentPage(nextPage);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const limit = 10;
  const hasMore = (commentPage * limit) < (topic.CommentCount || 0);

  return (
    <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Main Topic */}
      <TopicCard 
        topic={topic} 
        currentUserId={currentUserId}
        isSaved={isSaved}
        onToggleSave={onToggleSave}
        onDelete={onDelete}
        isCommentsVisible={showComments}
        onToggleComments={() => setShowComments(!showComments)}
      />
      
      
      {/* Comments List */}
      {showComments && topic.Comments && topic.Comments.length > 0 && (
        <div className="mt-2 animate-in slide-in-from-top-4 fade-in duration-300">
          {topic.Comments.map((comment, index) => (
            <CommentCard 
              key={comment.Id} 
              comment={comment} 
              isLast={index === topic.Comments!.length - 1 && !hasMore}
              currentUserId={currentUserId}
              onDelete={onDeleteComment ? () => onDeleteComment(comment.Id) : undefined}
            />
          ))}
          
          {hasMore && (
            <div className="pl-0 sm:pl-16 mt-2 flex justify-center">
              <button
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all shadow-sm border border-slate-100 disabled:opacity-50"
                title="Tải thêm bình luận"
              >
                {isLoadingMore ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span className="text-xl font-medium leading-none">+</span>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {showComments && onCreateComment && (
        <div className="mt-4 pl-0 sm:pl-16 flex justify-end animate-in slide-in-from-top-4 fade-in duration-300">
          <form onSubmit={handleSubmit} className="flex gap-3 w-full sm:w-11/12">
            <input 
              type="text" 
              value={replyContent}
              onChange={e => setReplyContent(e.target.value)}
              placeholder="Viết bình luận..." 
              className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all shadow-sm"
              disabled={isSubmitting}
            />
            <button 
              type="submit" 
              disabled={isSubmitting || !replyContent.trim()}
              className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-sm"
            >
              Gửi
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
