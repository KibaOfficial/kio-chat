// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MinioUpload, ProfileImageUpload, ChatFileUpload } from "@/components/storage/MinioUpload";
import { useMinioStorage } from "@/components/hooks/useMinioStorage";
import { StorageUploadResponse } from "@/app/api/storage/types";

interface UploadResult {
  service: 'minio';
  type: 'profile' | 'chat';
  fileName: string;
  originalName: string;
  url?: string;
  size: number;
  uploadTime: number;
  bucketName: string;
}

export function MinioUploadTestCard() {
  const [results, setResults] = useState<UploadResult[]>([]);
  const [currentUpload, setCurrentUpload] = useState<{ type: 'profile' | 'chat'; startTime: number } | null>(null);

  const handleUploadComplete = (response: StorageUploadResponse, type: 'profile' | 'chat', startTime: number) => {
    const uploadTime = Date.now() - startTime;
    
    const result: UploadResult = {
      service: 'minio',
      type,
      fileName: response.fileName,
      originalName: response.originalName,
      url: response.url,
      size: response.size,
      uploadTime,
      bucketName: response.bucketName,
    };

    setResults(prev => [result, ...prev]);
    setCurrentUpload(null);
    
    console.log('📤 MinIO Upload Complete:', result);
  };

  const handleUploadError = (error: string) => {
    console.error('❌ MinIO Upload Error:', error);
    setCurrentUpload(null);
  };

  const clearResults = () => {
    setResults([]);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getDownloadUrl = (bucketName: string, fileName: string): string => {
    const minioUrl = process.env.NEXT_PUBLIC_MINIO_URL;
    if (minioUrl) {
      return `${minioUrl}/${bucketName}/${fileName}`;
    } else {
      console.warn('NEXT_PUBLIC_MINIO_URL not set, falling back to API download');
      return `/api/storage/download?bucket=${encodeURIComponent(bucketName)}&file=${encodeURIComponent(fileName)}`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center justify-between">
          <span>MinIO Storage Test</span>
          <Badge variant="secondary">Self-Hosted</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Upload Controls */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Profile Image Upload */}
          <div className="space-y-2">
            <h3 className="font-medium text-sm">Profile Images (Public)</h3>
            <ProfileImageUpload
              className="h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400"
              onUploadComplete={(response) => {
                const startTime = currentUpload?.startTime || Date.now();
                handleUploadComplete(response, 'profile', startTime);
              }}
              onError={handleUploadError}
            >
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <svg className="w-8 h-8 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-sm font-medium">Profile Image</span>
                <span className="text-xs text-gray-500">Images • Max 8MB</span>
              </div>
            </ProfileImageUpload>
          </div>

          {/* Chat File Upload */}
          <div className="space-y-2">
            <h3 className="font-medium text-sm">Chat Files (Private)</h3>
            <ChatFileUpload
              className="h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400"
              onUploadComplete={(response) => {
                const startTime = currentUpload?.startTime || Date.now();
                handleUploadComplete(response, 'chat', startTime);
              }}
              onError={handleUploadError}
            >
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <svg className="w-8 h-8 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-sm font-medium">Chat Files</span>
                <span className="text-xs text-gray-500">Images & PDFs • Max 50MB</span>
              </div>
            </ChatFileUpload>
          </div>
        </div>

        {/* Current Upload Status */}
        {currentUpload && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-medium text-blue-700">
                Uploading {currentUpload.type} file to MinIO...
              </span>
            </div>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-sm">Upload Results</h3>
              <Button onClick={clearResults} variant="outline" size="sm">
                Clear Results
              </Button>
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="p-3 border border-gray-200 rounded-lg bg-gray-50 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant={result.type === 'profile' ? 'default' : 'secondary'}>
                        {result.type === 'profile' ? 'Profile' : 'Chat'}
                      </Badge>
                      <Badge variant="outline">MinIO</Badge>
                      <span className="text-sm font-medium">{result.originalName}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {result.uploadTime}ms
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-gray-500">Size:</span> {formatFileSize(result.size)}
                    </div>
                    <div>
                      <span className="text-gray-500">Bucket:</span> {result.bucketName}
                    </div>
                  </div>
                  
                  <div className="text-xs break-all">
                    <span className="text-gray-500">File:</span> {result.fileName}
                  </div>

                  {/* Download/View Links */}
                  <div className="flex space-x-2">
                    {result.url && (
                      <a
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-500 hover:underline"
                      >
                        View Public URL
                      </a>
                    )}
                    <a
                      href={getDownloadUrl(result.bucketName, result.fileName)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-green-500 hover:underline"
                    >
                      Download via API
                    </a>
                  </div>

                  {/* Image Preview for profile images */}
                  {result.type === 'profile' && result.url && (
                    <div className="mt-2">
                      <img
                        src={result.url}
                        alt="Preview"
                        className="max-w-24 max-h-24 object-contain border rounded"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Storage Info */}
        <div className="text-xs text-gray-500 border-t pt-3 space-y-1">
          <div className="font-medium">Storage Configuration:</div>
          <div>Profile Images: Public bucket (direct access)</div>
          <div>Chat Files: Private bucket (API access only)</div>
        </div>
      </CardContent>
    </Card>
  );
}

export default MinioUploadTestCard;