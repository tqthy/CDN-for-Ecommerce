# Use the official Node.js image as a base
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the application for production
RUN npm run build

# Install serve, a lightweight static file server, to serve the build files
RUN npm install -g serve

# Set the command to run the app with serve
CMD ["serve", "-s", "dist", "-l", "5173"]

# Expose port 3000
EXPOSE 5173