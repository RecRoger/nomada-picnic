# ETAPA 1: Construcción
FROM node:20-alpine AS builder
WORKDIR /app

# Copiamos archivos de dependencias de la raíz
COPY package*.json ./
# Copiamos package de la API
COPY api/package*.json ./api/

# Instalamos todo
RUN npm install

# Copiamos el código fuente
COPY shared/ ./shared/
COPY api/ ./api/

# Compilamos la API
WORKDIR /app/api
RUN npm run build

# ETAPA 2: Ejecución
FROM node:20-alpine
WORKDIR /app

# Traemos el build desde la etapa anterior
COPY --from=builder /app/api/dist ./dist
# Traemos los node_modules desde la raíz del builder
COPY --from=builder /app/node_modules ./node_modules
# Traemos el package.json de la API
COPY --from=builder /app/api/package*.json ./

EXPOSE 8080

# Comando de inicio
CMD ["node", "dist/api/src/main"]