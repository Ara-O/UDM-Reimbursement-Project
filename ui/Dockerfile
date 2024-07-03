# Use the Node.js LTS Alpine image as the base image
FROM node:lts-alpine

# Install Python and other necessary libraries for node-canvas
RUN apk add --no-cache python3 make g++ cairo-dev jpeg-dev pango-dev

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package.json package-lock.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose the port your app runs on
EXPOSE 5173

# Start the application
CMD ["npm", "run", "dev"]
