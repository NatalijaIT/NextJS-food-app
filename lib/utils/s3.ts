import { S3 } from '@aws-sdk/client-s3';

const r2 = new S3({
    region: 'auto',
    endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
    credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
    },
});

const BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME!;

export async function uploadImageToS3(file: File, fileName: string): Promise<string> {
    const bufferedImage = await file.arrayBuffer();

    await r2.putObject({
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: Buffer.from(bufferedImage),
        ContentType: file.type,
    });

    return fileName;
}

export async function deleteImageFromS3(fileName: string): Promise<void> {
    await r2.deleteObject({
        Bucket: BUCKET_NAME,
        Key: fileName,
    });
}
