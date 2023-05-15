# Build step #1: build the React front end
FROM node:16-alpine as build-step
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json  ./
RUN npm install --force
COPY ./src ./src
RUN rm -rf /app/src/setupProxy.js
COPY ./public ./public
ENV REACT_APP_API_AUTH='Basic NzVGMUY2NTY2MUFBOEVGNTU2QjNDNTFERjlGOEY6QkMzMUVBQjhDN0ZCNTdCMjk2QjRDNUNFOTc1NzI='
RUN npm run build

# Build step #2: build an nginx container
FROM nginx:stable-alpine
COPY --from=build-step /app/build /usr/share/nginx/html
COPY deployment/nginx.default.conf /etc/nginx/conf.d/default.conf