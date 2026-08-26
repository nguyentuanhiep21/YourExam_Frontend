"use client";

import { useState } from "react";
import { CreateTopicCard } from "./CreateTopicCard";
import { TopicThread } from "./TopicThread";
import { Profile } from "../types";
import { HelpCircle, Loader2 } from "lucide-react";
import { useSupport } from "../hooks/useSupport";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export function SupportClient() {
  const { topics, loading, error, createTopic, createComment, uploadImage } = useSupport();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  
  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUser({
          Id: user.id,
          FullName: user.user_metadata?.full_name || user.email?.split("@")[0] || "Người dùng",
          AvatarUrl: user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`,
        });
      }
    };
    fetchUser();
  }, []);

  const handleCreateTopic = async (title: string, content: string, imageFile: File | null) => {
    if (!currentUser) {
      alert("Vui lòng đăng nhập để tạo chủ đề.");
      return;
    }
    
    try {
      setIsSubmitting(true);
      let imageUrl = undefined;
      
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }
      
      await createTopic(title, content, currentUser.Id, imageUrl);
    } catch (err) {
      console.error("Failed to create topic:", err);
      alert("Đã xảy ra lỗi khi tạo chủ đề hoặc tải ảnh lên.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateComment = async (topicId: number, content: string) => {
    if (!currentUser) {
      alert("Vui lòng đăng nhập để bình luận.");
      return;
    }

    try {
      await createComment(topicId, content, currentUser.Id);
    } catch (err) {
      console.error("Failed to create comment:", err);
      alert("Đã xảy ra lỗi khi tạo bình luận.");
    }
  };

  return (
    <main className="relative z-10 flex-1 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header section */}
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 flex items-center justify-center sm:justify-start gap-3 mb-4 tracking-tight">
            <HelpCircle className="w-10 h-10 text-indigo-600" />
            Trung tâm Hỗ trợ
          </h1>
          <p className="text-lg text-gray-600 font-medium max-w-2xl">
            Bạn có câu hỏi, báo lỗi hay góp ý? Hãy đăng chủ đề tại đây để được đội ngũ quản trị viên và cộng đồng YourExam hỗ trợ nhanh chóng nhất.
          </p>
        </div>

        {/* Form Create Topic */}
        <CreateTopicCard currentUser={currentUser} isSubmitting={isSubmitting} onSubmit={handleCreateTopic} />
        
        {/* List Topics */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            Các chủ đề gần đây
          </h2>
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500 bg-red-50 rounded-xl">
              Đã xảy ra lỗi tải danh sách: {error}
            </div>
          ) : topics.length === 0 ? (
            <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-xl">
              Chưa có chủ đề nào. Hãy là người đầu tiên đăng bài!
            </div>
          ) : (
            topics.map(topic => (
              <TopicThread key={topic.Id} topic={topic} onCreateComment={handleCreateComment} />
            ))
          )}
        </div>

      </div>
    </main>
  );
}
