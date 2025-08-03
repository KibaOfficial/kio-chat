// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

"use client";

import { useRef, useState } from 'react';
import { useMinioStorage } from '@/components/hooks/useMinioStorage';
import { StorageUploadResponse } from '@/app/api/storage/types';

interface MinioUploadProps {
  type: 'profile' | 'chat';
  onUploadComplete?: (response: StorageUploadResponse) => void;
  onError?: (error: string) => void;
  className?: string;
  accept?: string;
  maxSize?: number; // in MB
  children?: React.ReactNode;
  disabled?: boolean;
}

export const MinioUpload: React.FC<MinioUploadProps> = ({
  type,
  onUploadComplete,
  onError,
  className = '',
  accept,
  maxSize,
  children,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const { uploadFile, isUploading, uploadProgress } = useMinioStorage({
    onUploadComplete,
    onError,
  });

  const defaultAccept = type === 'profile' 
    ? 'image/jpeg,image/jpg,image/png,image/gif,image/webp'
    : 'image/jpeg,image/jpg,image/png,image/gif,image/webp,application/pdf';

  const handleFileSelect = async (file: File) => {
    if (disabled || isUploading) return;

    // Validate file size if specified
    if (maxSize && file.size > maxSize * 1024 * 1024) {
      onError?.(`File size exceeds ${maxSize}MB limit`);
      return;
    }

    await uploadFile(file, type);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleClick = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !isUploading) {
      setDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    if (disabled || isUploading) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  return (
    <div
      className={`
        relative cursor-pointer transition-all duration-200
        ${dragOver ? 'border-blue-500 bg-blue-50' : ''}
        ${disabled || isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept || defaultAccept}
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled || isUploading}
      />
      
      {/* Upload Progress */}
      {isUploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <div className="text-sm text-gray-600">
              Uploading... {uploadProgress}%
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {children || (
        <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-gray-400">
          <div className="text-gray-600">
            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-lg font-medium">Click to upload or drag and drop</p>
            <p className="text-sm text-gray-500">
              {type === 'profile' ? 'Images only' : 'Images and PDFs'}
              {maxSize && ` • Max ${maxSize}MB`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// Specific components for common use cases
export const ProfileImageUpload: React.FC<Omit<MinioUploadProps, 'type'>> = (props) => (
  <MinioUpload {...props} type="profile" maxSize={8} />
);

export const ChatFileUpload: React.FC<Omit<MinioUploadProps, 'type'>> = (props) => (
  <MinioUpload {...props} type="chat" maxSize={50} />
);