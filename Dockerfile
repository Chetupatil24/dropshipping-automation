# Base image
FROM node:18-alpine

# Install Chrome for Puppeteer
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont \
      nodejs \
      yarn

# Tell Puppeteer to skip installing Chrome safely and use the system Chrome
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/

# Install dependencies
RUN cd backend && npm ci --only=production

# Copy backend code
COPY backend ./backend

# Copy standard environment file
COPY .env ./

# Expose port
EXPOSE 8080

# Start server
CMD ["node", "backend/server.js"]
