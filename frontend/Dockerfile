FROM node:20-alpine AS build
ARG NODE_OPTIONS=--max-old-space-size=2048
ENV NODE_OPTIONS=${NODE_OPTIONS}
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm i -g patch-package
RUN npm config set legacy-peer-deps true \
 && npm ci --no-fund --no-audit --legacy-peer-deps || npm i --no-fund --no-audit --legacy-peer-deps
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY docker-entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
COPY --from=build /app/dist/frontend /usr/share/nginx/html
EXPOSE 80
ENTRYPOINT ["/entrypoint.sh"]
