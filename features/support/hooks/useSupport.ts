import { useState, useEffect } from "react";
import { supportApi } from "../api/support.api";
import { Topic, TopicComment } from "../types";

export function useSupport() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTopics();
  }, []);

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

  return { 
    topics, 
    loading, 
    error, 
    createTopic, 
    createComment,
    uploadImage,
    refreshTopics: fetchTopics 
  };
}
