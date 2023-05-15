FROM node:16-alpine as build-step
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /app
RUN npm install
COPY . /app
RUN chmod +x migrate-and-start.sh
ENV DATABASE_URL="postgresql://postgres:123@db:5432/smartamm?schema=public"
EXPOSE 4004
CMD ["sh","migrate-and-start.sh"]