FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm config set legacy-peer-deps true \
 && npm ci --no-fund --no-audit --legacy-peer-deps --ignore-scripts || npm install --no-fund --no-audit --legacy-peer-deps --ignore-scripts
COPY . .
EXPOSE 4200
CMD ["npx", "ng", "serve", "--host", "0.0.0.0", "--port", "4200"]

