# Reports microservice
# Base https://hub.docker.com/r/oven/bun/tags
# Reference: https://bun.sh/guides/ecosystem/docker

# ---
FROM docker.io/oven/bun:1.2 AS base
WORKDIR /usr/src/app

# ---
FROM base AS install

WORKDIR /temp/app/dev/
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

WORKDIR /temp/app/prod/
COPY package.json bun.lock ./
RUN bun install --production --frozen-lockfile

# ---
FROM base AS prerelease

COPY --from=install /temp/app/dev/node_modules node_modules
COPY . .

ENV NODE_ENV=production

RUN bun test

# ---
FROM base AS release

COPY --from=install /temp/app/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app/src ./src
COPY --from=prerelease /usr/src/app/prisma ./prisma
COPY --from=prerelease /usr/src/app/package.json .
COPY --from=prerelease /usr/src/app/tsconfig.json .
COPY --from=prerelease /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=prerelease /usr/src/app/public ./public

EXPOSE 6969/TCP
ENTRYPOINT ["/bin/bash", "-c", "node_modules/prisma/build/index.js migrate deploy && node_modules/prisma/build/index.js generate && bun start"]
