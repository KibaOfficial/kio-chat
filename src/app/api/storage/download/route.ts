// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { minioClient, BUCKETS, hasPermissionToDownload } from '@/lib/storage/s3Client';

// GET /api/storage/download?bucket=bucket&file=filename
export async function GET(request: NextRequest) {
  try {
    // Authentication check
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const bucket = searchParams.get('bucket');
    const fileName = searchParams.get('file');

    if (!bucket || !fileName) {
      return NextResponse.json(
        { error: 'Missing bucket or file parameter' },
        { status: 400 }
      );
    }

    // Validate bucket
    if (!Object.values(BUCKETS).includes(bucket as any)) {
      return NextResponse.json(
        { error: 'Invalid bucket' },
        { status: 400 }
      );
    }

    // Permission check - users should only access files they have permission to view
    const hasPermission = await hasPermissionToDownload(session.user.id, bucket, fileName);
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have permission to access this file' },
        { status: 403 }
      );
    }

    try {
      // Get file from MinIO
      const stream = await minioClient.getObject(bucket, fileName);
      
      // Get file metadata
      const stat = await minioClient.statObject(bucket, fileName);
      
      // Convert stream to buffer for Next.js response
      const chunks: Buffer[] = [];
      for await (const chunk of stream) {
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);

      // Create response with proper headers
      const response = new NextResponse(buffer);
      
      response.headers.set('Content-Type', stat.metaData?.['content-type'] || 'application/octet-stream');
      response.headers.set('Content-Length', stat.size.toString());
      response.headers.set('Content-Disposition', `inline; filename="${stat.metaData?.['x-original-name'] || fileName}"`);
      response.headers.set('Cache-Control', 'private, max-age=3600'); // 1 hour cache
      
      return response;

    } catch (minioError) {
      console.error('MinIO download error:', minioError);
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { 
        error: 'Download failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}