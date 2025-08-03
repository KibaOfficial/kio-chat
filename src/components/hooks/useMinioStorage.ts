// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

"use client";

import { useState } from 'react';
import { StorageResponse, StorageUploadResponse } from '@/app/api/storage/types';

interface UseMinioStorageProps {
  onUploadComplete?: (response: StorageUploadResponse) => void;
  onError?: (error: string) => void;
}

export const useMinioStorage = ({ onUploadComplete, onError }: UseMinioStorageProps = {}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadFile = async (file: File, type: 'profile' | 'chat'): Promise<StorageUploadResponse | null> => {
    if (!file) {
      onError?.('No file selected');
      return null;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`/api/storage?type=${type}`, {
        method: 'POST',
        body: formData,
      });

      const result: StorageResponse = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      const uploadResponse = result as StorageUploadResponse;
      setUploadProgress(100);
      onUploadComplete?.(uploadResponse);
      
      return uploadResponse;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      console.error('Upload error:', errorMessage);
      onError?.(errorMessage);
      return null;
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000); // Reset progress after delay
    }
  };

  const deleteFile = async (bucket: string, fileName: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/storage?bucket=${encodeURIComponent(bucket)}&file=${encodeURIComponent(fileName)}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error);
      }

      return true;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Delete failed';
      console.error('Delete error:', errorMessage);
      onError?.(errorMessage);
      return false;
    }
  };

  const getDownloadUrl = (bucket: string, fileName: string): string => {
    return `/api/storage/download?bucket=${encodeURIComponent(bucket)}&file=${encodeURIComponent(fileName)}`;
  };

  const getPublicUrl = (bucket: string, fileName: string): string => {
    // For public buckets (like profile images), return direct MinIO URL
    const baseUrl = process.env.NEXT_PUBLIC_MINIO_URL || 'http://localhost:9000';
    return `${baseUrl}/${bucket}/${fileName}`;
  };

  return {
    uploadFile,
    deleteFile,
    getDownloadUrl,
    getPublicUrl,
    isUploading,
    uploadProgress,
  };
};

// Convenience hooks for specific use cases
export const useProfileImageUpload = (props?: UseMinioStorageProps) => {
  const storage = useMinioStorage(props);
  
  const uploadProfileImage = (file: File) => storage.uploadFile(file, 'profile');
  
  return {
    ...storage,
    uploadProfileImage,
  };
};

export const useChatFileUpload = (props?: UseMinioStorageProps) => {
  const storage = useMinioStorage(props);
  
  const uploadChatFile = (file: File) => storage.uploadFile(file, 'chat');
  
  return {
    ...storage,
    uploadChatFile,
  };
};