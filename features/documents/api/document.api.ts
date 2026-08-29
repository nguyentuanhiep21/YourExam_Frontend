import { createClient } from "@/lib/supabase/client";
import { UserDocument } from "../types/document.types";
import { getGmt7IsoString } from "@/utils/time";

export const documentApi = {
  /**
   * Upload file lên bucket 'UserDocuments' và trả về public URL
   */
  uploadFileToStorage: async (file: File, userId: string): Promise<{ url: string; path: string }> => {
    const supabase = createClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;
    
    // Upload lên bucket UserDocuments
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("UserDocuments")
      .upload(filePath, file);

    if (uploadError) {
      throw new Error(`Upload file failed: ${uploadError.message}`);
    }

    // Lấy public URL
    const { data } = supabase.storage
      .from("UserDocuments")
      .getPublicUrl(uploadData.path);

    return {
      url: data.publicUrl,
      path: uploadData.path
    };
  },

  /**
   * Lưu thông tin file vào database bảng 'UserDocuments'
   */
  saveDocumentToDb: async (
    fileName: string,
    fileUrl: string,
    fileType: string,
    fileSize: number,
    authorId: string
  ): Promise<UserDocument> => {
    const supabase = createClient();
    const createdAt = getGmt7IsoString();

    const { data, error } = await supabase
      .from("UserDocuments")
      .insert({
        FileName: fileName,
        FileUrl: fileUrl,
        FileType: fileType,
        FileSize: fileSize,
        AuthorId: authorId,
        CreatedAt: createdAt
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Save document to DB failed: ${error.message}`);
    }

    return data as any;
  },

  /**
   * Lấy danh sách tài liệu
   */
  getDocuments: async (): Promise<UserDocument[]> => {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from("UserDocuments")
      .select("*, Author:Profiles(*)") // Assuming Author relation is mapped to Profiles
      .order("CreatedAt", { ascending: false });

    if (error) {
      throw new Error(`Get documents failed: ${error.message}`);
    }

    return data as any;
  }
};
