FROM node:12

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY server/ ./server/

ENV PORT=8080

EXPOSE 8080

CMD ["npm", "start"]
