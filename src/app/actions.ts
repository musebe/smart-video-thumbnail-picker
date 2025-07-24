// src/app/actions.ts

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { type Video } from "@prisma/client";

/**
 * Saves a newly uploaded video's details to the database.
 * @param publicId The public ID from Cloudinary.
 * @param videoUrl The secure URL of the video from Cloudinary.
 * @param duration The duration of the video in seconds.
 */
export async function saveVideoToDatabase(
    publicId: string,
    videoUrl: string,
    duration: number // <-- MODIFIED: Added duration parameter
) {
    if (!publicId || !videoUrl) {
        throw new Error("Public ID and Video URL are required");
    }

    let newVideo: Video;
    const defaultThumbnailUrl = videoUrl.replace(/\.(mp4|mov|avi|webm)$/, ".jpg");

    try {
        // This is the only part that should be in the 'try' block
        newVideo = await prisma.video.create({
            data: {
                publicId: publicId,
                thumbnailUrl: defaultThumbnailUrl,
                duration: duration, // <-- MODIFIED: Save the duration
            },
        });
    } catch (error) {
        // This will now only catch actual database errors
        console.error("Error saving video to database:", error);
        throw new Error("Could not save video to database.");
    }

    // These actions happen only after the try block succeeds
    revalidatePath("/");
    // This redirect will now work correctly without being caught as an error
    redirect(`/video/${newVideo.id}`);
}


/**
 * Updates the thumbnail URL for a specific video.
 * @param videoId The ID of the video in our database.
 * @param newThumbnailUrl The new Cloudinary URL for the thumbnail.
 */
export async function updateThumbnail(videoId: string, newThumbnailUrl: string) {
    if (!videoId || !newThumbnailUrl) {
        throw new Error("Video ID and new thumbnail URL are required.");
    }

    try {
        await prisma.video.update({
            where: { id: videoId },
            data: { thumbnailUrl: newThumbnailUrl },
        });

        // Revalidate paths to ensure the UI updates with the new thumbnail
        revalidatePath("/");
        revalidatePath(`/video/${videoId}`);

    } catch (error) {
        console.error("Error updating thumbnail:", error);
        throw new Error("Could not update thumbnail in database.");
    }
}
