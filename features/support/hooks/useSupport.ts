import { useState, useEffect } from "react";
import { supportApi } from "../api/support.api";
import { Topic, TopicComment, Profile } from "../types/support.types";
import { createClient } from "@/lib/supabase/client";

export function useSupport() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedTopicIds, setSavedTopicIds] = useState<number[]>([]);
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);

  useEffect(() => {
    fetchTopics();
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setCurrentUser({
        Id: user.id,
        FullName: user.user_metadata?.full_name || user.email?.split("@")[0] || "Người dùng",
        AvatarUrl: user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`,
      });
      fetchSavedTopics(user.id);
    }
  };

  const fetchTopics = async () => {
    try {
      setLoading(true);
      const data = await supportApi.getTopics();
      setTopics(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createTopic = async (title: string, content: string, authorId: string, imageUrl?: string) => {
    try {
      const newTopic = await supportApi.createTopic({ Title: title, Content: content, AuthorId: authorId, ImageUrl: imageUrl });
      // Gán mảng rỗng cho Comments để đồng nhất type
      newTopic.Comments = [];
      setTopics(prev => [newTopic, ...prev]);
      return newTopic;
    } catch (err: any) {
      throw err;
    }
  };

  const createComment = async (topicId: number, content: string, authorId: string) => {
    try {
      const newComment = await supportApi.createComment({ TopicId: topicId, Content: content, AuthorId: authorId });
      
      setTopics(prev => prev.map(topic => {
        if (topic.Id === topicId) {
          return {
            ...topic,
            Comments: [...(topic.Comments || []), newComment]
          };
        }
        return topic;
      }));
      return newComment;
    } catch (err: any) {
      throw err;
    }
  };

  const uploadImage = async (file: File) => {
    try {
      return await supportApi.uploadImage(file);
    } catch (err: any) {
      throw err;
    }
  };

  const fetchSavedTopics = async (userId: string) => {
    try {
      const ids = await supportApi.getSavedTopics(userId);
      setSavedTopicIds(ids);
    } catch (err: any) {
      console.error("Failed to fetch saved topics:", err);
    }
  };

  const saveTopic = async (topicId: number, userId: string) => {
    try {
      await supportApi.saveTopic(topicId, userId);
      setSavedTopicIds(prev => [...prev, topicId]);
    } catch (err: any) {
      throw err;
    }
  };

  const unsaveTopic = async (topicId: number, userId: string) => {
    try {
      await supportApi.unsaveTopic(topicId, userId);
      setSavedTopicIds(prev => prev.filter(id => id !== topicId));
    } catch (err: any) {
      throw err;
    }
  };

  const addTopic = async (title: string, content: string, imageFile: File | null) => {
    if (!currentUser) {
      throw new Error("Vui lòng đăng nhập để tạo chủ đề.");
    }
    
    let imageUrl = undefined;
    if (imageFile) {
      imageUrl = await uploadImage(imageFile);
    }
    
    return await createTopic(title, content, currentUser.Id, imageUrl);
  };

  const addComment = async (topicId: number, content: string) => {
    if (!currentUser) {
      throw new Error("Vui lòng đăng nhập để bình luận.");
    }

    return await createComment(topicId, content, currentUser.Id);
  };

  const toggleSaveTopic = async (topicId: number) => {
    if (!currentUser) return;
    const isSaved = savedTopicIds.includes(topicId);
    if (isSaved) {
      await unsaveTopic(topicId, currentUser.Id);
    } else {
      await saveTopic(topicId, currentUser.Id);
    }
  };

  return { 
    topics, 
    loading, 
    error,
    savedTopicIds,
    currentUser,
    addTopic,
    addComment,
    toggleSaveTopic,
    refreshTopics: fetchTopics 
  };
}
