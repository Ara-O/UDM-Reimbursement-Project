FROM node:22

WORKDIR /app

COPY package*.json ./

# Install system dependencies for canvas
RUN apt-get update && apt-get install -y \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
 && rm -rf /var/lib/apt/lists/*

RUN npm install

COPY . .

CMD ["node", "app.js"]

EXPOSE 8080