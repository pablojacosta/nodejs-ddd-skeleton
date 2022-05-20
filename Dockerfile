FROM node:16

WORKDIR /application

COPY package.json yarn.lock ./

EXPOSE 3000

RUN yarn install && yarn cache clean --force

COPY . .
