# Dockerfile
# Place this file in the root of your nutritionSite directory (alongside server.js and package.json)

# 1. Base image with Node.js
FROM node:18-slim

ENV PORT=10000
EXPOSE 10000

# 2. Install system Chromium so Puppeteer can find a headless browser
RUN apt-get update && \
    apt-get install -y chromium && \
    rm -rf /var/lib/apt/lists/*

# 3. Environment variables to tell Puppeteer to skip its own download and use the system Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# 4. Set working directory
WORKDIR /app

# 5. Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# 6. Copy application source
COPY . .

# 7. Expose the port your server uses (match server.js)

# 8. Start the service
CMD ["node", "server.js"]
