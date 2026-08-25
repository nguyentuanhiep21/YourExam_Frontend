"use client";

import { useState } from "react";
import { CreateTopicCard } from "./CreateTopicCard";
import { TopicThread } from "./TopicThread";
import { mockTopics } from "../mockData";
import { Topic, Profile } from "../types";
import { HelpCircle } from "lucide-react";

export function SupportClient() {
  const [topics, setTopics] = useState<Topic[]>(mockTopics);
  
  // Giả lập currentUser (trong thực tế sẽ lấy từ context hoặc auth session)
  const currentUser: Profile = {
    Id: "me",
    FullName: "Guest User",
    AvatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Me",
  };

  const handleCreateTopic = (title: string, content: string) => {
    const newTopic: Topic = {
      Id: Date.now(),
      Title: title,
      Content: content,
      AuthorId: currentUser.Id,
      Author: currentUser,
      CreatedAt: new Date().toISOString(),
      Comments: [],
    };
    
    // Thêm topic mới lên đầu danh sách
    setTopics([newTopic, ...topics]);
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
        <CreateTopicCard currentUser={currentUser} onSubmit={handleCreateTopic} />
        
        {/* List Topics */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            Các chủ đề gần đây
          </h2>
          {topics.map(topic => (
            <TopicThread key={topic.Id} topic={topic} />
          ))}
        </div>

      </div>
    </main>
  );
}
