FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ENV NODE_ENV=production
ENV DB_STORAGE=/app/data/glow.sqlite
ENV MONGO_URI=mongodb://mongo:27017/glow_nosql

EXPOSE 5000

CMD ["npm", "start"]
