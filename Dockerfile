FROM node:12.8.1-alpine

WORKDIR /main

COPY . .

RUN ["npm", "install"]

RUN ["apk", "update"]
RUN ["apk", "add", "openssl"]

CMD ["node", "src/start.js"]

EXPOSE 5135
