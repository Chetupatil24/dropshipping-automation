# Base image
FROM node:18-alpine

# Install Chromium and dependencies for Puppeteer (used in backend for web scraping/PDF generation)
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont \
      nodejs \
      yarn

# Tell Puppeteer to skip installing Chrome/Chromium. We'll use the installed package.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Set working directory
WORKDIR /app

# Copy root package.json
COPY package*.json ./

# Copy backend package files
COPY backend/package*.json ./backend/

# Copy frontend package files
COPY frontend/package*.json ./frontend/

# Copy admin dashboard package files
COPY admin-dashboard/package*.json ./admin-dashboard/

# Configure npm for lower memory usage and install all dependencies cleanly
RUN npm config set fetch-retries 5 \
    && npm config set fetch-retry-mintimeout 20000 \
    && npm config set fetch-retry-maxtimeout 120000 \
    && npm clean-install --no-audit --no-fund --legacy-peer-deps \
    && cd frontend && npm clean-install --no-audit --no-fund --legacy-peer-deps \
    && cd ../admin-dashboard && npm clean-install --no-audit --no-fund --legacy-peer-deps

# Copy all source code
COPY . .

# Build frontend and admin-dashboard sequentially to prevent Out of Memory
RUN cd frontend && NODE_OPTIONS="--max_old_space_size=1024" npm run build
RUN cd admin-dashboard && NODE_OPTIONS="--max_old_space_size=1024" npm run build

# Expose ports
EXPOSE 5000 3000 3001

# Start script
CMD ["npm", "start"]
