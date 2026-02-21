FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --production

# Copy application files
COPY . .

# Create logs directory
RUN mkdir -p /app/logs

EXPOSE 5000

CMD ["node", "backend/server.js"]
