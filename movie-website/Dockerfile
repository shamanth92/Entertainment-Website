FROM node:20-alpine AS build-stage

WORKDIR /MOVIEWEBSITE

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:stable-alpine AS production-stage

COPY --from=build-stage /MOVIEWEBSITE/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

