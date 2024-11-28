FROM node:lts-alpine

RUN npm install -g @nestjs/cli

WORKDIR /usr/src/app

COPY package*.json package-lock.json ./

RUN npm ci

COPY . .

COPY ./.env.prod ./.env

RUN npm run lint

RUN npm run build

EXPOSE 5050

CMD [ "npm", "run","start:prod" ]