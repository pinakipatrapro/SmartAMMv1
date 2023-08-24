FROM node:16-alpine
RUN apk update && apk add bash

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /app
RUN npm install
COPY . /app

EXPOSE  4004

ENV DATABASE_URL="postgresql://postgres:123@db:5052/smartamm?schema=public"
ENV PORT="4004"
ENV DATA_SCHEMA="AMMDATA"
ENV API_USER="75F1F65661AA8EF556B3C51DF9F8F"
ENV API_PASS="BC31EAB8C7FB57B296B4C5CE97572"


CMD ["/bin/bash", "-c", "npx prisma migrate deploy;npx prisma generate;node index.js"]
