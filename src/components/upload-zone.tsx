// FILE: src/components/upload-zone.tsx

'use client';

import { CldUploadWidget } from 'next-cloudinary';

import { useState } from 'react';
import { toast } from 'sonner';
import { saveVideoToDatabase } from '@/app/actions';
import { UploadCloud } from 'lucide-react';

// Define the structure of the Cloudinary upload result
interface CloudinaryResult {
  info?: {
    public_id: string;
    secure_url: string;
  };
}

export function UploadZone() {
  const [isUploading, setIsUploading] = useState(false);

  const handleSuccess = async (result: CloudinaryResult) => {
    toast.info('Upload successful! Saving video to your library...');

    const publicId = result.info?.public_id;
    const videoUrl = result.info?.secure_url;

    if (publicId && videoUrl) {
      try {
        await saveVideoToDatabase(publicId, videoUrl);
        toast.success('Video saved! Redirecting to the editor...');
      } catch (error) {
        console.error(error);
        toast.error('Error: Could not save video information.');
        setIsUploading(false);
      }
    } else {
      toast.error('Upload Error: The upload result was invalid.');
      setIsUploading(false);
    }
  };

  return (
    <div className='w-full max-w-lg mx-auto p-4'>
      <CldUploadWidget
        // Use the preset name you created in your Cloudinary settings
        uploadPreset='smart-thumbnail-picker'
        options={{
          sources: ['local', 'url', 'google_drive', 'dropbox'],
          multiple: false,
          resourceType: 'video',
          clientAllowedFormats: ['mp4', 'mov', 'webm', 'ogv'],
          // CORRECTED: 'maxChunkSize' is the correct property name here
          maxChunkSize: 20000000, // 20 MB
        }}
        onSuccess={(result) => handleSuccess(result as CloudinaryResult)}
        onOpen={() => setIsUploading(true)}
        onClose={() => setIsUploading(false)}
        onError={(error) => {
          toast.error('Upload failed. Please try again.');
          console.error(error);
        }}
      >
        {({ open }) => {
          return (
            <button
              onClick={() => open()}
              disabled={isUploading}
              className='w-full p-6 sm:p-10 border-2 border-dashed border-primary/50 hover:border-primary hover:bg-primary/10 transition-all duration-300 rounded-lg flex flex-col items-center justify-center text-center'
            >
              <UploadCloud className='h-10 w-10 sm:h-12 sm:w-12 text-primary mb-4' />
              <span className='font-semibold text-base sm:text-lg text-foreground'>
                {isUploading ? 'Processing...' : 'Click or drag file to upload'}
              </span>
              <span className='font-normal text-xs sm:text-sm text-muted-foreground mt-2'>
                Supports MP4, MOV, WebM, and more
              </span>
            </button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
}
