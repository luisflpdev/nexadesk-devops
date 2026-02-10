# ============
# Build stage
# ============
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json ./

# Instala dependências necessárias para runtime
RUN npm install --omit=dev

COPY src ./src

# ============
# Runtime stage
# ============
FROM node:20-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production

# Segurança: rodar como usuário não-root
RUN addgroup -S app && adduser -S app -G app
USER app

COPY --from=build /app /app

# Porta do servidor de métricas do worker
EXPOSE 9090

CMD ["node", "src/index.js"]