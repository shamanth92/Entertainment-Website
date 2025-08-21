FROM node:20-alpine

WORKDIR /MOVIESERVER

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "server"]