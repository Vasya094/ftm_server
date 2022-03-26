FROM node:16-slim

WORKDIR /usr/src/app

# ENV PATH /app/node_modules/.bin:$PATH
# RUN apk add git
# RUN apk add openssh
# RUN apk add bash

COPY ./package.json ./
COPY tsconfig.json ./

RUN npm install

COPY . .

EXPOSE 8000

# CMD "/bin/zsh" [ "npm", "start" ]
CMD ["npm", "run", "dev"]