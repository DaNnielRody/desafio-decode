
FROM oven/bun:1.1.3

WORKDIR /app

COPY . .

RUN bun install --frozen-lockfile

EXPOSE 3333

CMD ["bun", "run", "src/main.ts"]