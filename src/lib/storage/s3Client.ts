// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import * as Minio from 'minio';

// MinIO Client Configuration
export const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT!,
  port: parseInt(process.env.MINIO_PORT!),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

// Bucket Configuration
export const BUCKETS = {
  CHAT_FILES: 'kio-chat-files',
  PROFILE_IMAGES: 'kio-profile-images',
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
  return `avatars/${fileName}`;
};

export const getChatFilePath = (fileName: string, mimeType: string): string => {
  if (mimeType.startsWith('image/')) {
    return `messages/images/${fileName}`;
  } else if (mimeType === 'application/pdf') {
    return `messages/documents/${fileName}`;
  } else {
    return `messages/other/${fileName}`;
  }
};

