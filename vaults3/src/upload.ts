import * as fs from 'fs';
import { BUCKET_NAME, s3Client } from './config';
import { PutObjectCommand } from '@aws-sdk/client-s3';

const uploadFileToS3 = async (filePath: string, key: string) => {
    if (!BUCKET_NAME) {
        throw new Error("S3_BUCKET_NAME is not defined in .env file");
    }

    console.log(`Uploading file '${filePath}' to S3 bucket '${BUCKET_NAME}' with key '${key}'`);

    
    try {
        // Create a read stream for the file
        const fileStream = fs.createReadStream(filePath);
    
        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
            Body: fileStream,
        });
        const response = await s3Client.send(command);
        console.log("✅ File uploaded successfully.");
        console.log("ETag:", response.ETag);
        
        if (response.VersionId) {
            console.log("VersionId:", response.VersionId);
        }
        return response;
    } catch (error) {
        console.error("❌ Error uploading file:", error);
    }
};

export const upload = async () => {
    const filePath = "files/sample.txt";
    const fileKey = `uploads/simple/${Date.now()}_sample.txt`;

    await uploadFileToS3(filePath, fileKey);
};