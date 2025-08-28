# Use Node image for building the app
FROM node:18-bullseye AS build-stage

WORKDIR /app

# Copy dependency files first for caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app
COPY . .

# Build the app for production
RUN npm run build

# Use a lightweight image to serve the built app
# Coolify will take care of serving this automatically
FROM nginx:stable-alpine AS production-stage

# Copy the built Vue app
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Optional: custom Nginx config if needed
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
