import { createClient } from "@/lib/supabase/client";
import { Topic, TopicComment } from "../types";
import { getGmt7IsoString } from "@/utils/time";

export const supportApi = {
  getTopics: async (): Promise<Topic[]> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("Topics")
      .select(`
        *,
        Comments:TopicComments(*)
      `)
      .order("CreatedAt", { ascending: false });

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
  }
};
