// src/components/thumbnail-editor.tsx

'use client';

import { useState, useTransition, useMemo } from 'react';
import { CldVideoPlayer } from 'next-cloudinary';
import Image from 'next/image';
import { toast } from 'sonner';
import { type Video } from '@prisma/client';

import 'next-cloudinary/dist/cld-video-player.css';

import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { updateThumbnail } from '@/app/actions';
import { ImageIcon, Save, Loader2, Download } from 'lucide-react';

// Helper function to format seconds into MM:SS format
function formatTime(seconds: number): string {
  const flooredSeconds = Math.floor(seconds);
  const min = Math.floor(flooredSeconds / 60);
  const sec = flooredSeconds % 60;
  return `${min.toString().padStart(2, '0')}:${sec
    .toString()
    .padStart(2, '0')}`;
}

export function ThumbnailEditor({ video }: { video: Video }) {
  // If activeTimestamp is null, we show the original thumbnail.
  // If it's a number, we show the frame at that timestamp.
  const [activeTimestamp, setActiveTimestamp] = useState<number | null>(null);
  const [downloadFormat, setDownloadFormat] = useState('jpg');
  const [isPending, startTransition] = useTransition();

  const cloudinaryBaseUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`;

  // Determine the base URL for the thumbnail (without extension)
  const thumbnailBaseUrl = useMemo(() => {
    if (activeTimestamp === null) {
      // If we haven't scrubbed, use the original thumbnail's URL but remove its extension
      return video.thumbnailUrl.replace(/\.[^/.]+$/, '');
    }
    // If we have scrubbed, generate a new URL based on the timestamp
    return `${cloudinaryBaseUrl}/so_${activeTimestamp}/${video.publicId}`;
  }, [activeTimestamp, video.thumbnailUrl, video.publicId, cloudinaryBaseUrl]);

  // The final URL for the preview image and download link
  const finalPreviewUrl = `${thumbnailBaseUrl}.${downloadFormat}`;

  const videoPlayer = useMemo(() => {
    return (
      <CldVideoPlayer
        id={video.publicId}
        width='1920'
        height='1080'
        src={video.publicId}
        colors={{ accent: '#ea580c', base: '#262626', text: '#f5f5f5' }}
      />
    );
  }, [video.publicId]);

  const handleSetThumbnail = async () => {
    // We always save the thumbnail as a JPG for consistency in our database.
    const urlToSave = `${thumbnailBaseUrl}.jpg`;
    startTransition(async () => {
      toast.info('Updating thumbnail...');
      try {
        await updateThumbnail(video.id, urlToSave);
        toast.success('Thumbnail updated successfully!');
        // After saving, reset the view to show the new "current" thumbnail
        setActiveTimestamp(null);
      } catch (error) {
        toast.error('Failed to update thumbnail.');
        console.error(error);
      }
    });
  };

  const totalDuration = video.duration ?? 0;

  return (
    <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12'>
      {/* Main Column: Video Player and Controls */}
      <div className='lg:col-span-2 space-y-6'>
        <div className='aspect-video w-full overflow-hidden rounded-lg bg-black shadow-lg'>
          {videoPlayer}
        </div>
        <div className='space-y-4 pt-4'>
          <label
            htmlFor='timestamp-slider'
            className='block font-medium text-lg'
          >
            Scrub to Select Frame:
          </label>
          <Slider
            id='timestamp-slider'
            defaultValue={[0]}
            max={Math.floor(totalDuration)}
            step={1}
            onValueChange={(value) => setActiveTimestamp(value[0])}
          />
          <div className='text-center text-sm text-muted-foreground font-mono'>
            {formatTime(activeTimestamp ?? 0)} / {formatTime(totalDuration)}
          </div>
        </div>
      </div>

      {/* Sidebar Column: Preview and Actions */}
      <div className='space-y-6'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-base font-semibold'>
              <ImageIcon size={16} /> Thumbnail Preview
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='relative aspect-video w-full bg-muted rounded-md overflow-hidden'>
              <Image
                key={finalPreviewUrl}
                src={finalPreviewUrl}
                alt='Thumbnail preview'
                fill
                className='object-cover'
                unoptimized
              />
            </div>
            <div className='grid grid-cols-3 gap-2'>
              <div className='col-span-1'>
                <Select onValueChange={setDownloadFormat} defaultValue='jpg'>
                  <SelectTrigger>
                    <SelectValue placeholder='Format' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='jpg'>JPG</SelectItem>
                    <SelectItem value='png'>PNG</SelectItem>
                    <SelectItem value='webp'>WEBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='col-span-2'>
                <Button asChild className='w-full'>
                  <a
                    href={finalPreviewUrl}
                    download={`thumbnail_${
                      activeTimestamp ?? 'current'
                    }.${downloadFormat}`}
                  >
                    <Download className='mr-2 h-4 w-4' />
                    Download
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={handleSetThumbnail}
          disabled={isPending || activeTimestamp === null}
          className='w-full text-lg py-6'
        >
          {isPending ? (
            <Loader2 className='mr-2 h-5 w-5 animate-spin' />
          ) : (
            <Save className='mr-2 h-5 w-5' />
          )}
          {isPending ? 'Saving...' : 'Save as New Thumbnail'}
        </Button>
      </div>
    </div>
  );
}
