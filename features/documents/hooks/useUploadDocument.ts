import { useState } from 'react';
import { documentApi } from '../api/document.api';
import { UserDocument } from '../types/document.types';
import { createClient } from '@/lib/supabase/client';

export const useUploadDocument = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadDocument = async (file: File): Promise<UserDocument | null> => {
    setIsUploading(true);
    setError(null);

    try {
      // 1. Get current user
      const supabase = createClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        throw new Error("Bạn cần đăng nhập để tải lên tài liệu.");
      }

      const authorId = user.id;

      // 2. Upload file to Storage theo chuẩn policy userId/fileName
      const { url } = await documentApi.uploadFileToStorage(file, authorId);

      // 3. Prepare file data
      const fileName = file.name;
      const fileExt = fileName.split('.').pop() || '';
      const fileSize = file.size; // bytes

      // 4. Save to Database
      const savedDoc = await documentApi.saveDocumentToDb(
        fileName,
        url,
        fileExt.toLowerCase(),
        fileSize,
        authorId
      );

      return savedDoc;
    } catch (err: any) {
      console.error("Error uploading document:", err);
      setError(err.message || "Đã xảy ra lỗi trong quá trình tải lên.");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadDocument,
    isUploading,
    error
  };
};
