// src/app/page.tsx

export default async function HomePage() {
  return (
    <main className='container mx-auto py-12 px-4'>
      <div className='text-center mb-12'>
        <h1 className='text-4xl font-bold tracking-tight sm:text-5xl'>
          Smart Video Thumbnail Picker
        </h1>
        <p className='text-lg text-muted-foreground mt-3'>
          Powered by Next.js, Cloudinary, and Neon
        </p>
      </div>

      {/* The UploadZone component will go here */}
      <div className='text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg max-w-lg mx-auto'>
        <p>Upload Zone Placeholder</p>
      </div>

      <div className='mt-20'>
        <h2 className='text-3xl font-semibold mb-8 text-center'>
          Your Video Library
        </h2>
        <div className='text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg'>
          <p>Video Gallery Placeholder</p>
        </div>
      </div>
    </main>
  );
}
