# FROM ubuntu
# RUN apt-get update && apt-get install -y iputils-ping
# RUN apt-get update && apt-get install -y redis-server
# CMD bash

FROM node:20.9.0

WORKDIR /app

COPY package.json .

ARG NODE_ENV

RUN if [ "$NODE_ENV" = "development" ]; \
    then npm install; \
    else npm install --only-production; \
    fi

COPY . ./

ENV PORT 3000

EXPOSE $PORT

CMD ["node", "index.js"]