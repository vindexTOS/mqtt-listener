FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --legacy-peer-deps

COPY . .
RUN yarn build

FROM node:20-alpine AS runner

WORKDIR /app

COPY package.json ./
RUN yarn global add pm2

COPY --from=builder /app ./

EXPOSE 3000

CMD ["pm2-runtime", "dist/main.js"]
