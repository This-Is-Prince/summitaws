import dotenv from 'dotenv';
dotenv.config();

import { S3Client } from '@aws-sdk/client-s3';

export const AWS_REGION = process.env.AWS_REGION;
export const MAIN_QUEUE_URL = process.env.MAIN_QUEUE_URL;
export const BUCKET_NAME = process.env.S3_BUCKET_NAME;

export const s3Client = new S3Client({
    region: AWS_REGION,
});