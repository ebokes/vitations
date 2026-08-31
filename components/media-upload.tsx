'use client';

import { Upload, X, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type UploadStatus = 'pending' | 'uploading' | 'processing' | 'completed' | 'failed';

interface UploadFile {
  file: File;
  status: UploadStatus;
  progress?: number;
  error?: string;
}

interface MediaUploadProps {
  onUpload: (files: File[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  allowedTypes?: string[];
  isLoading?: boolean;
}

export function MediaUpload({
  onUpload,
  maxFiles = 5,
  maxSizeMB = 10,
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'video/mp4'],
  isLoading = false,
}: MediaUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFiles = (files: File[]): boolean => {
    setError(null);

    if (uploadFiles.length + files.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return false;
    }

    for (const file of files) {
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`File size exceeds ${maxSizeMB}MB limit: ${file.name}`);
        return false;
      }

      const fileType = file.type || '';
      const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
      const isAllowedType = allowedTypes.includes(fileType);
      const isAllowedExt = ['heic', 'heif'].includes(fileExt);

      if (!isAllowedType && !isAllowedExt) {
        setError(`Unsupported file type: ${file.name}`);
        return false;
      }
    }

    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      if (validateFiles(files)) {
        const newUploadFiles: UploadFile[] = files.map((file) => ({
          file,
          status: 'pending' as UploadStatus,
        }));
        const nextFiles = [...uploadFiles, ...newUploadFiles];
        setUploadFiles(nextFiles);
        onUpload(files);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const files = Array.from(e.target.files);
      if (validateFiles(files)) {
        const newUploadFiles: UploadFile[] = files.map((file) => ({
          file,
          status: 'pending' as UploadStatus,
        }));
        const nextFiles = [...uploadFiles, ...newUploadFiles];
        setUploadFiles(nextFiles);
        onUpload(files);
      }
    }
  };

  const removeFile = (index: number) => {
    const nextFiles = [...uploadFiles];
    nextFiles.splice(index, 1);
    setUploadFiles(nextFiles);
    onUpload(nextFiles.map((uf) => uf.file));
  };

  const getStatusIcon = (status: UploadStatus) => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return <Loader2 className="h-4 w-4 animate-spin text-primary-600" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusText = (uploadFile: UploadFile) => {
    switch (uploadFile.status) {
      case 'uploading':
        return uploadFile.progress ? `Uploading ${uploadFile.progress}%` : 'Uploading...';
      case 'processing':
        return 'Processing...';
      case 'completed':
        return 'Complete';
      case 'failed':
        return uploadFile.error || 'Failed';
      default:
        return `${(uploadFile.file.size / (1024 * 1024)).toFixed(2)} MB`;
    }
  };

  return (
    <div className="w-full">
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={cn(
          'flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 p-8 text-center transition-colors',
          dragActive && 'border-primary-500 bg-primary-50',
          isLoading && 'pointer-events-none opacity-50'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          multiple={maxFiles > 1}
          onChange={handleChange}
          className="hidden"
          accept={allowedTypes.join(',')}
        />

        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-200 text-neutral-500">
          <Upload className="h-6 w-6" />
        </div>

        <p className="mb-2 text-sm text-neutral-700">
          <button
            type="button"
            className="font-semibold text-primary-600 hover:text-primary-700 focus:outline-none"
            onClick={() => inputRef.current?.click()}
          >
            Click to upload
          </button>{' '}
          or drag and drop
        </p>
        <p className="text-xs text-neutral-500">
          JPEG, PNG, WEBP, HEIC, or MP4 (Max {maxSizeMB}MB)
        </p>
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {uploadFiles.length > 0 && (
        <div className="mt-6">
          <h4 className="mb-3 text-sm font-semibold text-neutral-900">
            Selected Files ({uploadFiles.length}/{maxFiles})
          </h4>
          <ul className="divide-y divide-neutral-200">
            {uploadFiles.map((uploadFile, i) => (
              <li key={i} className="flex items-center justify-between py-2 text-sm">
                <span className="truncate pr-4 text-neutral-700">{uploadFile.file.name}</span>
                <div className="flex items-center gap-2">
                  {getStatusIcon(uploadFile.status)}
                  <span
                    className={cn(
                      'text-xs',
                      uploadFile.status === 'completed' && 'text-green-600',
                      uploadFile.status === 'failed' && 'text-red-600',
                      uploadFile.status === 'uploading' && 'text-primary-600',
                      uploadFile.status === 'processing' && 'text-primary-600',
                      uploadFile.status === 'pending' && 'text-neutral-500'
                    )}
                  >
                    {getStatusText(uploadFile)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="ml-4 text-neutral-500 hover:text-red-600 focus:outline-none"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
