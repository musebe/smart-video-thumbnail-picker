// src/app/video/[id]/page.tsx

import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';

import { ThumbnailEditor } from '@/components/thumbnail-editor';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default async function VideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const video = await prisma.video.findUnique({
    where: { id },
  });

  if (!video) {
    notFound();
  }

  return (
    <main className='container mx-auto py-12 px-4'>
      <div className='mb-8'>
        <Button asChild variant='outline'>
          <Link href='/'>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to Library
          </Link>
        </Button>
      </div>

      <div className='text-center mb-12'>
        <h1 className='text-4xl font-bold tracking-tight'>Manage Thumbnail</h1>
        <p
          className='text-lg text-muted-foreground mt-2 max-w-2xl mx-auto truncate'
          title={video.publicId}
        >
          {video.publicId}
        </p>
      </div>

      {/* Render the interactive client component, passing video data as a prop */}
      <ThumbnailEditor video={video} />
    </main>
  );
}
