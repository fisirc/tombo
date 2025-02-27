// --- Environment variables

export const PORT = maybeNumberEnv('PORT') ?? 6969;
export const DATABASE_URL = env('DATABASE_URL');

export const S3_ACCESS_KEY_ID = env('S3_ACCESS_KEY_ID');
export const S3_SECRET_ACCESS_KEY = env('S3_SECRET_ACCESS_KEY');
export const S3_ENDPOINT = env('S3_ENDPOINT');
export const S3_BUCKET = env('S3_BUCKET');

export const REDIS_URL = env('REDIS_URL');

export const GOOGLE_CLIENT_ID = env('GOOGLE_CLIENT_ID');
export const GOOGLE_CLIENT_SECRET = env('GOOGLE_CLIENT_SECRET');
export const GOOGLE_REDIRECT_URI = env('GOOGLE_REDIRECT_URI');

// --- Utils

function env(name: string): string {
    const value = maybeEnv(name);
    if (value === undefined) {
        throw new Error(`Missing required environment variable ${name}`);
    }
    return value;
}

function maybeEnv(name: string): string | undefined {
    return process.env[name];
}

function numberEnv(name: string): number {
    const value = maybeNumberEnv(name);
    if (value === undefined) {
        throw new Error(`Missing required numeric environment variable ${name}`);
    }
    return value;
}

function maybeNumberEnv(name: string): number | undefined {
    const value = maybeEnv(name);
    if (value === undefined) {
        return undefined;
    }
    const parsed = Number(value);
    if (Number.isNaN(parsed)) {
        throw new Error(`Invalid value for numeric environment variable ${name}`);
    }
    return parsed;
}
