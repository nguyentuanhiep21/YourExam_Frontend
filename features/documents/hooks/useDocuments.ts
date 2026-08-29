import { useState, useEffect, useCallback } from 'react';
import { documentApi } from '../api/document.api';
import { UserDocument } from '../types/document.types';

export const useDocuments = () => {
  const [documents, setDocuments] = useState<UserDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await documentApi.getDocuments();
      setDocuments(data);
    } catch (err: any) {
      console.error('Failed to fetch documents:', err);
      setError(err.message || 'Lỗi khi tải danh sách tài liệu');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return {
    documents,
    isLoading,
    error,
    refresh: fetchDocuments
  };
};
