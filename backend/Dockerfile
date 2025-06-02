# Use official Node.js LTS image
FROM node:20-alpine as builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production=false
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app .
CMD ["node", "dist/main.js"]