import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { supportApi } from "../api/support.api";
import { Topic, TopicComment, Profile } from "../types/support.types";
import { createClient } from "@/lib/supabase/client";

export function useSupport() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedTopicIds, setSavedTopicIds] = useState<number[]>([]);
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [totalTopics, setTotalTopics] = useState(0);

  const searchParams = useSearchParams();
  const pageStr = searchParams.get('page');
  const page = pageStr ? parseInt(pageStr, 10) : 1;
  const limit = 5;

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    fetchTopics(page, limit);
  }, [page]);

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

  const fetchTopics = async (p: number, l: number) => {
    try {
      setLoading(true);
      const { topics: data, total } = await supportApi.getTopics(p, l);
      setTopics(data);
      setTotalTopics(total);
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
            Comments: [...(topic.Comments || []), newComment],
            CommentCount: (topic.CommentCount || topic.Comments?.length || 0) + 1
          };
        }
        return topic;
      }));
      return newComment;
    } catch (err: any) {
      throw err;
    }
  };

  const loadMoreComments = async (topicId: number, page: number) => {
    try {
      const moreComments = await supportApi.getTopicComments(topicId, page, 10);
      setTopics(prev => prev.map(topic => {
        if (topic.Id === topicId) {
          const existingIds = new Set((topic.Comments || []).map(c => c.Id));
          const uniqueNew = moreComments.filter(c => !existingIds.has(c.Id));
          return {
            ...topic,
            Comments: [...(topic.Comments || []), ...uniqueNew]
          };
        }
        return topic;
      }));
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

  const removeTopic = async (topicId: number) => {
    if (!currentUser) throw new Error("Vui lòng đăng nhập.");
    try {
      await supportApi.deleteTopic(topicId, currentUser.Id);
      setTopics(prev => prev.filter(t => t.Id !== topicId));
    } catch (err: any) {
      throw err;
    }
  };

  const removeComment = async (topicId: number, commentId: number) => {
    if (!currentUser) throw new Error("Vui lòng đăng nhập.");
    try {
      await supportApi.deleteComment(commentId, currentUser.Id, topicId);
      setTopics(prev => prev.map(topic => {
        if (topic.Id === topicId && topic.Comments) {
          return {
            ...topic,
            Comments: topic.Comments.filter(c => c.Id !== commentId),
            CommentCount: Math.max(0, (topic.CommentCount || topic.Comments?.length || 0) - 1)
          };
        }
        return topic;
      }));
    } catch (err: any) {
      throw err;
    }
  };

  return { 
    topics, 
    loading, 
    error,
    savedTopicIds,
    currentUser,
    totalTopics,
    page,
    limit,
    addTopic,
    addComment,
    removeTopic,
    removeComment,
    loadMoreComments,
    toggleSaveTopic,
    refreshTopics: () => fetchTopics(page, limit)
  };
}
