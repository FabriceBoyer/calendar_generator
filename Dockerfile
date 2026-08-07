# syntax=docker/dockerfile:1

FROM node:20-alpine AS build
WORKDIR /app

# Base path for the built assets. GitHub Pages serves this app from a
# /<repo>/ sub-path, but a self-hosted Docker container normally serves it
# from the root, so default to "/" here.
ARG VITE_BASE_PATH=/
ENV VITE_BASE_PATH=$VITE_BASE_PATH

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine AS runtime
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost/ || exit 1
