// FILE: src/app/page.tsx

import { UploadZone } from '@/components/upload-zone';
import prisma from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

export default async function HomePage() {
  // Fetch all videos directly from your Neon database
  const videos = await prisma.video.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main className='container mx-auto py-12 px-4'>
      <div className='text-center mb-10'>
        <h1 className='text-4xl font-bold tracking-tight sm:text-5xl'>
          Smart Video Thumbnail Picker
        </h1>
        <p className='text-lg text-muted-foreground mt-3'>
          Upload your video and select the perfect moment for your thumbnail.
        </p>
      </div>

      <UploadZone />

      <div className='mt-16'>
        <h2 className='text-3xl font-semibold mb-8 text-center'>
          Your Video Library
        </h2>
        {videos.length > 0 ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6'>
            {videos.map((video) => (
              <Link href={`/video/${video.id}`} key={video.id}>
                <Card className='overflow-hidden hover:shadow-lg transition-shadow duration-300 group border-border hover:border-primary'>
                  <CardContent className='p-0'>
                    <div className='relative aspect-video'>
                      <Image
                        src={video.thumbnailUrl}
                        alt={`Thumbnail for video ${video.publicId}`}
                        fill
                        className='object-cover transition-transform duration-300 group-hover:scale-105'
                        sizes='(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'
                        unoptimized // Recommended for Cloudinary URLs to prevent double optimization
                      />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className='text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg'>
            <p>
              Your uploaded videos will appear here once you&apos;ve added some.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
