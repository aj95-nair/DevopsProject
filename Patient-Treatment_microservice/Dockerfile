
FROM node:12

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=5500

EXPOSE 5500

CMD [ "npm", "start" ]

