FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3030
CMD ["sh", "-c", "npx sequelize-cli db:migrate && node src/index.js"]
