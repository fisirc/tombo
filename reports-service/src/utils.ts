import { S3_PUBLIC_MEDIA_ENDPOINT } from './env';

export function getExtensionFromFiletype(type: string): string {
  switch (type.toLowerCase()) {
    case 'image/jpeg':
      return 'jpg';
    case 'image/png':
      return 'png';
    case 'image/webp':
      return 'webp';
    case 'video/mp4':
      return 'mp4';
    case 'video/ogg':
      return 'ogg';
    case 'video/webm':
      return 'webm';
    default:
      throw new Error('Unsupported file type');
  }
}

export function publicS3Url(resource?: string): string | undefined {
  if (!resource) return resource;
  return `${S3_PUBLIC_MEDIA_ENDPOINT}/${resource}`;
}
