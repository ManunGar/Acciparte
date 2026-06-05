FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .
ENV CI=false
EXPOSE 3001
CMD ["npm", "start"]
