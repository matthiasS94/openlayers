FROM node:22.14.0

# Arbeitsverzeichnis setzen
WORKDIR /app

# Package-Dateien kopieren und Abhängigkeiten installieren
COPY package*.json ./
RUN npm install

# Restliche Dateien kopieren
COPY . .

# Vite-Build (falls notwendig, falls nur Backend, kannst du das entfernen)
RUN npm run build

# Exponiere den Port
EXPOSE 3000

# Startkommando
CMD ["npm", "run", "start"]
