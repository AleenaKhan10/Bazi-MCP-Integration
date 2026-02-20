# ================================================
# Frontend Dockerfile — Multi-Stage Build
# ================================================
# Stage 1: Build React app with Vite
# Stage 2: Serve with Nginx (tiny, fast, production-ready)

# ========== STAGE 1: BUILD ==========
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies first (cached layer)
COPY package.json package-lock.json* ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# ========== STAGE 2: SERVE ==========
FROM nginx:alpine

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from Stage 1
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Nginx runs in foreground by default with this image
CMD ["nginx", "-g", "daemon off;"]
