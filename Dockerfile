FROM node:15.4.0
WORKDIR /nodedir
COPY package*.json ./ 
RUN npm install
RUN npm install typescript -g
COPY . .
RUN tsc -p tsconfig.json
CMD [ "npm", "run", "start" ]