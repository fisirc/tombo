// --- Environment variables

export const PORT = maybeNumberEnv('PORT') ?? 6969;

export const DATABASE_USER = env('DATABASE_USER');
export const DATABASE_PASSWORD = env('DATABASE_PASSWORD');
export const DATABASE_HOST = env('DATABASE_HOST');
export const DATABASE_PORT = maybeNumberEnv('DATABASE_PORT') ?? 5432;
export const DATABASE_URL = `postgres://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}`;

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
