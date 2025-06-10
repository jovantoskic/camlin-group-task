# Base image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package and lock files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all project files
COPY . .

# Build the project
RUN npm run build

# Install serve to serve built files
RUN npm install -g serve

# Expose port
EXPOSE 4173

# Default command
CMD ["serve", "-s", "dist"]
