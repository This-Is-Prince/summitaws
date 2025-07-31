import dotenv from 'dotenv';
dotenv.config();

import { SQSClient } from '@aws-sdk/client-sqs';

export const AWS_REGION = process.env.AWS_REGION;
export const MAIN_QUEUE_URL = process.env.MAIN_QUEUE_URL;

export const sqsClient = new SQSClient({
    region: AWS_REGION,
});
