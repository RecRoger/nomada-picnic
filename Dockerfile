# ETAPA 1: Construcción (Build)
FROM node:20-alpine AS builder
WORKDIR /app

# Copiamos los package.json de la raíz y del cliente
COPY package*.json ./
COPY client/package*.json ./client/

# Instalamos las dependencias
RUN npm install

# --- EL CAMBIO CLAVE: Copiamos shared y client ---
COPY shared/ ./shared/
COPY client/ ./client/

# Compilamos Angular
WORKDIR /app/client
RUN npm run build -- --configuration production

# ETAPA 2: Servidor de Producción (Nginx)
FROM nginx:alpine

# Copiamos la configuración de Nginx que creamos en el Paso 1
COPY client/nginx.conf /etc/nginx/conf.d/default.conf

# Copiamos el resultado de la compilación de Angular
# NOTA: Verifica que tu angular.json genere la carpeta en 'dist/client/browser'
COPY --from=builder /app/client/dist/client/browser /usr/share/nginx/html

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]