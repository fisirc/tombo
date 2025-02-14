import { S3Client } from 'bun';
import { S3_ACCESS_KEY_ID, S3_BUCKET, S3_ENDPOINT, S3_SECRET_ACCESS_KEY } from './env';

export const minio = new S3Client({
    accessKeyId: S3_ACCESS_KEY_ID,
    secretAccessKey: S3_SECRET_ACCESS_KEY,
    bucket: S3_BUCKET,
    endpoint: S3_ENDPOINT,
});
