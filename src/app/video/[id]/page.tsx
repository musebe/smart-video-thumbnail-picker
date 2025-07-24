// src/app/video/[id]/page.tsx

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

// The props are now correctly typed according to the Next.js 15 docs
export default async function VideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // We MUST await the params promise to access its values
  const { id } = await params;

  const video = await prisma.video.findUnique({
    where: { id: id }, // Use the resolved 'id'
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
          Video Public ID: {video.publicId}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thumbnail Selection</CardTitle>
        </CardHeader>
        <CardContent className='text-center p-8 border-2 border-dashed rounded-lg m-6'>
          <p>
            The video player and thumbnail controls will be built here in a
            future step.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
