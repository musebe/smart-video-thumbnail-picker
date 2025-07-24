// src/app/actions.ts

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export async function saveVideoToDatabase(publicId: string, videoUrl: string) {
    if (!publicId || !videoUrl) {
        throw new Error("Public ID and Video URL are required");
    }

    // Create a default thumbnail URL by changing the video extension to .jpg
    // Cloudinary's servers handle this transformation automatically. NO CANVAS.
    const defaultThumbnailUrl = videoUrl.replace(/\.(mp4|mov|avi|webm)$/, ".jpg");

    try {
        const newVideo = await prisma.video.create({
            data: {
                publicId: publicId,
                thumbnailUrl: defaultThumbnailUrl,
            },
        });

        console.log("Video saved to Neon database:", newVideo);

        // Invalidate the cache for the home page to show the new video
        revalidatePath("/");

        // Redirect to the new video's management page
        redirect(`/video/${newVideo.id}`);

    } catch (error) {
        console.error("Error saving video to database:", error);
        throw new Error("Could not save video to database.");
    }
}