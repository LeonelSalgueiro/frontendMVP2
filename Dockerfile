# Dockerfile do Frontend (Desenvolvimento)
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# O EXPOSE é opcional, pode tirar se quiser.
# O importante é o comando abaixo:
CMD ["npm", "run", "dev", "--", "--host"]