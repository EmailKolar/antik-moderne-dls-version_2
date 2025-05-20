# Use the official Node.js image as the base image
FROM node:16-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port for Vite dev server
EXPOSE 5173

# Command to run the application on Vite's default port
CMD ["npm", "run", "dev"]