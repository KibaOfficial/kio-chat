// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

export interface StorageUploadResponse {
  success: boolean;
  url?: string;
  fileName: string;
  originalName: string;
  size: number;
  mimeType: string;
  bucketName: string;
}

export interface StorageErrorResponse {
  success: false;
  error: string;
  message?: string;
}

export interface StorageDeleteResponse {
  success: boolean;
  message?: string;
}

export type StorageResponse = StorageUploadResponse | StorageErrorResponse;

export const ALLOWED_FILE_TYPES = {
  PROFILE_IMAGES: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp'
  ],
  CHAT_FILES: [
    'image/jpeg',
    'image/jpg',
    'image/png', 
    'image/gif',
    'image/webp',
    'application/pdf'
  ]
} as const;

export const MAX_FILE_SIZES = {
  PROFILE_IMAGES: 8 * 1024 * 1024, // 8MB
  CHAT_FILES: 50 * 1024 * 1024, // 50MB
} as const;

