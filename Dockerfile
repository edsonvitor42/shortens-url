FROM node:12.18.4-alpine3.11

RUN apk add --no-cache bash

WORKDIR /home/shortens-url

COPY ./package.json /home/shortens-url/package.json

COPY ./dist /home/shortens-url

RUN npm install --only=prod

CMD ["npm", "run", "start"]