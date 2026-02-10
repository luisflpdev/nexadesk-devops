# ============
# Build stage
# ============
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json ./
RUN npm install

COPY index.html ./index.html
COPY vite.config.js ./vite.config.js
COPY src ./src

RUN npm run build

# ============
# Runtime stage (Nginx)
# ============
FROM nginx:alpine AS runtime

# Remove config padrão e adiciona uma config SPA-friendly
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia build final
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]