# ============
# Build stage
# ============
FROM node:20-alpine AS build

WORKDIR /app

# Copia só manifests primeiro (melhora cache)
COPY package.json ./

# Instala dependências
# (Sem package-lock por enquanto; quando você gerar lockfile, trocamos para npm ci)
RUN npm install --omit=dev

# Copia o restante do código
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

# Copia dependências e código do stage de build
COPY --from=build /app /app

# Porta padrão da API
EXPOSE 3000

# Healthcheck simples (vai funcionar quando tiver wget/curl? no alpine não vem por padrão)
# Em Kubernetes a gente usa readiness/liveness via HTTP, então aqui é opcional.
# HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
#   CMD node -e "fetch('http://localhost:3000/healthz').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "src/index.js"]