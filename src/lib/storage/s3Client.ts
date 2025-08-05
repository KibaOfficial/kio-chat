// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import * as Minio from 'minio';

// Validate required environment variables
const requiredEnvVars = {
  MINIO_ENDPOINT: process.env.MINIO_ENDPOINT,
  MINIO_PORT: process.env.MINIO_PORT,
  MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY,
};

for (const [key, value] of Object.entries(requiredEnvVars)) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

// MinIO Client Configuration
export const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT!,
  port: parseInt(process.env.MINIO_PORT!),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY!,
  secretKey: process.env.MINIO_SECRET_KEY!,
});

// Bucket Configuration 
export const STORAGE_CONFIG = {
  BUCKET: 'kio-chat-storage',
  PATHS: {
    AVATARS: 'avatars/',
    GROUP_IMAGES: 'group-images/', 
    ATTACHMENTS: 'attachments/',
  }
} as const;

// Bucket Configuration
export const BUCKETS = {
  CHAT_FILES: 'kio-chat-storage',
  PROFILE_IMAGES: 'kio-chat-storage',
} as const;

export type BucketName = typeof BUCKETS[keyof typeof BUCKETS];

// Utility Functions
export const generateFileName = (originalName: string): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split('.').pop();
  return `${timestamp}-${randomString}.${extension}`;
};

export const getFileUrl = (bucketName: string, fileName: string): string => {
  const baseUrl = process.env.MINIO_PUBLIC_URL;
  return `${baseUrl}/${bucketName}/${fileName}`;
};

export const ensureBucketExists = async (bucketName: string): Promise<void> => {
  const exists = await minioClient.bucketExists(bucketName);
  if (!exists) {
    await minioClient.makeBucket(bucketName);
    console.log(`✅ Created bucket: ${bucketName}`);
  }
};

// File path generators
export const getProfileImagePath = (fileName: string): string => {
  return `${STORAGE_CONFIG.PATHS.AVATARS}${fileName}`;  // avatars/filename.jpg
};

export const getChatFilePath = (fileName: string, mimeType: string): string => {
  return `${STORAGE_CONFIG.PATHS.ATTACHMENTS}${fileName}`;  // attachments/filename.pdf
};

export const getGroupImagePath = (fileName: string): string => {
  return `${STORAGE_CONFIG.PATHS.GROUP_IMAGES}${fileName}`;  // group-images/filename.jpg
};

// Permission checking functions
export const hasPermissionToDelete = async (userId: string, bucket: string, fileName: string): Promise<boolean> => {
  try {
    // Get file metadata to check ownership
    const stat = await minioClient.statObject(bucket, fileName);
    const fileUserId = stat.metaData?.['x-user-id'];
    
    // User can only delete their own files
    return fileUserId === userId;
  } catch (error) {
    // File doesn't exist or error getting metadata
    return false;
  }
};

export const hasPermissionToDownload = async (userId: string, bucket: string, fileName: string): Promise<boolean> => {
  // Profile images are public
  if (bucket === BUCKETS.PROFILE_IMAGES) {
    return true;
  }
  
  // Chat files are private - only owner can access
  if (bucket === BUCKETS.CHAT_FILES) {
    try {
      const stat = await minioClient.statObject(bucket, fileName);
      const fileUserId = stat.metaData?.['x-user-id'];
      return fileUserId === userId;
    } catch (error) {
      return false;
    }
  }
  
  // Default deny for unknown buckets
  return false;
};

