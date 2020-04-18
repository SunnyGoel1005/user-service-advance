FROM node:8-alpine

COPY package*.json ./

RUN npm install

COPY . .

ENTRYPOINT [ "node", "user.js" ]

EXPOSE 3000
CMD [ "npm", "start" ]