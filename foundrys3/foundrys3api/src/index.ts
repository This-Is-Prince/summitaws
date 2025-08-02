import express from 'express';
import cors from 'cors';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { BUCKET_NAME, s3Client } from './config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const app = express();
app.use(express.json());
app.use(cors());

app.post("/get-presigned-url", async (req, res) => {
    const { fileName, fileType } = req.body;

    if (!fileName || !fileType) {
        return res.status(400).json({ error: "filename and fileType are required." });
    }

    const key = `uploads_lambda/presigned/${Date.now()}_${fileName}`;

    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        ContentType: fileType,
    });

    try {
        const uploadUrl = await getSignedUrl(s3Client, command, {
            expiresIn: 300,
        });

        console.log(`✅ Generated presigned URL from ${key}`);
        
        res.status(200).json({ uploadUrl, key });
    } catch (error) {
        console.error("❌ Error generating presigned URL:", error);
        res.status(500).json({ error: "Could not generate upload URL." });
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});