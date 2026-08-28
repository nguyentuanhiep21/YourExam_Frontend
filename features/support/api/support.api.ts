import { createClient } from "@/lib/supabase/client";
import { Topic, TopicComment } from "../types/support.types";
import { getGmt7IsoString } from "@/utils/time";

export const supportApi = {
  getTopics: async (page: number = 1, limit: number = 5): Promise<{ topics: Topic[], total: number }> => {
    const supabase = createClient();
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from("Topics")
      .select(`
        *,
        Comments:TopicComments(*)
      `, { count: "exact" })
      .order("CreatedAt", { ascending: false })
      .order("CreatedAt", { foreignTable: "TopicComments", ascending: true })
      .limit(10, { foreignTable: "TopicComments" })
      .range(from, to);

    if (error) throw new Error(error.message);
    return { topics: data as any, total: count || 0 };
  },

  getTopicComments: async (topicId: number, page: number = 1, limit: number = 10): Promise<TopicComment[]> => {
    const supabase = createClient();
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error } = await supabase
      .from("TopicComments")
      .select("*")
      .eq("TopicId", topicId)
      .order("CreatedAt", { ascending: true })
      .range(from, to);

    if (error) throw new Error(error.message);
    return data as any;
  },

  createTopic: async (topicData: { Title: string; Content: string; AuthorId: string; ImageUrl?: string }): Promise<Topic> => {
    const supabase = createClient();
    const createdAt = getGmt7IsoString();

    const { data: { user } } = await supabase.auth.getUser();
    console.log("=== DEBUG RLS ===");
    console.log("1. Supabase Auth UID:", user?.id);
    console.log("2. Payload AuthorId:", topicData.AuthorId);
    console.log("3. Trùng khớp?:", user?.id === topicData.AuthorId);
    console.log("4. Full Payload:", { ...topicData, CreatedAt: createdAt });
    console.log("=================");

    const { data, error } = await supabase
      .from("Topics")
      .insert({
        ...topicData,
        CreatedAt: createdAt
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as any;
  },

  createComment: async (commentData: { TopicId: number; Content: string; AuthorId: string }): Promise<TopicComment> => {
    const supabase = createClient();
    const createdAt = getGmt7IsoString();

    const { data, error } = await supabase
      .from("TopicComments")
      .insert({
        ...commentData,
        CreatedAt: createdAt
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data as any;
  },

  uploadImage: async (file: File): Promise<string> => {
    const supabase = createClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("SupportImages")
      .upload(fileName, file);

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const { data } = supabase.storage
      .from("SupportImages")
      .getPublicUrl(fileName);

    return data.publicUrl;
  },

  saveTopic: async (topicId: number, userId: string): Promise<void> => {
    const supabase = createClient();
    const savedAt = getGmt7IsoString();

    const { error } = await supabase
      .from("SavedTopics")
      .insert({
        TopicId: topicId,
        UserId: userId,
        SavedAt: savedAt
      });

    if (error) throw new Error(error.message);
  },

  unsaveTopic: async (topicId: number, userId: string): Promise<void> => {
    const supabase = createClient();

    const { error } = await supabase
      .from("SavedTopics")
      .delete()
      .match({ TopicId: topicId, UserId: userId });

    if (error) throw new Error(error.message);
  },

  getSavedTopics: async (userId: string): Promise<number[]> => {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from("SavedTopics")
      .select("TopicId")
      .eq("UserId", userId);
      
    if (error) throw new Error(error.message);
    return data.map((d: any) => d.TopicId);
  },

  deleteTopic: async (topicId: number, authorId: string): Promise<void> => {
    const supabase = createClient();
    
    const { error } = await supabase
      .from("Topics")
      .delete()
      .match({ Id: topicId, AuthorId: authorId });

    if (error) throw new Error(error.message);
  },

  deleteComment: async (commentId: number, authorId: string, topicId: number): Promise<void> => {
    const supabase = createClient();
    
    const { error } = await supabase
      .from("TopicComments")
      .delete()
      .match({ Id: commentId, AuthorId: authorId });

    if (error) throw new Error(error.message);
  }
};
