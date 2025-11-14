#!/bin/sh
set -eu

# Generate runtime API config for the SPA
API_URL_VAR="${API_URL:-https://inventario-backend-20g4.onrender.com}"
echo "window.__API_URL__='${API_URL_VAR}';" > /usr/share/nginx/html/config.js

# Generate nginx config honoring $PORT (Render, Fly, etc.)
PORT_VAR="${PORT:-80}"
cat > /etc/nginx/conf.d/default.conf <<NGINXCONF
server {
  listen ${PORT_VAR};
  server_name _;
  root /usr/share/nginx/html;
  charset utf-8;
  index index.html;

  location / {
    try_files \$uri \$uri/ /index.html;
  }

  location /assets/ {
    access_log off;
    expires 30d;
  }
}
NGINXCONF

exec nginx -g 'daemon off;'
