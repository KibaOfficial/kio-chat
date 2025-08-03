// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { 
  minioClient, 
  BUCKETS, 
  generateFileName, 
  getFileUrl, 
  ensureBucketExists,
  getProfileImagePath,
  getChatFilePath,
  hasPermissionToDelete
} from '@/lib/storage/s3Client';
import { 
  StorageUploadResponse, 
  StorageErrorResponse,
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZES 
} from './types';

// Validation helper
const validateFile = (file: File, type: 'profile' | 'chat'): string | null => {
  const allowedTypes = type === 'profile' 
    ? ALLOWED_FILE_TYPES.PROFILE_IMAGES 
    : ALLOWED_FILE_TYPES.CHAT_FILES;
    
  const maxSize = type === 'profile' 
    ? MAX_FILE_SIZES.PROFILE_IMAGES 
    : MAX_FILE_SIZES.CHAT_FILES;

  if (!allowedTypes.includes(file.type as any)) {
    return `Invalid file type. Allowed: ${allowedTypes.join(', ')}`;
  }

  if (file.size > maxSize) {
    const sizeMB = Math.round(maxSize / (1024 * 1024));
    return `File too large. Maximum size: ${sizeMB}MB`;
  }

  return null;
};

// POST /api/storage?type=profile|chat
export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const session = await auth();
    if (!session?.user?.id) {
      const errorResponse: StorageErrorResponse = {
        success: false,
        error: 'Unauthorized'
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const uploadType = searchParams.get('type') as 'profile' | 'chat';
    
    if (!uploadType || !['profile', 'chat'].includes(uploadType)) {
      const errorResponse: StorageErrorResponse = {
        success: false,
        error: 'Invalid upload type. Use ?type=profile or ?type=chat'
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      const errorResponse: StorageErrorResponse = {
        success: false,
        error: 'No file uploaded'
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Validate file
    const validationError = validateFile(file, uploadType);
    if (validationError) {
      const errorResponse: StorageErrorResponse = {
        success: false,
        error: validationError
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Generate unique filename
    const fileName = generateFileName(file.name);
    
    // Determine bucket and file path
    const bucketName = uploadType === 'profile' 
      ? BUCKETS.PROFILE_IMAGES 
      : BUCKETS.CHAT_FILES;
      
    const filePath = uploadType === 'profile'
      ? getProfileImagePath(fileName)
      : getChatFilePath(fileName, file.type);

    // Ensure bucket exists
    await ensureBucketExists(bucketName);

    // Convert file to buffer
    const buffer = await file.arrayBuffer();

    // Upload to MinIO
    await minioClient.putObject(
      bucketName,
      filePath,
      Buffer.from(buffer),
      buffer.byteLength,
      {
        'Content-Type': file.type,
        'X-Upload-Source': 'kio-chat',
        'X-Original-Name': file.name,
        'X-User-Id': session.user.id,
      }
    );

    console.log(`📤 ${uploadType} file uploaded: ${bucketName}/${filePath}`);

    // Generate response
    const response: StorageUploadResponse = {
      success: true,
      fileName: filePath,
      originalName: file.name,
      size: file.size,
      mimeType: file.type,
      bucketName,
    };

    // Add public URL for profile images
    if (uploadType === 'profile') {
      response.url = getFileUrl(bucketName, filePath);
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Storage upload error:', error);
    const errorResponse: StorageErrorResponse = {
      success: false,
      error: 'Upload failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// DELETE /api/storage?bucket=bucket&file=filename
export async function DELETE(request: NextRequest) {
  try {
    // Authentication check
    const session = await auth();
    if (!session?.user?.id) {
      const errorResponse: StorageErrorResponse = {
        success: false,
        error: 'Unauthorized'
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const bucket = searchParams.get('bucket');
    const fileName = searchParams.get('file');

    if (!bucket || !fileName) {
      const errorResponse: StorageErrorResponse = {
        success: false,
        error: 'Missing bucket or file parameter'
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Validate bucket
    if (!Object.values(BUCKETS).includes(bucket as any)) {
      const errorResponse: StorageErrorResponse = {
        success: false,
        error: 'Invalid bucket'
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Permission check - users should only delete their own files
    const hasPermission = await hasPermissionToDelete(session.user.id, bucket, fileName);
    if (!hasPermission) {
      const errorResponse: StorageErrorResponse = {
        success: false,
        error: 'Forbidden: You do not have permission to delete this file'
      };
      return NextResponse.json(errorResponse, { status: 403 });
    }
    
    // Delete from MinIO
    await minioClient.removeObject(bucket, fileName);
    
    console.log(`🗑️ File deleted: ${bucket}/${fileName}`);
    
    return NextResponse.json({ 
      success: true, 
      message: 'File deleted successfully' 
    });

  } catch (error) {
    console.error('Storage delete error:', error);
    const errorResponse: StorageErrorResponse = {
      success: false,
      error: 'Delete failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

