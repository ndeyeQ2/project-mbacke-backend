FROM ubuntu:latest
LABEL authors="mugirassoul"
# Utiliser l'image officielle de Node.js
FROM node:18-alpine

# Définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copier le fichier package.json et package-lock.json (si présent)
COPY package*.json ./

# Installer les dépendances du projet
RUN npm install

# Copier tous les fichiers de ton projet dans le conteneur
COPY .. .

# Exposer le port que ton application va utiliser
EXPOSE 7000

# Commande pour démarrer l'application
CMD ["node", "app.js"]

ENTRYPOINT ["top", "-b"]