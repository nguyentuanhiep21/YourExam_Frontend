"use client";

import { Topic } from "../types";
import { TopicCard } from "./TopicCard";
import { CommentCard } from "./CommentCard";
import { useState } from "react";

interface TopicThreadProps {
  topic: Topic;
  onCreateComment?: (topicId: number, content: string) => Promise<void>;
}

export function TopicThread({ topic, onCreateComment }: TopicThreadProps) {
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  return (
    <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Main Topic */}
      <TopicCard topic={topic} />
      
      {/* Comments List */}
      {topic.Comments && topic.Comments.length > 0 && (
        <div className="mt-2">
          {topic.Comments.map((comment, index) => (
            <CommentCard 
              key={comment.Id} 
              comment={comment} 
              isLast={index === topic.Comments!.length - 1} 
            />
          ))}
        </div>
      )}

      {onCreateComment && (
        <div className="mt-4 pl-0 sm:pl-16 flex justify-end">
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
