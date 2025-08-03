// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadButton } from "@/lib/uploadthing";
import { ProfileImageUpload } from "@/components/storage/MinioUpload";
import { StorageUploadResponse } from "@/app/api/storage/types";

interface ComparisonResult {
  service: 'uploadthing' | 'minio';
  fileName: string;
  originalName: string;
  url: string;
  size: number;
  uploadTime: number;
  success: boolean;
  error?: string;
}

export function StorageComparisonCard() {
  const [results, setResults] = useState<ComparisonResult[]>([]);
  const [uploadingService, setUploadingService] = useState<'uploadthing' | 'minio' | null>(null);

  const addResult = (result: ComparisonResult) => {
    setResults(prev => [result, ...prev.slice(0, 9)]); // Keep only last 10 results
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

  // UploadThing handlers
  const handleUploadThingBegin = () => {
    setUploadingService('uploadthing');
  };

  const handleUploadThingComplete = (res: any) => {
    setUploadingService(null);
    const startTime = Date.now(); // We don't track actual start time for UploadThing here
    
    if (res && res.length > 0) {
      const file = res[0];
      addResult({
        service: 'uploadthing',
        fileName: file.name,
        originalName: file.name,
        url: file.url,
        size: file.size || 0,
        uploadTime: 0, // UploadThing doesn't provide this easily
        success: true,
      });
    }
  };

  const handleUploadThingError = (error: Error) => {
    setUploadingService(null);
    addResult({
      service: 'uploadthing',
      fileName: '',
      originalName: '',
      url: '',
      size: 0,
      uploadTime: 0,
      success: false,
      error: error.message,
    });
  };

  // MinIO handlers
  const [minioStartTime, setMinioStartTime] = useState<number>(0);

  const handleMinioUploadStart = () => {
    setUploadingService('minio');
    setMinioStartTime(Date.now());
  };

  const handleMinioUploadComplete = (response: StorageUploadResponse) => {
    setUploadingService(null);
    const uploadTime = Date.now() - minioStartTime;
    
    addResult({
      service: 'minio',
      fileName: response.fileName,
      originalName: response.originalName,
      url: response.url || '',
      size: response.size,
      uploadTime,
      success: true,
    });
  };

  const handleMinioUploadError = (error: string) => {
    setUploadingService(null);
    addResult({
      service: 'minio',
      fileName: '',
      originalName: '',
      url: '',
      size: 0,
      uploadTime: Date.now() - minioStartTime,
      success: false,
      error,
    });
  };

  const getSuccessRate = (service: 'uploadthing' | 'minio') => {
    const serviceResults = results.filter(r => r.service === service);
    if (serviceResults.length === 0) return 0;
    const successful = serviceResults.filter(r => r.success).length;
    return Math.round((successful / serviceResults.length) * 100);
  };

  const getAverageUploadTime = (service: 'uploadthing' | 'minio') => {
    const serviceResults = results.filter(r => r.service === service && r.success && r.uploadTime > 0);
    if (serviceResults.length === 0) return 0;
    const total = serviceResults.reduce((sum, r) => sum + r.uploadTime, 0);
    return Math.round(total / serviceResults.length);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Storage Service Comparison</CardTitle>
        <p className="text-sm text-gray-600">
          Compare UploadThing vs MinIO performance and reliability
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Upload Testing */}
        <Tabs defaultValue="side-by-side" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="side-by-side">Side by Side</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="side-by-side" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* UploadThing */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium">UploadThing</h3>
                  <Badge variant="outline">External</Badge>
                </div>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <UploadButton
                    endpoint="profileImage"
                    onUploadBegin={handleUploadThingBegin}
                    onClientUploadComplete={handleUploadThingComplete}
                    onUploadError={handleUploadThingError}
                    appearance={{
                      button: "bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded w-full",
                      allowedContent: "text-sm text-gray-600",
                    }}
                  />
                  {uploadingService === 'uploadthing' && (
                    <div className="mt-3 text-sm text-purple-600">
                      ⏳ Uploading to UploadThing...
                    </div>
                  )}
                </div>
                
                <div className="text-xs text-gray-500 space-y-1">
                  <div>• External CDN hosting</div>
                  <div>• Automatic optimization</div>
                  <div>• Built-in security</div>
                  <div>• Usage-based pricing</div>
                </div>
              </div>

              {/* MinIO */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium">MinIO</h3>
                  <Badge variant="outline">Self-Hosted</Badge>
                </div>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <ProfileImageUpload
                    className="w-full min-h-[60px] border-none"
                    onUploadComplete={handleMinioUploadComplete}
                    onError={handleMinioUploadError}
                  >
                    <div 
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full cursor-pointer transition-colors"
                      onClick={handleMinioUploadStart}
                    >
                      Choose Profile Image
                    </div>
                  </ProfileImageUpload>
                  {uploadingService === 'minio' && (
                    <div className="mt-3 text-sm text-blue-600">
                      ⏳ Uploading to MinIO...
                    </div>
                  )}
                </div>
                
                <div className="text-xs text-gray-500 space-y-1">
                  <div>• Local/self-hosted storage</div>
                  <div>• Full control over data</div>
                  <div>• S3-compatible API</div>
                  <div>• No external costs</div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="stats" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-medium text-purple-600">UploadThing Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Success Rate:</span>
                    <span className="font-medium">{getSuccessRate('uploadthing')}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Upload Time:</span>
                    <span className="font-medium">{getAverageUploadTime('uploadthing')}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Uploads:</span>
                    <span className="font-medium">{results.filter(r => r.service === 'uploadthing').length}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-medium text-blue-600">MinIO Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Success Rate:</span>
                    <span className="font-medium">{getSuccessRate('minio')}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Upload Time:</span>
                    <span className="font-medium">{getAverageUploadTime('minio')}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Uploads:</span>
                    <span className="font-medium">{results.filter(r => r.service === 'minio').length}</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Recent Results */}
        {results.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-sm">Recent Uploads</h3>
              <Button onClick={clearResults} variant="outline" size="sm">
                Clear
              </Button>
            </div>
            
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {results.slice(0, 5).map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    result.success 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <Badge variant={result.service === 'uploadthing' ? 'default' : 'secondary'}>
                        {result.service === 'uploadthing' ? 'UploadThing' : 'MinIO'}
                      </Badge>
                      {result.success ? (
                        <span className="text-green-600">✅ {result.originalName}</span>
                      ) : (
                        <span className="text-red-600">❌ Failed</span>
                      )}
                    </div>
                    {result.success && result.uploadTime > 0 && (
                      <span className="text-xs text-gray-500">{result.uploadTime}ms</span>
                    )}
                  </div>
                  
                  {result.error && (
                    <div className="text-xs text-red-600 mt-1">{result.error}</div>
                  )}
                  
                  {result.success && result.url && (
                    <div className="flex items-center space-x-2 mt-2">
                      <a
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-500 hover:underline"
                      >
                        View File
                      </a>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">{formatFileSize(result.size)}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default StorageComparisonCard;