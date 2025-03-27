export async function extractS3Key(imageUrl: string | undefined): Promise<string> {
    if (!imageUrl) throw new Error("Profile image URL is missing.");

    const urlParts = imageUrl.split('/');
    if (urlParts.length < 4) throw new Error("Invalid S3 URL format.");

    const s3Key = urlParts.slice(3).join('/');
    if (!s3Key) throw new Error("Failed to retrieve S3 key.");

    return s3Key;
}