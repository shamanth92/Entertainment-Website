FROM node:20-alpine

WORKDIR /MOVIEWEBSITE

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "start"]